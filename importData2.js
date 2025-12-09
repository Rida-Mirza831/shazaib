import fs from "fs";
import mongoose from "mongoose";
import { chain } from "stream-chain";
import { parser } from "stream-json";
import { streamArray } from "stream-json/streamers/StreamArray";
import connectDB from "./db.js";
import Brand from "./models/brand.js";

const BATCH_SIZE = 500;

const importData2 = async () => {
  try {
    await connectDB();
    console.log("MongoDB Connected!");

    const fileStream = fs.createReadStream("./data2.json");

    const pipeline = chain([
      fileStream,
      parser(),
      streamArray()
    ]);

    let batch = [];
    let count = 0;

    pipeline.on("data", async ({ value }) => {
      // Map value to match schema
      const mappedBrand = {
        brand_id: value.brand_id || new mongoose.Types.ObjectId().toString(),
        brand_name: value.brand_name,
        brand_image: value.brand_image,
        brand_url: value.brand_url,
        wheels: value.wheels.map(wheel => ({
          id: wheel.id || new mongoose.Types.ObjectId().toString(),
          brand_id: value.brand_id || null,
          brand_name: value.brand_name,
          brand_image: value.brand_image,
          brand_type: wheel.brand_type || "normal",
          name: wheel.name,
          color: wheel.color || null,
          description: wheel.description || null,
          notice: wheel.notice || null,
          multiple_colors: wheel.multiple_colors || null,
          allround_image: wheel.allround_image || null,
          youtube_link: wheel.youtube_link || null,
          new_model: wheel.new_model || null,
          new_size: wheel.new_size || null,
          sizes: wheel.sizes || [],
          lowestDiameter: wheel.lowestDiameter || null,
          highestDiameter: wheel.highestDiameter || null,
          lowestPrice: wheel.lowestPrice || wheel.price || null,
          lowestPriceFormated: wheel.lowestPriceFormated || null,
          highestPrice: wheel.highestPrice || wheel.price || null,
          highestPriceFormated: wheel.highestPriceFormated || null,
          imagesmall: wheel.imagesmall || wheel.image || null,
          image: wheel.image || null,
          product_url: wheel.product_url || null,
          currency: wheel.currency || null,
          monthly_price: wheel.monthly_price || null,
          availability: wheel.availability || null
        }))
      };

      batch.push(mappedBrand);

      if (batch.length === BATCH_SIZE) {
        pipeline.pause();
        try {
          await Brand.insertMany(batch);
          count += batch.length;
          console.log(`Inserted ${count} items so far`);
          batch = [];
        } catch (err) {
          console.error("Error inserting batch:", err);
        }
        pipeline.resume();
      }
    });

    pipeline.on("end", async () => {
      if (batch.length > 0) {
        await Brand.insertMany(batch);
        count += batch.length;
        console.log(`Inserted remaining ${batch.length} items`);
      }
      console.log(`All data2 imported successfully! Total items: ${count}`);
      process.exit();
    });

    pipeline.on("error", (err) => {
      console.error("Stream error:", err);
      process.exit(1);
    });

  } catch (err) {
    console.error("Error connecting to DB:", err);
    process.exit(1);
  }
};

importData2();

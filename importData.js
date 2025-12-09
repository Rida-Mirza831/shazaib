import fs from "fs";
import { chain } from "stream-chain";
import { parser } from "stream-json";
import { streamArray } from "stream-json/streamers/StreamArray";
import connectDB from "./db.js";
import Brand from "./models/brand.js";

const BATCH_SIZE = 500;

const importData = async () => {
  try {
    await connectDB();
    console.log("MongoDB Connected!");

    const fileStream = fs.createReadStream("./data.json");

    const pipeline = chain([
      fileStream,
      parser(),
      streamArray()
    ]);

    let batch = [];
    let count = 0;

    pipeline.on("data", async ({ value }) => {
      batch.push(value);

      if (batch.length === BATCH_SIZE) {
        pipeline.pause(); // pause stream while inserting
        try {
          await Brand.insertMany(batch);
          count += batch.length;
          console.log(`Inserted ${count} items so far`);
          batch = [];
        } catch (err) {
          console.error("Error inserting batch:", err);
        }
        pipeline.resume(); // resume stream
      }
    });

    pipeline.on("end", async () => {
      if (batch.length > 0) {
        await Brand.insertMany(batch);
        count += batch.length;
        console.log(`Inserted remaining ${batch.length} items`);
      }
      console.log(`All data imported successfully! Total items: ${count}`);
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

importData();

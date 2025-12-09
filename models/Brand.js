import mongoose from "mongoose";

const sizeSchema = new mongoose.Schema({
  diameter: String,
  width: String,
  bolt_patterns_formated: String,
  offsets_formated: String,
  bolt_circles_formated: String,
  price: String,
  priceFormated: String
}, { _id: false });

const wheelSchema = new mongoose.Schema({
  brand_id: String,
  brand_name: String,
  brand_image: String,
  brand_type: String,
  id: String,
  name: String,
  color: String,
  description: String,
  notice: String,
  multiple_colors: { type: String, default: null },
  allround_image: { type: String, default: null },
  youtube_link: { type: String, default: null },
  new_model: { type: String, default: null },
  new_size: { type: String, default: null },

  sizes: [sizeSchema],

  lowestDiameter: String,
  highestDiameter: String,
  lowestPrice: String,
  lowestPriceFormated: String,
  highestPrice: String,
  highestPriceFormated: String,

  imagesmall: String,
  image: String,

  product_url:
   { type: String, default: null },
  currency:
   { type: String, default: null },
  monthly_price: 
  { type: String, default: null },
  availability
  : { type: String, default: null },

}, { _id: false });

const brandSchema = new mongoose.Schema({
  brand_id: String,
  brand_name: String,
  brand_url: String,
  brand_image: String,
  wheels: [wheelSchema]
});

const Brand = mongoose.model("Brand", brandSchema);
export default Brand;

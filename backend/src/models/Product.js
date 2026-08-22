import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
  },
  { _id: false }
);

export const CATEGORIES = ["Brooms", "Wipers", "Mops", "Brushes", "Scrubbers", "Others"];

export const SUBCATEGORIES = {
  Brooms: ["Plastic Broom", "Kharata (Wood)"],
};

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: "" },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    category: { type: String, required: true, trim: true, enum: CATEGORIES },
    subcategory: { type: String, trim: true, default: "" },
    images: {
      type: [imageSchema],
      validate: (v) => Array.isArray(v) && v.length > 0,
      required: true,
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);

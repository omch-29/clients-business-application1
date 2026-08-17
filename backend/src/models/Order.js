import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

export const ORDER_STATUSES = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

export const PAYMENT_METHODS = ["Cash on Delivery", "UPI", "Bank Transfer", "Other"];

const orderSchema = new mongoose.Schema(
  {
    items: {
      type: [orderItemSchema],
      validate: (v) => Array.isArray(v) && v.length > 0,
      required: true,
    },
    customer: {
      name: { type: String, required: true, trim: true },
      shopName: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
      address: { type: String, required: true, trim: true },
      email: { type: String, trim: true },
      notes: { type: String, trim: true },
    },
    paymentMethod: {
      type: String,
      enum: PAYMENT_METHODS,
      required: true,
    },
    totalAmount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ORDER_STATUSES,
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);

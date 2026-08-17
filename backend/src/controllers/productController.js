import Product, { CATEGORIES } from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";

export async function getProducts(req, res) {
  const products = await Product.find({ isActive: true }).sort({ createdAt: -1 });
  res.json(products);
}

export async function getAllProductsAdmin(req, res) {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products);
}

export async function getProduct(req, res) {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: "Broom not found" });
  }
  res.json(product);
}

export async function createProduct(req, res) {
  const { name, description, price, stock, category, images } = req.body;

  if (!name || price === undefined || !images?.length) {
    return res.status(400).json({
      message: "name, price and at least one image are required",
    });
  }
  if (!CATEGORIES.includes(category)) {
    return res.status(400).json({
      message: `category must be one of: ${CATEGORIES.join(", ")}`,
    });
  }

  const product = await Product.create({
    name,
    description: description || "",
    price,
    stock: stock ?? 0,
    category,
    images,
  });

  res.status(201).json(product);
}

export async function updateProduct(req, res) {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: "Broom not found" });
  }

  const { name, description, price, stock, category, images, isActive } = req.body;

  if (category !== undefined && !CATEGORIES.includes(category)) {
    return res.status(400).json({
      message: `category must be one of: ${CATEGORIES.join(", ")}`,
    });
  }

  if (name !== undefined) product.name = name;
  if (description !== undefined) product.description = description;
  if (price !== undefined) product.price = price;
  if (stock !== undefined) product.stock = stock;
  if (category !== undefined) product.category = category;
  if (images !== undefined) product.images = images;
  if (isActive !== undefined) product.isActive = isActive;

  await product.save();
  res.json(product);
}

export async function deleteProduct(req, res) {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: "Broom not found" });
  }

  await Promise.all(
    product.images.map((img) =>
      cloudinary.uploader.destroy(img.publicId).catch(() => null)
    )
  );

  await product.deleteOne();
  res.json({ message: "Broom deleted" });
}

import Order, { ORDER_STATUSES, PAYMENT_METHODS } from "../models/Order.js";
import Product from "../models/Product.js";

export async function createOrder(req, res) {
  const { items, customer, paymentMethod } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }
  if (!customer?.name || !customer?.shopName || !customer?.phone || !customer?.address) {
    return res.status(400).json({
      message: "Customer name, shop name, phone and address are required",
    });
  }
  if (!PAYMENT_METHODS.includes(paymentMethod)) {
    return res.status(400).json({ message: "A valid payment method is required" });
  }

  const productIds = items.map((i) => i.productId);
  const products = await Product.find({ _id: { $in: productIds } });
  const productMap = new Map(products.map((p) => [p._id.toString(), p]));

  let totalAmount = 0;
  const orderItems = [];

  for (const item of items) {
    const product = productMap.get(item.productId);
    if (!product) {
      return res.status(400).json({ message: `Broom not found: ${item.productId}` });
    }
    const quantity = Math.max(1, Number(item.quantity) || 1);
    totalAmount += product.price * quantity;
    orderItems.push({
      product: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0]?.url,
      quantity,
    });
  }

  const order = await Order.create({
    items: orderItems,
    customer,
    paymentMethod,
    totalAmount,
  });

  res.status(201).json(order);
}

export async function getOrders(req, res) {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
}

export async function getOrder(req, res) {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }
  res.json(order);
}

export async function updateOrderStatus(req, res) {
  const { status } = req.body;
  if (!ORDER_STATUSES.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  order.status = status;
  await order.save();
  res.json(order);
}

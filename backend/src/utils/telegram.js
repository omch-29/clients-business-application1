export async function sendTelegramMessage(text) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return;
  }

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Telegram API error ${res.status}: ${body}`);
  }
}

export function formatOrderMessage(order) {
  const itemLines = order.items
    .map((i) => `• ${i.name} x${i.quantity} — ₹${(i.price * i.quantity).toFixed(2)}`)
    .join("\n");

  return [
    "🧹 New Order Received",
    "",
    `Customer: ${order.customer.name}`,
    `Shop: ${order.customer.shopName}`,
    `Phone: ${order.customer.phone}`,
    `Address: ${order.customer.address}`,
    `Payment: ${order.paymentMethod}`,
    "",
    "Items:",
    itemLines,
    "",
    `Total: ₹${order.totalAmount.toFixed(2)}`,
  ].join("\n");
}

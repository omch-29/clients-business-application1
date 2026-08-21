import "dotenv/config";
import { sendTelegramMessage } from "./telegram.js";

const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

if (!token || !chatId) {
  console.error(
    "TELEGRAM_BOT_TOKEN and/or TELEGRAM_CHAT_ID are missing from backend/.env — fill both in first."
  );
  process.exit(1);
}

sendTelegramMessage("✅ Test message from Harsh Sales — Telegram notifications are working!")
  .then(() => {
    console.log("Sent! Check your Telegram chat for the message.");
  })
  .catch((err) => {
    console.error("Failed to send:", err.message);
    console.error(
      "Common causes: you haven't messaged your bot yet, or the token/chat ID is wrong."
    );
    process.exit(1);
  });

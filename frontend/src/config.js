export const SITE_NAME = "Harsh Sales";
export const SITE_TAGLINE = "Worldwide brooms collection, built to last.";
export const CURRENCY = "₹";

export const CATEGORIES = ["Brooms", "Wipers", "Mops", "Brushes", "Scrubbers", "Others"];

export const SUBCATEGORIES = {
  Brooms: ["Plastic Broom", "Kharata (Wood)"],
};

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export function formatPrice(amount) {
  return `${CURRENCY}${Number(amount).toFixed(2)}`;
}

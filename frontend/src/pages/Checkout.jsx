import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import client from "../api/client";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../config";

const PAYMENT_METHODS = ["Cash on Delivery", "UPI", "Bank Transfer", "Other"];

const initialForm = {
  name: "",
  shopName: "",
  phone: "",
  address: "",
  email: "",
  notes: "",
};

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (items.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const { data: order } = await client.post("/orders", {
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        customer: form,
        paymentMethod,
      });

      clearCart();
      toast.success("Order placed successfully!");
      navigate("/order-success", { state: { order } });
    } catch (err) {
      setError(err.response?.data?.message || "Could not place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container-page py-10">
      <h1 className="text-2xl font-semibold text-stone-900">Checkout</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <form onSubmit={handleSubmit} className="card space-y-4 p-6 lg:col-span-2">
          <div>
            <label className="label" htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              className="input"
              placeholder="Jane Doe"
            />
          </div>
          <div>
            <label className="label" htmlFor="shopName">Shop Name</label>
            <input
              id="shopName"
              name="shopName"
              required
              value={form.shopName}
              onChange={handleChange}
              className="input"
              placeholder="Jane's General Store"
            />
          </div>
          <div>
            <label className="label" htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              name="phone"
              required
              value={form.phone}
              onChange={handleChange}
              className="input"
              placeholder="9876543210"
            />
          </div>
          <div>
            <label className="label" htmlFor="email">Email (optional)</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="input"
              placeholder="jane@example.com"
            />
          </div>
          <div>
            <label className="label" htmlFor="address">Delivery Address</label>
            <textarea
              id="address"
              name="address"
              required
              rows={3}
              value={form.address}
              onChange={handleChange}
              className="input"
              placeholder="House no, street, city, pincode"
            />
          </div>
          <div>
            <label className="label" htmlFor="notes">Order Notes (optional)</label>
            <textarea
              id="notes"
              name="notes"
              rows={2}
              value={form.notes}
              onChange={handleChange}
              className="input"
              placeholder="Anything we should know?"
            />
          </div>
          <div>
            <label className="label" htmlFor="paymentMethod">Mode of Payment</label>
            <select
              id="paymentMethod"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="input"
            >
              {PAYMENT_METHODS.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? "Placing Order..." : `Place Order — ${formatPrice(totalPrice)}`}
          </button>
        </form>

        <div className="card h-fit p-6">
          <h2 className="text-lg font-semibold text-stone-900">Order Summary</h2>
          <div className="mt-4 space-y-3">
            {items.map((item) => (
              <div key={item.productId} className="flex justify-between text-sm text-stone-600">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span className="font-medium text-stone-900">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between border-t border-stone-200 pt-4">
            <span className="font-medium text-stone-900">Total</span>
            <span className="text-lg font-semibold text-stone-900">
              {formatPrice(totalPrice)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

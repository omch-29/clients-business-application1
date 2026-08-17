import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../config";

export default function Cart() {
  const { items, updateQuantity, removeFromCart, totalPrice } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="text-2xl font-semibold text-stone-900">Your cart is empty</h1>
        <p className="mt-2 text-stone-500">Add a few brooms to get started.</p>
        <Link to="/" className="btn-primary mt-6 inline-flex">
          Browse Brooms
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <h1 className="text-2xl font-semibold text-stone-900">Your Cart</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.productId} className="card flex gap-4 p-4">
              <img
                src={item.image}
                alt={item.name}
                className="h-24 w-24 flex-shrink-0 rounded-lg object-cover"
              />
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-medium text-stone-900">{item.name}</h3>
                    <p className="text-sm text-stone-500">{formatPrice(item.price)} each</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center rounded-lg border border-stone-300">
                    <button
                      className="px-3 py-1 text-lg text-stone-600 hover:text-stone-900"
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    >
                      −
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      className="px-3 py-1 text-lg text-stone-600 hover:text-stone-900"
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <span className="font-semibold text-stone-900">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="card h-fit p-6">
          <h2 className="text-lg font-semibold text-stone-900">Order Summary</h2>
          <div className="mt-4 flex justify-between text-stone-600">
            <span>Total</span>
            <span className="text-lg font-semibold text-stone-900">
              {formatPrice(totalPrice)}
            </span>
          </div>
          <button
            onClick={() => navigate("/checkout")}
            className="btn-primary mt-6 w-full"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

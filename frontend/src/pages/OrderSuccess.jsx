import { Link, useLocation } from "react-router-dom";
import { formatPrice } from "../config";

export default function OrderSuccess() {
  const { state } = useLocation();
  const order = state?.order;

  return (
    <div className="container-page py-20 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl">
        ✓
      </div>
      <h1 className="mt-6 text-2xl font-semibold text-stone-900">Thank you for your order!</h1>
      <p className="mt-2 text-stone-500">
        We&apos;ve received your order and will get in touch to confirm delivery.
      </p>

      {order && (
        <div className="card mx-auto mt-8 max-w-md p-6 text-left">
          <p className="text-sm text-stone-500">Order ID</p>
          <p className="break-all font-mono text-sm text-stone-800">{order._id}</p>
          <div className="mt-4 space-y-2">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm text-stone-600">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between border-t border-stone-200 pt-4">
            <span className="font-medium text-stone-900">Total</span>
            <span className="font-semibold text-stone-900">
              {formatPrice(order.totalAmount)}
            </span>
          </div>
        </div>
      )}

      <Link to="/" className="btn-primary mt-8 inline-flex">
        Continue Shopping
      </Link>
    </div>
  );
}

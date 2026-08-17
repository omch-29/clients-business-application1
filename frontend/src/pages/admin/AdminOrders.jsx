import { Fragment, useEffect, useState } from "react";
import toast from "react-hot-toast";
import client from "../../api/client";
import Spinner from "../../components/Spinner";
import { formatPrice } from "../../config";

const STATUSES = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

const STATUS_STYLES = {
  Pending: "bg-amber-100 text-amber-800",
  Processing: "bg-blue-100 text-blue-800",
  Shipped: "bg-indigo-100 text-indigo-800",
  Delivered: "bg-emerald-100 text-emerald-800",
  Cancelled: "bg-red-100 text-red-800",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    client
      .get("/orders")
      .then(({ data }) => setOrders(data))
      .catch(() => toast.error("Could not load orders"))
      .finally(() => setLoading(false));
  }, []);

  async function handleStatusChange(orderId, status) {
    const previous = orders;
    setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, status } : o)));
    try {
      await client.put(`/orders/${orderId}/status`, { status });
      toast.success("Order status updated");
    } catch {
      toast.error("Could not update status");
      setOrders(previous);
    }
  }

  if (loading) return <Spinner />;

  return (
    <div>
      <h1 className="text-xl font-semibold text-stone-900">Orders</h1>

      {orders.length === 0 ? (
        <p className="mt-8 text-stone-500">No orders yet.</p>
      ) : (
        <div className="card mt-6 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-stone-200 bg-stone-50 text-stone-500">
              <tr>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Shop</th>
                <th className="px-4 py-3 font-medium">Items</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Placed</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <Fragment key={order._id}>
                  <tr
                    className="cursor-pointer border-b border-stone-100 hover:bg-stone-50"
                    onClick={() =>
                      setExpandedId((id) => (id === order._id ? null : order._id))
                    }
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-stone-900">{order.customer.name}</div>
                      <div className="text-xs text-stone-500">{order.customer.phone}</div>
                    </td>
                    <td className="px-4 py-3">{order.customer.shopName}</td>
                    <td className="px-4 py-3">{order.items.length}</td>
                    <td className="px-4 py-3">{formatPrice(order.totalAmount)}</td>
                    <td className="px-4 py-3">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className={`rounded-full border-0 px-2.5 py-1 text-xs font-medium focus:ring-2 focus:ring-amber-200 ${STATUS_STYLES[order.status]}`}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                  {expandedId === order._id && (
                    <tr className="border-b border-stone-100 bg-stone-50">
                      <td colSpan={6} className="px-4 py-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <p className="text-xs font-medium uppercase text-stone-400">
                              Delivery Address
                            </p>
                            <p className="mt-1 text-stone-700">{order.customer.address}</p>
                            {order.customer.email && (
                              <p className="mt-1 text-stone-500">{order.customer.email}</p>
                            )}
                            <p className="mt-2 text-stone-500">
                              <span className="font-medium">Payment: </span>
                              {order.paymentMethod}
                            </p>
                            {order.customer.notes && (
                              <p className="mt-2 text-stone-500">
                                <span className="font-medium">Notes: </span>
                                {order.customer.notes}
                              </p>
                            )}
                          </div>
                          <div>
                            <p className="text-xs font-medium uppercase text-stone-400">
                              Items
                            </p>
                            <div className="mt-1 space-y-1">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between text-stone-700">
                                  <span>
                                    {item.name} × {item.quantity}
                                  </span>
                                  <span>{formatPrice(item.price * item.quantity)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

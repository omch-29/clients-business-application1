import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import client from "../../api/client";
import Spinner from "../../components/Spinner";
import { formatPrice } from "../../config";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  function fetchProducts() {
    setLoading(true);
    client
      .get("/products/admin/all")
      .then(({ data }) => setProducts(data))
      .catch(() => toast.error("Could not load brooms"))
      .finally(() => setLoading(false));
  }

  useEffect(fetchProducts, []);

  async function handleDelete(id, name) {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await client.delete(`/products/${id}`);
      toast.success("Broom deleted");
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch {
      toast.error("Could not delete broom");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-stone-900">Brooms</h1>
        <Link to="/admin/products/new" className="btn-primary">
          Add New Broom
        </Link>
      </div>

      {loading ? (
        <Spinner />
      ) : products.length === 0 ? (
        <p className="mt-8 text-stone-500">No brooms yet. Add your first one.</p>
      ) : (
        <div className="card mt-6 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-stone-200 bg-stone-50 text-stone-500">
              <tr>
                <th className="px-4 py-3 font-medium">Broom</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-b border-stone-100 last:border-0">
                  <td className="flex items-center gap-3 px-4 py-3">
                    <img
                      src={p.images?.[0]?.url}
                      alt={p.name}
                      className="h-10 w-10 rounded-md object-cover"
                    />
                    <span className="font-medium text-stone-900">{p.name}</span>
                  </td>
                  <td className="px-4 py-3">{formatPrice(p.price)}</td>
                  <td className="px-4 py-3">{p.stock}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        p.isActive
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-stone-200 text-stone-600"
                      }`}
                    >
                      {p.isActive ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-3">
                      <Link
                        to={`/admin/products/${p._id}/edit`}
                        className="text-amber-700 hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(p._id, p.name)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

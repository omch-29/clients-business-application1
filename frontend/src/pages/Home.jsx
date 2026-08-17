import { useEffect, useMemo, useState } from "react";
import client from "../api/client";
import ProductCard from "../components/ProductCard";
import Spinner from "../components/Spinner";
import { CATEGORIES, SITE_NAME, SITE_TAGLINE } from "../config";

const TABS = ["All", ...CATEGORIES];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    let ignore = false;

    client
      .get("/products")
      .then(({ data }) => {
        if (!ignore) setProducts(data);
      })
      .catch(() => {
        if (!ignore) setError("Could not load brooms right now. Please try again later.");
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      const matchesCategory = activeCategory === "All" || p.category === activeCategory;
      const matchesSearch =
        !q || p.name.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [products, search, activeCategory]);

  return (
    <div>
      <section className="border-b border-stone-200 bg-gradient-to-b from-amber-50 to-stone-50">
        <div className="container-page py-16 text-center sm:py-24">
          <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-5xl">
            {SITE_NAME}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-stone-600">{SITE_TAGLINE}</p>
        </div>
      </section>

      <section className="container-page py-10">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-semibold text-stone-900">Our Collection</h2>
          <input
            type="text"
            placeholder="Search brooms..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input sm:max-w-xs"
          />
        </div>

        {!loading && (
          <div className="mb-6 flex flex-wrap gap-2">
            {TABS.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? "bg-amber-700 text-white"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {loading && <Spinner />}

        {!loading && error && <p className="text-center text-red-600">{error}</p>}

        {!loading && !error && filtered.length === 0 && (
          <p className="py-16 text-center text-stone-500">No brooms found.</p>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
            {filtered.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

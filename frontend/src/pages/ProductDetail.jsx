import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import client from "../api/client";
import Spinner from "../components/Spinner";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../config";

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;
    setLoading(true);

    client
      .get(`/products/${id}`)
      .then(({ data }) => {
        if (!ignore) {
          setProduct(data);
          setActiveImage(0);
          setQuantity(1);
        }
      })
      .catch(() => {
        if (!ignore) setError("This broom could not be found.");
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [id]);

  if (loading) return <Spinner />;

  if (error || !product) {
    return (
      <div className="container-page py-16 text-center">
        <p className="text-stone-600">{error}</p>
        <Link to="/" className="mt-4 inline-block text-amber-700 hover:underline">
          Back to shop
        </Link>
      </div>
    );
  }

  const outOfStock = product.stock <= 0;

  function handleAddToCart() {
    addToCart(product, quantity);
    toast.success(`${product.name} added to cart`);
  }

  return (
    <div className="container-page py-10">
      <Link to="/" className="text-sm text-stone-500 hover:text-stone-800">
        &larr; Back to shop
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div>
          <div className="aspect-square w-full overflow-hidden rounded-xl border border-stone-200 bg-stone-100">
            <img
              src={product.images[activeImage]?.url}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="mt-4 flex gap-3 overflow-x-auto">
              {product.images.map((img, idx) => (
                <button
                  key={img.publicId}
                  onClick={() => setActiveImage(idx)}
                  className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 ${
                    idx === activeImage ? "border-amber-700" : "border-transparent"
                  }`}
                >
                  <img src={img.url} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          {product.category && (
            <p className="text-sm font-medium text-amber-700">
              {product.category}
              {product.subcategory && ` · ${product.subcategory}`}
            </p>
          )}
          <h1 className="mt-1 text-2xl font-bold text-stone-900 sm:text-3xl">
            {product.name}
          </h1>
          <p className="mt-4 text-2xl font-semibold text-stone-900">
            {formatPrice(product.price)}
          </p>
          {product.description && (
            <p className="mt-6 whitespace-pre-line text-stone-600">{product.description}</p>
          )}

          <p className="mt-4 text-sm">
            {outOfStock ? (
              <span className="font-medium text-red-600">Out of stock</span>
            ) : (
              <span className="font-medium text-emerald-600">
                In stock ({product.stock} available)
              </span>
            )}
          </p>

          {!outOfStock && (
            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center rounded-lg border border-stone-300">
                <button
                  className="px-3 py-2 text-lg text-stone-600 hover:text-stone-900"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  −
                </button>
                <span className="w-10 text-center">{quantity}</span>
                <button
                  className="px-3 py-2 text-lg text-stone-600 hover:text-stone-900"
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                >
                  +
                </button>
              </div>
              <button onClick={handleAddToCart} className="btn-primary flex-1 sm:flex-none">
                Add to Cart
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

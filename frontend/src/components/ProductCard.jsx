import { Link } from "react-router-dom";
import { formatPrice } from "../config";

export default function ProductCard({ product }) {
  const outOfStock = product.stock <= 0;

  return (
    <Link
      to={`/product/${product._id}`}
      className="card group overflow-hidden transition-shadow hover:shadow-md"
    >
      <div className="aspect-square w-full overflow-hidden bg-stone-100">
        <img
          src={product.images?.[0]?.url}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="truncate font-medium text-stone-900">{product.name}</h3>
        {product.category && (
          <p className="mt-1 text-sm text-stone-500">
            {product.category}
            {product.subcategory && ` · ${product.subcategory}`}
          </p>
        )}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-semibold text-stone-900">
            {formatPrice(product.price)}
          </span>
          {outOfStock ? (
            <span className="text-xs font-medium text-red-600">Out of stock</span>
          ) : (
            <span className="text-xs font-medium text-emerald-600">In stock</span>
          )}
        </div>
      </div>
    </Link>
  );
}

import { Link, NavLink } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import { SITE_NAME } from "../config";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-lg font-semibold text-stone-900">
          <span aria-hidden="true">🧹</span>
          {SITE_NAME}
        </Link>

        <nav className="flex items-center gap-6">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `text-sm font-medium ${isActive ? "text-amber-700" : "text-stone-600 hover:text-stone-900"}`
            }
          >
            Shop
          </NavLink>
          <Link to="/cart" className="relative flex items-center text-stone-700 hover:text-stone-900">
            <FiShoppingCart size={22} />
            {totalItems > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-amber-700 px-1 text-xs font-semibold text-white">
                {totalItems}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}

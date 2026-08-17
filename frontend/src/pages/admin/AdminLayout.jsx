import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { SITE_NAME } from "../../config";

export default function AdminLayout() {
  const { logout, email } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/admin/login");
  }

  const linkClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-medium ${
      isActive ? "bg-amber-100 text-amber-800" : "text-stone-600 hover:bg-stone-100"
    }`;

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white">
        <div className="container-page flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="font-semibold text-stone-900">{SITE_NAME} · Admin</span>
            <nav className="flex gap-1">
              <NavLink to="/admin/products" className={linkClass}>
                Brooms
              </NavLink>
              <NavLink to="/admin/orders" className={linkClass}>
                Orders
              </NavLink>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-stone-500 sm:inline">{email}</span>
            <button onClick={handleLogout} className="btn-secondary">
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="container-page py-8">
        <Outlet />
      </main>
    </div>
  );
}

import { Link } from "react-router-dom";
import { SITE_NAME } from "../config";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-stone-200 bg-white">
      <div className="container-page flex flex-col items-center justify-between gap-2 py-8 text-sm text-stone-500 sm:flex-row">
        <p>
          &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
        </p>
        <Link to="/admin/login" className="text-stone-400 hover:text-stone-600">
          Admin
        </Link>
      </div>
    </footer>
  );
}

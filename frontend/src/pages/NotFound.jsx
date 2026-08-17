import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container-page py-24 text-center">
      <h1 className="text-4xl font-bold text-stone-900">404</h1>
      <p className="mt-2 text-stone-500">Page not found.</p>
      <Link to="/" className="btn-primary mt-6 inline-flex">
        Go Home
      </Link>
    </div>
  );
}

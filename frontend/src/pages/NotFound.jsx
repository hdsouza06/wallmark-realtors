import { Link } from "react-router-dom";
import Seo from "../components/Seo";

export default function NotFound() {
  return (
    <>
      <Seo title="Page Not Found" />
      <div className="flex min-h-screen flex-col items-center justify-center bg-navy-950 px-6 text-center text-white">
        <p className="font-serif text-8xl font-bold text-gold">404</p>
        <h1 className="mt-4 text-2xl font-semibold">Page Not Found</h1>
        <p className="mt-2 max-w-md text-white/60">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn-gold mt-8">Back to Home</Link>
      </div>
    </>
  );
}

import { Link } from "react-router-dom";

/**
 * variant:
 *   "full" — the complete logo lockup image (footer, login).
 *   "mark" — compact building monogram + a clean wordmark (navbar).
 */
export default function Logo({ className = "", height = "h-12", variant = "full", light = false, imgClassName = "" }) {
  if (variant === "mark") {
    return (
      <Link to="/" className={`inline-flex items-center gap-3 ${className}`} aria-label="Wallmark Realtors home">
        <img src="/logo-mark.png" alt="Wallmark Realtors" className="h-10 w-auto object-contain sm:h-11" />
        <span className="leading-none">
          <span className={`block font-serif text-lg font-bold tracking-[0.15em] ${light ? "text-white" : "text-navy-900"}`}>
            WALLMARK
          </span>
          <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-[0.4em] text-gold">
            Realtors
          </span>
        </span>
      </Link>
    );
  }

  return (
    <Link to="/" className={`inline-flex items-center ${className}`} aria-label="Wallmark Realtors home">
      <img
        src="/logo.png"
        alt="Wallmark Realtors"
        className={`${height} w-auto object-contain ${imgClassName}`}
        width="1048"
        height="1048"
      />
    </Link>
  );
}

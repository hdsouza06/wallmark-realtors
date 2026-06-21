import { FiSearch } from "react-icons/fi";

const PROPERTY_TYPES = ["apartment", "villa", "plot", "commercial"];
const BHK_OPTIONS = [1, 2, 3, 4, 5];

export default function PropertyFilters({ filters, onChange, onSubmit, showListingType = false }) {
  const set = (key) => (e) => onChange({ ...filters, [key]: e.target.value, page: 1 });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.();
      }}
      className="rounded-2xl bg-white p-5 shadow-luxe"
    >
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <div className="relative md:col-span-2 lg:col-span-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gold" />
          <input
            value={filters.q || ""}
            onChange={set("q")}
            placeholder="Search location, title..."
            className="input-luxe pl-10"
          />
        </div>

        {showListingType && (
          <select value={filters.listing_type || ""} onChange={set("listing_type")} className="input-luxe">
            <option value="">Buy / Lease</option>
            <option value="buy">Buy</option>
            <option value="lease">Lease</option>
          </select>
        )}

        <input value={filters.location || ""} onChange={set("location")} placeholder="Location" className="input-luxe" />

        <select value={filters.property_type || ""} onChange={set("property_type")} className="input-luxe">
          <option value="">Property Type</option>
          {PROPERTY_TYPES.map((t) => (
            <option key={t} value={t}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </option>
          ))}
        </select>

        <select value={filters.bhk || ""} onChange={set("bhk")} className="input-luxe">
          <option value="">BHK</option>
          {BHK_OPTIONS.map((b) => (
            <option key={b} value={b}>
              {b} BHK
            </option>
          ))}
        </select>

        <select value={filters.max_price || ""} onChange={set("max_price")} className="input-luxe">
          <option value="">Max Budget</option>
          <option value="5000000">Up to ₹50 L</option>
          <option value="10000000">Up to ₹1 Cr</option>
          <option value="30000000">Up to ₹3 Cr</option>
          <option value="50000000">Up to ₹5 Cr</option>
          <option value="100000000">Up to ₹10 Cr</option>
        </select>

        <select value={filters.sort || "newest"} onChange={set("sort")} className="input-luxe">
          <option value="newest">Newest First</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>

        <button type="submit" className="btn-gold lg:col-span-1">
          Search
        </button>
      </div>
    </form>
  );
}

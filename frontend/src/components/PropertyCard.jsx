import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMapPin, FiMaximize, FiHome, FiPlayCircle } from "react-icons/fi";
import { formatPrice } from "../config/site";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80";

export default function PropertyCard({ property, index = 0 }) {
  const image = property.images?.[0]?.url || PLACEHOLDER;
  const statusLabel = {
    available: "Available",
    under_offer: "Under Offer",
    sold: "Sold",
    rented: "Rented",
  }[property.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
    >
      <Link
        to={`/property/${property.slug}`}
        className="group block overflow-hidden rounded-2xl bg-white shadow-luxe"
      >
        <div className="relative h-60 overflow-hidden">
          <img
            src={image}
            alt={property.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900/70 via-transparent to-transparent" />
          <div className="absolute left-4 top-4 flex gap-2">
            {property.is_featured && (
              <span className="rounded-full bg-gold px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-navy-900">
                Featured
              </span>
            )}
            <span className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-navy-900">
              {property.listing_type === "lease" ? "For Lease" : "For Sale"}
            </span>
          </div>
          {property.youtube_url && (
            <span className="absolute right-4 top-4 text-white drop-shadow">
              <FiPlayCircle className="text-2xl" />
            </span>
          )}
          <p className="absolute bottom-4 left-4 text-xl font-semibold text-white">
            {formatPrice(property.price, property.listing_type)}
          </p>
        </div>

        <div className="p-5">
          <h3 className="line-clamp-1 text-lg font-semibold text-navy-900 group-hover:text-gold">
            {property.title}
          </h3>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
            <FiMapPin className="text-gold" /> {property.location}
            {property.city ? `, ${property.city}` : ""}
          </p>
          <div className="mt-4 flex items-center gap-5 border-t border-gray-100 pt-4 text-sm text-gray-600">
            {property.bhk != null && (
              <span className="flex items-center gap-1.5">
                <FiHome className="text-gold" /> {property.bhk} BHK
              </span>
            )}
            {property.area_sqft != null && (
              <span className="flex items-center gap-1.5">
                <FiMaximize className="text-gold" /> {property.area_sqft} sqft
              </span>
            )}
            {statusLabel && (
              <span className="ml-auto text-xs font-medium uppercase tracking-wide text-gold">
                {statusLabel}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

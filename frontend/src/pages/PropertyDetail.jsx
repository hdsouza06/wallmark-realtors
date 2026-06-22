import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiMapPin,
  FiMaximize,
  FiHome,
  FiCheckCircle,
  FiPlayCircle,
  FiArrowLeft,
  FiTag,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import Seo from "../components/Seo";
import EnquiryForm from "../components/EnquiryForm";
import { propertiesApi } from "../services/api";
import { formatPrice, waLink, SITE } from "../config/site";
import { useSettings } from "../context/SettingsContext";

const PLACEHOLDER = "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1400&q=80";

// Handles watch?v=, youtu.be/, /embed/, /shorts/, and /live/ URLs.
function youtubeId(url) {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|v=|\/embed\/|\/shorts\/|\/live\/)([\w-]{11})/);
  return m ? m[1] : null;
}

export default function PropertyDetail() {
  const { slug } = useParams();
  const settings = useSettings();
  const [property, setProperty] = useState(null);
  const [error, setError] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    setProperty(null);
    propertiesApi.get(slug).then((p) => { setProperty(p); setActive(0); }).catch(() => setError(true));
  }, [slug]);

  if (error) {
    return (
      <div className="container-luxe flex min-h-[60vh] flex-col items-center justify-center pt-24 text-center">
        <h1 className="text-3xl font-semibold text-navy-900">Property not found</h1>
        <Link to="/buy" className="btn-gold mt-6">Browse Properties</Link>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container-luxe pt-32">
        <div className="skeleton h-[460px] w-full rounded-3xl" />
      </div>
    );
  }

  const images = property.images?.length ? property.images : [{ url: PLACEHOLDER, id: 0 }];
  const ytId = youtubeId(property.youtube_url);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Residence",
    name: property.title,
    description: property.description,
    address: { "@type": "PostalAddress", addressLocality: property.location },
  };

  return (
    <>
      <Seo title={property.title} description={property.description?.slice(0, 160)} image={images[0].url} schema={schema} />

      <div className="pt-24">
        <div className="container-luxe">
          <Link to="/buy" className="inline-flex items-center gap-2 text-sm font-semibold text-gold">
            <FiArrowLeft /> Back to Listings
          </Link>
        </div>

        {/* Gallery */}
        <div className="container-luxe mt-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-hidden rounded-3xl">
            <img src={images[active].url} alt={property.title} className="h-[300px] w-full object-cover sm:h-[520px]" />
          </motion.div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={img.id || i}
                  onClick={() => setActive(i)}
                  className={`shrink-0 overflow-hidden rounded-2xl border-2 transition ${active === i ? "border-gold" : "border-transparent hover:border-gold/40"}`}
                >
                  <img src={img.url} alt="" className="h-20 w-28 object-cover sm:h-24 sm:w-36" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Body */}
        <div className="container-luxe mt-12 grid gap-12 pb-24 lg:grid-cols-[2fr_1fr]">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-gold px-3 py-1 text-xs font-bold uppercase text-navy-900">
                {property.listing_type === "lease" ? "For Lease" : "For Sale"}
              </span>
              <span className="rounded-full bg-cream px-3 py-1 text-xs font-bold uppercase text-navy-900">
                {property.status?.replace("_", " ")}
              </span>
            </div>
            <h1 className="mt-4 text-3xl font-bold text-navy-900 sm:text-4xl">{property.title}</h1>
            <p className="mt-2 flex items-center gap-2 text-gray-500">
              <FiMapPin className="text-gold" /> {property.location}{property.city ? `, ${property.city}` : ""}
            </p>
            <p className="mt-4 font-serif text-3xl font-bold text-gold">
              {formatPrice(property.price, property.listing_type)}
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                property.bhk != null && { Icon: FiHome, label: "Configuration", value: `${property.bhk} BHK` },
                property.area_sqft != null && { Icon: FiMaximize, label: "Area", value: `${property.area_sqft} sqft` },
                property.property_type && { Icon: FiTag, label: "Type", value: property.property_type },
              ].filter(Boolean).map((s) => (
                <div key={s.label} className="rounded-2xl bg-cream p-5">
                  <s.Icon className="text-xl text-gold" />
                  <p className="mt-3 text-xs uppercase tracking-wider text-gray-400">{s.label}</p>
                  <p className="font-semibold capitalize text-navy-900">{s.value}</p>
                </div>
              ))}
            </div>

            <h2 className="mt-10 text-xl font-semibold text-navy-900">Description</h2>
            <p className="mt-3 whitespace-pre-line leading-relaxed text-gray-600">{property.description}</p>

            {property.amenities_list?.length > 0 && (
              <>
                <h2 className="mt-10 text-xl font-semibold text-navy-900">Amenities</h2>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {property.amenities_list.map((a) => (
                    <span key={a} className="flex items-center gap-2 text-gray-600">
                      <FiCheckCircle className="text-gold" /> {a}
                    </span>
                  ))}
                </div>
              </>
            )}

            {ytId && (
              <>
                <h2 className="mt-10 text-xl font-semibold text-navy-900">Video Tour</h2>
                <a
                  href={property.youtube_url}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative mt-4 block overflow-hidden rounded-2xl"
                >
                  <img
                    src={`https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`}
                    onError={(e) => {
                      e.currentTarget.src = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
                    }}
                    alt="Video tour"
                    className="h-72 w-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-navy-900/40 transition group-hover:bg-navy-900/30">
                    <FiPlayCircle className="text-6xl text-white" />
                  </div>
                  <span className="absolute bottom-4 left-4 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white">
                    Watch on YouTube
                  </span>
                </a>
              </>
            )}
          </div>

          {/* Sticky enquiry */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-3xl bg-white p-7 shadow-luxe">
              <EnquiryForm
                enquiryType={property.listing_type === "lease" ? "lease" : "buy"}
                propertyRef={`${property.title} (${property.slug})`}
                title="Enquire About This Property"
                showSubject={false}
                buttonLabel="Request a Callback"
              />
              <a href={waLink(settings.whatsapp, `Hi, I'm interested in "${property.title}" (${SITE.name}).`)} target="_blank" rel="noreferrer" className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-7 py-3 text-sm font-semibold uppercase tracking-wider text-white transition hover:opacity-90">
                <FaWhatsapp className="text-lg" /> WhatsApp Us
              </a>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}

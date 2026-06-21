import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight, FiSearch } from "react-icons/fi";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const HERO_BG =
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=80";

export default function Hero({ banner }) {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const bg = banner?.image_url || HERO_BG;
  const title = banner?.title || "One-Stop Solution for All Your Real Estate Needs";
  const subtitle =
    banner?.subtitle ||
    "Buy, sell, lease and invest in premium properties across Mumbai, Pune, Goa & Dubai — from finding your dream home to living and beyond.";

  return (
    <section className="relative flex min-h-screen items-center">
      <div className="absolute inset-0">
        <img src={bg} alt="Luxury property" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-900/60 via-navy-900/55 to-navy-950/90" />
      </div>

      <div className="container-luxe relative z-10 pt-24">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="eyebrow mb-5"
        >
          Wallmark Realtors · Premium Real Estate
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="max-w-4xl text-4xl font-bold leading-[1.1] text-white sm:text-6xl lg:text-7xl"
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 max-w-xl text-lg text-white/75"
        >
          {subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-9 flex flex-wrap gap-4"
        >
          <Link to={banner?.cta_link || "/buy"} className="btn-gold">
            {banner?.cta_text || "Explore Properties"} <FiArrowRight />
          </Link>
          <Link to="/contact" className="btn-outline">
            Book a Consultation
          </Link>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          onSubmit={(e) => {
            e.preventDefault();
            navigate(`/buy?q=${encodeURIComponent(q)}`);
          }}
          className="mt-12 flex max-w-xl items-center gap-2 rounded-full bg-white/95 p-2 shadow-luxe backdrop-blur"
        >
          <FiSearch className="ml-4 text-xl text-gold" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by location, project, or keyword..."
            className="flex-1 bg-transparent px-2 py-2 text-sm text-navy-900 outline-none"
          />
          <button className="btn-gold !px-6 !py-2.5">Search</button>
        </motion.form>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60">
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
          className="h-10 w-6 rounded-full border-2 border-white/40 p-1"
        >
          <div className="mx-auto h-2 w-1 rounded-full bg-gold" />
        </motion.div>
      </div>
    </section>
  );
}

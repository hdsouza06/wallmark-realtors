import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiChevronLeft, FiChevronRight, FiStar } from "react-icons/fi";
import { FaQuoteLeft } from "react-icons/fa";
import SectionHeading from "../SectionHeading";
import { contentApi } from "../../services/api";

export default function Testimonials() {
  const [items, setItems] = useState([]);
  const [i, setI] = useState(0);

  useEffect(() => {
    contentApi.testimonials().then(setItems).catch(() => setItems([]));
  }, []);

  useEffect(() => {
    if (items.length <= 1) return;
    const t = setInterval(() => setI((p) => (p + 1) % items.length), 6000);
    return () => clearInterval(t);
  }, [items.length]);

  if (!items.length) return null;
  const active = items[i];

  return (
    <section className="bg-cream py-20 lg:py-28">
      <div className="container-luxe">
        <SectionHeading
          center
          eyebrow="Testimonials"
          title="Trusted by Discerning Clients"
          subtitle="Hear from the families and investors who found their perfect address with us."
        />

        <div className="relative mx-auto mt-12 max-w-3xl text-center">
          <FaQuoteLeft className="mx-auto mb-6 text-4xl text-gold/40" />
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <p className="text-xl font-light leading-relaxed text-navy-900 sm:text-2xl">
                "{active.message}"
              </p>
              <div className="mt-6 flex justify-center gap-1 text-gold">
                {Array.from({ length: active.rating || 5 }).map((_, k) => (
                  <FiStar key={k} className="fill-gold" />
                ))}
              </div>
              <p className="mt-4 font-serif text-lg font-semibold text-navy-900">{active.name}</p>
              {active.role && <p className="text-sm text-gray-500">{active.role}</p>}
            </motion.div>
          </AnimatePresence>

          {items.length > 1 && (
            <div className="mt-8 flex items-center justify-center gap-3">
              <button
                onClick={() => setI((p) => (p - 1 + items.length) % items.length)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-navy-900/15 transition hover:border-gold hover:text-gold"
              >
                <FiChevronLeft />
              </button>
              <button
                onClick={() => setI((p) => (p + 1) % items.length)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-navy-900/15 transition hover:border-gold hover:text-gold"
              >
                <FiChevronRight />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

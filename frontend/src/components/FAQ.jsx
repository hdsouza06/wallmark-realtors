import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiPlus, FiMinus } from "react-icons/fi";
import SectionHeading from "./SectionHeading";
import Seo from "./Seo";

const FAQS = [
  {
    q: "How do I schedule a property viewing?",
    a: "Simply contact us via phone, WhatsApp or the enquiry form, and our advisor will arrange a viewing at your convenience.",
  },
  {
    q: "Are all listings RERA verified?",
    a: "Yes. Every property listed with Wallmark Realtors undergoes legal due diligence and RERA verification where applicable.",
  },
  {
    q: "Do you assist with home loans?",
    a: "Absolutely. We partner with leading banks to secure the best interest rates and handle the entire loan process for you.",
  },
  {
    q: "What areas do you operate in?",
    a: "We specialise in premium properties across Mumbai, Pune and surrounding metropolitan regions.",
  },
  {
    q: "Is there a fee for a consultation?",
    a: "No. Initial consultations and property valuations are completely complimentary.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(0);

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <section className="bg-cream py-20 lg:py-28">
      <Seo schema={schema} />
      <div className="container-luxe max-w-3xl">
        <SectionHeading center eyebrow="FAQ" title="Frequently Asked Questions" />
        <div className="mt-12 space-y-4">
          {FAQS.map((f, i) => (
            <div key={f.q} className="overflow-hidden rounded-2xl bg-white shadow-luxe">
              <button
                onClick={() => setOpen(open === i ? -1 : i)}
                className="flex w-full items-center justify-between gap-4 p-6 text-left"
              >
                <span className="font-semibold text-navy-900">{f.q}</span>
                <span className="text-gold">{open === i ? <FiMinus /> : <FiPlus />}</span>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-6 text-sm leading-relaxed text-gray-500">{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

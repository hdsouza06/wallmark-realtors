import { useState } from "react";
import { motion } from "framer-motion";
import { FiLayers, FiFeather, FiSun } from "react-icons/fi";
import Seo from "../components/Seo";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";
import EnquiryForm from "../components/EnquiryForm";

const SERVICES = [
  { Icon: FiFeather, title: "Bespoke Design", desc: "Tailor-made interiors that reflect your personality." },
  { Icon: FiLayers, title: "Turnkey Execution", desc: "From concept to completion, fully managed." },
  { Icon: FiSun, title: "Smart & Sustainable", desc: "Energy-efficient, future-ready living spaces." },
];

const PORTFOLIO = [
  "1618221195710-dd6b41faaea6",
  "1616486338812-3dadae4b4ace",
  "1616137466211-f939a420be84",
  "1586023492125-27b2c045efd7",
  "1617103996702-96ff29b1c467",
  "1631679706909-1844bbd07221",
];

const BEFORE_AFTER = [
  {
    before: "1502672260266-1c1ef2d93688",
    after: "1618221195710-dd6b41faaea6",
    title: "Living Room Transformation",
  },
  {
    before: "1484154218962-a197022b5858",
    after: "1616486338812-3dadae4b4ace",
    title: "Modern Kitchen Makeover",
  },
];

const img = (id, w = 800) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

function BeforeAfter({ before, after, title }) {
  const [pos, setPos] = useState(50);
  return (
    <Reveal>
      <div className="overflow-hidden rounded-2xl bg-white shadow-luxe">
        <div className="relative h-72 select-none">
          <img src={img(after)} alt="After" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
            <img src={img(before)} alt="Before" className="h-full w-full object-cover" style={{ width: `${(100 / pos) * 100}%`, maxWidth: "none" }} />
            <span className="absolute left-3 top-3 rounded-full bg-navy-900/80 px-3 py-1 text-xs font-semibold text-white">Before</span>
          </div>
          <span className="absolute right-3 top-3 rounded-full bg-gold px-3 py-1 text-xs font-semibold text-navy-900">After</span>
          <div className="absolute bottom-0 top-0 w-0.5 bg-white" style={{ left: `${pos}%` }} />
          <input
            type="range"
            min="0"
            max="100"
            value={pos}
            onChange={(e) => setPos(Number(e.target.value))}
            className="absolute inset-x-0 bottom-4 mx-auto w-3/4 accent-gold"
          />
        </div>
        <p className="p-5 text-center font-semibold text-navy-900">{title}</p>
      </div>
    </Reveal>
  );
}

export default function Interiors() {
  return (
    <>
      <Seo
        title="Interior Design Services"
        description="Luxury interior design services by Wallmark Realtors. Explore our portfolio and stunning before & after transformations."
      />
      <PageHero
        eyebrow="Interior Design"
        title="Crafting Beautiful Spaces"
        subtitle="Transform your house into a luxurious home with our bespoke interior design services."
        breadcrumb="Interiors"
        image="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=2000&q=80"
      />

      <section className="container-luxe py-20 lg:py-28">
        <SectionHeading center eyebrow="What We Do" title="Interior Design Services" />
        <div className="mt-12 grid gap-7 sm:grid-cols-3">
          {SERVICES.map(({ Icon, title, desc }, i) => (
            <Reveal key={title} index={i}>
              <div className="h-full rounded-2xl bg-cream p-8 text-center">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold text-2xl text-navy-900">
                  <Icon />
                </span>
                <h3 className="mt-6 text-lg font-semibold text-navy-900">{title}</h3>
                <p className="mt-2 text-sm text-gray-500">{desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-cream py-20 lg:py-28">
        <div className="container-luxe">
          <SectionHeading center eyebrow="Before & After" title="Real Transformations" subtitle="Drag the slider to reveal the magic of great design." />
          <div className="mt-12 grid gap-7 lg:grid-cols-2">
            {BEFORE_AFTER.map((b) => (
              <BeforeAfter key={b.title} {...b} />
            ))}
          </div>
        </div>
      </section>

      <section className="container-luxe py-20 lg:py-28">
        <SectionHeading center eyebrow="Our Work" title="Portfolio Gallery" />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PORTFOLIO.map((id, i) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 3) * 0.1 }}
              className="group overflow-hidden rounded-2xl"
            >
              <img
                src={img(id)}
                alt="Interior project"
                loading="lazy"
                className="h-64 w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-navy-900 py-20 lg:py-28">
        <div className="container-luxe mx-auto max-w-2xl">
          <div className="rounded-3xl bg-white p-8 shadow-luxe lg:p-12">
            <EnquiryForm
              enquiryType="interiors"
              title="Start Your Project"
              subtitle="Tell us your vision and our designers will bring it to life."
              buttonLabel="Request a Design Consultation"
            />
          </div>
        </div>
      </section>
    </>
  );
}

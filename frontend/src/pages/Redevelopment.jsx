import { useState } from "react";
import { motion } from "framer-motion";
import { FiCheckCircle, FiClock } from "react-icons/fi";
import Seo from "../components/Seo";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";
import EnquiryForm from "../components/EnquiryForm";

const img = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=80`;

const PROJECTS = [
  { id: "1545324418-cc1a3fa10c00", title: "Marina Heights", location: "Worli, Mumbai", status: "ongoing", desc: "A 42-storey luxury redevelopment with sea views." },
  { id: "1486406146926-c627a92ad1ab", title: "The Crest Residences", location: "Aundh, Pune", status: "ongoing", desc: "Modern gated community replacing a 1980s society." },
  { id: "1564013799919-ab600027ffc6", title: "Palm Grove Towers", location: "Andheri, Mumbai", status: "completed", desc: "Delivered 2023 — 120 premium apartments." },
  { id: "1512917774080-9991f1c4c750", title: "Orchid Enclave", location: "Baner, Pune", status: "completed", desc: "Award-winning sustainable redevelopment." },
];

const GALLERY = ["1480714378408-67cf0d13bc1b", "1449844908441-8829872d2607", "1493809842364-78817add7ffb", "1460317442991-0ec209397118"];

export default function Redevelopment() {
  const [tab, setTab] = useState("ongoing");
  const filtered = PROJECTS.filter((p) => p.status === tab);

  return (
    <>
      <Seo
        title="Redevelopment Projects"
        description="Explore Wallmark Realtors' ongoing and completed redevelopment projects transforming urban living."
      />
      <PageHero
        eyebrow="Building the Future"
        title="Redevelopment Projects"
        subtitle="Transforming ageing societies into modern landmarks of luxury living."
        breadcrumb="Redevelopment"
        image="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80"
      />

      <section className="container-luxe py-20 lg:py-28">
        <SectionHeading center eyebrow="Our Projects" title="Crafting Modern Landmarks" />

        <div className="mt-10 flex justify-center gap-3">
          {[
            { key: "ongoing", label: "Ongoing", Icon: FiClock },
            { key: "completed", label: "Completed", Icon: FiCheckCircle },
          ].map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition ${
                tab === key ? "bg-gold text-navy-900" : "bg-cream text-navy-900 hover:bg-gold/20"
              }`}
            >
              <Icon /> {label}
            </button>
          ))}
        </div>

        <div className="mt-12 grid gap-7 sm:grid-cols-2">
          {filtered.map((p, i) => (
            <Reveal key={p.title} index={i}>
              <div className="group overflow-hidden rounded-2xl bg-white shadow-luxe">
                <div className="relative h-64 overflow-hidden">
                  <img src={img(p.id)} alt={p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <span className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-bold uppercase ${p.status === "ongoing" ? "bg-gold text-navy-900" : "bg-green-600 text-white"}`}>
                    {p.status}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-navy-900">{p.title}</h3>
                  <p className="mt-1 text-sm text-gold">{p.location}</p>
                  <p className="mt-3 text-sm text-gray-500">{p.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-cream py-20 lg:py-28">
        <div className="container-luxe">
          <SectionHeading center eyebrow="Gallery" title="Project Gallery" />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {GALLERY.map((id, i) => (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 4) * 0.1 }}
                className="group overflow-hidden rounded-2xl"
              >
                <img src={img(id)} alt="Project" loading="lazy" className="h-56 w-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-luxe py-20 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Partner With Us"
              title="Considering Redevelopment?"
              subtitle="If your society is exploring redevelopment, our experts can guide you through feasibility, approvals and execution — maximising value for every member."
            />
          </div>
          <div className="rounded-3xl bg-white p-8 shadow-luxe lg:p-10">
            <EnquiryForm
              enquiryType="redevelopment"
              title="Discuss Your Project"
              buttonLabel="Contact Our Team"
            />
          </div>
        </div>
      </section>
    </>
  );
}

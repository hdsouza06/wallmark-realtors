import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiAward,
  FiHome,
  FiKey,
  FiTrendingUp,
  FiDollarSign,
  FiGrid,
  FiRefreshCw,
  FiShield,
  FiUsers,
  FiClock,
} from "react-icons/fi";
import Seo from "../components/Seo";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";
import PropertyCard from "../components/PropertyCard";
import { PropertyGridSkeleton } from "../components/Skeletons";
import Hero from "../components/home/Hero";
import Stats from "../components/home/Stats";
import Testimonials from "../components/home/Testimonials";
import { propertiesApi, contentApi } from "../services/api";
import { SITE } from "../config/site";
import { useSettings } from "../context/SettingsContext";

const SERVICES = [
  { Icon: FiHome, title: "Buy Property", desc: "Handpicked premium homes ready for you to move in.", to: "/buy" },
  { Icon: FiDollarSign, title: "Sell Property", desc: "Get the best value with our expert advisory.", to: "/sell" },
  { Icon: FiKey, title: "Lease & Rent", desc: "Furnished and unfurnished rentals across the city.", to: "/lease" },
  { Icon: FiTrendingUp, title: "Home Loans", desc: "Best rates from leading partner banks.", to: "/home-loan" },
  { Icon: FiGrid, title: "Interiors", desc: "Bespoke interior design for luxury living.", to: "/interiors" },
  { Icon: FiRefreshCw, title: "Redevelopment", desc: "Transforming societies into modern landmarks.", to: "/redevelopment" },
];

const WHY = [
  { Icon: FiAward, title: "18+ Years of Trust", desc: "Nearly two decades of delivering excellence in real estate." },
  { Icon: FiShield, title: "Verified Listings", desc: "Every property is RERA-checked and legally vetted." },
  { Icon: FiUsers, title: "Dedicated Advisors", desc: "Personal relationship managers for every client." },
  { Icon: FiClock, title: "End-to-End Service", desc: "From search to handover and beyond, we're with you." },
];

export default function Home() {
  const settings = useSettings();
  const [featured, setFeatured] = useState(null);
  const [recent, setRecent] = useState(null);
  const [banner, setBanner] = useState(null);
  const aboutPoints = (settings.about_points || "")
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean);

  useEffect(() => {
    propertiesApi.list({ featured: true, page_size: 6 }).then((d) => setFeatured(d.items)).catch(() => setFeatured([]));
    propertiesApi.list({ sort: "newest", page_size: 3 }).then((d) => setRecent(d.items)).catch(() => setRecent([]));
    contentApi.banners().then((b) => setBanner(b[0] || null)).catch(() => {});
  }, []);

  const schema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: SITE.name,
    telephone: SITE.phone,
    email: SITE.email,
    address: SITE.address,
  };

  return (
    <>
      <Seo title="Premium Real Estate" schema={schema} />
      <Hero banner={banner} />

      {/* MahaRERA trust badge */}
      {settings.rera && (
        <section className="bg-navy-900">
          <div className="container-luxe flex flex-col items-center justify-center gap-3 py-5 text-center sm:flex-row sm:gap-5">
            <span className="flex items-center gap-2 rounded-full border border-gold/50 bg-gold/10 px-5 py-2">
              <FiAward className="text-gold" />
              <span className="text-sm font-semibold tracking-wide text-white">
                MahaRERA Registered
              </span>
              <span className="rounded-full bg-gold px-3 py-0.5 text-sm font-bold text-navy-900">
                {settings.rera}
              </span>
            </span>
            <p className="text-xs uppercase tracking-[0.25em] text-white/60">
              Trusted · Verified · Compliant
            </p>
          </div>
        </section>
      )}

      {/* Featured Properties */}
      <section className="container-luxe py-20 lg:py-28">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Featured Collection"
            title="Signature Properties"
            subtitle="A curated selection of our most exclusive residences."
          />
          <Link to="/buy" className="btn-outline hidden sm:inline-flex">
            View All <FiArrowRight />
          </Link>
        </div>
        <div className="mt-12">
          {featured === null ? (
            <PropertyGridSkeleton />
          ) : featured.length ? (
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((p, i) => (
                <PropertyCard key={p.id} property={p} index={i} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No featured properties yet.</p>
          )}
        </div>
      </section>

      {/* About */}
      <section id="about" className="bg-cream py-20 lg:py-28">
        <div className="container-luxe grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="relative">
              <img
                src={settings.about_image}
                alt={settings.about_title}
                className="rounded-3xl shadow-luxe"
                loading="lazy"
              />
              {settings.rera && (
                <div className="absolute -bottom-6 -right-6 hidden rounded-2xl bg-navy-900 p-5 text-center text-white shadow-luxe sm:block">
                  <p className="text-[10px] uppercase tracking-wider text-white/60">MahaRERA</p>
                  <p className="font-serif text-lg font-bold text-gold">{settings.rera}</p>
                </div>
              )}
            </div>
          </Reveal>
          <div>
            <SectionHeading
              eyebrow="About Us"
              title={settings.about_title}
              subtitle={settings.about_subtitle}
            />
            {settings.about_body && (
              <p className="mt-5 whitespace-pre-line leading-relaxed text-gray-600">
                {settings.about_body}
              </p>
            )}
            {aboutPoints.length > 0 && (
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {aboutPoints.map((t) => (
                  <Reveal as="li" key={t} className="flex items-start gap-3 text-gray-700">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold text-xs text-navy-900">
                      ✓
                    </span>
                    {t}
                  </Reveal>
                ))}
              </ul>
            )}
            <Link to="/contact" className="btn-gold mt-9">
              Get in Touch <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="container-luxe py-20 lg:py-28">
        <SectionHeading
          center
          eyebrow="What We Offer"
          title="Our Premium Services"
          subtitle="A complete real estate ecosystem under one trusted roof."
        />
        <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map(({ Icon, title, desc, to }, i) => (
            <Reveal key={title} index={i}>
              <Link
                to={to}
                className="group flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-8 shadow-luxe transition hover:-translate-y-2"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-navy-900 text-2xl text-gold transition group-hover:bg-gold group-hover:text-navy-900">
                  <Icon />
                </span>
                <h3 className="mt-6 text-xl font-semibold text-navy-900">{title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-500">{desc}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-gold">
                  Learn More <FiArrowRight className="transition group-hover:translate-x-1" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <Stats />

      {/* Why Choose Us */}
      <section className="container-luxe py-20 lg:py-28">
        <SectionHeading
          center
          eyebrow="Why Choose Us"
          title="The Wallmark Advantage"
          subtitle="What sets us apart in the world of premium real estate."
        />
        <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {WHY.map(({ Icon, title, desc }, i) => (
            <Reveal key={title} index={i}>
              <div className="h-full rounded-2xl bg-cream p-8 text-center transition hover:bg-navy-900 hover:text-white group">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold text-2xl text-navy-900">
                  <Icon />
                </span>
                <h3 className="mt-6 text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-gray-500 group-hover:text-white/70">{desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <Testimonials />

      {/* Recent Listings */}
      <section className="container-luxe py-20 lg:py-28">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="Just Listed" title="Recent Listings" />
          <Link to="/buy" className="btn-outline hidden sm:inline-flex">
            Browse All <FiArrowRight />
          </Link>
        </div>
        <div className="mt-12">
          {recent === null ? (
            <PropertyGridSkeleton count={3} />
          ) : (
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {recent.map((p, i) => (
                <PropertyCard key={p.id} property={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-24">
        <img
          src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=2000&q=80"
          alt="Luxury home"
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-navy-950/85" />
        <div className="container-luxe relative text-center">
          <Reveal>
            <h2 className="mx-auto max-w-3xl text-3xl font-semibold text-white sm:text-5xl">
              Ready to Find Your Dream Home?
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-white/70">
              Let our experts guide you to the perfect property. Book a complimentary consultation today.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <Link to="/contact" className="btn-gold">
                Book Consultation
              </Link>
              <a href={SITE.phoneHref} className="btn-outline">
                Call {SITE.phone}
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

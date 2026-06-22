import { Link } from "react-router-dom";
import { FiArrowRight, FiAward } from "react-icons/fi";
import Seo from "../components/Seo";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";
import Stats from "../components/home/Stats";
import { SITE } from "../config/site";
import { useSettings } from "../context/SettingsContext";

export default function About() {
  const settings = useSettings();
  const aboutPoints = (settings.about_points || "")
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <>
      <Seo
        title="About Us"
        description={settings.about_subtitle || `About ${SITE.name}`}
      />
      <PageHero
        eyebrow="Who We Are"
        title={settings.about_title || "About Us"}
        subtitle={settings.about_subtitle}
        breadcrumb="About Us"
        image={settings.about_image}
      />

      {/* MahaRERA trust badge */}
      {settings.rera && (
        <section className="bg-navy-900">
          <div className="container-luxe flex flex-col items-center justify-center gap-3 py-5 text-center sm:flex-row sm:gap-5">
            <span className="flex items-center gap-2 rounded-full border border-gold/50 bg-gold/10 px-5 py-2">
              <FiAward className="text-gold" />
              <span className="text-sm font-semibold tracking-wide text-white">MahaRERA Registered</span>
              <span className="rounded-full bg-gold px-3 py-0.5 text-sm font-bold text-navy-900">
                {settings.rera}
              </span>
            </span>
            <p className="text-xs uppercase tracking-[0.25em] text-white/60">Trusted · Verified · Compliant</p>
          </div>
        </section>
      )}

      {/* Story */}
      <section className="bg-cream py-20 lg:py-28">
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

      <Stats />

      {/* CTA */}
      <section className="container-luxe py-20 text-center lg:py-28">
        <Reveal>
          <SectionHeading
            center
            eyebrow="Let's Talk"
            title="Ready to Begin Your Journey?"
            subtitle="Whether you're buying, selling, leasing or investing, our team is here to guide you every step of the way."
          />
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Link to="/contact" className="btn-gold">Contact Us</Link>
            <Link to="/buy" className="btn-outline">Explore Properties</Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}

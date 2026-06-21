import { FiMapPin, FiPhone, FiMail, FiClock } from "react-icons/fi";
import { FaWhatsapp, FaInstagram, FaFacebookF, FaYoutube, FaLinkedinIn } from "react-icons/fa";
import Seo from "../components/Seo";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import EnquiryForm from "../components/EnquiryForm";
import FAQ from "../components/FAQ";
import { telHref, waLink } from "../config/site";
import { useSettings } from "../context/SettingsContext";

export default function Contact() {
  const settings = useSettings();

  const cards = [
    { Icon: FiMapPin, title: "Visit Us", lines: [settings.address] },
    { Icon: FiPhone, title: "Call Us", lines: [settings.phone], href: telHref(settings.phone) },
    { Icon: FiMail, title: "Email Us", lines: [settings.email], href: `mailto:${settings.email}` },
    { Icon: FiClock, title: "Working Hours", lines: ["Mon – Sat: 9:30 – 19:00", "Sunday: By appointment"] },
  ];

  const socials = [
    { Icon: FaInstagram, href: settings.instagram_url, label: "Instagram" },
    { Icon: FaFacebookF, href: settings.facebook_url, label: "Facebook" },
    { Icon: FaYoutube, href: settings.youtube_url, label: "YouTube" },
    { Icon: FaLinkedinIn, href: settings.linkedin_url, label: "LinkedIn" },
  ].filter((s) => s.href);

  return (
    <>
      <Seo title="Contact Us" description="Get in touch with Wallmark Realtors. Call, WhatsApp, email or visit our office. We're here to help you find your dream home." />
      <PageHero
        eyebrow="Get In Touch"
        title="Contact Wallmark Realtors"
        subtitle="We'd love to hear from you. Reach out and our team will respond promptly."
        breadcrumb="Contact"
        image="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80"
      />

      <section className="container-luxe py-20 lg:py-28">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(({ Icon, title, lines, href }, i) => (
            <Reveal key={title} index={i}>
              <div className="h-full rounded-2xl bg-cream p-7 text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold text-2xl text-navy-900">
                  <Icon />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-navy-900">{title}</h3>
                {lines.map((l) =>
                  href ? (
                    <a key={l} href={href} className="mt-1 block text-sm text-gray-600 hover:text-gold">{l}</a>
                  ) : (
                    <p key={l} className="mt-1 text-sm text-gray-600">{l}</p>
                  )
                )}
              </div>
            </Reveal>
          ))}
        </div>

        {socials.length > 0 && (
          <div className="mt-10 flex flex-col items-center gap-4">
            <p className="eyebrow">Follow Us</p>
            <div className="flex gap-3">
              {socials.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 text-lg text-navy-900 transition hover:bg-gold hover:text-white"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="mt-16 grid gap-12 lg:grid-cols-2">
          <div className="rounded-3xl bg-white p-8 shadow-luxe lg:p-10">
            <EnquiryForm enquiryType="contact" title="Send a Message" subtitle="Fill in the form and we'll get back to you shortly." />
            <a href={waLink(settings.whatsapp)} target="_blank" rel="noreferrer" className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-7 py-3 text-sm font-semibold uppercase tracking-wider text-white transition hover:opacity-90">
              <FaWhatsapp className="text-lg" /> Chat on WhatsApp
            </a>
          </div>

          <div className="overflow-hidden rounded-3xl shadow-luxe">
            <iframe
              title="Wallmark Realtors Location"
              src={settings.map_embed}
              className="h-full min-h-[400px] w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      <FAQ />
    </>
  );
}

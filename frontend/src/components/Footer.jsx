import { useState } from "react";
import { Link } from "react-router-dom";
import { FiInstagram, FiFacebook, FiYoutube, FiLinkedin, FiMapPin, FiPhone, FiMail } from "react-icons/fi";
import Logo from "./Logo";
import { NAV_LINKS, SITE, telHref } from "../config/site";
import { contentApi } from "../services/api";
import { useSettings } from "../context/SettingsContext";

export default function Footer() {
  const settings = useSettings();
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const subscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setBusy(true);
    try {
      const res = await contentApi.subscribe(email);
      setMsg(res.detail);
      setEmail("");
    } catch {
      setMsg("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const socials = [
    { Icon: FiInstagram, href: settings.instagram_url },
    { Icon: FiFacebook, href: settings.facebook_url },
    { Icon: FiYoutube, href: settings.youtube_url },
    { Icon: FiLinkedin, href: settings.linkedin_url },
  ].filter((s) => s.href);

  return (
    <footer className="bg-navy-950 text-white">
      <div className="border-b border-white/10">
        <div className="container-luxe grid gap-8 py-14 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo height="h-20" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/60">
              Curating exceptional homes and investment opportunities across India's most
              prestigious neighbourhoods.
            </p>
            <div className="mt-6 flex gap-3">
              {socials.map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition hover:border-gold hover:bg-gold hover:text-navy-900"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-5 text-sm font-semibold uppercase tracking-widest text-gold">Explore</h4>
            <ul className="space-y-3 text-sm text-white/70">
              {NAV_LINKS.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="transition hover:text-gold">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/blog" className="transition hover:text-gold">Blog</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-5 text-sm font-semibold uppercase tracking-widest text-gold">Contact</h4>
            <ul className="space-y-4 text-sm text-white/70">
              <li className="flex gap-3"><FiMapPin className="mt-1 shrink-0 text-gold" /> {settings.address}</li>
              <li className="flex gap-3"><FiPhone className="shrink-0 text-gold" /> <a href={telHref(settings.phone)} className="hover:text-gold">{settings.phone}</a></li>
              <li className="flex gap-3"><FiMail className="shrink-0 text-gold" /> <a href={`mailto:${settings.email}`} className="hover:text-gold">{settings.email}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-5 text-sm font-semibold uppercase tracking-widest text-gold">Newsletter</h4>
            <p className="mb-4 text-sm text-white/60">Get exclusive listings and market insights.</p>
            <form onSubmit={subscribe} className="space-y-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full rounded-full border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-gold"
              />
              <button disabled={busy} className="btn-gold w-full">
                {busy ? "Subscribing..." : "Subscribe"}
              </button>
              {msg && <p className="text-xs text-gold">{msg}</p>}
            </form>
          </div>
        </div>
      </div>

      <div className="container-luxe flex flex-col items-center justify-between gap-2 py-6 text-xs text-white/50 sm:flex-row">
        <p>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
        {settings.rera && <p className="text-gold/80">MahaRERA No. {settings.rera}</p>}
        <p>{SITE.tagline}</p>
      </div>
    </footer>
  );
}

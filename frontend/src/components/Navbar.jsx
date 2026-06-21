import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FiMenu, FiX, FiPhone } from "react-icons/fi";
import Logo from "./Logo";
import { NAV_LINKS, telHref } from "../config/site";
import { useSettings } from "../context/SettingsContext";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const settings = useSettings();
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const solid = scrolled || !isHome || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        solid ? "bg-navy-900/95 py-2 shadow-luxe backdrop-blur" : "bg-transparent py-3"
      }`}
    >
      <nav className="container-luxe flex items-center justify-between">
        <Logo
          height={scrolled ? "h-14" : "h-20"}
          imgClassName="[filter:drop-shadow(0_1px_3px_rgba(0,0,0,0.55))]"
        />

        <ul className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `relative text-sm font-medium tracking-wide transition-colors after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:bg-gold after:transition-all ${
                    isActive
                      ? "text-gold after:w-full"
                      : "text-white/85 hover:text-gold after:w-0 hover:after:w-full"
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-4 lg:flex">
          <a href={telHref(settings.phone)} className="flex items-center gap-2 text-sm text-white/85 hover:text-gold">
            <FiPhone /> {settings.phone}
          </a>
        </div>

        <button
          className="text-2xl text-white lg:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <FiX /> : <FiMenu />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden lg:hidden"
          >
            <ul className="container-luxe flex flex-col gap-1 py-4">
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      `block rounded-lg px-4 py-3 text-sm font-medium ${
                        isActive ? "bg-gold/15 text-gold" : "text-white/90 hover:bg-white/5"
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
              <li>
                <a href={telHref(settings.phone)} className="mt-2 block btn-gold w-full">
                  Call {settings.phone}
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

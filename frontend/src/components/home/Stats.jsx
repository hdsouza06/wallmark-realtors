import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { useSettings } from "../../context/SettingsContext";

// Split a display string like "4,200 Cr" into a number (4200) for the count-up
// animation and the trailing suffix (" Cr"). Falls back gracefully for any text.
function parseStat(raw) {
  const text = (raw ?? "").toString().trim();
  const match = text.match(/^[\d,]+/);
  if (!match) return { value: 0, suffix: text, animate: false };
  const value = parseInt(match[0].replace(/,/g, ""), 10) || 0;
  return { value, suffix: text.slice(match[0].length), animate: true };
}

function Counter({ value, suffix, animate }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView || !animate) return;
    let start = 0;
    const duration = 1600;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setN(Math.floor(p * value));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, value, animate]);

  return (
    <span ref={ref}>
      {animate ? n.toLocaleString("en-IN") : ""}
      {suffix}
    </span>
  );
}

export default function Stats() {
  const settings = useSettings();
  const stats = [
    { value: settings.stat1_value, label: settings.stat1_label },
    { value: settings.stat2_value, label: settings.stat2_label },
    { value: settings.stat3_value, label: settings.stat3_label },
    { value: settings.stat4_value, label: settings.stat4_label },
  ].filter((s) => s.value || s.label);

  return (
    <section className="bg-navy-900 py-16">
      <div className="container-luxe grid grid-cols-2 gap-8 lg:grid-cols-4">
        {stats.map((s, i) => {
          const { value, suffix, animate } = parseStat(s.value);
          return (
            <div key={i} className="text-center">
              <p className="font-serif text-4xl font-bold text-gold sm:text-5xl">
                <Counter value={value} suffix={suffix} animate={animate} />
              </p>
              <p className="mt-2 text-sm uppercase tracking-wider text-white/60">{s.label}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

const STATS = [
  { value: 1500, suffix: "+", label: "Happy Families" },
  { value: 850, suffix: "+", label: "Properties Sold" },
  { value: 18, suffix: " Yrs", label: "Of Excellence" },
  { value: 4200, suffix: " Cr", label: "Worth Transacted" },
];

function Counter({ value, suffix }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1600;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setN(Math.floor(p * value));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, value]);

  return (
    <span ref={ref}>
      {n.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

export default function Stats() {
  return (
    <section className="bg-navy-900 py-16">
      <div className="container-luxe grid grid-cols-2 gap-8 lg:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="text-center">
            <p className="font-serif text-4xl font-bold text-gold sm:text-5xl">
              <Counter value={s.value} suffix={s.suffix} />
            </p>
            <p className="mt-2 text-sm uppercase tracking-wider text-white/60">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

import Reveal from "./Reveal";

export default function SectionHeading({ eyebrow, title, subtitle, center, light }) {
  return (
    <Reveal className={`max-w-2xl ${center ? "mx-auto text-center" : ""}`}>
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <h2
        className={`text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl ${
          light ? "text-white" : "text-navy-900"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-4 text-base leading-relaxed ${light ? "text-white/70" : "text-gray-500"}`}>
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}

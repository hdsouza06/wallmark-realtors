import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function PageHero({ title, subtitle, eyebrow, image, breadcrumb }) {
  return (
    <section className="relative flex h-[52vh] min-h-[380px] items-center">
      <div className="absolute inset-0">
        <img src={image} alt={title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-900/70 to-navy-950/90" />
      </div>
      <div className="container-luxe relative z-10 pt-16 text-white">
        {eyebrow && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="eyebrow mb-4"
          >
            {eyebrow}
          </motion.p>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-3xl text-4xl font-bold sm:text-6xl"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 max-w-xl text-lg text-white/75"
          >
            {subtitle}
          </motion.p>
        )}
        <nav className="mt-6 flex items-center gap-2 text-sm text-white/60">
          <Link to="/" className="hover:text-gold">Home</Link>
          <span>/</span>
          <span className="text-gold">{breadcrumb || title}</span>
        </nav>
      </div>
    </section>
  );
}

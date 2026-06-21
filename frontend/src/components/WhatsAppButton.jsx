import { FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";
import { waLink } from "../config/site";
import { useSettings } from "../context/SettingsContext";

export default function WhatsAppButton() {
  const settings = useSettings();
  return (
    <motion.a
      href={waLink(settings.whatsapp)}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1, type: "spring" }}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-2xl text-white shadow-lg transition hover:scale-110"
    >
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-40" />
      <FaWhatsapp className="relative" />
    </motion.a>
  );
}

export const SITE = {
  name: "Wallmark Realtors",
  tagline: "Marking Trust. Building Futures.",
  phone: "+91 98208 90001",
  phoneHref: "tel:+919820890001",
  whatsapp: "919820890001",
  email: "wallmarkrealtors@gmail.com",
  website: "https://www.wallmarkrealtors.com",
  address: "Mumbai · Pune · Goa · Dubai",
  rera: "MahaRERA No. A031262601485",
  mapEmbed: "https://www.google.com/maps?q=Mumbai,Maharashtra,India&output=embed",
  social: {
    instagram: "https://www.instagram.com/wallmarkrealtors",
    facebook: "https://www.facebook.com/wallmarkrealtors",
    youtube: "https://www.youtube.com/@wallmarkrealtors",
    linkedin: "https://www.linkedin.com/company/wallmarkrealtors",
  },
};

export const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Buy", to: "/buy" },
  { label: "Sell", to: "/sell" },
  { label: "Lease", to: "/lease" },
  { label: "Home Loan", to: "/home-loan" },
  { label: "Interiors", to: "/interiors" },
  { label: "Redevelopment", to: "/redevelopment" },
  { label: "Contact", to: "/contact" },
];

export const formatPrice = (value, listingType) => {
  if (value == null) return "Price on request";
  const suffix = listingType === "lease" ? "/mo" : "";
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr${suffix}`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)} Lakh${suffix}`;
  return `₹${value.toLocaleString("en-IN")}${suffix}`;
};

const DEFAULT_WA_MESSAGE = "Hi Wallmark Realtors, I'd like to know more about your properties.";

// Build a WhatsApp deep link. `number` may include +, spaces or dashes — they're stripped.
export const waLink = (number, message) =>
  `https://wa.me/${String(number || SITE.whatsapp).replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
    message || DEFAULT_WA_MESSAGE
  )}`;

// Backwards-compatible helper using the static default number.
export const whatsappLink = (message) => waLink(SITE.whatsapp, message);

// Normalise a phone string into a tel: href.
export const telHref = (phone) => `tel:${String(phone || SITE.phone).replace(/[^0-9+]/g, "")}`;

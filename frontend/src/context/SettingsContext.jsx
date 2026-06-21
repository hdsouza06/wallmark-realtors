import { createContext, useContext, useEffect, useState } from "react";
import { settingsApi } from "../services/api";
import { SITE } from "../config/site";

// Fallback defaults (used before the API responds, or if it fails).
const DEFAULTS = {
  phone: SITE.phone,
  whatsapp: SITE.whatsapp,
  email: SITE.email,
  address: SITE.address,
  website: SITE.website,
  rera: "A031262601485",
  map_embed: SITE.mapEmbed,
  youtube_url: SITE.social.youtube,
  instagram_url: SITE.social.instagram,
  facebook_url: SITE.social.facebook,
  linkedin_url: SITE.social.linkedin,
  about_title: "About Wallmark Realtors",
  about_subtitle: "Your one-stop solution for all your real estate needs",
  about_body: "",
  about_points: "",
  about_image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80",
};

const SettingsContext = createContext(DEFAULTS);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULTS);

  useEffect(() => {
    settingsApi
      .get()
      .then((data) => setSettings((prev) => ({ ...prev, ...data })))
      .catch(() => {});
  }, []);

  return <SettingsContext.Provider value={settings}>{children}</SettingsContext.Provider>;
}

export const useSettings = () => useContext(SettingsContext);

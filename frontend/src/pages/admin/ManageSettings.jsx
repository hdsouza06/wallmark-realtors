import { useEffect, useState } from "react";
import { FiSave, FiUploadCloud, FiCheckCircle } from "react-icons/fi";
import { FaInstagram, FaFacebookF, FaYoutube, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";
import { PageTitle, Card, Field, Spinner } from "../../components/admin/ui";
import { settingsApi, uploadsApi } from "../../services/api";

export default function ManageSettings() {
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    settingsApi.get().then(setForm).catch(() => setError("Failed to load settings."));
  }, []);

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setSaved(false);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const updated = await settingsApi.update(form);
      setForm(updated);
      setSaved(true);
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  const uploadAbout = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadsApi.generic(file);
      setForm((f) => ({ ...f, about_image: res.url }));
    } catch {
      setError("Image upload failed (check Cloudinary) — you can paste an image URL instead.");
    } finally {
      setUploading(false);
    }
  };

  if (!form) return error ? <p className="text-red-500">{error}</p> : <Spinner />;

  const socialFields = [
    { key: "youtube_url", label: "YouTube channel link", Icon: FaYoutube, ph: "https://www.youtube.com/@wallmarkrealtors" },
    { key: "instagram_url", label: "Instagram profile link", Icon: FaInstagram, ph: "https://www.instagram.com/wallmarkrealtors" },
    { key: "facebook_url", label: "Facebook page link", Icon: FaFacebookF, ph: "https://www.facebook.com/wallmarkrealtors" },
    { key: "linkedin_url", label: "LinkedIn link (optional)", Icon: FaLinkedinIn, ph: "https://www.linkedin.com/company/..." },
  ];

  return (
    <form onSubmit={save}>
      <PageTitle
        title="Site Settings"
        subtitle="Update your contact details, social links and About Us content. Changes go live immediately."
        action={
          <button disabled={saving} className="btn-gold">
            <FiSave /> {saving ? "Saving..." : "Save Changes"}
          </button>
        }
      />

      {saved && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
          <FiCheckCircle /> Settings saved and published to the website.
        </div>
      )}
      {error && <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Contact */}
        <Card className="space-y-4">
          <h2 className="text-lg font-semibold text-navy-900">Contact Details</h2>
          <Field label="Phone (displayed)"><input value={form.phone || ""} onChange={set("phone")} className="input-luxe" placeholder="+91 98208 90001" /></Field>
          <Field label={<span className="flex items-center gap-2"><FaWhatsapp className="text-[#25D366]" /> WhatsApp number (with country code, digits only)</span>}>
            <input value={form.whatsapp || ""} onChange={set("whatsapp")} className="input-luxe" placeholder="919820890001" />
          </Field>
          <Field label="Email"><input value={form.email || ""} onChange={set("email")} className="input-luxe" placeholder="wallmarkrealtors@gmail.com" /></Field>
          <Field label="Address / Locations"><input value={form.address || ""} onChange={set("address")} className="input-luxe" /></Field>
          <Field label="Website"><input value={form.website || ""} onChange={set("website")} className="input-luxe" /></Field>
          <Field label="MahaRERA License No."><input value={form.rera || ""} onChange={set("rera")} className="input-luxe" placeholder="A031262601485" /></Field>
          <Field label="Google Maps embed URL"><input value={form.map_embed || ""} onChange={set("map_embed")} className="input-luxe" /></Field>
        </Card>

        {/* Social */}
        <Card className="space-y-4">
          <h2 className="text-lg font-semibold text-navy-900">Social Media Links</h2>
          <p className="text-sm text-gray-500">Paste the full link. Empty fields are hidden from the website automatically.</p>
          {socialFields.map(({ key, label, Icon, ph }) => (
            <Field key={key} label={<span className="flex items-center gap-2"><Icon className="text-gold" /> {label}</span>}>
              <input value={form[key] || ""} onChange={set(key)} className="input-luxe" placeholder={ph} />
            </Field>
          ))}
        </Card>

        {/* Homepage stats */}
        <Card className="space-y-4 lg:col-span-2">
          <h2 className="text-lg font-semibold text-navy-900">Homepage Stats</h2>
          <p className="text-sm text-gray-500">
            The four highlight numbers on the home page. The number counts up automatically — keep a
            number at the start (e.g. <span className="font-medium">1,500+</span>,{" "}
            <span className="font-medium">18 Yrs</span>, <span className="font-medium">4,200 Cr</span>).
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="grid grid-cols-2 gap-3 rounded-xl border border-gray-100 p-3">
                <Field label={`Stat ${i} — value`}>
                  <input value={form[`stat${i}_value`] || ""} onChange={set(`stat${i}_value`)} className="input-luxe" placeholder="1,500+" />
                </Field>
                <Field label={`Stat ${i} — label`}>
                  <input value={form[`stat${i}_label`] || ""} onChange={set(`stat${i}_label`)} className="input-luxe" placeholder="Happy Families" />
                </Field>
              </div>
            ))}
          </div>
        </Card>

        {/* About */}
        <Card className="space-y-4 lg:col-span-2">
          <h2 className="text-lg font-semibold text-navy-900">About Us Section (Home page)</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Heading"><input value={form.about_title || ""} onChange={set("about_title")} className="input-luxe" /></Field>
            <Field label="Subheading"><input value={form.about_subtitle || ""} onChange={set("about_subtitle")} className="input-luxe" /></Field>
          </div>
          <Field label="About text (paragraph)">
            <textarea rows={5} value={form.about_body || ""} onChange={set("about_body")} className="input-luxe resize-none" />
          </Field>
          <Field label="Key points (one per line)">
            <textarea rows={5} value={form.about_points || ""} onChange={set("about_points")} className="input-luxe resize-none" placeholder={"Buying your dream home\nHome loan assistance\n..."} />
          </Field>
          <Field label="About image">
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 py-6 hover:border-gold">
              <FiUploadCloud className="text-2xl text-gold" />
              <span className="mt-1 text-xs text-gray-500">{uploading ? "Uploading..." : "Upload image"}</span>
              <input type="file" accept="image/*" className="hidden" onChange={uploadAbout} />
            </label>
            <input value={form.about_image || ""} onChange={set("about_image")} placeholder="or paste image URL" className="input-luxe mt-2" />
          </Field>
          {form.about_image && <img src={form.about_image} alt="" className="h-40 w-full rounded-xl object-cover sm:w-80" />}
        </Card>
      </div>

      <div className="mt-6">
        <button disabled={saving} className="btn-gold">
          <FiSave /> {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

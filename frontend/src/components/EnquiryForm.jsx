import { useState } from "react";
import { FiCheckCircle } from "react-icons/fi";
import { enquiriesApi } from "../services/api";

export default function EnquiryForm({
  enquiryType = "contact",
  propertyRef,
  title = "Send us a message",
  subtitle,
  showSubject = true,
  buttonLabel = "Submit Enquiry",
  dark = false,
}) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [status, setStatus] = useState({ state: "idle", message: "" });

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setStatus({ state: "loading", message: "" });
    try {
      const res = await enquiriesApi.create({
        ...form,
        enquiry_type: enquiryType,
        property_ref: propertyRef,
      });
      setStatus({ state: "success", message: res.detail });
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      const detail = err?.response?.data?.detail;
      setStatus({
        state: "error",
        message: typeof detail === "string" ? detail : "Something went wrong. Please try again.",
      });
    }
  };

  if (status.state === "success") {
    return (
      <div className={`rounded-2xl p-8 text-center ${dark ? "bg-white/5" : "bg-cream"}`}>
        <FiCheckCircle className="mx-auto mb-4 text-5xl text-gold" />
        <h3 className={`text-2xl font-semibold ${dark ? "text-white" : "text-navy-900"}`}>Thank You!</h3>
        <p className={`mt-2 ${dark ? "text-white/70" : "text-gray-500"}`}>{status.message}</p>
        <button onClick={() => setStatus({ state: "idle", message: "" })} className="btn-outline mt-6">
          Send Another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {title && (
        <div className="mb-2">
          <h3 className={`text-2xl font-semibold ${dark ? "text-white" : "text-navy-900"}`}>{title}</h3>
          {subtitle && <p className={`mt-1 text-sm ${dark ? "text-white/60" : "text-gray-500"}`}>{subtitle}</p>}
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <input name="name" required value={form.name} onChange={update} placeholder="Full Name *" className="input-luxe" />
        <input name="phone" value={form.phone} onChange={update} placeholder="Phone Number" className="input-luxe" />
      </div>
      <input type="email" name="email" value={form.email} onChange={update} placeholder="Email Address" className="input-luxe" />
      {showSubject && (
        <input name="subject" value={form.subject} onChange={update} placeholder="Subject" className="input-luxe" />
      )}
      <textarea name="message" rows={4} value={form.message} onChange={update} placeholder="Your Message" className="input-luxe resize-none" />
      {status.state === "error" && <p className="text-sm text-red-500">{status.message}</p>}
      <button disabled={status.state === "loading"} className="btn-gold w-full">
        {status.state === "loading" ? "Sending..." : buttonLabel}
      </button>
    </form>
  );
}

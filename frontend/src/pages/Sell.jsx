import { FiTrendingUp, FiCamera, FiUsers, FiCheckCircle, FiDollarSign } from "react-icons/fi";
import Seo from "../components/Seo";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";
import EnquiryForm from "../components/EnquiryForm";

const STEPS = [
  { Icon: FiUsers, title: "Free Consultation", desc: "Share your property details and goals with our advisors." },
  { Icon: FiDollarSign, title: "Accurate Valuation", desc: "Get a data-backed market valuation of your property." },
  { Icon: FiCamera, title: "Premium Marketing", desc: "Professional photography and targeted promotion." },
  { Icon: FiCheckCircle, title: "Seamless Closing", desc: "We handle negotiations, paperwork and handover." },
];

export default function Sell() {
  return (
    <>
      <Seo
        title="Sell Your Property"
        description="Sell your property at the best value with Wallmark Realtors. Request a free consultation and valuation."
      />
      <PageHero
        eyebrow="For Property Owners"
        title="Sell With Confidence"
        subtitle="Maximise your property's value with India's trusted luxury real estate advisors."
        breadcrumb="Sell"
        image="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=2000&q=80"
      />

      <section className="container-luxe py-20 lg:py-28">
        <SectionHeading
          center
          eyebrow="How It Works"
          title="Selling Made Effortless"
          subtitle="Our proven four-step process ensures you get the best price with zero hassle."
        />
        <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(({ Icon, title, desc }, i) => (
            <Reveal key={title} index={i}>
              <div className="relative h-full rounded-2xl bg-cream p-8">
                <span className="absolute right-6 top-6 font-serif text-5xl font-bold text-gold/20">
                  0{i + 1}
                </span>
                <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-navy-900 text-2xl text-gold">
                  <Icon />
                </span>
                <h3 className="mt-6 text-lg font-semibold text-navy-900">{title}</h3>
                <p className="mt-2 text-sm text-gray-500">{desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-navy-900 py-20 lg:py-28">
        <div className="container-luxe grid items-center gap-12 lg:grid-cols-2">
          <div className="text-white">
            <p className="eyebrow mb-4">Request a Consultation</p>
            <h2 className="text-3xl font-semibold sm:text-4xl">List Your Property With Us</h2>
            <p className="mt-4 text-white/70">
              Tell us about your property and our team will get back to you with a complimentary
              valuation and a tailored selling strategy.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                "No upfront charges",
                "Access to a network of verified buyers",
                "Dedicated relationship manager",
                "Complete legal & documentation support",
              ].map((t) => (
                <li key={t} className="flex items-center gap-3 text-white/80">
                  <FiCheckCircle className="text-gold" /> {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl bg-white p-8 shadow-luxe">
            <EnquiryForm
              enquiryType="sell"
              title="Get a Free Valuation"
              subtitle="Fill in your details and we'll be in touch within 24 hours."
              buttonLabel="Request Consultation"
            />
          </div>
        </div>
      </section>
    </>
  );
}

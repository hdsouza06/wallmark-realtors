import { useMemo, useState } from "react";
import { FiPercent } from "react-icons/fi";
import Seo from "../components/Seo";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";
import EnquiryForm from "../components/EnquiryForm";

const BANKS = ["HDFC Bank", "State Bank of India", "ICICI Bank", "Axis Bank", "Kotak Mahindra", "Bank of Baroda", "LIC Housing", "PNB Housing"];

function EMICalculator() {
  const [amount, setAmount] = useState(5000000);
  const [rate, setRate] = useState(8.5);
  const [years, setYears] = useState(20);

  const { emi, totalInterest, totalPayment } = useMemo(() => {
    const p = Number(amount);
    const r = Number(rate) / 12 / 100;
    const n = Number(years) * 12;
    if (!p || !r || !n) return { emi: 0, totalInterest: 0, totalPayment: 0 };
    const emiVal = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = emiVal * n;
    return { emi: emiVal, totalInterest: total - p, totalPayment: total };
  }, [amount, rate, years]);

  const fmt = (v) => `₹${Math.round(v).toLocaleString("en-IN")}`;

  const fields = [
    { label: "Loan Amount", value: amount, set: setAmount, min: 500000, max: 100000000, step: 100000, fmt: fmt },
    { label: "Interest Rate (%)", value: rate, set: setRate, min: 5, max: 15, step: 0.1, fmt: (v) => `${v}%` },
    { label: "Tenure (Years)", value: years, set: setYears, min: 1, max: 30, step: 1, fmt: (v) => `${v} yrs` },
  ];

  return (
    <div className="grid gap-10 rounded-3xl bg-white p-8 shadow-luxe lg:grid-cols-2 lg:p-12">
      <div className="space-y-8">
        {fields.map((f) => (
          <div key={f.label}>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-navy-900">{f.label}</label>
              <span className="rounded-full bg-gold/15 px-3 py-1 text-sm font-semibold text-navy-900">
                {f.fmt(f.value)}
              </span>
            </div>
            <input
              type="range"
              min={f.min}
              max={f.max}
              step={f.step}
              value={f.value}
              onChange={(e) => f.set(Number(e.target.value))}
              className="w-full accent-gold"
            />
          </div>
        ))}
      </div>

      <div className="flex flex-col justify-center rounded-2xl bg-navy-900 p-8 text-center text-white">
        <p className="text-sm uppercase tracking-wider text-white/60">Monthly EMI</p>
        <p className="mt-2 font-serif text-4xl font-bold text-gold">{fmt(emi)}</p>
        <div className="mt-8 grid grid-cols-2 gap-4 text-left">
          <div className="rounded-xl bg-white/5 p-4">
            <p className="text-xs text-white/60">Total Interest</p>
            <p className="mt-1 font-semibold">{fmt(totalInterest)}</p>
          </div>
          <div className="rounded-xl bg-white/5 p-4">
            <p className="text-xs text-white/60">Total Payment</p>
            <p className="mt-1 font-semibold">{fmt(totalPayment)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomeLoan() {
  return (
    <>
      <Seo
        title="Home Loan Assistance"
        description="Get the best home loan rates from leading partner banks with Wallmark Realtors. Use our EMI calculator and enquire today."
      />
      <PageHero
        eyebrow="Financing Made Simple"
        title="Home Loan Assistance"
        subtitle="Unlock the best interest rates from India's leading banks, with expert guidance at every step."
        breadcrumb="Home Loan"
        image="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=2000&q=80"
      />

      <section className="container-luxe py-20 lg:py-28">
        <SectionHeading
          center
          eyebrow="EMI Calculator"
          title="Plan Your Finances"
          subtitle="Estimate your monthly instalments and total cost before you commit."
        />
        <div className="mt-12">
          <EMICalculator />
        </div>
      </section>

      <section className="bg-cream py-20 lg:py-28">
        <div className="container-luxe">
          <SectionHeading center eyebrow="Our Network" title="Partner Banks" subtitle="We work with India's most trusted lenders to get you the best deal." />
          <div className="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {BANKS.map((b, i) => (
              <Reveal key={b} index={i}>
                <div className="flex h-24 items-center justify-center rounded-2xl bg-white p-6 text-center font-semibold text-navy-900 shadow-luxe transition hover:text-gold">
                  <span className="flex items-center gap-2">
                    <FiPercent className="text-gold" /> {b}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="container-luxe py-20 lg:py-28">
        <div className="mx-auto max-w-2xl rounded-3xl bg-white p-8 shadow-luxe lg:p-12">
          <EnquiryForm
            enquiryType="home_loan"
            title="Loan Enquiry"
            subtitle="Share your requirements and our loan experts will find the best option for you."
            buttonLabel="Submit Enquiry"
          />
        </div>
      </section>
    </>
  );
}

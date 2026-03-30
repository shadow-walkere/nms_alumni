import { useState } from "react";

export default function DonationsPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    amount: "",
    purpose: "",
    message: "",
  });

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSuccess("");
    setError("");

    try {
      // Ensure phone number starts with 254
      let formattedPhone = form.phone.trim();
      if (formattedPhone.startsWith("0")) {
        formattedPhone = "254" + formattedPhone.slice(1);
      } else if (!formattedPhone.startsWith("254")) {
        formattedPhone = "254" + formattedPhone;
      }

      const response = await fetch("http://localhost:5000/api/mpesa/stkpush", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          phone: formattedPhone,
          amount: form.amount,
          purpose: form.purpose,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Payment request failed");
      }

      setSuccess("✅ STK Push sent! Check your phone to complete payment.");
      setForm({
        name: "",
        phone: "",
        amount: "",
        purpose: "",
        message: "",
      });
    } catch (err) {
      console.error(err);
      setError("❌ Something went wrong. Please try again.");
    }
  }

  return (
    <div className="min-h-screen bg-stone-50">

      {/* HERO */}
      <div className="bg-gradient-to-br from-[#0e1a2b] to-[#1f3f72] text-white py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-5xl font-bold mb-4">
            Make a <span className="text-amber-400 italic">Donation</span>
          </h1>
          <p className="text-white/70 max-w-xl">
            Support Nambale Magnet School by contributing to impactful initiatives
            that shape future generations.
          </p>
        </div>
      </div>

      {/* FORM */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-stone-200">

          <h2 className="text-2xl font-bold text-slate-800 mb-6">
            Donation Details
          </h2>

          {success && (
            <div className="mb-4 p-3 rounded-lg bg-green-100 text-green-700 text-sm">
              {success}
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Name */}
            <div>
              <label className="text-sm font-semibold text-slate-600">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full mt-1 px-4 py-2.5 rounded-xl border border-stone-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="text-sm font-semibold text-slate-600">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                placeholder="07XXXXXXXX"
                className="w-full mt-1 px-4 py-2.5 rounded-xl border border-stone-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none"
              />
            </div>

            {/* Amount */}
            <div>
              <label className="text-sm font-semibold text-slate-600">
                Amount (KES)
              </label>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                required
                className="w-full mt-1 px-4 py-2.5 rounded-xl border border-stone-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none"
              />
            </div>

            {/* Purpose */}
            <div>
              <label className="text-sm font-semibold text-slate-600">
                Donation Purpose
              </label>
              <select
                name="purpose"
                value={form.purpose}
                onChange={handleChange}
                required
                className="w-full mt-1 px-4 py-2.5 rounded-xl border border-stone-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none"
              >
                <option value="">Select purpose</option>
                <option>Scholarship Fund</option>
                <option>Library Development</option>
                <option>Infrastructure</option>
                <option>General Support</option>
              </select>
            </div>

            {/* Message */}
            <div>
              <label className="text-sm font-semibold text-slate-600">
                Message (Optional)
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows="3"
                className="w-full mt-1 px-4 py-2.5 rounded-xl border border-stone-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full bg-amber-500 text-white py-3 rounded-xl font-semibold hover:bg-amber-600 transition"
            >
              Donate Now
            </button>

          </form>
        </div>
      </div>

      {/* FOOTER CTA */}
      <div className="bg-[#0e1a2b] text-white text-center py-10">
        <p className="text-white/60">
          Thank you for supporting NMS Alumni Community 💛
        </p>
      </div>

    </div>
  );
}
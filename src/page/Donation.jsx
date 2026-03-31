import { useState } from "react";

export default function DonationsPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    amount: "",
    purpose: "",
    message: "",
  });

  const [status, setStatus] = useState({ type: "", msg: "" }); // { type: 'success' | 'error' | 'info', msg: '' }
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus({ type: "", msg: "" });
    
    // 1. Basic Validation
    const phoneRegex = /^(?:254|\+254|0)?(7|1)\d{8}$/;
    if (!phoneRegex.test(form.phone)) {
      setStatus({ type: "error", msg: "Please enter a valid Safaricom number (07... or 01...)" });
      return;
    }

    setLoading(true);

    try {
      // 2. Format phone number to 254XXXXXXXXX
      let formattedPhone = form.phone.trim().replace(/\+/g, "");
      if (formattedPhone.startsWith("0")) {
        formattedPhone = "254" + formattedPhone.slice(1);
      } else if (formattedPhone.startsWith("7") || formattedPhone.startsWith("1")) {
        formattedPhone = "254" + formattedPhone;
      }

      setStatus({ type: "info", msg: "Sending STK Push to your phone..." });

      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/mpesa/stkpush`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: formattedPhone,
          amount: Number(form.amount),
          purpose: form.purpose,
          message: form.message, // Ensure this is sent to your Donation model
        }),
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("The server encountered an issue. Please try again later.");
      }

      if (!response.ok) {
        throw new Error(data.CustomerMessage || data.error || "Payment request failed");
      }

      // 3. Success State
      setStatus({ 
        type: "success", 
        msg: "📲 STK Push sent! Enter your M-Pesa PIN on your phone to complete the donation." 
      });

      setForm({ name: "", phone: "", amount: "", purpose: "", message: "" });

    } catch (err) {
      console.error("PAYMENT_ERROR:", err.message);
      setStatus({ type: "error", msg: err.message });
    } finally {
      setLoading(false);
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
          <p className="text-white/70 max-w-xl text-lg">
            Support Nambale Magnet School by contributing to impactful initiatives.
          </p>
        </div>
      </div>

      {/* FORM CONTAINER */}
      <div className="max-w-3xl mx-auto px-6 py-12 -mt-10">
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-stone-200">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Donation Details</h2>

          {/* DYNAMIC ALERT MESSAGE */}
          {status.msg && (
            <div className={`mb-6 p-4 rounded-xl text-sm font-medium flex items-center space-x-2 ${
              status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 
              status.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 
              'bg-blue-50 text-blue-700 border border-blue-200'
            }`}>
              <span>{status.msg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Name */}
              <div>
                <label className="text-xs uppercase tracking-wider font-bold text-slate-500 ml-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                  className="w-full mt-1 px-4 py-3 rounded-xl border border-stone-300 focus:border-amber-400 focus:ring-4 focus:ring-amber-100 outline-none transition-all"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="text-xs uppercase tracking-wider font-bold text-slate-500 ml-1">M-Pesa Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  placeholder="0712345678"
                  className="w-full mt-1 px-4 py-3 rounded-xl border border-stone-300 focus:border-amber-400 focus:ring-4 focus:ring-amber-100 outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Amount */}
              <div>
                <label className="text-xs uppercase tracking-wider font-bold text-slate-500 ml-1">Amount (KES)</label>
                <input
                  type="number"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  required
                  min="1"
                  placeholder="e.g. 1000"
                  className="w-full mt-1 px-4 py-3 rounded-xl border border-stone-300 focus:border-amber-400 focus:ring-4 focus:ring-amber-100 outline-none transition-all"
                />
              </div>

              {/* Purpose */}
              <div>
                <label className="text-xs uppercase tracking-wider font-bold text-slate-500 ml-1">Purpose</label>
                <select
                  name="purpose"
                  value={form.purpose}
                  onChange={handleChange}
                  required
                  className="w-full mt-1 px-4 py-3 rounded-xl border border-stone-300 focus:border-amber-400 focus:ring-4 focus:ring-amber-100 outline-none transition-all appearance-none bg-white"
                >
                  <option value="">Select purpose</option>
                  <option>Scholarship Fund</option>
                  <option>Library Development</option>
                  <option>Infrastructure</option>
                  <option>General Support</option>
                </select>
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="text-xs uppercase tracking-wider font-bold text-slate-500 ml-1">Message (Optional)</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows="3"
                placeholder="Leave a word of encouragement..."
                className="w-full mt-1 px-4 py-3 rounded-xl border border-stone-300 focus:border-amber-400 focus:ring-4 focus:ring-amber-100 outline-none transition-all"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 text-[#0e1a2b] py-4 rounded-xl font-bold text-lg hover:bg-amber-400 transform active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-amber-200"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3 border-2 border-white border-t-transparent rounded-full" viewBox="0 0 24 24"></svg>
                  Processing...
                </span>
              ) : "Secure Donation via M-Pesa"}
            </button>
          </form>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-[#0e1a2b] text-white text-center py-12 border-t border-white/10">
        <p className="text-white/50 text-sm italic">
          Your contribution directly impacts the lives of students at Nambale Magnet School.
        </p>
        <p className="mt-2 font-medium">Thank you for supporting NMS Alumni Community 💛</p>
      </footer>
    </div>
  );
}
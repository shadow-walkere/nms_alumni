import { useState } from "react";
import SERVER_URL from "../config";

export default function DonationsPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    amount: "",
    purpose: "",
    message: "",
  });

  const [status, setStatus] = useState({ type: "", msg: "" });
  const [loading, setLoading] = useState(false);

  // Quick select amounts
  const presetAmounts = [1000, 2500, 5000, 10000];

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handlePresetClick(val) {
    setForm({ ...form, amount: val });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus({ type: "", msg: "" });

    // 1. Basic Validation
    const phoneRegex = /^(?:254|\+254|0)?(7|1)\d{8}$/;
    if (!phoneRegex.test(form.phone)) {
      setStatus({
        type: "error",
        msg: "Please enter a valid Safaricom number (07... or 01...)",
      });
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

      const response = await fetch(
        `${SERVER_URL}/api/mpesa/stkpush`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            phone: formattedPhone,
            amount: Number(form.amount),
            purpose: form.purpose,
            message: form.message,
          }),
        }
      );

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
        msg: "📲 STK Push sent! Enter your M-Pesa PIN on your phone to complete the donation.",
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
    <div className="min-h-screen bg-black text-gray-300 font-sans selection:bg-yellow-500 selection:text-black">
      
      {/* HEADER / HERO */}
      <div className="relative bg-zinc-950 border-b border-yellow-500/20 py-20 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
        <div className="relative z-10 max-w-4xl mx-auto animate-fade-in-up">
          <span className="inline-block border border-yellow-500 text-yellow-500 text-xs px-4 py-1.5 rounded-full font-bold tracking-widest uppercase mb-6 shadow-[0_0_10px_rgba(234,179,8,0.2)]">
            NMS Endowment Fund
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
            Empower the Next <br />
            <span className="text-yellow-500">Generation</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg md:text-xl">
            Your contributions directly fund scholarships, improve infrastructure, and create lasting opportunities for Nambale Magnet students.
          </p>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-12 gap-12 items-start">
        
        {/* LEFT COLUMN: IMPACT INFO */}
        <div className="lg:col-span-5 space-y-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div>
            <h2 className="text-3xl font-bold text-white mb-4">Why Give Back?</h2>
            <div className="w-16 h-1 bg-yellow-500 mb-6"></div>
            <p className="text-gray-400 leading-relaxed mb-8">
              Every shilling invested in the Nambale Magnet Alumni Network goes directly towards bridging the educational gap for brilliant but vulnerable children. 
            </p>
          </div>

          <div className="space-y-6">
            {/* Impact Item 1 */}
            <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl hover:border-yellow-500/50 transition-colors group">
              <div className="flex items-center gap-4 mb-3">
                <div className="bg-yellow-500/10 p-3 rounded-lg text-yellow-500 group-hover:bg-yellow-500 group-hover:text-black transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path></svg>
                </div>
                <h3 className="text-xl font-bold text-white">Scholarship Fund</h3>
              </div>
              <p className="text-sm text-gray-500">Supporting university tuition and upkeep for our top-performing graduates.</p>
            </div>

            {/* Impact Item 2 */}
            <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl hover:border-yellow-500/50 transition-colors group">
              <div className="flex items-center gap-4 mb-3">
                <div className="bg-yellow-500/10 p-3 rounded-lg text-yellow-500 group-hover:bg-yellow-500 group-hover:text-black transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                </div>
                <h3 className="text-xl font-bold text-white">Infrastructure</h3>
              </div>
              <p className="text-sm text-gray-500">Upgrading school facilities, science labs, and the campus library.</p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: DONATION FORM */}
        <div className="lg:col-span-7 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.8)] p-8 md:p-10 relative overflow-hidden">
            {/* Decorative element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-bl-full blur-2xl"></div>

            <h2 className="text-2xl font-bold text-white mb-6 relative z-10">Make Your Contribution</h2>

            {/* DYNAMIC ALERT MESSAGE - Dark Mode Optimized */}
            {status.msg && (
              <div
                className={`mb-8 p-4 rounded-xl text-sm font-bold flex items-center gap-3 border backdrop-blur-sm animate-fade-in ${
                  status.type === "success"
                    ? "bg-green-950/40 text-green-400 border-green-900/50"
                    : status.type === "error"
                    ? "bg-red-950/40 text-red-400 border-red-900/50"
                    : "bg-yellow-950/40 text-yellow-500 border-yellow-900/50"
                }`}
              >
                {status.type === "success" && <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>}
                {status.type === "error" && <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>}
                {status.type === "info" && <svg className="w-5 h-5 shrink-0 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>}
                <span>{status.msg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="text-xs uppercase tracking-widest font-bold text-gray-400 ml-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your name"
                    className="w-full mt-2 px-5 py-4 bg-zinc-900 rounded-xl border border-zinc-800 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all text-white placeholder-zinc-600"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="text-xs uppercase tracking-widest font-bold text-gray-400 ml-1">M-Pesa Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    placeholder="07XX XXX XXX"
                    className="w-full mt-2 px-5 py-4 bg-zinc-900 rounded-xl border border-zinc-800 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all text-white placeholder-zinc-600"
                  />
                </div>
              </div>

              {/* Amount Selection */}
              <div>
                <label className="text-xs uppercase tracking-widest font-bold text-gray-400 ml-1">Select or Enter Amount (KES)</label>
                
                {/* Quick Select Buttons */}
                <div className="grid grid-cols-4 gap-3 mt-3 mb-3">
                  {presetAmounts.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => handlePresetClick(amt)}
                      className={`py-2 rounded-lg text-sm font-bold border transition-all ${
                        Number(form.amount) === amt 
                          ? "bg-yellow-500 border-yellow-500 text-black" 
                          : "bg-zinc-900 border-zinc-800 text-gray-400 hover:border-yellow-500/50 hover:text-yellow-500"
                      }`}
                    >
                      {amt.toLocaleString()}
                    </button>
                  ))}
                </div>

                <input
                  type="number"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  required
                  min="1"
                  placeholder="Custom Amount"
                  className="w-full px-5 py-4 bg-zinc-900 rounded-xl border border-zinc-800 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all text-white placeholder-zinc-600 font-bold text-lg"
                />
              </div>

              {/* Purpose */}
              <div>
                <label className="text-xs uppercase tracking-widest font-bold text-gray-400 ml-1">Purpose of Donation</label>
                <div className="relative mt-2">
                  <select
                    name="purpose"
                    value={form.purpose}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 bg-zinc-900 rounded-xl border border-zinc-800 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all appearance-none text-white cursor-pointer"
                  >
                    <option value="" disabled className="text-zinc-500">Select purpose</option>
                    <option value="Scholarship Fund">Scholarship Fund</option>
                    <option value="Library Development">Library Development</option>
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="General Support">General Support (Where most needed)</option>
                  </select>
                  {/* Custom dropdown arrow to match theme */}
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-yellow-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="text-xs uppercase tracking-widest font-bold text-gray-400 ml-1">Message (Optional)</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Leave a word of encouragement for the students..."
                  className="w-full mt-2 px-5 py-4 bg-zinc-900 rounded-xl border border-zinc-800 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all text-white placeholder-zinc-600 resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-yellow-500 text-black py-4 rounded-xl font-extrabold text-lg hover:bg-yellow-400 hover:-translate-y-1 transform active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(234,179,8,0.25)] flex justify-center items-center gap-3 mt-4"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-6 w-6 border-2 border-black border-t-transparent rounded-full" viewBox="0 0 24 24"></svg>
                    Processing STK Push...
                  </>
                ) : (
                  <>
                    Complete Payment via M-Pesa
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-zinc-950 border-t border-zinc-900 text-center py-12 mt-10">
        <p className="text-yellow-500 text-sm font-bold uppercase tracking-widest mb-2">
          Thank you for your generosity
        </p>
        <p className="text-gray-500 text-sm">
          All transactions are securely processed via Safaricom Daraja API.
        </p>
      </footer>

      {/* Global Styles for Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
      `}} />
    </div>
  );
}
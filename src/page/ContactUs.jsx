import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { toast } from "react-hot-toast";

export default function Contact() {
  const formRef = useRef();
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const sendEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    const formData = {
      name: formRef.current.name.value,
      email: formRef.current.email.value,
      subject: "Contact Form Submission - NMS Alumni Network",
      message: formRef.current.message.value,
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/contact/send-mail`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json().catch(() => null);

      if (response.ok && data?.success) {
        setStatus({
          type: "success",
          message: "✅ Message sent successfully! We'll get back to you soon.",
        });
        toast.success("Email sent successfully!");
        formRef.current.reset();
      } else {
        setStatus({
          type: "error",
          message: data?.error || "❌ Failed to send. Please try again later.",
        });
        toast.error(data?.error || "Failed to send message.");
      }
    } catch (error) {
      console.error("Email error:", error);
      toast.error(`Email error: ${error.message}`);
      setStatus({
        type: "error",
        message: "❌ Network error. Please check your connection and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-gray-300 font-sans selection:bg-yellow-500 selection:text-black">
      
      {/* 🌟 Hero Section */}
      <section className="relative h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden border-b border-yellow-500/20">
        <img
          src="https://images.unsplash.com/photo-1577563908411-5077b6dc7624?q=80&w=2070&auto=format&fit=crop"
          alt="Contact Us"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black"></div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center text-white px-6"
        >
          <span className="inline-block border border-yellow-500 text-yellow-500 text-xs px-4 py-1.5 rounded-full font-bold tracking-widest uppercase mb-6 shadow-[0_0_10px_rgba(234,179,8,0.2)]">
            We're Here For You
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-wide drop-shadow-lg mb-4">
            Get in <span className="text-yellow-500">Touch</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Whether you have a question, want to volunteer, or need assistance with your alumni account, drop us a line.
          </p>
        </motion.div>
      </section>

      {/* 🕰️ Info Bar */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="bg-zinc-950 border-b border-zinc-900 text-white flex flex-wrap justify-center items-center gap-6 md:gap-12 py-6 px-4 text-center text-sm md:text-base font-medium relative z-20"
      >
        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5 text-yellow-500" />
          <span className="text-gray-300">Nambale, Busia County, Kenya</span>
        </div>
        <a
          href="tel:+254700000000"
          className="flex items-center gap-3 hover:text-yellow-500 transition-colors"
        >
          <Phone className="w-5 h-5 text-yellow-500" />
          <span>+254 700 000 000</span>
        </a>
        <a
          href="mailto:alumni@nambalemagnet.org"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 hover:text-yellow-500 transition-colors"
        >
          <Mail className="w-5 h-5 text-yellow-500" />
          <span>alumni@nambalemagnet.org</span>
        </a>
        {/* <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-yellow-500" />
          <span className="text-gray-300">Mon - Fri: 8 AM - 5 PM</span>
        </div> */}
      </motion.section>

      {/* 🌸 Main Contact Section */}
      <section className="px-6 py-20 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-12 lg:gap-16 items-start"
        >
          {/* ✉️ Contact Form */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
            className="relative bg-zinc-950 border border-zinc-800 p-8 md:p-10 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.8)] overflow-hidden"
          >
            {/* Subtle glow effect */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-bl-full blur-2xl pointer-events-none"></div>

            <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              <Send className="w-6 h-6 text-yellow-500" />
              Send Us a Message
            </h2>

            <form ref={formRef} onSubmit={sendEmail} className="space-y-6 relative z-10">
              {["name", "email"].map((field, i) => (
                <div className="relative" key={i}>
                  <label className="text-xs uppercase tracking-widest font-bold text-gray-500 ml-1 mb-2 block">
                    {field === "name" ? "Full Name" : "Email Address"}
                  </label>
                  <input
                    type={field === "email" ? "email" : "text"}
                    name={field}
                    required
                    disabled={loading}
                    className="w-full px-5 py-4 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed placeholder-zinc-600"
                    placeholder={`Enter your ${field}`}
                  />
                </div>
              ))}

              <div className="relative">
                <label className="text-xs uppercase tracking-widest font-bold text-gray-500 ml-1 mb-2 block">
                  Your Message
                </label>
                <textarea
                  rows="5"
                  name="message"
                  required
                  disabled={loading}
                  className="w-full px-5 py-4 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed placeholder-zinc-600 resize-none"
                  placeholder="How can we help you?"
                ></textarea>
              </div>

              <motion.button
                whileHover={!loading ? { scale: 1.02 } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
                type="submit"
                disabled={loading}
                className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-extrabold px-6 py-4 rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(234,179,8,0.2)] flex justify-center items-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 border-2 border-black border-t-transparent rounded-full" viewBox="0 0 24 24"></svg>
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </motion.button>
            </form>

            {/* Status Messages */}
            {status.message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-6 p-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 border backdrop-blur-sm ${
                  status.type === "success"
                    ? "bg-green-950/40 text-green-400 border-green-900/50"
                    : "bg-red-950/40 text-red-400 border-red-900/50"
                }`}
              >
                {status.message}
              </motion.div>
            )}
          </motion.div>

          {/* 🗺️ Contact Info + Map */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="flex flex-col h-full justify-between"
          >
            <div>
              <h2 className="text-3xl font-extrabold text-white mb-6">
                Visit or <span className="text-yellow-500">Call Us</span>
              </h2>
              <div className="w-16 h-1 bg-yellow-500 mb-6"></div>
              <p className="text-gray-400 mb-10 leading-relaxed text-lg">
                The Alumni Association office is open during regular school hours. Reach out to coordinate campus visits, organize reunions, or inquire about the Endowment Fund. We are always thrilled to welcome our alumni back home.
              </p>

              <div className="space-y-6">
                {/* Custom Styled Info Blocks */}
                <div className="flex items-start gap-4 group">
                  <div className="bg-zinc-900 p-4 rounded-xl text-yellow-500 group-hover:bg-yellow-500 group-hover:text-black transition-colors">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">Our Location</h4>
                    <p className="text-gray-500 text-sm">Nambale Magnet School Campus<br/>Busia County, Kenya</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="bg-zinc-900 p-4 rounded-xl text-yellow-500 group-hover:bg-yellow-500 group-hover:text-black transition-colors">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">Phone Number</h4>
                    <a href="tel:+254700000000" className="text-gray-500 text-sm hover:text-yellow-500 transition-colors">+254 700 000 000</a>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="bg-zinc-900 p-4 rounded-xl text-yellow-500 group-hover:bg-yellow-500 group-hover:text-black transition-colors">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">Email Address</h4>
                    <a href="mailto:alumni@nambalemagnet.org" className="text-gray-500 text-sm hover:text-yellow-500 transition-colors">alumni@nambalemagnet.org</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Embed - Styled for Dark Mode */}
            <div className="mt-12 w-full h-64 relative rounded-2xl overflow-hidden border border-zinc-800 group shadow-2xl">
              {/* Overlay to dim the map slightly to fit the dark theme */}
              <div className="absolute inset-0 bg-black/20 pointer-events-none z-10 transition-opacity group-hover:opacity-0"></div>
              <iframe
                title="Nambale Magnet School Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.818228511475!2d34.2505!3d0.4503!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x177f590000000001%3A0x1234567890abcdef!2sNambale%20Magnet%20School!5e0!3m2!1sen!2ske!4v1610000000000!5m2!1sen!2ske"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'contrast(1.2) opacity(0.8)' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="transition-all duration-500 group-hover:filter-none"
              ></iframe>

              <motion.div
                whileHover={{ opacity: 1 }}
                className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 transition-all z-20 backdrop-blur-sm"
              >
                <a
                  href="https://goo.gl/maps/placeholder"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-8 py-3 rounded-full shadow-[0_0_20px_rgba(234,179,8,0.4)] transition-transform hover:scale-105"
                >
                  📍 Get Directions
                </a>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* 💬 Floating WhatsApp Button - Styled for the theme */}
      <motion.a
        href="https://wa.me/254700000000?text=Hello%20NMS%20Alumni%20Network!%20I%20have%20an%20inquiry."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-50 flex items-center justify-center group"
        whileHover={{ scale: 1.1 }}
      >
        <div className="relative">
          {/* Gold Pulse Effect */}
          <span className="absolute inline-flex h-full w-full rounded-full bg-yellow-500 opacity-40 animate-ping"></span>
          <div className="relative bg-zinc-900 border border-yellow-500/50 rounded-full p-4 shadow-[0_0_20px_rgba(234,179,8,0.3)] group-hover:bg-yellow-500 transition-colors">
            <svg
              className="w-8 h-8 text-yellow-500 group-hover:text-black transition-colors"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
          </div>
        </div>
      </motion.a>
    </div>
  );
}
"use client";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Heart } from "lucide-react";

// Custom SVG Icons to replace the removed Lucide brand icons
const FacebookIcon = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const InstagramIcon = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const LinkedinIcon = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

export default function Footer() {
  const fadeUp = (delay = 0) => ({
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay, ease: "easeOut" },
    },
  });

  return (
    <footer className="relative overflow-hidden bg-black text-gray-300 py-16 mt-20 font-sans border-t border-zinc-900 selection:bg-yellow-500 selection:text-black">

      {/* ✨ Subtle Animated Golden Glow */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(234,179,8,0.05),transparent_50%)] pointer-events-none"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

        {/* 🏡 Brand & Intro */}
        <motion.div
          variants={fadeUp(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-extrabold text-white mb-2 uppercase tracking-widest">
            NMS <span className="text-yellow-500">Alumni</span>
          </h2>
          <p className="text-sm leading-relaxed text-gray-400 mt-4">
            Connecting graduates, celebrating achievements, and supporting the future of Nambale Magnet School. Together, we build a legacy of excellence.
          </p>
          <div className="mt-6 flex items-center gap-2 text-yellow-500 font-bold text-sm">
            <Heart size={16} className="animate-pulse" />
            <span>Empower the Next Generation</span>
          </div>
        </motion.div>

        {/* 🔗 Quick Links */}
        <motion.div
          variants={fadeUp(0.2)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">
            Quick Links
          </h3>
          <ul className="space-y-3 text-sm font-medium">
            {[
              { to: "/", label: "Home" },
              { to: "/alumni", label: "Alumni Directory" },
              { to: "/events", label: "News & Events" },
              { to: "/scholarships", label: "Scholarships" },
              { to: "/donations", label: "Make a Donation" },
              { to: "/contact", label: "Contact Us" },
            ].map((link, i) => (
              <li key={i}>
                <Link
                  to={link.to}
                  className="text-gray-400 hover:text-yellow-500 transition-colors duration-300 flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-800 group-hover:bg-yellow-500 transition-colors"></span>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* 🤝 Get Involved */}
        <motion.div
          variants={fadeUp(0.3)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">
            Get Involved
          </h3>
          <ul className="space-y-3 text-sm font-medium">
            {[
              { to: "#", label: "Mentorship Program" },
              { to: "#", label: "Submit Alumni News" },
              { to: "#", label: "Volunteer Opportunities" },
              { to: "#", label: "Endowment Fund Info" },
              { to: "/auth", label: "Update Your Profile" },
            ].map((link, i) => (
              <li key={i}>
                <Link
                  to={link.to}
                  className="text-gray-400 hover:text-yellow-500 transition-colors duration-300 flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-800 group-hover:bg-yellow-500 transition-colors"></span>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* 📞 Contact Info */}
        <motion.div
          variants={fadeUp(0.4)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">
            Contact Us
          </h3>
          <ul className="space-y-4 text-sm text-gray-400">
            <li className="flex items-start space-x-3 group">
              <Phone size={18} className="text-yellow-500 mt-0.5" />
              <a href="tel:+254700000000" className="hover:text-white transition-colors">+254 700 000 000</a>
            </li>
            <li className="flex items-start space-x-3 group">
              <Mail size={18} className="text-yellow-500 mt-0.5" />
              <a href="mailto:alumni@nambalemagnet.org" className="hover:text-white transition-colors">alumni@nambalemagnet.org</a>
            </li>
            <li className="flex items-start space-x-3 group">
              <MapPin size={18} className="text-yellow-500 mt-0.5 shrink-0" />
              <span>Nambale Magnet School Campus<br />Busia County, Kenya</span>
            </li>
          </ul>

          {/* Social Icons */}
          <div className="flex space-x-4 mt-8">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-zinc-900 p-2.5 rounded-full text-gray-400 hover:bg-yellow-500 hover:text-black transition-all duration-300"
            >
              <FacebookIcon size={18} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-zinc-900 p-2.5 rounded-full text-gray-400 hover:bg-yellow-500 hover:text-black transition-all duration-300"
            >
              <LinkedinIcon size={18} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-zinc-900 p-2.5 rounded-full text-gray-400 hover:bg-yellow-500 hover:text-black transition-all duration-300"
            >
              <InstagramIcon size={18} />
            </a>
          </div>
        </motion.div>
      </div>

      {/* Divider & Copyright */}
      <motion.div
        variants={fadeUp(0.5)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="relative z-10 mt-16 border-t border-zinc-900 pt-8 text-center"
      >
        <p className="text-xs text-gray-600 font-medium tracking-wide">
          © {new Date().getFullYear()} The Nambale Magnet School Alumni Network. All rights reserved.
        </p>
      </motion.div>
    </footer>
  );
}
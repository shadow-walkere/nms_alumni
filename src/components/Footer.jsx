import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Heart } from "lucide-react";

// Custom SVG Icons
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

// Lightweight scroll reveal hook
const useReveal = () => {
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);
  return ref;
};

const FooterSection = ({ children, delay = 0 }) => {
  const ref = useReveal();
  return (
    <div
      ref={ref}
      data-reveal
      style={{ transitionDelay: `${delay}ms` }}
      className="opacity-0 translate-y-6 transition-all duration-700 ease-out"
    >
      {children}
    </div>
  );
};

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-black text-gray-300 py-16 mt-20 font-sans border-t border-zinc-900 selection:bg-yellow-500 selection:text-black">
      {/* Subtle golden glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(234,179,8,0.05),transparent_50%)] pointer-events-none animate-pulse" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand */}
        <FooterSection delay={100}>
          <h2 className="text-2xl font-extrabold text-white mb-2 uppercase tracking-widest">
            The NMS <span className="text-yellow-500">Alumni Association</span>
          </h2>
          <p className="text-sm leading-relaxed text-gray-400 mt-4">
            Connecting graduates, celebrating achievements, and supporting the future of Nambale Magnet School. Together, we build a legacy of excellence.
          </p>
          <div className="mt-6 flex items-center gap-2 text-yellow-500 font-bold text-sm">
            <Heart size={16} className="animate-pulse" />
            <span>Empower the Next Generation</span>
          </div>
        </FooterSection>

        {/* Quick Links */}
        <FooterSection delay={200}>
          <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">
            Quick Links
          </h3>
          <ul className="space-y-3 text-sm font-medium">
            {[
              { to: "/", label: "Home" },
              { to: "/alumni", label: "Alumni Directory" },
              { to: "/gallery", label: "Gallery" },
              { to: "/events", label: "News & Events" },
      
              { to: "/contact", label: "Contact Us" },
            ].map((link, i) => (
              <li key={i}>
                <Link
                  to={link.to}
                  className="text-gray-400 hover:text-yellow-500 transition-colors duration-300 flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-800 group-hover:bg-yellow-500 transition-colors" />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </FooterSection>

        {/* Get Involved */}
        <FooterSection delay={300}>
          <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">
            Get Involved
          </h3>
          <ul className="space-y-3 text-sm font-medium">
            {[
              { to: "/contact", label: "Mentorship Program" },
              { to: "/contact", label: "Submit Alumni News" },
              { to: "/contact", label: "Volunteer Opportunities" },
            
            ].map((link, i) => (
              <li key={i}>
                <Link
                  to={link.to}
                  className="text-gray-400 hover:text-yellow-500 transition-colors duration-300 flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-800 group-hover:bg-yellow-500 transition-colors" />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </FooterSection>

        {/* Contact */}
        <FooterSection delay={400}>
          <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">
            Contact Us
          </h3>
          <ul className="space-y-4 text-sm text-gray-400">
            <li className="flex items-start space-x-3 group">
              <Phone size={18} className="text-yellow-500 mt-0.5" />
              <a href="tel:+254700000000" className="hover:text-white transition-colors">
                +254 700 000 000
              </a>
            </li>
            <li className="flex items-start space-x-3 group">
              <Mail size={18} className="text-yellow-500 mt-0.5" />
              <a href="mailto:alumni@nambalemagnet.org" className="hover:text-white transition-colors">
                alumni@nambalemagnet.org
              </a>
            </li>
            <li className="flex items-start space-x-3 group">
              <MapPin size={18} className="text-yellow-500 mt-0.5 shrink-0" />
              <span>
                Nambale Magnet School Campus
                <br />
                Busia County, Kenya
              </span>
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
        </FooterSection>
      </div>

      {/* Copyright */}
      <FooterSection delay={500}>
        <div className="relative z-10 mt-16 border-t border-zinc-900 pt-8 text-center">
          <p className="text-xs text-gray-600 font-medium tracking-wide">
            © {new Date().getFullYear()} The Nambale Magnet School Alumni Network. All rights reserved.
          </p>
        </div>
      </FooterSection>

      {/* Reveal styles */}
      <style>{`
        [data-reveal].revealed {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}</style>
    </footer>
  );
};
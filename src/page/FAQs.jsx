import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChevronDown, ChevronUp, Leaf } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SERVER_URL from "../config";

export default function FAQs() {
  const [faqs, setFaqs] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const res = await axios.get(`${SERVER_URL}/api/faq`);
        setFaqs(res.data.filter((t) => t.isVerified));
      } catch (err) {
        console.error("Failed to fetch FAQs:", err);
      }
    };
    fetchFAQs();
  }, []);

  const toggle = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <section className="bg-gradient-to-b from-[#e9f9ee] via-white to-[#f9fff9] px-6 py-20 sm:px-12 lg:px-24 font-serif text-[#144d2d]">
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center mb-14">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-semibold text-[#1b7f4a] mb-4 tracking-wide"
        >
          <Leaf className="inline-block text-[#34c759] mr-2 w-8 h-8" />
          Frequently Asked Questions
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-[#2f6042] text-lg max-w-2xl mx-auto"
        >
          Get clear answers about{" "}
          <span className="font-semibold text-[#34c759]">
            The Thorn & Thatch Gardens
          </span>{" "}
          — everything you need to know before your visit or event.
        </motion.p>
        <div className="w-24 h-1 bg-[#34c759] mx-auto mt-5 rounded-full" />
      </div>

      {/* FAQ Cards */}
      <div className="max-w-4xl mx-auto space-y-6">
        {faqs.length === 0 && (
          <p className="text-center text-[#1b7f4a] italic">
            No FAQs available at the moment 🌿
          </p>
        )}

        {faqs.map((faq, index) => (
          <motion.div
            key={faq._id || index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            viewport={{ once: true }}
            className={`border border-[#c6f0d3] rounded-3xl shadow-md transition-all duration-300 bg-white/90 backdrop-blur-sm overflow-hidden hover:shadow-xl`}
          >
            {/* Question Header */}
            <button
              onClick={() => toggle(index)}
              className={`w-full flex justify-between items-center text-left p-6 md:p-7 transition-all duration-300 ${
                activeIndex === index
                  ? "bg-[#1b7f4a] text-white"
                  : "bg-[#f6fff9] hover:bg-[#e9f9ee]"
              } rounded-3xl`}
            >
              <span
                className={`text-lg sm:text-xl font-bold ${
                  activeIndex === index ? "text-white" : "text-[#144d2d]"
                }`}
              >
                {faq.question}
              </span>
              {activeIndex === index ? (
                <ChevronUp className="text-[#34c759] w-5 h-5" />
              ) : (
                <ChevronDown className="text-[#1b7f4a] w-5 h-5" />
              )}
            </button>

            {/* Animated Answer */}
            <AnimatePresence initial={false}>
              {activeIndex === index && (
                <motion.div
                  key="content"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.35 }}
                  className="bg-white text-[#2f6042] border-t border-[#c6f0d3] px-6 md:px-7 py-5"
                >
                  <p className="leading-relaxed text-base sm:text-lg">
                    {faq.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Decorative Glow */}
      <motion.div
        className="absolute top-0 left-5 w-36 sm:w-52 h-36 sm:h-52 bg-[#9ae6b4] rounded-full opacity-20 blur-3xl"
        animate={{ y: [0, 20, 0], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-0 right-5 w-40 sm:w-64 h-40 sm:h-64 bg-[#68d391] rounded-full opacity-20 blur-3xl"
        animate={{ y: [0, -25, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 12, repeat: Infinity }}
      />
    </section>
  );
}

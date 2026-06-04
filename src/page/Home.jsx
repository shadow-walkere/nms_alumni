import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

/* ============================================================
   DATA – Hero Slider & Existing Content
   ============================================================ */
const heroSlides = [
  {
    image:
      "../Assets/homepage1.jpg",
    caption: "We had an lively session with our alumni at the NMS field",
  },

  {
    image:
      "../Assets/homepage.jpg",
    caption: "Alumni Networking & Mentorship Session",
  },
  {
    image:
      "../Assets/pioneerclass.jpg",
    caption: "Some of Our proud Pioneer class members",
  },
  {
    image:
      "../Assets/reunion.jpg",
    caption: "Our first Alumni Reunion event in December",
  },
  {
    image:
      "../Assets/games2.jpg",
    caption: "We participated in some fun games",
  },
];

const featuredContent = [
  {
    id: 1,
    type: "Event",
    title: "Annual Alumni Gala Dinner 2026",
    date: "December 12, 2026",
    location: "Sarit Expo Centre, Nairobi",
    excerpt:
      "Join us for an evening of networking, celebration, and raising funds for the NMS Endowment. Dress code is strictly black tie.",
    content:
      "The Annual Alumni Gala Dinner is a night of celebration, networking, and fundraising for the NMS Endowment Fund. The evening will feature a keynote address by prominent industry leaders, awards for outstanding alumni, and live entertainment. Don't miss this chance to reconnect with your peers.",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 2,
    type: "Opportunity",
    title: "Postgraduate Scholarship Fund",
    date: "Applications open until Aug 2026",
    location: "Online Portal",
    excerpt:
      "Applications are now open for the NMS Alumni Scholarship designed for recent graduates pursuing Masters degrees.",
    content:
      "Applications are now open for the NMS Alumni Scholarship designed for recent graduates pursuing Masters degrees in STEM and Education. Ensure your profile is updated before applying through the portal. Funding covers up to 75% of tuition for selected candidates.",
    image:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 3,
    type: "News",
    title: "New Science Wing Inaugurated",
    date: "May 10, 2026",
    location: "NMS Main Campus",
    excerpt:
      "Thanks to the generous contributions from our 2010-2015 alumni cohort, the new state-of-the-art labs are open.",
    content:
      "Thanks to the generous contributions from our 2010-2015 alumni cohort, the new state-of-the-art chemistry and physics labs are officially open. This will significantly boost the research capabilities of our current students and prepare them for global STEM challenges.",
    image:
      "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 4,
    type: "Event",
    title: "Tech Career Fair & Networking",
    date: "June 20, 2026",
    location: "NMS Main Hall",
    excerpt:
      "Connect with top tech companies and NMS alumni. Bring your updated resume for on-the-spot interviews.",
    content:
      "Are you an undergraduate looking for attachments or a recent graduate looking for a job? The Alumni Tech Career Fair brings together top tech companies and NMS alumni. Prepare your portfolio and join us for a day of networking and career building.",
    image:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32b7?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 5,
    type: "News",
    title: "Mentorship Drive a Huge Success",
    date: "March 25, 2026",
    location: "Virtual & On-Campus",
    excerpt:
      "Over 50 alumni returned to campus to mentor current high school seniors.",
    content:
      "The annual mentorship drive saw record attendance. Over 50 alumni spanning various professions spent the weekend conducting workshops and one-on-one career counseling for the graduating class. We thank everyone who volunteered their time and expertise.",
    image:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop",
  },
];

const faqData = [
  {
    question: "How do I officially join the NMS Alumni Network?",
    answer:
      "Registration is completely free and open to all former Nambale Magnet students. Simply click the 'Login / Register' button at the top right of the page, fill in your graduation year and basic details, and your account will be activated.",
  },
  {
    question: "How can I contribute to the NMS Endowment Fund?",
    answer:
      "You can securely donate directly through our portal. Visit the 'Donations' page, where you can select a specific fund (like Scholarships or Infrastructure) and securely process your contribution via M-Pesa STK Push.",
  },
  {
    question: "Does the association offer mentorship opportunities?",
    answer:
      "Yes! A core goal of our association is fostering cross-generational support. We frequently host virtual masterclasses and on-campus mentorship drives. Keep an eye on the 'Events' section to register as either a mentor or a mentee.",
  },
  {
    question: "How do I update my professional information in the directory?",
    answer:
      "Once logged in, navigate to your dashboard and click 'Edit Profile'. Here, you can update your current university, profession, location, and a brief bio so fellow alumni can easily connect with you.",
  },
  {
    question: "Can I post a job or internship opportunity for fellow alumni?",
    answer:
      "Absolutely. We strongly encourage alumni to hire alumni! You can submit job openings or attachment opportunities through the 'Contact Us' page, and our team will feature it in our next newsletter and the Opportunities board.",
  },
];

/* ============================================================
   CUSTOM HOOK – Scroll Reveal
   ============================================================ */
const useScrollReveal = (threshold = 0.1) => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
          }
        });
      },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    );

    const elements = document.querySelectorAll("[data-reveal]");
    elements.forEach((el) => observer.observe(el));

    return () => elements.forEach((el) => observer.unobserve(el));
  }, [threshold]);
};

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [heroSlideIndex, setHeroSlideIndex] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [openFaq, setOpenFaq] = useState(null);
  const heroTimer = useRef(null);
  const newsTimer = useRef(null);

  // Activate scroll reveal
  useScrollReveal();

  // Hero slider auto‑rotate
  useEffect(() => {
    heroTimer.current = setInterval(() => {
      setHeroSlideIndex((prev) => (prev + 1) % heroSlides.length);
    }, 4000);
    return () => clearInterval(heroTimer.current);
  }, []);

  // News slider auto‑rotate
  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % featuredContent.length);
  const prevSlide = () =>
    setCurrentSlide((prev) =>
      prev === 0 ? featuredContent.length - 1 : prev - 1
    );

  useEffect(() => {
    newsTimer.current = setInterval(nextSlide, 6000);
    return () => clearInterval(newsTimer.current);
  }, []);

  // Notification helper
  const triggerNotification = (message) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  };

  const handleSetReminder = (item, e) => {
    e?.stopPropagation();
    triggerNotification(`Reminder set for: ${item.title}`);
  };

  // FAQ toggle
  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="relative min-h-screen bg-black font-sans text-gray-300 selection:bg-yellow-500 selection:text-black overflow-hidden">
      {/* ==================== TOAST NOTIFICATIONS ==================== */}
      <div className="fixed top-24 right-6 z-[999] flex flex-col gap-3 pointer-events-none">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className="pointer-events-auto flex items-center gap-3 rounded-xl bg-white/10 backdrop-blur-xl border border-yellow-500/30 px-5 py-3 text-white shadow-[0_8px_32px_rgba(234,179,8,0.15)] animate-slide-in-right"
          >
            <svg
              className="h-5 w-5 text-yellow-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span className="font-semibold text-sm">{notif.message}</span>
          </div>
        ))}
      </div>

      {/* ==================== HERO SLIDER ==================== */}
      <section className="relative flex h-[650px] items-center justify-center overflow-hidden text-center text-white">
        {/* Dynamic background images */}
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className="absolute inset-0 transition-opacity duration-1000 ease-out"
            style={{
              opacity: index === heroSlideIndex ? 1 : 0,
              backgroundImage: `url(${slide.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        ))}

        {/* Gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/70 to-black/95 z-10" />

        {/* Floating ambient light */}
        <div className="absolute top-1/4 left-1/4 h-64 w-64 bg-yellow-500/10 rounded-full blur-3xl animate-pulse z-20" />

        {/* Caption for the current hero slide */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30">
          <div className="inline-block rounded-full border border-yellow-500/20 bg-white/10 backdrop-blur-md px-5 py-2 text-sm font-medium text-white shadow-lg">
            {heroSlides[heroSlideIndex].caption}
          </div>
        </div>

        {/* Dot indicators */}
        <div className="absolute bottom-8 right-8 z-30 flex gap-2">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setHeroSlideIndex(idx)}
              className={`h-2.5 rounded-full transition-all duration-500 ${
                idx === heroSlideIndex
                  ? "w-10 bg-yellow-500 shadow-[0_0_12px_rgba(234,179,8,0.5)]"
                  : "w-2.5 bg-white/30 hover:bg-white/60"
              }`}
            />
          ))}
        </div>

        {/* Main hero content – always visible */}
        <div className="relative z-30 max-w-4xl px-4 animate-fade-in-up">
          <span className="inline-block rounded-full border border-yellow-500/30 bg-yellow-500/10 backdrop-blur-md px-5 py-2 text-xs font-bold uppercase tracking-widest text-yellow-500">
            Welcome Home, Alumni
          </span>

          <h1 className="mt-6 text-5xl md:text-7xl font-extrabold leading-tight">
            Connecting Generations{" "}
            <br />
            <span className="bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
              of Excellence
            </span>
          </h1>

          <p className="mt-6 text-lg text-gray-300 max-w-2xl mx-auto backdrop-blur-sm">
            Empowering the Nambale Magnet community to reconnect, foster
            mentorship, and give back to the institution that shaped our
            foundations.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/auth"
              className="group relative overflow-hidden rounded-xl bg-yellow-500 px-8 py-4 font-bold text-black shadow-[0_0_25px_rgba(234,179,8,0.4)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(234,179,8,0.6)]"
            >
              <span className="relative z-10">Join the Network</span>
              <div className="absolute inset-0 -z-0 bg-gradient-to-r from-yellow-400 to-amber-400 opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
            <Link
              to="/alumni"
              className="group rounded-xl border border-white/10 bg-white/5 backdrop-blur-md px-8 py-4 font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:border-yellow-500/60 hover:bg-yellow-500/10"
            >
              Browse Directory
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== ABOUT THE SCHOOL ==================== */}
      <section className="relative max-w-7xl mx-auto px-6 py-24 lg:py-32 grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div className="relative group" data-reveal>
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-yellow-500 to-amber-600 opacity-20 blur-xl transition-opacity duration-700 group-hover:opacity-40" />
          <div className="relative overflow-hidden rounded-2xl border border-white/5 shadow-2xl">
            <img
              src="../Assets/leadership.jpg"
              alt="Students on campus"
              className="h-[400px] w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
          </div>
        </div>

        <div data-reveal>
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            A Legacy of{" "}
            <span className="bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
              Leadership
            </span>{" "}
            & Service
          </h2>

          <div className="mt-8 space-y-6 text-gray-400 text-lg">
            <p>
              The Association was founded in December 2025 on the principles of
              community empowerment, networking opportunities, career
              advancement and Institutional connection and was launched by the
              School Director, Rev. Evalyn Wakhusama.
            </p>
            <div className="space-y-4">
              <div className="rounded-xl border-l-2 border-yellow-500 bg-white/5 backdrop-blur-sm p-5">
                <h3 className="font-semibold text-white mb-1">Our Mission</h3>
                <p className="text-sm text-gray-400">
                  To provide a holistic, quality education that equips our
                  students with the skills, integrity, and resilience to
                  transform their communities.
                </p>
              </div>
              <div className="rounded-xl border-l-2 border-yellow-500 bg-white/5 backdrop-blur-sm p-5">
                <h3 className="font-semibold text-white mb-1">Our Vision</h3>
                <p className="text-sm text-gray-400">
                  To be a premier institution in Africa nurturing the next
                  generation of compassionate and innovative leaders.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== GOALS SECTION ==================== */}
      <section className="relative border-t border-white/5 bg-gradient-to-b from-black to-zinc-950 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16" data-reveal>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Our Core <span className="text-yellow-500">Goals</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              The Nambale Magnet Alumni Association is driven by clear
              objectives designed to empower our graduates and support our alma
              mater.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg
                    className="w-7 h-7"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
                    />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                ),
                title: "Networking Opportunities",
                desc: "Graduates can connect with peers, industry leaders, and professionals globally for career growth and professional growth.",
              },
              {
                icon: (
                  <svg
                    className="w-7 h-7"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                  >
                    <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
                    <path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01" />
                  </svg>
                ),
                title: "Institutional Connection",
                desc: "Members stay connected via exclusive newsletters, magazines, and social media groups, allowing them to follow university milestones.",
              },
              {
                icon: (
                  <svg
                    className="w-7 h-7"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                  >
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                ),
                title: "Career Advancement",
                desc: "Associations act as a bridge to new jobs, offering career coaching, professional development workshops, and access to industry forums.",
              },
              {
                icon: (
                  <svg
                    className="w-7 h-7"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                  >
                    <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z" />
                  </svg>
                ),
                title: "Mentorship & Volunteering",
                desc: "Opportunities exist to mentor current students, lead alumni chapters, and participate in community service.",
              },
              {
                icon: (
                  <svg
                    className="w-7 h-7"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                  >
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                ),
                title: "Maintain Strong Bonds",
                desc: "Fostering lifelong friendships and a supportive community that celebrates each other's successes.",
              },
            ].map((goal, idx) => (
              <div
                key={idx}
                data-reveal
                className="group relative rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm p-8 transition-all duration-500 hover:-translate-y-2 hover:border-yellow-500/40 hover:shadow-[0_20px_50px_rgba(234,179,8,0.08)]"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-yellow-500/10 text-yellow-500 transition-all duration-300 group-hover:bg-yellow-500 group-hover:text-black group-hover:shadow-[0_0_20px_rgba(234,179,8,0.4)]">
                  {goal.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors">
                  {goal.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {goal.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== DYNAMIC HIGHLIGHT SLIDER ==================== */}
      <section id="news" className="relative bg-black py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div data-reveal>
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                News and <span className="text-yellow-500">Events</span>
              </h2>
              <p className="text-gray-400 mt-2 text-lg">
                Latest news, opportunities, and upcoming gatherings.
              </p>
            </div>
            <Link
              to="/events"
              className="hidden md:inline-flex items-center gap-2 text-yellow-500 font-bold hover:text-yellow-400 transition-colors group"
            >
              View All{" "}
              <svg
                className="w-4 h-4 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-zinc-950 shadow-2xl group h-[500px]">
            {featuredContent.map((item, index) => (
              <div
                key={item.id}
                className={`absolute inset-0 transition-all duration-1000 ease-out ${
                  index === currentSlide
                    ? "opacity-100 scale-100 z-10"
                    : "opacity-0 scale-105 z-0"
                }`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-[2000ms]"
                  style={{
                    transform:
                      index === currentSlide ? "scale(1.03)" : "scale(1)",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 z-20">
                  <span className="inline-block rounded-full bg-yellow-500/20 backdrop-blur-md border border-yellow-500/30 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-yellow-500 mb-4">
                    {item.type}
                  </span>
                  <h3 className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-gray-300 text-lg max-w-2xl hidden sm:block mb-6">
                    {item.excerpt}
                  </p>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setSelectedItem(item)}
                      className="rounded-xl bg-yellow-500 px-6 py-3 font-bold text-black shadow-lg hover:bg-yellow-400 transition-colors"
                    >
                      Read More
                    </button>
                    {item.type === "Event" && (
                      <button
                        onClick={(e) => handleSetReminder(item, e)}
                        className="rounded-xl border border-white/20 bg-white/5 backdrop-blur-md px-6 py-3 font-bold text-white hover:border-yellow-500 hover:text-yellow-500 transition-all"
                      >
                        Remind Me
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white transition-all duration-300 hover:bg-yellow-500 hover:text-black hover:border-yellow-500 opacity-0 group-hover:opacity-100"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white transition-all duration-300 hover:bg-yellow-500 hover:text-black hover:border-yellow-500 opacity-0 group-hover:opacity-100"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            <div className="absolute bottom-6 right-8 z-30 flex gap-2">
              {featuredContent.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2.5 rounded-full transition-all duration-500 ${
                    idx === currentSlide
                      ? "w-10 bg-yellow-500 shadow-[0_0_12px_rgba(234,179,8,0.5)]"
                      : "w-2.5 bg-white/30 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link
              to="/events"
              className="inline-block rounded-xl border border-yellow-500 text-yellow-500 font-bold px-6 py-3 hover:bg-yellow-500 hover:text-black transition-all"
            >
              View All Events
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== FAQ SECTION ==================== */}
      <section className="relative bg-zinc-950 py-24 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16" data-reveal>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Frequently Asked{" "}
              <span className="text-yellow-500">Questions</span>
            </h2>
            <p className="text-gray-400 text-lg">
              Everything you need to know about joining and engaging with the
              NMS Alumni Network.
            </p>
          </div>

          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <div
                key={index}
                data-reveal
                className={`rounded-2xl border transition-all duration-500 ${
                  openFaq === index
                    ? "border-yellow-500/30 bg-yellow-500/5 shadow-[0_0_30px_rgba(234,179,8,0.08)]"
                    : "border-white/5 bg-white/[0.02] hover:border-white/10"
                }`}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="flex w-full items-center justify-between p-6 text-left focus:outline-none"
                >
                  <h3
                    className={`font-bold text-lg transition-colors duration-300 ${
                      openFaq === index ? "text-yellow-500" : "text-white"
                    }`}
                  >
                    {faq.question}
                  </h3>
                  <span
                    className={`ml-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                      openFaq === index
                        ? "bg-yellow-500 text-black border-yellow-500 rotate-180"
                        : "bg-transparent text-gray-400 border-white/10"
                    }`}
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </button>
                <div
                  className={`transition-all duration-500 ease-in-out overflow-hidden ${
                    openFaq === index ? "max-h-40 pb-6 px-6" : "max-h-0"
                  }`}
                >
                  <p className="text-gray-400 text-sm leading-relaxed border-t border-white/5 pt-4">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CTA ==================== */}
      <section className="relative overflow-hidden bg-yellow-500 py-24 text-center text-black">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10" />
        <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-black/10 blur-3xl" />

        <div className="relative z-10 max-w-3xl mx-auto px-6" data-reveal>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
            Make a Lasting Impact Today
          </h2>
          <p className="text-black/80 text-lg mb-10 font-medium">
            Your support ensures that the next generation of Nambale Magnet
            students have the resources they need to succeed. Every contribution
            builds our legacy.
          </p>
          <Link
            to="/donations"
            className="inline-block rounded-xl bg-black px-10 py-4 font-bold text-yellow-500 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:bg-zinc-900"
          >
            Donate to the Endowment
          </Link>
        </div>
      </section>

      {/* ==================== UNIVERSAL MODAL ==================== */}
      {selectedItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div
            className="absolute inset-0"
            onClick={() => setSelectedItem(null)}
          />
          <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-yellow-500/20 bg-zinc-950 shadow-[0_0_60px_rgba(234,179,8,0.1)] animate-slide-up flex flex-col max-h-[90vh] z-10">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-gray-300 backdrop-blur-md transition-all hover:bg-yellow-500 hover:text-black"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="h-64 sm:h-80 w-full relative shrink-0">
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent z-10" />
              <img
                src={selectedItem.image}
                alt={selectedItem.title}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="p-8 overflow-y-auto -mt-16 relative z-20">
              <span className="inline-block rounded-full bg-yellow-500/20 backdrop-blur-md border border-yellow-500/30 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-yellow-500 mb-3">
                {selectedItem.type}
              </span>
              <h2 className="text-3xl font-extrabold text-white mb-4">
                {selectedItem.title}
              </h2>

              <div className="rounded-xl bg-white/5 border border-white/5 p-5 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-xs font-bold uppercase text-gray-500">
                    Date
                  </span>
                  <p className="text-yellow-500 font-medium">
                    {selectedItem.date}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-bold uppercase text-gray-500">
                    Location
                  </span>
                  <p className="text-white font-medium">
                    {selectedItem.location}
                  </p>
                </div>
              </div>

              <div className="text-gray-300 leading-relaxed space-y-4">
                <p>{selectedItem.content}</p>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 flex gap-4">
                {selectedItem.type === "Event" ? (
                  <>
                    <button
                      onClick={(e) => {
                        handleSetReminder(selectedItem, e);
                        setSelectedItem(null);
                      }}
                      className="rounded-xl bg-yellow-500 px-6 py-3 font-bold text-black hover:bg-yellow-400 transition-colors flex-1"
                    >
                      Set Reminder
                    </button>
                    <Link
                      to="/contact"
                      className="rounded-xl border border-white/20 bg-white/5 px-6 py-3 font-bold text-white hover:border-yellow-500 hover:text-yellow-500 transition-all flex-1 text-center"
                    >
                      Register
                    </Link>
                  </>
                ) : (
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="rounded-xl bg-white/10 px-6 py-3 font-bold text-white hover:bg-white/20 transition-colors w-full"
                  >
                    Close
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== GLOBAL STYLES ==================== */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(60px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fade-in { animation: fade-in 0.4s ease-out forwards; }
        .animate-slide-up { animation: slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-fade-in-up { animation: fade-in-up 0.7s ease-out forwards; }
        .animate-slide-in-right { animation: slide-in-right 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

        [data-reveal] {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        [data-reveal].revealed {
          opacity: 1;
          transform: translateY(0);
        }

        .overflow-hidden {
          transition: max-height 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
}
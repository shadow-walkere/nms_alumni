import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";


const featuredContent = [
  {
    id: 1,
    type: "Event",
    title: "Annual Alumni Gala Dinner 2026",
    date: "December 12, 2026",
    location: "Sarit Expo Centre, Nairobi",
    excerpt: "Join us for an evening of networking, celebration, and raising funds for the NMS Endowment. Dress code is strictly black tie.",
    content: "The Annual Alumni Gala Dinner is a night of celebration, networking, and fundraising for the NMS Endowment Fund. The evening will feature a keynote address by prominent industry leaders, awards for outstanding alumni, and live entertainment. Don't miss this chance to reconnect with your peers.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 2,
    type: "Opportunity",
    title: "Postgraduate Scholarship Fund",
    date: "Applications open until Aug 2026",
    location: "Online Portal",
    excerpt: "Applications are now open for the NMS Alumni Scholarship designed for recent graduates pursuing Masters degrees.",
    content: "Applications are now open for the NMS Alumni Scholarship designed for recent graduates pursuing Masters degrees in STEM and Education. Ensure your profile is updated before applying through the portal. Funding covers up to 75% of tuition for selected candidates.",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 3,
    type: "News",
    title: "New Science Wing Inaugurated",
    date: "May 10, 2026",
    location: "NMS Main Campus",
    excerpt: "Thanks to the generous contributions from our 2010-2015 alumni cohort, the new state-of-the-art labs are open.",
    content: "Thanks to the generous contributions from our 2010-2015 alumni cohort, the new state-of-the-art chemistry and physics labs are officially open. This will significantly boost the research capabilities of our current students and prepare them for global STEM challenges.",
    image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 4,
    type: "Event",
    title: "Tech Career Fair & Networking",
    date: "June 20, 2026",
    location: "NMS Main Hall",
    excerpt: "Connect with top tech companies and NMS alumni. Bring your updated resume for on-the-spot interviews.",
    content: "Are you an undergraduate looking for attachments or a recent graduate looking for a job? The Alumni Tech Career Fair brings together top tech companies and NMS alumni. Prepare your portfolio and join us for a day of networking and career building.",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32b7?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 5,
    type: "News",
    title: "Mentorship Drive a Huge Success",
    date: "March 25, 2026",
    location: "Virtual & On-Campus",
    excerpt: "Over 50 alumni returned to campus to mentor current high school seniors.",
    content: "The annual mentorship drive saw record attendance. Over 50 alumni spanning various professions spent the weekend conducting workshops and one-on-one career counseling for the graduating class. We thank everyone who volunteered their time and expertise.",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop"
  }
];

// --- MOCK DATA FOR FAQs ---
const faqData = [
  {
    question: "How do I officially join the NMS Alumni Network?",
    answer: "Registration is completely free and open to all former Nambale Magnet students. Simply click the 'Login / Register' button at the top right of the page, fill in your graduation year and basic details, and your account will be activated."
  },
  {
    question: "How can I contribute to the NMS Endowment Fund?",
    answer: "You can securely donate directly through our portal. Visit the 'Donations' page, where you can select a specific fund (like Scholarships or Infrastructure) and securely process your contribution via M-Pesa STK Push."
  },
  {
    question: "Does the association offer mentorship opportunities?",
    answer: "Yes! A core goal of our association is fostering cross-generational support. We frequently host virtual masterclasses and on-campus mentorship drives. Keep an eye on the 'Events' section to register as either a mentor or a mentee."
  },
  {
    question: "How do I update my professional information in the directory?",
    answer: "Once logged in, navigate to your dashboard and click 'Edit Profile'. Here, you can update your current university, profession, location, and a brief bio so fellow alumni can easily connect with you."
  },
  {
    question: "Can I post a job or internship opportunity for fellow alumni?",
    answer: "Absolutely. We strongly encourage alumni to hire alumni! You can submit job openings or attachment opportunities through the 'Contact Us' page, and our team will feature it in our next newsletter and the Opportunities board."
  }
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [openFaq, setOpenFaq] = useState(null);

  // --- Slider Logic ---
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % featuredContent.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? featuredContent.length - 1 : prev - 1));

  useEffect(() => {
    const timer = setInterval(nextSlide, 6000); // Auto-slide every 6 seconds
    return () => clearInterval(timer);
  }, []);

  // --- Notification Logic ---
  const triggerNotification = (message) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message }]);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    }, 3000);
  };

  const handleSetReminder = (item, e) => {
    e?.stopPropagation();
    triggerNotification(`Reminder set for: ${item.title}`);
  };

  // --- FAQ Logic ---
  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="font-sans text-gray-300 bg-black min-h-screen selection:bg-yellow-500 selection:text-black relative">
      
      {/* TOAST NOTIFICATIONS */}
      <div className="fixed top-24 right-6 z-50 flex flex-col gap-3">
        {notifications.map((notif) => (
          <div 
            key={notif.id} 
            className="bg-yellow-500 text-black px-6 py-3 rounded-lg shadow-[0_0_20px_rgba(234,179,8,0.4)] font-bold flex items-center gap-3 animate-slide-in-right"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
            </svg>
            {notif.message}
          </div>
        ))}
      </div>

      {/* HERO */}
      <section
        className="relative h-[600px] flex items-center justify-center text-center text-white overflow-hidden"
        style={{
          backgroundImage: "url('https://i.pinimg.com/736x/0c/80/60/0c806026be56f3e803746c83298e51bd.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black"></div>

        <div className="relative max-w-3xl px-4 animate-fade-in-up">
          <span className="inline-block border border-yellow-500 text-yellow-500 text-xs px-4 py-1.5 rounded-full font-bold tracking-widest uppercase mb-6">
            Welcome Home, Alumni
          </span>

          <h1 className="text-4xl md:text-6xl font-extrabold mt-2 leading-tight">
            Connecting Generations <br />
            <span className="text-yellow-500">of Excellence</span>
          </h1>

          <p className="mt-6 text-lg text-gray-300 max-w-2xl mx-auto">
            Empowering the Nambale Magnet community to reconnect, foster
            mentorship, and give back to the institution that shaped our
            foundations.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/auth" className="bg-yellow-500 text-black font-bold px-8 py-3 rounded-lg hover:bg-yellow-400 hover:-translate-y-1 transition-all duration-300 shadow-[0_0_15px_rgba(234,179,8,0.3)]">
              Join the Network
            </Link>
            <Link
              to="/alumni"
              className="border border-gray-500 text-gray-300 px-8 py-3 rounded-lg hover:border-yellow-500 hover:text-yellow-500 hover:-translate-y-1 transition-all duration-300"
            >
              Browse Directory
            </Link>
          </div>
        </div>
      </section>

      {/* ABOUT THE SCHOOL */}
      <section className="max-w-7xl mx-auto px-8 py-24 grid md:grid-cols-2 gap-16 items-center">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <img
            src="../Assets/NMS-10.jpg"
            alt="Students on campus"
            className="relative rounded-xl shadow-2xl object-cover h-[400px] w-full border border-zinc-800"
          />
        </div>

        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            A Legacy of <span className="text-yellow-500">Leadership</span> & Service
          </h2>

          <div className="mt-6 space-y-6 text-gray-400">
            <p>
              The Association was founded in December 2025 on the principles of community empowerment, networking opportunities, career advancement and Institutional connection and was launched by the School Director, Rev. Evalyn Wakhusama.
            </p>
            <div className="pl-4 border-l-2 border-yellow-500">
              <h3 className="text-white font-semibold mb-1">Our Mission</h3>
              <p className="text-sm">
                To provide a holistic, quality education that equips our students with the skills, integrity, and resilience to transform their communities.
              </p>
            </div>
            <div className="pl-4 border-l-2 border-yellow-500">
              <h3 className="text-white font-semibold mb-1">Our Vision</h3>
              <p className="text-sm">
                To be a premier institution in Africa nurturing the next generation of compassionate and innovative leaders.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* GOALS SECTION */}
      <section className="bg-zinc-950 py-24 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Our Core <span className="text-yellow-500">Goals</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              The Nambale Magnet Alumni Association is driven by clear objectives designed to empower our graduates and support our alma mater.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Goal 1 */}
            <div className="bg-black border border-zinc-800 p-8 rounded-2xl hover:border-yellow-500/50 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(234,179,8,0.1)] transition-all duration-300 group">
              <div className="w-14 h-14 bg-zinc-900 text-yellow-500 rounded-xl flex items-center justify-center mb-6 group-hover:bg-yellow-500 group-hover:text-black transition-colors">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path strokeLinecap="round" strokeLinejoin="round" d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path strokeLinecap="round" strokeLinejoin="round" d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-500 transition-colors">Networking Opportunities</h3>
              <p className="text-sm text-gray-400 leading-relaxed">Graduates can connect with peers, industry leaders, and professionals globally for career growth and professional growth.</p>
            </div>

            {/* Goal 2 */}
            <div className="bg-black border border-zinc-800 p-8 rounded-2xl hover:border-yellow-500/50 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(234,179,8,0.1)] transition-all duration-300 group">
              <div className="w-14 h-14 bg-zinc-900 text-yellow-500 rounded-xl flex items-center justify-center mb-6 group-hover:bg-yellow-500 group-hover:text-black transition-colors">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><path strokeLinecap="round" strokeLinejoin="round" d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-500 transition-colors">Institutional Connection</h3>
              <p className="text-sm text-gray-400 leading-relaxed">Members stay connected via exclusive newsletters, magazines, and social media groups, allowing them to follow university milestones.</p>
            </div>

            {/* Goal 3 */}
            <div className="bg-black border border-zinc-800 p-8 rounded-2xl hover:border-yellow-500/50 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(234,179,8,0.1)] transition-all duration-300 group">
              <div className="w-14 h-14 bg-zinc-900 text-yellow-500 rounded-xl flex items-center justify-center mb-6 group-hover:bg-yellow-500 group-hover:text-black transition-colors">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path strokeLinecap="round" strokeLinejoin="round" d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-500 transition-colors">Career Advancement</h3>
              <p className="text-sm text-gray-400 leading-relaxed">Associations act as a bridge to new jobs, offering career coaching, professional development workshops, and access to industry forums.</p>
            </div>

            {/* Goal 4 */}
            <div className="bg-black border border-zinc-800 p-8 rounded-2xl hover:border-yellow-500/50 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(234,179,8,0.1)] transition-all duration-300 group">
              <div className="w-14 h-14 bg-zinc-900 text-yellow-500 rounded-xl flex items-center justify-center mb-6 group-hover:bg-yellow-500 group-hover:text-black transition-colors">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-500 transition-colors">Mentorship & Volunteering</h3>
              <p className="text-sm text-gray-400 leading-relaxed">Opportunities exist to mentor current students, lead alumni chapters, and participate in community service.</p>
            </div>

            {/* Goal 5 */}
            <div className="bg-black border border-zinc-800 p-8 rounded-2xl hover:border-yellow-500/50 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(234,179,8,0.1)] transition-all duration-300 group">
              <div className="w-14 h-14 bg-zinc-900 text-yellow-500 rounded-xl flex items-center justify-center mb-6 group-hover:bg-yellow-500 group-hover:text-black transition-colors">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path strokeLinecap="round" strokeLinejoin="round" d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-500 transition-colors">Maintain Strong Bonds</h3>
              <p className="text-sm text-gray-400 leading-relaxed">Fostering lifelong friendships and a supportive community that celebrates each other's successes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* DYNAMIC HIGHLIGHT SLIDER (News, Events, Scholarships) */}
      <section id="news" className="bg-black py-24 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                News and <span className="text-yellow-500">Events</span>
              </h2>
              <p className="text-gray-400 mt-2">Latest news, opportunities, and upcoming gatherings.</p>
            </div>
            <Link to="/events" className="hidden md:inline-flex items-center gap-2 text-yellow-500 font-bold hover:text-yellow-400 transition-colors">
              View All <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
            </Link>
          </div>

          <div className="relative bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden h-[450px] group shadow-2xl">
            {featuredContent.map((item, index) => (
              <div
                key={item.id}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10"></div>
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 z-20">
                  <span className="inline-block bg-yellow-500 text-black text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mb-4 shadow-md">
                    {item.type}
                  </span>
                  <h3 className="text-3xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-gray-300 text-lg max-w-3xl mb-6 drop-shadow-md hidden sm:block">
                    {item.excerpt}
                  </p>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setSelectedItem(item)}
                      className="bg-yellow-500 text-black px-6 py-2.5 rounded-lg font-bold hover:bg-yellow-400 transition-colors shadow-lg"
                    >
                      Read More
                    </button>
                    {item.type === "Event" && (
                      <button
                        onClick={(e) => handleSetReminder(item, e)}
                        className="bg-zinc-900 border border-zinc-700 text-white px-6 py-2.5 rounded-lg font-bold hover:border-yellow-500 hover:text-yellow-500 transition-all"
                      >
                        Remind Me
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/60 hover:bg-yellow-500 text-white hover:text-black p-3 rounded-full backdrop-blur-sm border border-zinc-700 hover:border-yellow-500 transition-all opacity-0 group-hover:opacity-100">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            </button>
            <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/60 hover:bg-yellow-500 text-white hover:text-black p-3 rounded-full backdrop-blur-sm border border-zinc-700 hover:border-yellow-500 transition-all opacity-0 group-hover:opacity-100">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </button>

            <div className="absolute bottom-6 right-8 z-30 flex gap-2">
              {featuredContent.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    idx === currentSlide ? "bg-yellow-500 w-8" : "bg-white/40 hover:bg-white"
                  }`}
                ></button>
              ))}
            </div>
          </div>
          
          <div className="mt-8 text-center md:hidden">
            <Link to="/events" className="inline-block border border-yellow-500 text-yellow-500 font-bold px-6 py-2 rounded-lg hover:bg-yellow-500 hover:text-black transition-colors">
              View All Events
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="bg-zinc-950 py-24 border-t border-zinc-900">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Frequently Asked <span className="text-yellow-500">Questions</span>
            </h2>
            <p className="text-gray-400">
              Everything you need to know about joining and engaging with the NMS Alumni Network.
            </p>
          </div>

          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <div 
                key={index} 
                className={`bg-black border rounded-xl overflow-hidden transition-all duration-300 ${
                  openFaq === index ? "border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.1)]" : "border-zinc-800"
                }`}
              >
                <button 
                  onClick={() => toggleFaq(index)} 
                  className="w-full text-left p-6 flex justify-between items-center focus:outline-none group"
                >
                  <h3 className={`font-bold text-lg transition-colors duration-300 ${openFaq === index ? "text-yellow-500" : "text-white group-hover:text-yellow-500"}`}>
                    {faq.question}
                  </h3>
                  <span className={`shrink-0 ml-4 w-8 h-8 flex items-center justify-center rounded-full border transition-all duration-300 ${
                    openFaq === index ? "bg-yellow-500 text-black border-yellow-500 rotate-180" : "bg-zinc-900 text-gray-400 border-zinc-700 group-hover:border-yellow-500 group-hover:text-yellow-500"
                  }`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </span>
                </button>
                <div 
                  className={`transition-all duration-500 ease-in-out ${
                    openFaq === index ? "max-h-96 opacity-100 pb-6 px-6" : "max-h-0 opacity-0 px-6"
                  }`}
                >
                  <p className="text-gray-400 text-sm leading-relaxed border-t border-zinc-900 pt-4">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 bg-yellow-500 text-black text-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <h2 className="text-4xl font-extrabold mb-6">Make a Lasting Impact Today</h2>
          <p className="text-black/80 text-lg mb-10 font-medium">
            Your support ensures that the next generation of Nambale Magnet students have the resources they need to succeed. Every contribution builds our legacy.
          </p>
          <Link to="/donations" className="inline-block bg-black text-yellow-500 font-bold px-10 py-4 rounded-lg hover:bg-zinc-900 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(0,0,0,0.3)] transition-all duration-300">
            Donate to the Endowment
          </Link>
        </div>
      </section>

      {/* UNIVERSAL MODAL */}
      {selectedItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="absolute inset-0" onClick={() => setSelectedItem(null)}></div>
          
          <div className="relative bg-zinc-950 border border-yellow-500/30 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] z-10 animate-slide-up">
            <button onClick={() => setSelectedItem(null)} className="absolute top-4 right-4 z-20 bg-black/50 text-gray-300 hover:text-yellow-500 hover:bg-black p-2 rounded-full transition-all">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>

            <div className="h-64 sm:h-80 w-full relative shrink-0">
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent z-10"></div>
              <img src={selectedItem.image} alt={selectedItem.title} className="w-full h-full object-cover" />
            </div>

            <div className="p-8 overflow-y-auto z-20 -mt-16 relative">
              <span className="inline-block bg-yellow-500 text-black text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
                {selectedItem.type}
              </span>
              <h2 className="text-3xl font-extrabold text-white mb-4 leading-tight">{selectedItem.title}</h2>
              
              <div className="bg-black border border-zinc-800 rounded-lg p-4 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 uppercase font-bold">Date</span>
                  <span className="text-yellow-500 font-medium">{selectedItem.date}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 uppercase font-bold">Location</span>
                  <span className="text-white font-medium">{selectedItem.location}</span>
                </div>
              </div>

              <div className="text-gray-300 leading-relaxed space-y-4">
                <p>{selectedItem.content}</p>
              </div>

              <div className="mt-8 pt-6 border-t border-zinc-800 flex gap-4">
                {selectedItem.type === 'Event' ? (
                  <>
                    <button onClick={(e) => { handleSetReminder(selectedItem, e); setSelectedItem(null); }} className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-400 transition-colors flex-1 text-center shadow-lg">
                      Set Reminder
                    </button>
                    <Link to="/contact" className="border border-zinc-600 text-white px-6 py-3 rounded-lg font-bold hover:border-yellow-500 hover:text-yellow-500 transition-colors flex-1 text-center inline-block">
                      Register
                    </Link>
                  </>
                ) : (
                  <button onClick={() => setSelectedItem(null)} className="bg-zinc-800 text-white px-6 py-3 rounded-lg font-bold hover:bg-zinc-700 transition-colors w-full text-center">
                    Close
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GLOBAL STYLES FOR ANIMATIONS */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-up { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slide-in-right { from { opacity: 0; transform: translateX(50px); } to { opacity: 1; transform: translateX(0); } }
        
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        .animate-slide-up { animation: slide-up 0.4s ease-out forwards; }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
        .animate-slide-in-right { animation: slide-in-right 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
      `}} />
    </div>
  );
}
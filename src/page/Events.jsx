import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

const SERVER_URL = 
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SERVER_URL) ||
  (typeof process !== 'undefined' && process.env && process.env.REACT_APP_SERVER_URL) || 
  "http://localhost:5000";

/* ── Custom Scroll‑Reveal Hook ── */
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

export default function NewsEvents() {
  const [newsData, setNewsData] = useState([]);
  const [eventsData, setEventsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showEventBanner, setShowEventBanner] = useState(true);

  useScrollReveal(); // Activate scroll reveals

  // Fetch news & events from backend
  useEffect(() => {
    const fetchNewsEvents = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${SERVER_URL}/api/news-events`);
        const items = res.data.data || [];
        setNewsData(items.filter(item => item.type === "news"));
        setEventsData(items.filter(item => item.type === "event"));
      } catch (err) {
        console.error("Failed to fetch news & events:", err);
        toast.error("Could not load latest news and events");
      } finally {
        setLoading(false);
      }
    };
    fetchNewsEvents();
  }, []);

  // Banner auto-dismiss after 6 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowEventBanner(false);
    }, 6000);
    return () => clearTimeout(timer);
  }, []);

  // Slider Logic
  const nextSlide = () => {
    if (newsData.length > 0) {
      setCurrentSlide((prev) => (prev + 1) % newsData.length);
    }
  };
  const prevSlide = () => {
    if (newsData.length > 0) {
      setCurrentSlide((prev) => (prev === 0 ? newsData.length - 1 : prev - 1));
    }
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [newsData.length]);

  // Notification Logic (toasts)
  const triggerNotification = (message) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    }, 3000);
  };

  const handleSetReminder = (event, e) => {
    e?.stopPropagation();
    triggerNotification(`Reminder set for: ${event.title}`);
    // Optionally hide banner when user interacts
    setShowEventBanner(false);
  };

  // Next upcoming event (first in array)
  const nextEvent = eventsData.length > 0 ? eventsData[0] : null;

  return (
    <div className="min-h-screen bg-black text-gray-300 font-sans selection:bg-yellow-500 selection:text-black pb-24 relative overflow-hidden">
      
      {/* ========== TOAST NOTIFICATIONS (unchanged) ========== */}
      <div className="fixed top-24 right-1 z-50 flex flex-col gap-3 pointer-events-none">
        {notifications.map((notif) => (
          <div 
            key={notif.id} 
            className="pointer-events-auto bg-white/10 backdrop-blur-xl border border-yellow-500/30 px-5 py-3 rounded-xl text-white font-semibold flex items-center gap-3 shadow-[0_8px_32px_rgba(234,179,8,0.15)] animate-slide-in-right"
          >
            <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
            </svg>
            {notif.message}
          </div>
        ))}
      </div>

      {/* ========== FLOATING TOP EVENT BANNER (new position, auto-dismiss) ========== */}
      {showEventBanner && nextEvent && (
        <div
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out ${
            showEventBanner ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
          }`}
        >
          <div className="mx-auto mt-2 w-[90%] max-w-2xl rounded-2xl border border-yellow-500/20 bg-white/5 backdrop-blur-xl p-4 shadow-[0_20px_50px_rgba(234,179,8,0.1)] cursor-pointer group"
               onClick={() => setSelectedItem(nextEvent)}>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <span className="relative flex h-3 w-3 flex-shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-widest text-yellow-500">Upcoming Event</p>
                  <p className="text-white font-semibold text-sm truncate">{nextEvent.title}</p>
                  <p className="text-gray-400 text-xs">
                    {nextEvent.date
                      ? new Date(nextEvent.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "No Date"}
                  </p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSetReminder(nextEvent, e);
                }}
                className="text-xs font-bold text-yellow-500 bg-yellow-500/10 hover:bg-yellow-500 hover:text-black px-4 py-1.5 rounded-full transition-all flex-shrink-0"
              >
                Remind Me
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========== HEADER ========== */}
      <header className="relative bg-zinc-950 border-b border-yellow-500/20 py-20 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-3xl mx-auto" data-reveal>
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4">
            News & <span className="text-yellow-500">Events</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Stay updated with the latest happenings, inspiring alumni stories, and upcoming networking opportunities.
          </p>
        </div>
      </header>

      {/* ========== NEWS SLIDER ========== */}
      <section className="max-w-7xl mx-auto px-6 py-20" data-reveal>
        <div className="flex items-center gap-4 mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">
            Latest <span className="text-yellow-500">News</span>
          </h2>
          <div className="flex-1 h-px bg-gradient-to-r from-yellow-500/30 to-transparent"></div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20 bg-zinc-950/20 border border-white/5 rounded-3xl h-[300px] items-center">
            <Loader2 className="w-10 h-10 text-yellow-500 animate-spin" />
          </div>
        ) : newsData.length === 0 ? (
          <div className="text-center py-20 bg-zinc-950 border border-white/5 rounded-3xl h-[200px] flex flex-col justify-center items-center">
            <p className="text-gray-500 text-sm">No news articles published yet.</p>
          </div>
        ) : (
          <div className="relative rounded-3xl border border-white/5 bg-zinc-950 overflow-hidden h-[450px] md:h-[500px] group shadow-2xl">
            {newsData.map((news, index) => (
              <div
                key={news._id || news.id}
                className={`absolute inset-0 transition-all duration-1000 ${
                  index === currentSlide ? "opacity-100 scale-100 z-10" : "opacity-0 scale-105 z-0"
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10" />
                {news.image ? (
                  <img
                    src={news.image}
                    alt={news.title}
                    className="w-full h-full object-cover transition-transform duration-[2000ms]"
                    style={{ transform: index === currentSlide ? 'scale(1.03)' : 'scale(1)' }}
                  />
                ) : (
                  <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-gray-600 text-lg">
                    No Image Available
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 z-20">
                  <span className="inline-block rounded-full bg-yellow-500/20 backdrop-blur-md border border-yellow-500/30 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-yellow-500 mb-4">
                    {news.date
                      ? new Date(news.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "No Date"}
                  </span>
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-3 drop-shadow-lg">
                    {news.title}
                  </h3>
                  <p className="text-gray-300 text-lg max-w-3xl mb-6 drop-shadow-md hidden md:block">
                    {news.excerpt}
                  </p>
                  <button
                    onClick={() => setSelectedItem(news)}
                    className="rounded-xl bg-yellow-500 px-6 py-3 font-bold text-black shadow-lg hover:bg-yellow-400 transition-colors"
                  >
                    Read Full Story
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-yellow-500 hover:text-black hover:border-yellow-500"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-yellow-500 hover:text-black hover:border-yellow-500"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
            </button>

            <div className="absolute bottom-6 right-8 z-30 flex gap-2">
              {newsData.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    idx === currentSlide ? "w-10 bg-yellow-500 shadow-[0_0_12px_rgba(234,179,8,0.5)]" : "w-2.5 bg-white/30 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ========== UPCOMING EVENTS GRID ========== */}
      <section className="max-w-7xl mx-auto px-6 py-8" data-reveal>
        <div className="flex items-center gap-4 mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">
            Upcoming <span className="text-yellow-500">Events</span>
          </h2>
          <div className="flex-1 h-px bg-gradient-to-r from-yellow-500/30 to-transparent"></div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-yellow-500 animate-spin" />
          </div>
        ) : eventsData.length === 0 ? (
          <div className="text-center py-20 bg-zinc-950 border border-white/5 rounded-3xl h-[200px] flex flex-col justify-center items-center">
            <p className="text-gray-500 text-sm">No upcoming events scheduled yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {eventsData.map((event) => (
              <div
                key={event._id || event.id}
                className="group relative rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-yellow-500/40 hover:shadow-[0_20px_50px_rgba(234,179,8,0.08)] cursor-pointer flex flex-col"
                onClick={() => setSelectedItem(event)}
              >
                <div className="h-48 overflow-hidden relative">
                  <div className="absolute top-4 left-4 z-10 rounded-full bg-black/60 backdrop-blur-md border border-yellow-500/30 text-yellow-500 px-3 py-1">
                    <span className="text-xs uppercase tracking-widest font-bold">Event</span>
                  </div>
                  {event.image ? (
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-gray-600 text-sm">
                      No Image Available
                    </div>
                  )}
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">
                    {event.title}
                  </h3>
                  
                  <div className="space-y-2 mb-4 mt-2 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                      {event.date
                        ? new Date(event.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "No Date"}
                    </div>
                    {event.time && (
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        {event.time}
                      </div>
                    )}
                    {event.location && (
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                        {event.location}
                      </div>
                    )}
                  </div>

                  <div className="mt-auto border-t border-white/5 pt-4 flex justify-between items-center">
                    <span className="text-sm font-bold text-white group-hover:text-yellow-400 transition-colors">View Details</span>
                    <button 
                      onClick={(e) => handleSetReminder(event, e)}
                      className="bg-yellow-500 text-black p-2 rounded-full hover:bg-yellow-400 hover:scale-110 transition-all"
                      title="Remind Me"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ========== UNIVERSAL MODAL ========== */}
      {selectedItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="absolute inset-0" onClick={() => setSelectedItem(null)} />
          
          <div className="relative bg-zinc-950 border border-yellow-500/20 w-full max-w-3xl rounded-2xl shadow-[0_0_60px_rgba(234,179,8,0.1)] overflow-hidden flex flex-col max-h-[90vh] z-10 animate-slide-up">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-gray-300 backdrop-blur-md transition-all hover:bg-yellow-500 hover:text-black"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>

            {selectedItem.image && (
              <div className="h-64 sm:h-80 w-full relative shrink-0">
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent z-10" />
                <img src={selectedItem.image} alt={selectedItem.title} className="w-full h-full object-cover" />
              </div>
            )}

            <div className={`p-8 overflow-y-auto ${selectedItem.image ? "-mt-16" : ""} relative z-20`}>
              <span className="inline-block rounded-full bg-yellow-500/20 backdrop-blur-md border border-yellow-500/30 text-yellow-500 text-xs font-extrabold px-3 py-1 uppercase tracking-wider mb-3">
                {selectedItem.type === 'event' ? 'Upcoming Event' : 'Alumni News'}
              </span>
              <h2 className="text-3xl font-extrabold text-white mb-4 leading-tight">{selectedItem.title}</h2>
              
              {selectedItem.type === 'event' && (
                <div className="rounded-xl bg-white/5 border border-white/5 p-5 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs font-bold uppercase text-gray-500">Date & Time</span>
                    <p className="text-white font-medium">
                      {selectedItem.date
                        ? new Date(selectedItem.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "No Date"}
                    </p>
                    <p className="text-yellow-500 text-sm">{selectedItem.time}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase text-gray-500">Location</span>
                    <p className="text-white font-medium">{selectedItem.location}</p>
                  </div>
                </div>
              )}

              {selectedItem.type === 'news' && (
                <p className="text-yellow-500 text-sm font-bold mb-6">
                  {selectedItem.date
                    ? new Date(selectedItem.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "No Date"}
                </p>
              )}

              <div className="text-gray-300 leading-relaxed space-y-4">
                <p>{selectedItem.description || selectedItem.content}</p>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 flex gap-4">
                {selectedItem.type === 'event' ? (
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
                    <button className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-bold text-white hover:border-yellow-500 hover:text-yellow-500 transition-all flex-1">
                      Register Now
                    </button>
                  </>
                ) : (
                  <button className="rounded-xl bg-yellow-500 px-6 py-3 font-bold text-black hover:bg-yellow-400 transition-colors w-full">
                    Share this Article
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========== GLOBAL ANIMATIONS ========== */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(60px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fade-in { animation: fade-in 0.4s ease-out forwards; }
        .animate-slide-up { animation: slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
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
      `}</style>
    </div>
  );
}
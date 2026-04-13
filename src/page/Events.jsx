import React, { useState, useEffect } from "react";

// --- MOCK DATA ---
const newsData = [
  {
    id: 1,
    title: "NMS Secures Funding for New Tech Hub",
    date: "April 10, 2026",
    excerpt: "The Alumni Association has successfully raised KES 2M to equip the new innovation center.",
    content: "We are thrilled to announce that the Nambale Magnet Alumni Association, in partnership with local tech leaders, has successfully raised over KES 2M. These funds will be directly channeled into building a state-of-the-art Tech Hub and Innovation Center at the school, complete with 50 new computers, high-speed internet, and a robotics lab. Construction begins next month.",
    image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1000&auto=format&fit=crop",
    type: "news"
  },
  {
    id: 2,
    title: "Class of 2018 Mentorship Drive a Huge Success",
    date: "March 25, 2026",
    excerpt: "Over 50 alumni returned to campus to mentor current high school seniors.",
    content: "The annual mentorship drive spearheaded by the Class of 2018 saw record attendance. Over 50 alumni spanning various professions—from medicine to software engineering—spent the weekend conducting workshops, one-on-one career counseling, and leadership seminars for the graduating class. We thank everyone who volunteered their time.",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1000&auto=format&fit=crop",
    type: "news"
  },
  {
    id: 3,
    title: "Alumni Profile: Dr. Aisha Wanjiku Featured in Medical Journal",
    date: "March 15, 2026",
    excerpt: "NMS alumna recognized for her groundbreaking research in pediatric care.",
    content: "Dr. Aisha Wanjiku (Class of 2020) has recently published a peer-reviewed paper in the East African Medical Journal regarding innovative pediatric care in rural communities. Her research is already changing policies in local clinics. We congratulate Dr. Wanjiku on her stellar achievements!",
    image: "https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=1000&auto=format&fit=crop",
    type: "news"
  }
];

const eventsData = [
  {
    id: 101,
    title: "Annual Alumni Gala Dinner 2026",
    date: "December 12, 2026",
    time: "6:00 PM - 11:00 PM",
    location: "Sarit Expo Centre, Nairobi",
    description: "Join us for our flagship event of the year. The Annual Alumni Gala Dinner is a night of celebration, networking, and fundraising for the NMS Endowment Fund. The evening will feature a keynote address by prominent industry leaders, awards for outstanding alumni, and live entertainment. Dress code is strictly black tie.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000&auto=format&fit=crop",
    type: "event"
  },
  {
    id: 102,
    title: "Tech Career Fair & Networking",
    date: "June 20, 2026",
    time: "10:00 AM - 4:00 PM",
    location: "NMS Main Hall, Nambale",
    description: "Are you an undergraduate looking for attachments or a recent graduate looking for a job? The Alumni Tech Career Fair brings together top tech companies and NMS alumni. Bring your updated resume, portfolio, and prepare for on-the-spot interviews.",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32b7?q=80&w=1000&auto=format&fit=crop",
    type: "event"
  },
  {
    id: 103,
    title: "Virtual Masterclass: Investing in MMFs",
    date: "May 05, 2026",
    time: "7:00 PM - 8:30 PM (EAT)",
    location: "Google Meet",
    description: "Financial literacy is key to personal growth. Join our panel of financial experts (including alumni working in top banking sectors) as they break down how to start saving and investing in Money Market Funds in Kenya.",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1000&auto=format&fit=crop",
    type: "event"
  }
];

export default function NewsEvents() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null); // For Modal
  const [notifications, setNotifications] = useState([]); // For Toast Pop-ups

  // Slider Logic
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % newsData.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? newsData.length - 1 : prev - 1));

  // Auto-slide effect for news
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  // Notification Logic
  const triggerNotification = (message) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message }]);
    
    // Auto-remove notification after 3 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    }, 3000);
  };

  const handleSetReminder = (event, e) => {
    e.stopPropagation(); // Prevent modal from opening when clicking button
    triggerNotification(`Reminder set for: ${event.title}`);
  };

  return (
    <div className="min-h-screen bg-black text-gray-300 font-sans selection:bg-yellow-500 selection:text-black pb-24 relative">
      
      {/* TOAST NOTIFICATION CONTAINER */}
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

      {/* HEADER */}
      <header className="bg-zinc-950 border-b border-yellow-500/20 py-16 px-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            News & <span className="text-yellow-500">Events</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Stay updated with the latest happenings, inspiring alumni stories, and upcoming networking opportunities.
          </p>
        </div>
      </header>

      {/* NEWS SLIDER SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-3xl font-extrabold text-white tracking-wide">
            Latest <span className="text-yellow-500">News</span>
          </h2>
          <div className="flex-1 h-[1px] bg-gradient-to-r from-yellow-500/50 to-transparent"></div>
        </div>

        <div className="relative bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden h-[400px] md:h-[500px] group shadow-2xl">
          {/* Slider Images and Content */}
          {newsData.map((news, index) => (
            <div
              key={news.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10"></div>
              <img
                src={news.image}
                alt={news.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                <span className="inline-block bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
                  {news.date}
                </span>
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-3 drop-shadow-lg">
                  {news.title}
                </h3>
                <p className="text-gray-300 text-lg max-w-3xl mb-6 drop-shadow-md hidden md:block">
                  {news.excerpt}
                </p>
                <button
                  onClick={() => setSelectedItem(news)}
                  className="bg-zinc-900 border border-yellow-500 text-yellow-500 px-6 py-2 rounded-lg font-bold hover:bg-yellow-500 hover:text-black transition-colors"
                >
                  Read Full Story
                </button>
              </div>
            </div>
          ))}

          {/* Slider Controls */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-yellow-500 text-white hover:text-black p-3 rounded-full backdrop-blur-sm border border-zinc-600 hover:border-yellow-500 transition-all opacity-0 group-hover:opacity-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-yellow-500 text-white hover:text-black p-3 rounded-full backdrop-blur-sm border border-zinc-600 hover:border-yellow-500 transition-all opacity-0 group-hover:opacity-100"
          >
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
          </button>

          {/* Indicators */}
          <div className="absolute bottom-6 right-8 z-30 flex gap-2">
            {newsData.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-3 h-3 rounded-full transition-all ${
                  idx === currentSlide ? "bg-yellow-500 w-8" : "bg-white/50 hover:bg-white"
                }`}
              ></button>
            ))}
          </div>
        </div>
      </section>

      {/* UPCOMING EVENTS GRID */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-3xl font-extrabold text-white tracking-wide">
            Upcoming <span className="text-yellow-500">Events</span>
          </h2>
          <div className="flex-1 h-[1px] bg-gradient-to-r from-yellow-500/50 to-transparent"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {eventsData.map((event) => (
            <div
              key={event.id}
              className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden group hover:-translate-y-2 hover:border-yellow-500/50 hover:shadow-[0_10px_30px_rgba(234,179,8,0.1)] transition-all duration-300 flex flex-col cursor-pointer"
              onClick={() => setSelectedItem(event)}
            >
              <div className="h-48 overflow-hidden relative">
                <div className="absolute top-4 left-4 z-10 bg-black/80 backdrop-blur-md border border-yellow-500/50 text-yellow-500 text-center px-3 py-1 rounded-lg">
                  <span className="block text-xs uppercase tracking-widest font-bold">Event</span>
                </div>
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              
              <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-500 transition-colors">
                  {event.title}
                </h3>
                
                <div className="space-y-2 mb-4 mt-2">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    {event.date}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    {event.time}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    {event.location}
                  </div>
                </div>

                <div className="mt-auto border-t border-zinc-800 pt-4 flex justify-between items-center">
                  <span className="text-sm font-bold text-white hover:text-yellow-500">View Details</span>
                  <button 
                    onClick={(e) => handleSetReminder(event, e)}
                    className="bg-yellow-500 text-black p-2 rounded-full hover:bg-yellow-400 hover:scale-110 transition-all"
                    title="Remind Me"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* UNIVERSAL MODAL FOR READING MORE */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-md animate-fade-in">
          {/* Click background to close */}
          <div className="absolute inset-0" onClick={() => setSelectedItem(null)}></div>
          
          <div className="relative bg-zinc-950 border border-yellow-500/30 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] z-10 animate-slide-up">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 z-20 bg-black/50 text-gray-300 hover:text-yellow-500 hover:bg-black p-2 rounded-full transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>

            {/* Modal Image Header */}
            <div className="h-64 sm:h-80 w-full relative shrink-0">
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent z-10"></div>
              <img src={selectedItem.image} alt={selectedItem.title} className="w-full h-full object-cover" />
            </div>

            {/* Modal Content Area */}
            <div className="p-8 overflow-y-auto z-20 -mt-16 relative">
              <span className="inline-block bg-yellow-500 text-black text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
                {selectedItem.type === 'event' ? 'Upcoming Event' : 'Alumni News'}
              </span>
              <h2 className="text-3xl font-extrabold text-white mb-4 leading-tight">{selectedItem.title}</h2>
              
              {/* Event Specific Meta Data */}
              {selectedItem.type === 'event' && (
                <div className="bg-black border border-zinc-800 rounded-lg p-4 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 uppercase font-bold">Date & Time</span>
                    <span className="text-white font-medium">{selectedItem.date}</span>
                    <span className="text-yellow-500 text-sm">{selectedItem.time}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 uppercase font-bold">Location</span>
                    <span className="text-white font-medium">{selectedItem.location}</span>
                  </div>
                </div>
              )}

              {/* News Date */}
              {selectedItem.type === 'news' && (
                <p className="text-yellow-500 text-sm font-bold mb-6">{selectedItem.date}</p>
              )}

              <div className="text-gray-300 leading-relaxed space-y-4">
                <p>{selectedItem.description || selectedItem.content}</p>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 pt-6 border-t border-zinc-800 flex gap-4">
                {selectedItem.type === 'event' ? (
                  <>
                    <button 
                      onClick={(e) => {
                        handleSetReminder(selectedItem, e);
                        setSelectedItem(null);
                      }}
                      className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-400 transition-colors flex-1 text-center"
                    >
                      Set Reminder
                    </button>
                    <button className="border border-zinc-600 text-white px-6 py-3 rounded-lg font-bold hover:border-yellow-500 hover:text-yellow-500 transition-colors flex-1 text-center">
                      Register Now
                    </button>
                  </>
                ) : (
                  <button className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-400 transition-colors w-full text-center">
                    Share this Article
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Global Styles for custom animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        .animate-slide-up { animation: slide-up 0.4s ease-out forwards; }
        .animate-slide-in-right { animation: slide-in-right 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
      `}} />
    </div>
  );
}
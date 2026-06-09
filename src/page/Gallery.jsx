import React, { useState, useEffect } from "react";
import {
  X,
  PlayCircle,
  Image as ImageIcon,
  Loader2,
  Users,
  Briefcase,
  Trophy,
  Search,
  Filter,
  Layers,
  Video,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const SERVER_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_SERVER_URL) ||
  (typeof process !== "undefined" && process.env?.REACT_APP_SERVER_URL) ||
  "http://localhost:5000";

const AlumniGallery = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredId, setHoveredId] = useState(null);

  // Lightbox state
  const [lightbox, setLightbox] = useState({
    isOpen: false,
    currentIndex: 0,
  });

  const tabs = [
    { id: "all", label: "All Moments", icon: <Layers size={16} /> },
    { id: "reunions", label: "Reunions", icon: <Users size={16} /> },
    { id: "leadership", label: "Leadership", icon: <Users size={16} /> },
    { id: "networking", label: "Networking", icon: <Briefcase size={16} /> },
    { id: "achievements", label: "Achievements", icon: <Trophy size={16} /> },
    { id: "videos", label: "Videos", icon: <Video size={16} /> },
  ];

  const openLightbox = (index) => {
    setLightbox({ isOpen: true, currentIndex: index });
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightbox({ isOpen: false, currentIndex: 0 });
    document.body.style.overflow = "auto";
  };

  const goToPrev = (e) => {
    if (e) e.stopPropagation();
    setLightbox((prev) => ({
      ...prev,
      currentIndex: (prev.currentIndex - 1 + mediaItems.length) % mediaItems.length,
    }));
  };

  const goToNext = (e) => {
    if (e) e.stopPropagation();
    setLightbox((prev) => ({
      ...prev,
      currentIndex: (prev.currentIndex + 1) % mediaItems.length,
    }));
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightbox.isOpen) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") goToPrev();
      if (e.key === "ArrowRight") goToNext();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [lightbox.isOpen, mediaItems.length]);

  // Fetch media from server
  useEffect(() => {
    const fetchMedia = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (activeTab === "videos") {
          params.append("type", "video");
        } else if (activeTab !== "all") {
          params.append("type", "image");
          params.append("category", activeTab);
        }
        if (searchQuery.trim()) {
          params.append("search", searchQuery.trim());
        }
        const url = `${SERVER_URL}/api/gallery${
          params.toString() ? `?${params.toString()}` : ""
        }`;
        const response = await axios.get(url);
        const data = response.data.data || response.data || [];
        setMediaItems(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching media:", error);
        toast.error("Could not load alumni gallery");
        setMediaItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMedia();
  }, [activeTab, searchQuery]);

  const currentItem = mediaItems[lightbox.currentIndex] || {};

  return (
    <div className="bg-black overflow-x-hidden min-h-screen font-sans selection:bg-yellow-500 selection:text-black">
      {/* HERO SECTION */}
      <section className="relative h-screen md:h-[55vh] min-h-[450px] flex items-center justify-center overflow-hidden">
        {/* Dynamic background with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-black z-0" />
        
        {/* Animated gradient orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-500/20 rounded-full blur-3xl animate-pulse z-0" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse z-0" />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(234,179,8,0.05)_1px,transparent_1px)] bg-[length:40px_40px] z-0" />

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 backdrop-blur-md border border-yellow-500/30 text-yellow-400 text-xs font-bold uppercase tracking-widest mb-6 animate-fade-in-up"
               style={{ animation: "fadeInUp 0.6s ease-out" }}>
            <Sparkles size={14} /> Alumni Gallery
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-tight animate-fade-in-up"
              style={{ animation: "fadeInUp 0.6s ease-out 0.1s both" }}>
            Our Alumni,
            <br />
            <span className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 bg-clip-text text-transparent">
              One Legacy
            </span>
          </h1>
          
          <p className="text-base md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed font-light mb-8 animate-fade-in-up"
             style={{ animation: "fadeInUp 0.6s ease-out 0.2s both" }}>
            Relive the moments that define us — reunions, mentorship, achievements, and the connections that last forever.
          </p>

          {/* Scroll indicator */}
          <div className="animate-bounce mt-6 inline-block">
            <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* FILTER BAR - STICKY & ENHANCED */}
      <div className="sticky top-0 z-40 bg-black/90 backdrop-blur-xl border-b border-yellow-500/20 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Bar */}
            <div className="relative w-full md:w-72 md:order-2">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500/60 w-4 h-4" />
              <input
                type="text"
                placeholder="Search memories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-zinc-900/50 border border-yellow-500/20 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/30 outline-none text-sm font-medium text-white placeholder-gray-500 shadow-md transition-all"
              />
            </div>

            {/* Tabs */}
            <div className="w-full md:w-auto overflow-x-auto no-scrollbar md:order-1">
              <div className="flex items-center gap-2 pb-1 md:pb-0">
                {tabs.map((tab, idx) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold whitespace-nowrap transition-all duration-300 transform active:scale-95 ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-yellow-500 to-amber-500 text-black shadow-lg shadow-yellow-500/30 ring-2 ring-yellow-500"
                        : "bg-zinc-800/50 text-gray-300 border border-yellow-500/20 hover:border-yellow-500/60 hover:text-yellow-400"
                    }`}
                    style={{
                      animation: activeTab === tab.id ? "popIn 0.3s ease-out" : "none"
                    }}
                  >
                    {tab.icon} {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* GALLERY GRID */}
      <section className="px-4 md:px-6 py-16 min-h-screen bg-black">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <div className="relative w-16 h-16 mb-6">
                <Loader2 className="w-16 h-16 text-yellow-500 animate-spin" />
                <div className="absolute inset-0 bg-yellow-500/20 blur-xl rounded-full animate-pulse" />
              </div>
              <p className="text-gray-400 font-semibold animate-pulse">
                Loading memories...
              </p>
            </div>
          ) : mediaItems.length === 0 ? (
            <div className="text-center py-32 bg-gradient-to-br from-zinc-900 to-black rounded-3xl border-2 border-dashed border-yellow-500/30 mx-auto max-w-2xl">
              <Filter size={48} className="mx-auto text-yellow-500/40 mb-4" />
              <h3 className="text-2xl font-bold text-white">
                No memories found
              </h3>
              <p className="text-gray-400 mt-3 text-base">
                {searchQuery
                  ? "Try a different search term"
                  : "No media available in this category yet"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {mediaItems.map((item, idx) => (
                <div
                  key={item._id}
                  className="group relative bg-gradient-to-br from-zinc-800 to-black rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer border border-yellow-500/10 hover:border-yellow-500/40"
                  onClick={() => openLightbox(idx)}
                  onMouseEnter={() => setHoveredId(item._id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{
                    animation: `slideInUp 0.5s ease-out ${idx * 0.1}s both`,
                    transform: hoveredId === item._id ? "translateY(-8px)" : "translateY(0)"
                  }}
                >
                  <div className="relative overflow-hidden aspect-video bg-black">
                    {item.type === "video" ? (
                      <>
                        <video
                          src={item.url}
                          className="w-full h-full object-cover opacity-60 transition-opacity duration-500 group-hover:opacity-100"
                          muted
                          preload="metadata"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors duration-300">
                          <div className="relative">
                            <div className="absolute inset-0 bg-yellow-500/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-300" />
                            <div className="relative w-16 h-16 bg-yellow-500/30 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                              <PlayCircle className="w-8 h-8 text-yellow-300 fill-current" />
                            </div>
                          </div>
                        </div>
                        <span className="absolute top-3 right-3 bg-black/70 text-yellow-400 text-[11px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider">
                          Video
                        </span>
                      </>
                    ) : (
                      <img
                        src={item.url}
                        alt={item.title}
                        className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                    )}

                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Content overlay */}
                  <div className="absolute bottom-0 left-0 w-full p-5 translate-y-6 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                    <span className="inline-block px-3 py-1 bg-gradient-to-r from-yellow-500 to-amber-500 text-black text-[11px] font-bold uppercase tracking-wider rounded-md mb-2.5">
                      {item.category
                        ? item.category.charAt(0).toUpperCase() +
                          item.category.slice(1)
                        : "Alumni"}
                    </span>
                    <h3 className="text-white font-black text-sm leading-snug drop-shadow-lg line-clamp-2">
                      {item.title || "Untitled"}
                    </h3>
                  </div>

                  {/* Shine effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* LIGHTBOX WITH SLIDER */}
      {lightbox.isOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in"
          onClick={closeLightbox}
          style={{ animation: "fadeIn 0.3s ease-out" }}
        >
          {/* Close button */}
          <button
            className="absolute top-4 right-4 p-3 bg-yellow-500/20 hover:bg-yellow-500/40 text-yellow-400 rounded-full transition-all duration-300 z-50 hover:scale-110"
            onClick={closeLightbox}
            aria-label="Close lightbox"
          >
            <X size={28} />
          </button>

          {/* Prev / Next arrows */}
          {mediaItems.length > 1 && (
            <>
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-yellow-500/20 hover:bg-yellow-500/40 text-yellow-400 rounded-full transition-all duration-300 z-50 hover:scale-110 hover:-translate-x-1"
                onClick={goToPrev}
                aria-label="Previous"
              >
                <ChevronLeft size={32} />
              </button>
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-yellow-500/20 hover:bg-yellow-500/40 text-yellow-400 rounded-full transition-all duration-300 z-50 hover:scale-110 hover:translate-x-1"
                onClick={goToNext}
                aria-label="Next"
              >
                <ChevronRight size={32} />
              </button>
            </>
          )}

          {/* Media container */}
          <div
            className="relative w-full max-w-5xl flex flex-col items-center animate-slide-up"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: "slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }}
          >
            {currentItem.type === "video" ? (
              <div className="w-full aspect-video max-h-[85vh] rounded-xl overflow-hidden shadow-2xl shadow-yellow-500/20">
                <video
                  src={currentItem.url}
                  controls
                  autoPlay
                  muted
                  className="w-full h-full"
                />
              </div>
            ) : (
              <img
                src={currentItem.url}
                alt={currentItem.title}
                className="max-h-[85vh] w-auto rounded-xl shadow-2xl shadow-yellow-500/20 object-contain"
              />
            )}

            {currentItem.title && (
              <div className="mt-6 text-center animate-fade-in-up" style={{ animation: "fadeInUp 0.6s ease-out 0.2s both" }}>
                <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">
                  {currentItem.title}
                </h3>
                <p className="text-gray-400 text-sm mt-2 font-medium">
                  <span className="text-yellow-500 font-bold">{lightbox.currentIndex + 1}</span> / {mediaItems.length}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FOOTER CTA */}
      <section className="py-20 md:py-24 bg-gradient-to-b from-black to-zinc-900 border-t border-yellow-500/20 text-center relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(234,179,8,0.1)_0%,transparent_70%)]" />
        
        <div className="max-w-3xl mx-auto px-4 md:px-6 relative z-10">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">
            Stay Connected
          </h2>
          <p className="text-gray-300 mb-10 text-base md:text-lg leading-relaxed">
            Join our thriving alumni community to stay updated on reunions, events, mentorship opportunities, and success stories.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4">
            <a
              href="https://facebook.com/groups/alumni"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-white text-black font-bold rounded-lg hover:shadow-xl hover:shadow-yellow-500/30 hover:-translate-y-1 transition-all duration-300 transform active:scale-95"
            >
              Facebook Group
            </a>
            <a
              href="https://linkedin.com/groups/alumni"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-white text-black font-bold rounded-lg hover:shadow-xl hover:shadow-yellow-500/30 hover:-translate-y-1 transition-all duration-300 transform active:scale-95"
            >
              LinkedIn Network
            </a>
            <a
              href="/alumni/register"
              className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-bold rounded-lg hover:shadow-xl hover:shadow-yellow-500/40 hover:-translate-y-1 transition-all duration-300 transform active:scale-95"
            >
              Alumni Portal
            </a>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        @keyframes slideUp {
          from { 
            opacity: 0; 
            transform: translateY(40px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        @keyframes slideInUp {
          from { 
            opacity: 0; 
            transform: translateY(30px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        @keyframes popIn {
          from { 
            transform: scale(0.95); 
            opacity: 0;
          }
          to { 
            transform: scale(1); 
            opacity: 1;
          }
        }

        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default AlumniGallery;
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

  // Lightbox state – now includes current index for slider navigation
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

  // Open lightbox at a specific index
  const openLightbox = (index) => {
    setLightbox({ isOpen: true, currentIndex: index });
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightbox({ isOpen: false, currentIndex: 0 });
    document.body.style.overflow = "auto";
  };

  // Navigate lightbox
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
    <div className="bg-slate-50 overflow-x-hidden min-h-screen font-sans selection:bg-blue-200">
      {/* HERO */}
      <section className="relative h-[45vh] min-h-[350px] flex items-center justify-center overflow-hidden bg-slate-900">
        <div className="absolute inset-0 opacity-40">
          <div className="w-full h-full bg-gradient-to-r from-blue-700 to-indigo-800"></div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-slate-900/30"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center pt-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-blue-200 text-xs font-bold uppercase tracking-widest mb-4">
            <ImageIcon size={14} /> Alumni Gallery
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">
            Our Alumni,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500">
              One Community
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
            Relive the moments that keep us connected — reunions, professional
            milestones, and shared successes.
          </p>
        </div>
      </section>

      {/* FILTER BAR */}
      <div className="sticky top-0 z-40 bg-slate-50/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-64 md:order-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search memories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm font-medium text-slate-700 shadow-sm transition-all"
              />
            </div>
            <div className="w-full md:w-auto overflow-x-auto no-scrollbar md:order-1">
              <div className="flex items-center gap-2 pb-1 md:pb-0">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 transform active:scale-95 ${
                      activeTab === tab.id
                        ? "bg-indigo-900 text-white shadow-md ring-2 ring-indigo-900 ring-offset-2 ring-offset-slate-50"
                        : "bg-white text-slate-600 border border-slate-200 hover:border-blue-300 hover:text-blue-700"
                    }`}
                  >
                    {tab.icon} {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* GALLERY GRID – exactly 3 columns on desktop */}
      <section className="px-4 md:px-8 py-12 min-h-[50vh]">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
              <p className="text-slate-500 font-medium animate-pulse">
                Loading memories...
              </p>
            </div>
          ) : mediaItems.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300 mx-auto max-w-2xl">
              <Filter size={40} className="mx-auto text-slate-400 mb-4" />
              <h3 className="text-lg font-bold text-slate-700">
                No memories found
              </h3>
              <p className="text-slate-500 mt-2">
                {searchQuery
                  ? "Try a different search term"
                  : "No media available in this category yet"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {mediaItems.map((item, idx) => (
                <div
                  key={item._id}
                  className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer border border-slate-100 hover:border-blue-100"
                  onClick={() => openLightbox(idx)}
                >
                  <div className="relative overflow-hidden">
                    {item.type === "video" ? (
                      <div className="relative aspect-video bg-slate-900 flex items-center justify-center">
                        <video
                          src={item.url}
                          className="w-full h-full object-cover opacity-70"
                          muted
                          preload="metadata"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <PlayCircle className="w-8 h-8 text-white fill-current" />
                          </div>
                        </div>
                        <span className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wider">
                          Video
                        </span>
                      </div>
                    ) : (
                      <img
                        src={item.url}
                        alt={item.title}
                        className="w-full h-64 object-cover transform transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  <div className="absolute bottom-0 left-0 w-full p-5 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                    <span className="inline-block px-2 py-0.5 bg-blue-600/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider rounded-md mb-2">
                      {item.category
                        ? item.category.charAt(0).toUpperCase() +
                          item.category.slice(1)
                        : "Alumni"}
                    </span>
                    <h3 className="text-white font-bold text-sm leading-snug shadow-black drop-shadow-md">
                      {item.title || "Untitled"}
                    </h3>
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
          className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-50"
            onClick={closeLightbox}
            aria-label="Close lightbox"
          >
            <X size={28} />
          </button>

          {/* Prev / Next arrows */}
          {mediaItems.length > 1 && (
            <>
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-50"
                onClick={goToPrev}
                aria-label="Previous"
              >
                <ChevronLeft size={32} />
              </button>
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-50"
                onClick={goToNext}
                aria-label="Next"
              >
                <ChevronRight size={32} />
              </button>
            </>
          )}

          {/* Media container */}
          <div
            className="relative w-full max-w-5xl flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {currentItem.type === "video" ? (
              <div className="w-full aspect-video max-h-[85vh]">
                <video
                  src={currentItem.url}
                  controls
                  autoPlay
                  muted
                  className="w-full h-full rounded-lg shadow-2xl"
                />
              </div>
            ) : (
              <img
                src={currentItem.url}
                alt={currentItem.title}
                className="max-h-[85vh] w-auto rounded-lg shadow-2xl object-contain"
              />
            )}

            {currentItem.title && (
              <div className="mt-4 text-center">
                <h3 className="text-lg font-bold text-white tracking-wide">
                  {currentItem.title}
                </h3>
                <p className="text-slate-400 text-sm mt-1">
                  {lightbox.currentIndex + 1} / {mediaItems.length}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FOOTER CTA */}
      <section className="py-20 bg-white border-t border-slate-100 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-black text-slate-900 mb-4">
            Stay Connected
          </h2>
          <p className="text-slate-600 mb-8 text-lg">
            Join our official alumni network to never miss a reunion, event, or
            update.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="https://facebook.com/groups/alumni"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-[#1877F2] text-white font-bold rounded-full hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              Facebook Group
            </a>
            <a
              href="https://linkedin.com/groups/alumni"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-[#0A66C2] text-white font-bold rounded-full hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              LinkedIn Network
            </a>
            <a
              href="/alumni/register"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-full hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              Alumni Portal
            </a>
          </div>
        </div>
      </section>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default AlumniGallery;
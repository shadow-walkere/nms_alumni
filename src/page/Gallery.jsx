import React, { useState } from "react";
import { Link } from "react-router-dom";

// --- MOCK DATA FOR GALLERY ---
const galleryData = [
  {
    id: 1,
    category: "Events",
    title: "Alumni Gala Dinner 2025",
    description: "Keynote address during the annual end-of-year alumni gathering.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 2,
    category: "Campus",
    title: "Main Administration Block",
    description: "The iconic main building at dusk.",
    image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 3,
    category: "Students",
    title: "Science Fair Winners",
    description: "Senior students presenting their award-winning robotics project.",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 4,
    category: "Mentorship",
    title: "Career Day Workshop",
    description: "Alumni professionals conducting one-on-one sessions with the graduating class.",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 5,
    category: "Events",
    title: "Tech Career Fair",
    description: "Networking session between recent graduates and top tech recruiters.",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32b7?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 6,
    category: "Campus",
    title: "New Sports Complex",
    description: "Inauguration of the state-of-the-art indoor basketball court.",
    image: "https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=2069&auto=format&fit=crop"
  },
  {
    id: 7,
    category: "Mentorship",
    title: "Women in STEM Panel",
    description: "Female alumni sharing their journeys in engineering and medicine.",
    image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2069&auto=format&fit=crop"
  },
  {
    id: 8,
    category: "Students",
    title: "Graduation Day",
    description: "The class of 2025 celebrating their milestone achievement.",
    image: "https://images.unsplash.com/photo-1523580494112-02882a938c82?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 9,
    category: "Events",
    title: "Tree Planting Drive",
    description: "Alumni and students joining hands for environmental conservation.",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2013&auto=format&fit=crop"
  }
];

const categories = ["All", "Events", "Campus", "Students", "Mentorship"];

export default function Gallery() {
  const [filter, setFilter] = useState("All");
  const [selectedImage, setSelectedImage] = useState(null);

  // --- Filter Logic ---
  const filteredGallery = filter === "All" 
    ? galleryData 
    : galleryData.filter(item => item.category === filter);

  return (
    <div className="font-sans text-gray-300 bg-black min-h-screen selection:bg-yellow-500 selection:text-black relative">
      
      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 px-6 text-center border-b border-zinc-900 bg-zinc-950">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
        <div className="relative max-w-4xl mx-auto animate-fade-in-up">
          <span className="inline-block border border-yellow-500 text-yellow-500 text-xs px-4 py-1.5 rounded-full font-bold tracking-widest uppercase mb-6">
            Visual Legacy
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold mt-2 text-white">
            Nambale Magnet <span className="text-yellow-500">Gallery</span>
          </h1>
          <p className="mt-6 text-lg text-gray-400 max-w-2xl mx-auto">
            Explore moments of excellence, campus milestones, and our vibrant community through the years.
          </p>
        </div>
      </section>

      {/* FILTER BAR */}
      <section className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-zinc-900 py-4">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-start sm:justify-center overflow-x-auto no-scrollbar gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`whitespace-nowrap px-6 py-2 rounded-full font-bold text-sm transition-all duration-300 ${
                filter === cat
                  ? "bg-yellow-500 text-black shadow-[0_0_15px_rgba(234,179,8,0.3)]"
                  : "bg-zinc-900 text-gray-400 border border-zinc-800 hover:border-yellow-500 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* GALLERY GRID */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredGallery.map((item) => (
            <div 
              key={item.id} 
              onClick={() => setSelectedImage(item)}
              className="relative group bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden cursor-pointer hover:border-yellow-500/50 hover:shadow-[0_10px_30px_rgba(234,179,8,0.1)] transition-all duration-500 h-72 animate-fade-in"
            >
              {/* Image with zoom effect */}
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300"></div>
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <span className="inline-block bg-zinc-900 text-yellow-500 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mb-2 border border-zinc-700">
                  {item.category}
                </span>
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-yellow-500 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 line-clamp-2">
                  {item.description}
                </p>
              </div>

              {/* View Icon Overlay */}
              <div className="absolute top-4 right-4 bg-black/60 p-2 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-zinc-700">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
              </div>
            </div>
          ))}
        </div>
        
        {filteredGallery.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            No images found for this category.
          </div>
        )}
      </section>

      {/* CTA SECTION */}
      <section className="bg-zinc-950 py-16 border-t border-zinc-900">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Have Memories to Share?
          </h2>
          <p className="text-gray-400 mb-8">
            We are always looking to expand our archive. If you have photos from your time at Nambale Magnet, let us know!
          </p>
          <Link 
            to="/contact" 
            className="inline-block border border-yellow-500 text-yellow-500 font-bold px-8 py-3 rounded-lg hover:bg-yellow-500 hover:text-black transition-all duration-300 shadow-[0_0_15px_rgba(234,179,8,0.1)] hover:-translate-y-1"
          >
            Submit Photos
          </Link>
        </div>
      </section>

      {/* LIGHTBOX MODAL (Matches Home.js universal modal) */}
      {selectedImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="absolute inset-0" onClick={() => setSelectedImage(null)}></div>
          
          <div className="relative bg-zinc-950 border border-zinc-800 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] z-10 animate-slide-up">
            
            {/* Close Button */}
            <button 
              onClick={() => setSelectedImage(null)} 
              className="absolute top-4 right-4 z-20 bg-black/50 text-gray-300 hover:text-yellow-500 hover:bg-black p-2 rounded-full transition-all border border-transparent hover:border-yellow-500"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>

            {/* Large Image Area */}
            <div className="h-[50vh] sm:h-[65vh] w-full bg-black relative shrink-0">
              <img 
                src={selectedImage.image} 
                alt={selectedImage.title} 
                className="w-full h-full object-contain" 
              />
            </div>

            {/* Image Details */}
            <div className="p-6 md:p-8 bg-zinc-950 border-t border-zinc-900 shrink-0">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="inline-block bg-zinc-900 text-yellow-500 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
                    {selectedImage.category}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2 leading-tight">
                    {selectedImage.title}
                  </h2>
                  <p className="text-gray-400">
                    {selectedImage.description}
                  </p>
                </div>
                
                <div className="shrink-0 flex gap-3">
                  <button onClick={() => setSelectedImage(null)} className="bg-zinc-800 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-zinc-700 transition-colors">
                    Close
                  </button>
                  <a href={selectedImage.image} target="_blank" rel="noreferrer" className="bg-yellow-500 text-black px-6 py-2.5 rounded-lg font-bold hover:bg-yellow-400 transition-colors flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                    </svg>
                    Original
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GLOBAL STYLES FOR ANIMATIONS (Reused from Home) */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-up { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        .animate-slide-up { animation: slide-up 0.4s ease-out forwards; }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
        
        /* Hide scrollbar for filter categories on mobile */
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}
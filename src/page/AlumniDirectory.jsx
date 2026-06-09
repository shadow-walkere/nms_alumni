import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, Users, GraduationCap, MapPin, Briefcase, Mail, Phone, ChevronDown, ChevronUp, Loader2, Sparkles } from "lucide-react";

const SERVER_URL = 
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SERVER_URL) ||
  (typeof process !== 'undefined' && process.env && process.env.REACT_APP_SERVER_URL) || 
  "http://localhost:5000";

const placeholderImage = "https://ui-avatars.com/api/?name=Alumni&background=EAB308&color=000&size=150";

const AlumniDirectory = () => {
  const [classYears, setClassYears] = useState([]);
  const [alumniByClass, setAlumniByClass] = useState({});
  const [expandedClass, setExpandedClass] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [loadingAlumni, setLoadingAlumni] = useState(false);
  const [hoveredAlumnus, setHoveredAlumnus] = useState(null);
  const [hoveredYear, setHoveredYear] = useState(null);

  // Fetch class years on mount
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await axios.get(`${SERVER_URL}/api/alumni/classes`);
        const years = res.data.data || [];
        setClassYears(years);
        setLoadingClasses(false);
        if (years.length > 0) {
          setExpandedClass(years[0]);
        }
      } catch (err) {
        console.error("Error fetching class years:", err);
        setLoadingClasses(false);
      }
    };
    fetchClasses();
  }, []);

  // Fetch alumni of a specific class when expanded
  useEffect(() => {
    if (expandedClass !== null && !alumniByClass[expandedClass]) {
      fetchAlumniByClass(expandedClass);
    }
  }, [expandedClass]);

  const fetchAlumniByClass = async (year) => {
    setLoadingAlumni(true);
    try {
      const res = await axios.get(`${SERVER_URL}/api/alumni?classYear=${year}`);
      setAlumniByClass((prev) => ({ ...prev, [year]: res.data.data || [] }));
    } catch (err) {
      console.error("Error fetching alumni:", err);
      setAlumniByClass((prev) => ({ ...prev, [year]: [] }));
    } finally {
      setLoadingAlumni(false);
    }
  };

  // Global search handler
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }
    try {
      const res = await axios.get(`${SERVER_URL}/api/alumni?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchResults(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults(null);
  };

  const toggleClassYear = (year) => {
    if (expandedClass === year) {
      setExpandedClass(null);
    } else {
      setExpandedClass(year);
    }
  };

  const renderAlumniGrid = (alumniList) => {
    if (!alumniList || alumniList.length === 0) {
      return (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-yellow-500/30 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">No alumni found.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {alumniList.map((alum, idx) => (
          <div
            key={alum._id}
            className="group relative bg-gradient-to-br from-zinc-800 to-black rounded-2xl shadow-lg hover:shadow-2xl border border-yellow-500/10 hover:border-yellow-500/40 p-6 transition-all duration-500 cursor-pointer"
            onMouseEnter={() => setHoveredAlumnus(alum._id)}
            onMouseLeave={() => setHoveredAlumnus(null)}
            style={{
              animation: `slideInUp 0.5s ease-out ${idx * 0.08}s both`,
              transform: hoveredAlumnus === alum._id ? "translateY(-8px)" : "translateY(0)"
            }}
          >
            {/* Glow effect on hover */}
            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl" />

            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-5">
                <div className="relative">
                  <img
                    src={alum.image || placeholderImage}
                    alt={alum.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-yellow-500/40 group-hover:border-yellow-500 transition-colors duration-300"
                  />
                  <div className="absolute inset-0 rounded-full bg-yellow-500/0 group-hover:bg-yellow-500/10 transition-colors duration-300" />
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-lg text-white group-hover:text-yellow-400 transition-colors duration-300">{alum.name}</h3>
                  <span className="text-xs font-bold text-yellow-500/70 group-hover:text-yellow-400 transition-colors duration-300">Class of {alum.classYear}</span>
                </div>
              </div>

              <div className="space-y-2.5 text-sm text-gray-300">
                {alum.profession && (
                  <div className="flex items-center gap-3 group/item">
                    <Briefcase size={16} className="text-yellow-500/60 group-hover/item:text-yellow-400 transition-colors flex-shrink-0" />
                    <span className="group-hover/item:text-yellow-400/80 transition-colors">{alum.profession}</span>
                  </div>
                )}
                {alum.location && (
                  <div className="flex items-center gap-3 group/item">
                    <MapPin size={16} className="text-yellow-500/60 group-hover/item:text-yellow-400 transition-colors flex-shrink-0" />
                    <span className="group-hover/item:text-yellow-400/80 transition-colors">{alum.location}</span>
                  </div>
                )}
                {alum.email && (
                  <div className="flex items-center gap-3 group/item">
                    <Mail size={16} className="text-yellow-500/60 group-hover/item:text-yellow-400 transition-colors flex-shrink-0" />
                    <span className="group-hover/item:text-yellow-400/80 transition-colors truncate">{alum.email}</span>
                  </div>
                )}
                {alum.phone && (
                  <div className="flex items-center gap-3 group/item">
                    <Phone size={16} className="text-yellow-500/60 group-hover/item:text-yellow-400 transition-colors flex-shrink-0" />
                    <span className="group-hover/item:text-yellow-400/80 transition-colors">{alum.phone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Shine effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loadingClasses) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-black">
        <div className="relative">
          <Loader2 className="w-12 h-12 text-yellow-500 animate-spin" />
          <div className="absolute inset-0 bg-yellow-500/20 blur-xl rounded-full animate-pulse" />
        </div>
        <p className="text-yellow-500 font-bold mt-4 animate-pulse">Loading alumni network...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black font-sans selection:bg-yellow-500 selection:text-black overflow-x-hidden">
      {/* HERO SECTION */}
      <section className="relative h-screen md:h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden pt-20 md:pt-0">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-black z-0" />

        {/* Animated glow orbs */}
        <div className="absolute top-32 left-20 w-72 h-72 bg-yellow-500/20 rounded-full blur-3xl animate-pulse z-0" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse z-0" />

        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(234,179,8,0.05)_1px,transparent_1px)] bg-[length:40px_40px] z-0" />

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 backdrop-blur-md border border-yellow-500/30 text-yellow-400 text-xs font-bold uppercase tracking-widest mb-6"
               style={{ animation: "fadeInUp 0.6s ease-out" }}>
            <Sparkles size={14} /> Alumni Directory
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-tight flex items-center justify-center gap-3"
              style={{ animation: "fadeInUp 0.6s ease-out 0.1s both" }}>
            <GraduationCap className="w-12 h-12 md:w-16 md:h-16 text-yellow-500" />
            <span>
              Connect with<br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 bg-clip-text text-transparent">
                Our Community
              </span>
            </span>
          </h1>

          <p className="text-base md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light mb-8"
             style={{ animation: "fadeInUp 0.6s ease-out 0.2s both" }}>
            Explore our thriving alumni network. Search by name, profession, or location to reconnect with classmates and build meaningful professional relationships.
          </p>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="max-w-2xl mx-auto relative"
            style={{ animation: "fadeInUp 0.6s ease-out 0.3s both" }}
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500/60 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, profession, location..."
                className="w-full pl-12 pr-16 py-4 rounded-xl bg-white/10 border border-yellow-500/20 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/30 outline-none text-white placeholder-gray-500 backdrop-blur-sm transition-all text-sm md:text-base"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-yellow-500 to-amber-500 text-black p-2 rounded-lg hover:shadow-lg hover:shadow-yellow-500/40 transition-all hover:scale-105 active:scale-95"
              >
                <Search size={20} />
              </button>
            </div>
          </form>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 pb-24">
        {/* Search Results (if any) */}
        {searchResults !== null ? (
          <section className="animate-fade-in">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-yellow-500/20">
              <h2 className="text-3xl md:text-4xl font-black text-white">
                Search Results
              </h2>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/20 border border-yellow-500/40 rounded-lg text-yellow-400 font-bold">
                {searchResults.length} found
              </span>
            </div>
            {searchResults.length > 0 ? (
              renderAlumniGrid(searchResults)
            ) : (
              <div className="text-center py-16">
                <Search className="w-16 h-16 text-yellow-500/30 mx-auto mb-4" />
                <p className="text-gray-400 text-lg font-medium">No alumni found matching your search.</p>
                <button
                  onClick={clearSearch}
                  className="mt-6 px-6 py-2.5 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors"
                >
                  Try Different Search
                </button>
              </div>
            )}
          </section>
        ) : (
          /* Class Year View */
          <>
            {/* Class Year Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-12">
              {classYears.map((year, idx) => (
                <button
                  key={year}
                  onClick={() => toggleClassYear(year)}
                  onMouseEnter={() => setHoveredYear(year)}
                  onMouseLeave={() => setHoveredYear(null)}
                  className={`group relative p-5 rounded-xl transition-all duration-300 overflow-hidden text-center ${
                    expandedClass === year
                      ? "bg-gradient-to-br from-yellow-500 to-amber-500 text-black shadow-xl shadow-yellow-500/40 scale-105 ring-2 ring-yellow-500"
                      : "bg-zinc-800/50 text-white hover:bg-zinc-700 border border-yellow-500/10 hover:border-yellow-500/40"
                  }`}
                  style={{
                    animation: `slideInUp 0.5s ease-out ${idx * 0.05}s both`,
                    transform: hoveredYear === year && expandedClass !== year ? "translateY(-4px)" : "translateY(0)"
                  }}
                >
                  {/* Glow on hover */}
                  {expandedClass !== year && (
                    <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10 blur-lg" />
                  )}

                  <span className="block text-2xl md:text-3xl font-black">{year}</span>
                  <span className="text-xs opacity-70 block mt-1">Class of {year}</span>
                  <div className="mt-2 flex justify-center">
                    {expandedClass === year ? (
                      <ChevronUp className="w-5 h-5 transition-transform" />
                    ) : (
                      <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Expanded Class Section */}
            {expandedClass !== null && (
              <div
                className="bg-gradient-to-br from-zinc-900 to-black rounded-3xl p-8 md:p-12 shadow-2xl border border-yellow-500/20"
                style={{ animation: "slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 pb-6 border-b border-yellow-500/20">
                  <h3 className="text-3xl md:text-4xl font-black text-white mb-4 sm:mb-0">
                    Class of <span className="text-yellow-400">{expandedClass}</span>
                  </h3>
                  {alumniByClass[expandedClass] && (
                    <span className="inline-flex items-center gap-2 bg-yellow-500/20 text-yellow-400 font-bold px-5 py-2.5 rounded-lg border border-yellow-500/40 whitespace-nowrap">
                      <Users size={18} />
                      {alumniByClass[expandedClass].length} Alumni
                    </span>
                  )}
                </div>

                {loadingAlumni && !alumniByClass[expandedClass] ? (
                  <div className="flex flex-col justify-center items-center py-20">
                    <Loader2 className="w-10 h-10 text-yellow-500 animate-spin mb-4" />
                    <p className="text-gray-400 font-medium animate-pulse">Loading alumni...</p>
                  </div>
                ) : (
                  renderAlumniGrid(alumniByClass[expandedClass])
                )}
              </div>
            )}

            {/* Clear Search Button */}
            {searchResults !== null && (
              <div className="text-center mt-8">
                <button
                  onClick={clearSearch}
                  className="px-6 py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-all hover:scale-105 active:scale-95"
                >
                  Clear Search
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
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

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
      `}</style>
    </div>
  );
};

export default AlumniDirectory;
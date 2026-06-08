import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, Users, GraduationCap, MapPin, Briefcase, Mail, Phone, ChevronDown, ChevronUp } from "lucide-react";

const SERVER_URL = 
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SERVER_URL) ||
  (typeof process !== 'undefined' && process.env && process.env.REACT_APP_SERVER_URL) || 
  "http://localhost:5000";

const placeholderImage = "https://ui-avatars.com/api/?name=Alumni&background=6366f1&color=fff&size=150";

const AlumniDirectory = () => {
  const [classYears, setClassYears] = useState([]);
  const [alumniByClass, setAlumniByClass] = useState({}); // { 2016: [...], ... }
  const [expandedClass, setExpandedClass] = useState(null); // currently open year
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null); // null = no search active
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [loadingAlumni, setLoadingAlumni] = useState(false);

  // Fetch class years on mount
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await axios.get(`${SERVER_URL}/api/alumni/classes`);
        const years = res.data.data || [];
        setClassYears(years);
        setLoadingClasses(false);
        // Preload the first year if exists
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
      // If data not yet fetched, useEffect will trigger fetch
    }
  };

  const renderAlumniGrid = (alumniList) => {
    if (!alumniList || alumniList.length === 0) return <p className="text-gray-400 italic text-center py-8">No alumni found.</p>;
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {alumniList.map((alum) => (
          <div key={alum._id} className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <img
                src={alum.image || placeholderImage}
                alt={alum.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-indigo-200"
              />
              <div>
                <h3 className="font-bold text-lg text-gray-800">{alum.name}</h3>
                <span className="text-sm text-indigo-600 font-semibold">Class of {alum.classYear}</span>
              </div>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              {alum.profession && (
                <p className="flex items-center gap-2"><Briefcase size={14} className="text-gray-400" /> {alum.profession}</p>
              )}
              {alum.location && (
                <p className="flex items-center gap-2"><MapPin size={14} className="text-gray-400" /> {alum.location}</p>
              )}
              {alum.email && (
                <p className="flex items-center gap-2"><Mail size={14} className="text-gray-400" /> {alum.email}</p>
              )}
              {alum.phone && (
                <p className="flex items-center gap-2"><Phone size={14} className="text-gray-400" /> {alum.phone}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loadingClasses) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
        <p className="text-lg text-indigo-600 font-semibold animate-pulse">Loading classes...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-slate-800 mb-4 flex items-center justify-center gap-3">
            <GraduationCap className="w-10 h-10 text-indigo-600" />
            Alumni Directory
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Explore our community by class year. Click on a year to see the alumni.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-md mx-auto mb-12 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, profession, location..."
            className="w-full pl-12 pr-4 py-3.5 rounded-full border border-slate-200 shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 bg-indigo-600 text-white p-1.5 rounded-full hover:bg-indigo-700 transition">
            <Search size={16} />
          </button>
          {searchResults !== null && (
            <button
              onClick={clearSearch}
              className="mt-2 text-sm text-indigo-600 underline"
            >
              Clear search
            </button>
          )}
        </form>

        {/* Search Results (if any) */}
        {searchResults !== null ? (
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Search Results ({searchResults.length})
            </h2>
            {renderAlumniGrid(searchResults)}
          </section>
        ) : (
          /* Class Year Grid */
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {classYears.map((year) => (
                <button
                  key={year}
                  onClick={() => toggleClassYear(year)}
                  className={`w-full p-6 rounded-2xl text-center transition-all duration-300 ${
                    expandedClass === year
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-105"
                      : "bg-white text-slate-700 hover:shadow-md hover:border-indigo-200 border border-gray-100"
                  }`}
                >
                  <span className="block text-3xl font-black">{year}</span>
                  <span className="text-sm opacity-80">Class of {year}</span>
                  {expandedClass === year ? (
                    <ChevronUp className="mx-auto mt-2 w-5 h-5" />
                  ) : (
                    <ChevronDown className="mx-auto mt-2 w-5 h-5 text-gray-400" />
                  )}
                </button>
              ))}
            </div>

            {expandedClass !== null && (
              <div className="mt-8 bg-white rounded-3xl p-8 shadow-xl border border-slate-100 animate-slide-up">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                  <h3 className="text-2xl font-black text-slate-800">
                    Class of {expandedClass}
                  </h3>
                  {alumniByClass[expandedClass] && (
                    <span className="bg-indigo-50 text-indigo-700 font-semibold px-4 py-1.5 rounded-full text-sm">
                      {alumniByClass[expandedClass].length} Alumni
                    </span>
                  )}
                </div>
                {loadingAlumni && !alumniByClass[expandedClass] ? (
                  <div className="flex justify-center py-10">
                    <p className="text-center text-indigo-600 font-medium animate-pulse">Loading class directory...</p>
                  </div>
                ) : (
                  renderAlumniGrid(alumniByClass[expandedClass])
                )}
              </div>
            )}
          </>
        )}
      </div>
      <style>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.4s ease-out; }
      `}</style>
    </div>
  );
};

export default AlumniDirectory;
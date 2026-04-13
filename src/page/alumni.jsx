import React, { useState } from "react";

// Mock Data: Reflecting classes 2016-2024, mostly students
const alumniData = [
  {
    id: 1,
    name: "Emmanuel Kiprono",
    year: "2018",
    status: "Undergraduate Student",
    institution: "Egerton University",
    course: "BSc. Computer Science",
    bio: "Passionate about software development and machine learning. Currently working on my final year project and always open to collaborating on tech initiatives.",
    email: "emmanuel.k@example.com",
    linkedin: "linkedin.com/in/emmanuelk",
    image: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?q=80&w=250&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Aisha Wanjiku",
    year: "2020",
    status: "Undergraduate Student",
    institution: "University of Nairobi",
    course: "Medicine & Surgery (MBChB)",
    bio: "Dedicated medical student aiming to specialize in pediatrics. Active member of the medical students' association and a volunteer at local clinics.",
    email: "aisha.w@example.com",
    linkedin: "linkedin.com/in/aishaw",
    image: "https://images.unsplash.com/photo-1531123897727-8f129e1bf3c9?q=80&w=250&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Brian Ochieng",
    year: "2016",
    status: "Employed / Part-time Masters",
    institution: "Kenyatta University",
    course: "Business Administration",
    bio: "Working as a financial analyst in Nairobi while completing my MBA. I am always happy to mentor younger NMS alumni interested in finance or investments.",
    email: "brian.o@example.com",
    linkedin: "linkedin.com/in/briano",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=250&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Faith Mutheu",
    year: "2022",
    status: "Undergraduate Student",
    institution: "Strathmore University",
    course: "Data Science & Analytics",
    bio: "Fascinated by big data, statistical analysis, and visualizing complex information. Currently looking for attachment opportunities in tech firms.",
    email: "faith.m@example.com",
    linkedin: "linkedin.com/in/faithm",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop",
  },
  {
    id: 5,
    name: "David Njuguna",
    year: "2024",
    status: "Freshman",
    institution: "Jomo Kenyatta University (JKUAT)",
    course: "Electrical & Electronic Engineering",
    bio: "Just started my university journey! Eager to explore robotics and renewable energy systems. Looking forward to connecting with senior engineering students.",
    email: "david.n@example.com",
    linkedin: "linkedin.com/in/davidn",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=250&auto=format&fit=crop",
  },
  {
    id: 6,
    name: "Grace Kemboi",
    year: "2019",
    status: "Undergraduate Student",
    institution: "Moi University",
    course: "Law (LLB)",
    bio: "Final year law student with a keen interest in data privacy policies and corporate law. Mentoring high school debaters in my free time.",
    email: "grace.k@example.com",
    linkedin: "linkedin.com/in/gracek",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=250&auto=format&fit=crop",
  },
  {
    id: 7,
    name: "Kevin Mutua",
    year: "2024",
    status: "First Year Student",
    institution: "KCA University",
    course: "BSc. Information Technology",
    bio: "Passionate about cybersecurity and ethical hacking. Looking forward to learning from my peers and alumni in the tech space.",
    email: "kevin.m@example.com",
    linkedin: "linkedin.com/in/kevinm",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=250&auto=format&fit=crop",
  }
];

const graduationYears = ["All", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016"];

export default function AlumniDirectory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedAlumni, setSelectedAlumni] = useState(null);

  // 1. Filter Logic
  const filteredAlumni = alumniData.filter((alumni) => {
    const matchesSearch =
      alumni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alumni.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alumni.course.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = selectedYear === "All" || alumni.year === selectedYear;
    return matchesSearch && matchesYear;
  });

  // 2. Grouping Logic
  const groupedAlumni = filteredAlumni.reduce((acc, alumni) => {
    if (!acc[alumni.year]) {
      acc[alumni.year] = [];
    }
    acc[alumni.year].push(alumni);
    return acc;
  }, {});

  // 3. Sorting Years (Descending order: Newest classes first)
  const sortedYears = Object.keys(groupedAlumni).sort((a, b) => b - a);

  return (
    <div className="min-h-screen bg-black text-gray-300 font-sans selection:bg-yellow-500 selection:text-black pb-20">
      
      {/* HEADER */}
      <header className="bg-zinc-950 border-b border-yellow-500/20 py-16 px-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Alumni <span className="text-yellow-500">Directory</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Connect with fellow Nambale Magnet alumni. Whether you're navigating university life, looking for a mentor, or expanding your professional network, your community is here.
          </p>
        </div>
      </header>

      {/* SEARCH & FILTER BAR */}
      <section className="max-w-7xl mx-auto px-6 -mt-8 relative z-20 mb-16">
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl shadow-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="w-full md:w-2/3 relative">
            <input
              type="text"
              placeholder="Search by name, university, or course..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black border border-zinc-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all"
            />
          </div>
          <div className="w-full md:w-1/3 flex items-center gap-3">
            <label className="text-gray-400 font-medium whitespace-nowrap">Class of:</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full bg-black border border-zinc-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all cursor-pointer"
            >
              {graduationYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* GROUPED ALUMNI GRID */}
      <section className="max-w-7xl mx-auto px-6">
        {sortedYears.length > 0 ? (
          sortedYears.map((year) => (
            <div key={year} className="mb-16 animate-fade-in-up">
              {/* Class Year Header */}
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-3xl font-extrabold text-white tracking-wide">
                  Class of <span className="text-yellow-500">{year}</span>
                </h2>
                <div className="flex-1 h-[1px] bg-gradient-to-r from-yellow-500/50 to-transparent"></div>
              </div>

              {/* Cards Grid for this specific year */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {groupedAlumni[year].map((alumni) => (
                  <div
                    key={alumni.id}
                    className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden group hover:-translate-y-2 hover:border-yellow-500/50 hover:shadow-[0_10px_30px_rgba(234,179,8,0.1)] transition-all duration-300 flex flex-col"
                  >
                    {/* Card Header w/ Image */}
                    <div className="p-6 pb-0 flex items-center gap-4">
                      <img
                        src={alumni.image}
                        alt={alumni.name}
                        className="w-20 h-20 rounded-full object-cover border-2 border-yellow-500/50 group-hover:border-yellow-500 transition-colors"
                      />
                      <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-yellow-500 transition-colors">
                          {alumni.name}
                        </h3>
                        <span className="inline-block bg-zinc-800/50 border border-zinc-700 text-gray-400 text-xs px-2 py-1 rounded mt-1 font-semibold">
                          {alumni.institution}
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 flex-grow">
                      <div className="mb-4">
                        <p className="text-sm text-gray-400 uppercase tracking-wider font-semibold mb-1">
                          Current Focus
                        </p>
                        <p className="text-white font-medium">{alumni.course}</p>
                        <p className="text-xs text-yellow-500/80 mt-1 italic">{alumni.status}</p>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="border-t border-zinc-800 p-4 bg-black flex justify-between items-center">
                      <button
                        onClick={() => setSelectedAlumni(alumni)}
                        className="text-sm text-white font-semibold hover:text-yellow-500 transition-colors"
                      >
                        View Profile
                      </button>
                      <button
                        onClick={() => setSelectedAlumni(alumni)}
                        className="bg-yellow-500 text-black px-4 py-1.5 rounded-full text-sm font-bold hover:bg-yellow-400 transition-colors shadow-md"
                      >
                        Connect
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 text-gray-500 bg-zinc-950 border border-zinc-900 rounded-xl">
            <p className="text-2xl font-bold mb-2 text-white">No alumni found.</p>
            <p>Try adjusting your search or class year filter.</p>
          </div>
        )}
      </section>

      {/* MODAL / POPUP */}
      {selectedAlumni && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          {/* Click outside to close */}
          <div 
            className="absolute inset-0" 
            onClick={() => setSelectedAlumni(null)}
          ></div>
          
          <div className="relative bg-zinc-950 border border-yellow-500/30 w-full max-w-2xl rounded-2xl shadow-2xl p-8 overflow-y-auto max-h-[90vh] z-10 animate-slide-up">
            <button
              onClick={() => setSelectedAlumni(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-yellow-500 text-3xl font-bold transition-colors leading-none"
            >
              &times;
            </button>

            <div className="flex flex-col md:flex-row gap-8 items-start mt-2">
              <img
                src={selectedAlumni.image}
                alt={selectedAlumni.name}
                className="w-32 h-32 md:w-48 md:h-48 rounded-xl object-cover border-4 border-zinc-800 shadow-lg"
              />
              
              <div className="flex-1">
                <h2 className="text-3xl font-extrabold text-white mb-2">{selectedAlumni.name}</h2>
                <span className="inline-block border border-yellow-500 text-yellow-500 text-xs px-3 py-1 rounded-full font-bold uppercase mb-4">
                  Class of {selectedAlumni.year}
                </span>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs text-gray-500 uppercase tracking-widest font-bold">Institution</h4>
                    <p className="text-lg text-white font-medium">{selectedAlumni.institution}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-xs text-gray-500 uppercase tracking-widest font-bold">Course / Major</h4>
                    <p className="text-white">{selectedAlumni.course}</p>
                    <p className="text-sm text-yellow-500 italic mt-1">{selectedAlumni.status}</p>
                  </div>

                  <div>
                    <h4 className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">About</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {selectedAlumni.bio}
                    </p>
                  </div>
                </div>

                {/* Connection Links */}
                <div className="mt-8 pt-6 border-t border-zinc-800 flex gap-4">
                  <a
                    href={`mailto:${selectedAlumni.email}`}
                    className="flex-1 bg-yellow-500 text-black text-center py-3 rounded-lg font-bold hover:bg-yellow-400 transition-colors shadow-[0_0_15px_rgba(234,179,8,0.2)]"
                  >
                    Send Email
                  </a>
                  <a
                    href={`https://${selectedAlumni.linkedin}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 bg-zinc-900 border border-zinc-700 text-white text-center py-3 rounded-lg font-bold hover:border-yellow-500 hover:text-yellow-500 transition-all"
                  >
                    LinkedIn Profile
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tailwind custom animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        .animate-slide-up { animation: slide-up 0.4s ease-out forwards; }
        .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }
      `}} />
    </div>
  );
}
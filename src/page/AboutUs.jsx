import React, { useState } from 'react';

// ── Constitution chapters data ──────────────────────────────────────────────
const constitutionChapters = [
  {
    id: 1,
    title: "Chapter 1: Name & Registration",
    description: "Official name, legal status, and registration details of the Nambale Magnet School Alumni Association.",
    icon: "🏛️",
    file: "/documents/constitution/chapter1.pdf",
  },
  {
    id: 2,
    title: "Chapter 2: Objectives & Goals",
    description: "The core objectives that guide our alumni network and the goals we collectively pursue.",
    icon: "🎯",
    file: "/documents/constitution/chapter2.pdf",
  },
  {
    id: 3,
    title: "Chapter 3: Membership",
    description: "Eligibility criteria, categories of membership, rights, duties, and subscription fees.",
    icon: "🤝",
    file: "/documents/constitution/chapter3.pdf",
  },
  {
    id: 4,
    title: "Chapter 4: Governance & Leadership",
    description: "Structure of the governing body, elections, terms of office, and leadership responsibilities.",
    icon: "⚖️",
    file: "/documents/constitution/chapter4.pdf",
  },
  {
    id: 5,
    title: "Chapter 5: Meetings & Quorum",
    description: "Rules governing general meetings, special meetings, notice periods, and quorum requirements.",
    icon: "📋",
    file: "/documents/constitution/chapter5.pdf",
  },
  {
    id: 6,
    title: "Chapter 6: Finance & Auditing",
    description: "Management of funds, financial year, auditing procedures, and accountability measures.",
    icon: "💰",
    file: "/documents/constitution/chapter6.pdf",
  },
  {
    id: 7,
    title: "Chapter 7: Amendments & Dissolution",
    description: "Procedures for amending the constitution and provisions for dissolution of the association.",
    icon: "📜",
    file: "/documents/constitution/chapter7.pdf",
  },
];

// ── Alumni Leadership data ──────────────────────────────────────────────────
const leadershipTeam = [
  {
    name: "Eugene Opaili",
    role: "Chairperson",
    classOf: "Class of 2016",
    bio: "Eugene Opaili leads the alumni network with a passion for education equity and community development.",
    initials: "EO",
    color: "from-yellow-600 to-yellow-400",
  },
  {
    name: "Brian Waf",
    role: "Vice Chairperson",
    classOf: "Class of 2014",
    bio: "Entrepreneur and youth advocate. Brian coordinates alumni chapters across the country and drives mentorship programmes.",
    initials: "BW",
    color: "from-amber-600 to-amber-400",
  },
  {
    name: "Richard Mukanda",
    role: "Secretary General",
    classOf: "Class of 2019",
    bio: "A Computer Science Student at Kenyatta University.",
    initials: "RM",
    color: "from-yellow-700 to-yellow-500",
  },
  {
    name: "Kevin Otieno Ouma",
    role: "Treasurer",
    classOf: "Class of 2011",
    bio: "Certified accountant with 8 years in financial services. Kevin oversees the alumni fund and scholarship disbursements.",
    initials: "KO",
    color: "from-amber-700 to-amber-500",
  },
  {
    name: "Winnie Nekesa Juma",
    role: "Director of Programmes",
    classOf: "Class of 2015",
    bio: "Secondary school teacher and curriculum designer. Winnie leads alumni-driven mentorship and back-to-school initiatives.",
    initials: "WN",
    color: "from-yellow-500 to-yellow-300",
  },
  {
    name: "Daniel Khisa Mulama",
    role: "Director of Membership",
    classOf: "Class of 2016",
    bio: "IT professional who built and manages the alumni digital platform. Daniel drives outreach and alumni registration efforts.",
    initials: "DK",
    color: "from-amber-500 to-amber-300",
  },
];

// ── Chapter Card ────────────────────────────────────────────────────────────
const ChapterCard = ({ chapter }) => {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    setDownloading(true);
    // Simulate / trigger download
    setTimeout(() => {
      setDownloading(false);
      setDownloaded(true);
      // In a real app this would be:
      // const link = document.createElement('a');
      // link.href = chapter.file;
      // link.download = `NMS_Constitution_${chapter.title}.pdf`;
      // link.click();
      setTimeout(() => setDownloaded(false), 3000);
    }, 1200);
  };

  return (
    <div className="group bg-gray-800 border border-gray-700 hover:border-yellow-500/60 rounded-lg p-5 flex flex-col gap-3 transition-all duration-300 hover:bg-gray-750 hover:shadow-lg hover:shadow-yellow-500/10">
      <div className="flex items-start gap-3">
        <span className="text-2xl mt-0.5 select-none">{chapter.icon}</span>
        <div className="flex-1 min-w-0">
          <h4 className="text-white font-semibold text-sm leading-snug group-hover:text-yellow-400 transition-colors">
            {chapter.title}
          </h4>
          <p className="text-gray-400 text-xs mt-1.5 leading-relaxed">{chapter.description}</p>
        </div>
      </div>
      <button
        onClick={handleDownload}
        disabled={downloading}
        className={`mt-auto flex items-center justify-center gap-2 w-full py-2 px-4 rounded text-xs font-semibold transition-all duration-300 ${
          downloaded
            ? "bg-green-600/20 border border-green-500/40 text-green-400"
            : downloading
            ? "bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 cursor-wait"
            : "bg-transparent border border-yellow-500/40 text-yellow-400 hover:bg-yellow-500 hover:text-black hover:border-yellow-500"
        }`}
      >
        {downloading ? (
          <>
            <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            Preparing…
          </>
        ) : downloaded ? (
          <>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Downloaded!
          </>
        ) : (
          <>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
            </svg>
            Download PDF
          </>
        )}
      </button>
    </div>
  );
};

// ── Leadership Card ─────────────────────────────────────────────────────────
const LeaderCard = ({ leader }) => (
  <div className="bg-gray-800 border border-gray-700 hover:border-yellow-500/50 rounded-lg p-5 flex flex-col gap-3 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/10">
    <div className="flex items-center gap-4">
      <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${leader.color} flex items-center justify-center text-black font-bold text-lg flex-shrink-0 shadow-md`}>
        {leader.initials}
      </div>
      <div>
        <h4 className="text-white font-semibold text-sm leading-snug">{leader.name}</h4>
        <p className="text-yellow-400 text-xs font-medium mt-0.5">{leader.role}</p>
        <p className="text-gray-500 text-xs mt-0.5">{leader.classOf}</p>
      </div>
    </div>
    <p className="text-gray-400 text-xs leading-relaxed border-t border-gray-700 pt-3">{leader.bio}</p>
  </div>
);

// ── Main Component ──────────────────────────────────────────────────────────
const AboutUs = () => {
  const [fullConstitutionDownloading, setFullConstitutionDownloading] = useState(false);
  const [fullConstitutionDownloaded, setFullConstitutionDownloaded] = useState(false);

  const handleFullDownload = () => {
    setFullConstitutionDownloading(true);
    setTimeout(() => {
      setFullConstitutionDownloading(false);
      setFullConstitutionDownloaded(true);
      setTimeout(() => setFullConstitutionDownloaded(false), 4000);
    }, 1500);
  };

  return (
    <div className="bg-black min-h-screen">
      {/* Page Header */}
      <div className="relative py-24 bg-gradient-to-r from-gray-900 to-black border-b-2 border-yellow-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">
            About Nambale Magnet School
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto italic">
            "Live, that there may be Life" — Breaking the cycle of poverty through quality education
          </p>
        </div>
      </div>

      {/* Our Story Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h2 className="text-3xl font-bold text-yellow-500 mb-6">Our Story</h2>
              <p className="text-gray-300 leading-relaxed mb-5">
                The Nambale Magnet School was founded in <strong className="text-white">2009</strong> by
                the <strong className="text-white">Rev. Evalyn Wakhusama</strong>, a Yale
                School graduate and one of the first women ordained in the Anglican Church of Kenya.
                Witnessing the devastation of lack of education and extreme poverty in rural
                western Kenya, she dreamt of a school that would offer hope, safety, and a future
                to children from Busia County.
              </p>
              <p className="text-gray-300 leading-relaxed mb-5">
                The school opened its doors with just <strong className="text-white">35 pioneer
                learners</strong> in January 2009. Today, it has grown into a vibrant residential
                primary school serving <strong className="text-white">over 435 students</strong> —
                from preschool through eighth grade. More than <strong className="text-white">250
                pupils board</strong> at the school, and over <strong className="text-white">150 staff
                members</strong> are employed, making NMS one of the largest employers in the
                Nambale area.
              </p>
              <p className="text-gray-300 leading-relaxed">
                The word <strong className="text-white">"Magnet"</strong> captures the school's
                ability to attract bright minds, dedicated educators, generous partners, and
                transformational resources from across Kenya and around the world.
              </p>
            </div>

            {/* Mission & Vision Card */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-yellow-500 mb-3">Our Mission</h3>
                <p className="text-gray-300 leading-relaxed">
                  To provide a high-quality, holistic education that nurtures the intellectual,
                  spiritual, emotional, and physical development of every child, while breaking
                  the cycle of poverty in rural western Kenya.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-yellow-500 mb-3">Our Vision</h3>
                <p className="text-gray-300 leading-relaxed">
                  To be a center of excellence that transforms lives, produces responsible
                  leaders, and builds a community where every child can reach their full
                  God-given potential.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-yellow-500 mb-3">Core Values</h3>
                <ul className="text-gray-300 space-y-2">
                  {["Faith", "Excellence", "Integrity", "Compassion", "Stewardship"].map((v) => (
                    <li key={v} className="flex gap-2">
                      <span className="text-yellow-500">•</span> {v}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Facts */}
      <section className="py-16 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-yellow-500 text-center mb-12">
            NMS Today: A Community of Growth
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { number: "435+", label: "Students enrolled" },
              { number: "250+", label: "Boarders" },
              { number: "60+", label: "Staff members" },
              { number: "35", label: "Pioneer learners" },
            ].map((stat, idx) => (
              <div key={idx} className="bg-gray-800 border border-gray-700 rounded-lg p-6 text-center">
                <p className="text-4xl font-bold text-yellow-500 mb-2">{stat.number}</p>
                <p className="text-gray-300 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
          <p className="text-gray-400 text-center mt-8 max-w-2xl mx-auto">
            Located in Nambale, Busia County, the school sits on a secure, green campus with
            modern classrooms, dormitories, a library, a computer lab, and playgrounds — all
            built through the generosity of local and international partners.
          </p>
        </div>
      </section>

      {/* ── Alumni Leadership ────────────────────────────────────────────────── */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
            <div>
              <h2 className="text-3xl font-bold text-yellow-500">Alumni Leadership</h2>
              <p className="text-gray-400 mt-2 max-w-xl">
                Meet the dedicated team steering the Nambale Magnet School Alumni Association — all proud graduates giving back to the community that shaped them.
              </p>
            </div>
            <a
              href="/alumni/leadership"
              className="text-yellow-500 text-sm font-semibold border border-yellow-500/40 px-4 py-2 rounded hover:bg-yellow-500 hover:text-black transition whitespace-nowrap self-start sm:self-auto"
            >
              Full Team →
            </a>
          </div>

          {/* Leadership Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {leadershipTeam.map((leader) => (
              <LeaderCard key={leader.name} leader={leader} />
            ))}
          </div>

          {/* Elections Banner */}
          <div className="mt-10 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🗳️</span>
              <div>
                <p className="text-white font-semibold text-sm">Next Elections: January 2026</p>
                <p className="text-gray-400 text-xs mt-0.5">
                  Leadership elections are held every two years at the Annual General Meeting.
                  All registered alumni in good standing are eligible to vote and stand.
                </p>
              </div>
            </div>
            <a
              href="/alumni/elections"
              className="text-yellow-400 text-xs font-semibold border border-yellow-500/40 px-4 py-2 rounded hover:bg-yellow-500 hover:text-black transition whitespace-nowrap flex-shrink-0"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* ── School Constitution ──────────────────────────────────────────────── */}
      <section className="py-16 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-3">
            <div>
              <h2 className="text-3xl font-bold text-yellow-500">School Constitution</h2>
              <p className="text-gray-400 mt-2 max-w-2xl">
                The NMS Alumni Association is governed by a formal constitution ratified at the
                founding AGM. Click any chapter below to download it as a PDF, or download the
                full document in one go.
              </p>
            </div>

            {/* Full Constitution Download */}
            <button
              onClick={handleFullDownload}
              disabled={fullConstitutionDownloading}
              className={`flex items-center gap-2 px-5 py-2.5 rounded font-bold text-sm transition-all duration-300 flex-shrink-0 self-start sm:self-auto ${
                fullConstitutionDownloaded
                  ? "bg-green-600/20 border border-green-500/40 text-green-400"
                  : fullConstitutionDownloading
                  ? "bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 cursor-wait"
                  : "bg-yellow-500 text-black hover:bg-yellow-400"
              }`}
            >
              {fullConstitutionDownloading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Preparing…
                </>
              ) : fullConstitutionDownloaded ? (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Downloaded!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
                  </svg>
                  Full Constitution (PDF)
                </>
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-700 mb-10" />

          {/* Chapter Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {constitutionChapters.map((chapter) => (
              <ChapterCard key={chapter.id} chapter={chapter} />
            ))}
          </div>

          {/* Footer note */}
          <p className="text-gray-500 text-xs text-center mt-8">
            Constitution last reviewed and ratified at the Annual General Meeting, March 2024.
            For queries, contact{" "}
            <a href="mailto:alumni@nambalemagnet.ac.ke" className="text-yellow-500 hover:underline">
              alumni@nambalemagnet.ac.ke
            </a>
          </p>
        </div>
      </section>

      {/* Alumni Connection Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-bold text-yellow-500 mb-6">
                The Alumni Network: A Global Family
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Since its inception, NMS has nurtured thousands of students who have gone on
                to attend top secondary schools, universities, and build careers in Kenya and
                abroad. Our alumni are teachers, engineers, doctors, entrepreneurs, and
                community leaders.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                The Nambale Magnet School Alumni Network exists to reconnect former students,
                celebrate achievements, and give back to the school that shaped us.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Alumni play a vital role in mentoring current students, sponsoring scholarships,
                and supporting capital projects. Together, we ensure that the next generation
                of learners has the same opportunities we did — and more.
              </p>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h3 className="text-2xl font-bold text-yellow-500 mb-5">Why Stay Connected?</h3>
              <ul className="space-y-3 text-gray-300">
                {[
                  "Reconnect with classmates and teachers",
                  "Mentor a current student",
                  "Attend alumni events and reunions",
                  "Support scholarships and infrastructure",
                  "Expand your professional network",
                  "Share your story to inspire others",
                ].map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-yellow-500">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800 border-t-2 border-yellow-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Be Part of the Legacy</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Whether you're a recent graduate or an old hand, your journey started here.
            Join the alumni network today and help write the next chapter of Nambale Magnet School.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/auth"
              className="bg-yellow-500 text-black px-8 py-3 rounded font-bold hover:bg-yellow-400 transition"
            >
              Join the Alumni Network
            </a>
            <a
              href="/donations"
              className="border border-yellow-500 text-yellow-500 px-8 py-3 rounded font-bold hover:bg-yellow-500 hover:text-black transition"
            >
              Give Back
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
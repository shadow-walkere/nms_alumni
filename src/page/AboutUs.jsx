import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

/* ── Data (unchanged) ─────────────────────────────────────────────────────── */
const constitutionChapters = [
  {
    id: 1,
    title: "Chapter 1: Name & Registration",
    description:
      "Official name, legal status, and registration details of the Nambale Magnet School Alumni Association.",
    icon: "🏛️",
  },
  {
    id: 2,
    title: "Chapter 2: Objectives & Goals",
    description:
      "The core objectives that guide our alumni network and the goals we collectively pursue.",
    icon: "🎯",
  },
  {
    id: 3,
    title: "Chapter 3: Membership",
    description:
      "Eligibility criteria, categories of membership, rights, duties, and subscription fees.",
    icon: "🤝",
  },
  {
    id: 4,
    title: "Chapter 4: Governance & Leadership",
    description:
      "Structure of the governing body, elections, terms of office, and leadership responsibilities.",
    icon: "⚖️",
  },
  {
    id: 5,
    title: "Chapter 5: Meetings & Quorum",
    description:
      "Rules governing general meetings, special meetings, notice periods, and quorum requirements.",
    icon: "📋",
  },
  {
    id: 6,
    title: "Chapter 6: Finance & Auditing",
    description:
      "Management of funds, financial year, auditing procedures, and accountability measures.",
    icon: "💰",
  },
  {
    id: 7,
    title: "Chapter 7: Amendments & Dissolution",
    description:
      "Procedures for amending the constitution and provisions for dissolution of the association.",
    icon: "📜",
  },
];

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
    name: "Name",
    role: "Vice Chairperson",
    classOf: "Class of",
    bio: "bio data.",
    initials: "NE",
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
    name: "Cabral Ochieng",
    role: "Treasurer",
    classOf: "Class of ",
    bio: "Student at .....",
    initials: "CO",
    color: "from-amber-700 to-amber-500",
  },
  {
    name: "Esther Karani",
    role: "Secretary",
    classOf: "Class of 2015",
    bio: "Student at ...",
    initials: "EK",
    color: "from-yellow-500 to-yellow-300",
  },
  {
    name: "Rhoda Olive",
    role: "Assistant Secretary",
    classOf: "Class of ",
    bio: "Student at....",
    initials: "RO",
    color: "from-amber-500 to-amber-300",
  },
];

/* ── Custom Scroll Reveal Hook ─────────────────────────────────────────────── */
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
      { threshold, rootMargin: "0px 0px -40px 0px" },
    );
    const elements = document.querySelectorAll("[data-reveal]");
    elements.forEach((el) => observer.observe(el));
    return () => elements.forEach((el) => observer.unobserve(el));
  }, [threshold]);
};

/* ── Sub‑components ───────────────────────────────────────────────────────── */
const ChapterCard = ({ chapter }) => (
  <div className="group relative rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm p-6 transition-all duration-500 hover:-translate-y-1.5 hover:border-yellow-500/40 hover:shadow-[0_20px_50px_rgba(234,179,8,0.08)]">
    <div className="flex items-start gap-4">
      <span className="text-2xl">{chapter.icon}</span>
      <div>
        <h4 className="text-white font-semibold text-base group-hover:text-yellow-400 transition-colors">
          {chapter.title}
        </h4>
        <p className="text-gray-400 text-sm mt-1.5 leading-relaxed">
          {chapter.description}
        </p>
      </div>
    </div>
  </div>
);

const LeaderCard = ({ leader }) => (
  <div className="group relative rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm p-6 transition-all duration-500 hover:-translate-y-1.5 hover:border-yellow-500/40 hover:shadow-[0_20px_50px_rgba(234,179,8,0.08)]">
    <div className="flex items-center gap-4 mb-4">
      <div
        className={`w-14 h-14 rounded-full bg-gradient-to-br ${leader.color} flex items-center justify-center text-black font-bold text-lg shadow-lg`}
      >
        {leader.initials}
      </div>
      <div>
        <h4 className="text-white font-semibold text-base">{leader.name}</h4>
        <p className="text-yellow-400 text-xs font-medium mt-0.5">
          {leader.role}
        </p>
        <p className="text-gray-500 text-xs mt-0.5">{leader.classOf}</p>
      </div>
    </div>
    <p className="text-gray-400 text-sm leading-relaxed border-t border-white/5 pt-4">
      {leader.bio}
    </p>
  </div>
);

/* ── Main AboutUs Component ───────────────────────────────────────────────── */
const AboutUs = () => {
  useScrollReveal();

  const [fullConstitutionDownloading, setFullConstitutionDownloading] =
    useState(false);
  const [fullConstitutionDownloaded, setFullConstitutionDownloaded] =
    useState(false);

  const handleFullDownload = () => {
    setFullConstitutionDownloading(true);
    setTimeout(() => {
      setFullConstitutionDownloading(false);
      setFullConstitutionDownloaded(true);
      setTimeout(() => setFullConstitutionDownloaded(false), 4000);
    }, 1500);
  };

  return (
    <div className="relative min-h-screen bg-black font-sans text-gray-300 selection:bg-yellow-500 selection:text-black overflow-hidden">
      {/* ======== Page Header (with ambient light) ======== */}
      <div className="relative py-28 border-b border-yellow-500/20 bg-gradient-to-b from-zinc-900 to-black overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 tracking-tight">
            About Nambale Magnet School
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto italic font-light">
            "Live, that there may be Life" — Breaking the cycle of poverty
            through quality education
          </p>
        </div>
      </div>

      {/* ======== Our Story Section ======== */}
      <section className="relative py-24" data-reveal>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
            <div>
              <h2 className="text-4xl font-bold text-yellow-500 mb-8">
                Our Story
              </h2>
              <div className="space-y-5 text-gray-300 leading-relaxed">
                <p>
                  The Nambale Magnet School was founded in{" "}
                  <strong className="text-white">2009</strong> by the{" "}
                  <strong className="text-white">Rev. Evalyn Wakhusama</strong>,
                  a Yale School graduate and one of the first women ordained in
                  the Anglican Church of Kenya. Witnessing the devastation of
                  lack of education and extreme poverty in rural western Kenya,
                  she dreamt of a school that would offer hope, safety, and a
                  future to children from Busia County.
                </p>
                <p>
                  The school opened its doors with just{" "}
                  <strong className="text-white">35 pioneer learners</strong> in
                  January 2009. Today, it has grown into a vibrant residential
                  primary school serving{" "}
                  <strong className="text-white">over 435 students</strong> —
                  from preschool through eighth grade. More than{" "}
                  <strong className="text-white">250 pupils board</strong> at
                  the school, and over{" "}
                  <strong className="text-white">150 staff members</strong> are
                  employed, making NMS one of the largest employers in the
                  Nambale area.
                </p>
                <p>
                  The word <strong className="text-white">"Magnet"</strong>{" "}
                  captures the school's ability to attract bright minds,
                  dedicated educators, generous partners, and transformational
                  resources from across Kenya and around the world.
                </p>
              </div>
            </div>

            {/* Mission & Vision Card */}
            <div className="relative rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm p-8 space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-yellow-500 mb-4">
                  Our Mission
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  To provide a high-quality, holistic education that nurtures
                  the intellectual, spiritual, emotional, and physical
                  development of every child, while breaking the cycle of
                  poverty in rural western Kenya.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-yellow-500 mb-4">
                  Our Vision
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  To be a center of excellence that transforms lives, produces
                  responsible leaders, and builds a community where every child
                  can reach their full God-given potential.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-yellow-500 mb-4">
                  Core Values
                </h3>
                <ul className="space-y-2 text-gray-400">
                  {[
                    "Faith",
                    "Excellence",
                    "Integrity",
                    "Compassion",
                    "Stewardship",
                  ].map((v) => (
                    <li key={v} className="flex gap-2 items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />{" "}
                      {v}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======== Key Facts (animated stats) ======== */}
      <section
        className="relative py-24 border-t border-white/5 bg-gradient-to-b from-black to-zinc-950"
        data-reveal
      >
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-yellow-500 text-center mb-16">
            NMS Today: A Community of Growth
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { number: "435+", label: "Students enrolled" },
              { number: "250+", label: "Boarders" },
              { number: "60+", label: "Staff members" },
              { number: "35", label: "Pioneer learners" },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="group relative rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm p-8 text-center transition-all duration-500 hover:-translate-y-1 hover:border-yellow-500/40 hover:shadow-[0_20px_50px_rgba(234,179,8,0.08)]"
              >
                <p className="text-5xl font-extrabold text-yellow-500 mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </p>
                <p className="text-gray-400 text-sm font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
          <p className="text-gray-400 text-center mt-12 max-w-2xl mx-auto leading-relaxed">
            Located in Nambale, Busia County, the school sits on a secure, green
            campus with modern classrooms, dormitories, a library, a computer
            lab, and playgrounds — all built through the generosity of local and
            international partners.
          </p>
        </div>
      </section>

      {/* ======== Alumni Leadership ======== */}
      <section className="relative py-24" data-reveal>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
            <div>
              <h2 className="text-4xl font-bold text-yellow-500">
                Alumni Leadership
              </h2>
              <p className="text-gray-400 mt-2 max-w-xl text-lg">
                Meet the dedicated team steering the Nambale Magnet School
                Alumni Association — all proud graduates giving back to the
                community that shaped them.
              </p>
            </div>
            <Link
              to="/alumni/leadership"
              className="text-yellow-500 text-sm font-semibold border border-yellow-500/30 px-5 py-2.5 rounded-xl hover:bg-yellow-500 hover:text-black transition-all duration-300 whitespace-nowrap self-start sm:self-auto"
            >
              Full Team →
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {leadershipTeam.map((leader) => (
              <LeaderCard key={leader.name} leader={leader} />
            ))}
          </div>

          {/* Elections Banner */}
          <div className="mt-12 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 backdrop-blur-sm p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-start gap-4">
              <span className="text-2xl">🗳️</span>
              <div>
                <p className="text-white font-semibold text-base">
                  Next Elections: January 2026
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Leadership elections are held every two years at the Annual
                  General Meeting. All registered alumni in good standing are
                  eligible to vote and stand.
                </p>
              </div>
            </div>
            <Link
              to="/alumni/elections"
              className="text-yellow-400 text-xs font-semibold border border-yellow-500/30 px-5 py-2.5 rounded-xl hover:bg-yellow-500 hover:text-black transition-all whitespace-nowrap flex-shrink-0"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* ======== School Constitution ======== */}
      <section
        className="relative py-24 border-t border-white/5 bg-gradient-to-b from-black to-zinc-950"
        data-reveal
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-3">
            <div>
              <h2 className="text-4xl font-bold text-yellow-500">
                School Constitution
              </h2>
              <p className="text-gray-400 mt-3 max-w-2xl text-lg">
                The NMS Alumni Association is governed by a formal constitution
                ratified at the founding AGM. Download the full document below.
              </p>
            </div>

            <button
              onClick={handleFullDownload}
              disabled={fullConstitutionDownloading}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 flex-shrink-0 self-start sm:self-auto ${
                fullConstitutionDownloaded
                  ? "bg-green-600/20 border border-green-500/30 text-green-400"
                  : fullConstitutionDownloading
                    ? "bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 cursor-wait"
                    : "bg-yellow-500 text-black hover:bg-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.3)]"
              }`}
            >
              {fullConstitutionDownloading ? (
                <>
                  <svg
                    className="w-4 h-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  Preparing…
                </>
              ) : fullConstitutionDownloaded ? (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Downloaded!
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3"
                    />
                  </svg>
                  Full Constitution (PDF)
                </>
              )}
            </button>
          </div>

          <div className="border-t border-white/5 mt-8 mb-10" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {constitutionChapters.map((chapter) => (
              <ChapterCard key={chapter.id} chapter={chapter} />
            ))}
          </div>

          <p className="text-gray-500 text-xs text-center mt-10">
            Constitution last reviewed and ratified at the Annual General
            Meeting, March 2024. For queries, contact{" "}
            <a
              href="mailto:alumni@nambalemagnet.ac.ke"
              className="text-yellow-500 hover:underline"
            >
              alumni@nambalemagnet.ac.ke
            </a>
          </p>
        </div>
      </section>

      {/* ======== Alumni Connection ======== */}
      <section className="relative py-24" data-reveal>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <h2 className="text-4xl font-bold text-yellow-500 mb-8">
                The Alumni Network: A Global Family
              </h2>
              <div className="space-y-4 text-gray-400 leading-relaxed">
                <p>
                  Since its inception, NMS has nurtured thousands of students
                  who have gone on to attend top secondary schools,
                  universities, and build careers in Kenya and abroad. Our
                  alumni are teachers, engineers, doctors, entrepreneurs, and
                  community leaders.
                </p>
                <p>
                  The Nambale Magnet School Alumni Network exists to reconnect
                  former students, celebrate achievements, and give back to the
                  school that shaped us.
                </p>
                <p>
                  Alumni play a vital role in mentoring current students,
                  sponsoring scholarships, and supporting capital projects.
                  Together, we ensure that the next generation of learners has
                  the same opportunities we did — and more.
                </p>
              </div>
            </div>

            <div className="relative rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm p-8">
              <h3 className="text-2xl font-bold text-yellow-500 mb-6">
                Why Stay Connected?
              </h3>
              <ul className="space-y-3 text-gray-400">
                {[
                  "Reconnect with classmates and teachers",
                  "Mentor a current student",
                  "Attend alumni events and reunions",
                  "Support scholarships and infrastructure",
                  "Expand your professional network",
                  "Share your story to inspire others",
                ].map((item) => (
                  <li key={item} className="flex gap-3 items-center">
                    <svg
                      className="w-5 h-5 text-yellow-500 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ======== Call to Action ======== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-zinc-900 to-black border-t border-yellow-500/20 py-24">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl" />
        <div
          className="relative max-w-4xl mx-auto px-6 text-center"
          data-reveal
        >
          <h2 className="text-4xl font-extrabold text-white mb-4">
            Be Part of the Legacy
          </h2>
          <p className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto">
            Whether you're a recent graduate or an old hand, your journey
            started here. Join the alumni network today and help write the next
            chapter of Nambale Magnet School.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/auth"
              className="rounded-xl bg-yellow-500 px-8 py-4 font-bold text-black shadow-[0_0_25px_rgba(234,179,8,0.4)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(234,179,8,0.6)]"
            >
              Join the Alumni Network
            </Link>
            <Link
              to="/donations"
              className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md px-8 py-4 font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:border-yellow-500/60 hover:bg-yellow-500/10"
            >
              Give Back
            </Link>
          </div>
        </div>
      </section>

      {/* ======== Global animations & reveal styles ======== */}
      <style>{`
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
};

export default AboutUs;

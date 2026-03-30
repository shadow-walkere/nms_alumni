import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="font-sans text-gray-800">
      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-8 py-4 bg-white shadow-sm">
        <h1 className="text-lg font-bold text-blue-900">
          Nambale Magnet
          <span className="block text-xs text-gray-500">Alumni Network</span>
        </h1>

        <div className="hidden md:flex gap-8 text-sm font-medium">
          <Link to="/" className="text-yellow-500">
            Home
          </Link>
          <Link to="/alumni">Alumni Directory</Link>

          <a href="#">Events</a>
        </div>

        <div className="flex gap-3">
          <button className="border px-4 py-1 rounded-full text-sm">
            <Link to="/donations"> Donate</Link>
          </button>
          <Link
            to="/auth"
            className="bg-blue-900 text-white px-4 py-1 rounded-full text-sm"
          >
            Login
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section
        className="relative h-[520px] flex items-center justify-center text-center text-white"
        style={{
          backgroundImage:
            "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnUnxZYffigylm8RXTILcF3mSf5A5Wg-Ipmw&s')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-blue-900/80"></div>

        <div className="relative max-w-2xl px-4">
          <span className="bg-yellow-500 text-xs px-3 py-1 rounded-full text-black font-semibold">
            WELCOME HOME, ALUMNI
          </span>

          <h1 className="text-4xl md:text-5xl font-bold mt-4">
            Connecting Generations <br />
            <span className="text-yellow-400">of Excellence</span>
          </h1>

          <p className="mt-4 text-gray-200">
            Reconnect, mentor, and give back to your school community.
          </p>

          <div className="mt-6 flex justify-center gap-4">
            <button className="bg-blue-800 px-6 py-2 rounded-lg">
              Join Alumni Network
            </button>

            <Link
              to="/alumni"
              className="border px-6 py-2 rounded-lg hover:bg-white hover:text-blue-900"
            >
              Browse Directory
            </Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="px-6 -mt-14">
        <div className="bg-white rounded-xl shadow-lg grid grid-cols-2 md:grid-cols-4 text-center py-6">
          <Stat number="500+" label="Alumni" />
          <Stat number="150+" label="Success Stories" />
          <Stat number="24" label="Events" />
          <Stat number="12" label="Projects" />
        </div>
      </section>

      {/* ABOUT */}
      <section className="px-8 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-3xl font-bold">
            A Legacy of <span className="text-blue-900">Leadership</span> &{" "}
            <span className="text-yellow-500">Service</span>
          </h2>

          <p className="mt-4 text-gray-600">
            NMS continues to shape leaders and change lives through education.
          </p>

          <button className="mt-6 border px-5 py-2 rounded-lg">
            Learn More →
          </button>
        </div>

        <img
          src="https://images.unsplash.com/photo-1523240795612-9a054b0db644"
          alt=""
          className="rounded-xl shadow-lg"
        />
      </section>

      {/* CTA */}
      <section className="bg-blue-900 text-white text-center py-16">
        <h2 className="text-3xl font-bold">Make a Lasting Impact</h2>
        <p className="mt-3 text-gray-300">Support the next generation.</p>

        <button className="mt-6 bg-yellow-500 text-black px-6 py-2 rounded-lg">
          Donate Now
        </button>
      </section>

      <footer className="bg-gray-900 text-gray-300 text-center py-6 text-sm">
        © {new Date().getFullYear()} NMS Alumni Network
      </footer>
    </div>
  );
}

function Stat({ number, label }) {
  return (
    <div>
      <h3 className="text-2xl font-bold text-blue-900">{number}</h3>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}

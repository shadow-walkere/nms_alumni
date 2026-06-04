import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import {
  Home,
  Users,
  Search,
  Settings,
  TrendingUp,
  Bell,
  Plus,
  X,
  Check,
  Edit,
  Trash2,
  Download,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Award,
  Grid,
  List,
  Menu,
  Moon,
  Sun,
  User,
  Linkedin,
  Filter,
  Lock,
  LogOut,
  ChevronRight,
  ChevronLeft
} from "lucide-react";

// ─── Seeded RNG & data generation ────────────────────────────────────────────
const rng = (seed) => {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
};

const YEARS = [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026];
const DEPTS = [
  "Computer Science",
  "Business Administration",
  "Education",
  "Health Sciences",
  "Engineering",
  "Social Work",
  "Agricultural Science",
  "Communication",
  "Accounting",
  "Law"
];
const COMPANIES = [
  "Safaricom PLC",
  "Google Kenya",
  "KCB Bank",
  "Nation Media Group",
  "KEMRI",
  "M-Pesa Africa",
  "UN Kenya",
  "Equity Bank",
  "Kenya Airways",
  "Ministry of Education",
  "Self-Employed",
  "USAID Kenya",
  "East African Breweries"
];
const LOCS = [
  "Nairobi",
  "Kisumu",
  "Mombasa",
  "Eldoret",
  "Busia",
  "Kampala",
  "London",
  "Toronto",
  "Dubai",
  "Kigali",
  "Dar es Salaam",
  "Juba"
];
const JOBS = [
  "Software Engineer",
  "Teacher",
  "Registered Nurse",
  "Accountant",
  "Project Manager",
  "Entrepreneur",
  "Data Analyst",
  "Medical Doctor",
  "Legal Officer",
  "Sales Manager",
  "NGO Programme Officer",
  "University Lecturer",
  "Agricultural Officer"
];
const SKILLS_POOL = [
  "Leadership",
  "Python",
  "Public Speaking",
  "Data Analysis",
  "Research",
  "Community Dev",
  "Financial Mgmt",
  "Teaching",
  "Healthcare",
  "Software Dev",
  "Marketing",
  "Agronomy",
  "Legal Research",
  "Journalism",
  "Mentorship"
];
const FNAMES = [
  "Amara",
  "Brian",
  "Cynthia",
  "Daniel",
  "Evaline",
  "Felix",
  "Grace",
  "Hassan",
  "Irene",
  "Joel",
  "Kalinda",
  "Lawrence",
  "Mercy",
  "Nelson",
  "Olivia",
  "Patrick",
  "Queen",
  "Robert",
  "Sarah",
  "Timothy",
  "Urasula",
  "Vincent",
  "Winnie",
  "Xavier",
  "Yasmin",
  "Zack",
  "Asha",
  "Benedict",
  "Caroline",
  "David",
  "Eunice",
  "Francis",
  "Gloria",
  "Henry",
  "Immaculate",
  "James",
  "Kezia",
  "Lilian",
  "Michael",
  "Naomi"
];
const SNAMES = [
  "Odhiambo",
  "Wafula",
  "Achieng",
  "Barasa",
  "Njoroge",
  "Kimani",
  "Otieno",
  "Mwangi",
  "Chebet",
  "Koech",
  "Mutua",
  "Nzomo",
  "Wangari",
  "Kipkemoi",
  "Auma",
  "Simiyu",
  "Juma",
  "Ndirangu",
  "Kamau",
  "Ruto",
  "Wekesa",
  "Namukho",
  "Nabwire",
  "Imbahale",
  "Wanyama"
];
const BIOS = [
  "A passionate professional committed to using technology and education to drive positive change in the community.",
  "Dedicated to empowering the next generation through mentorship and community-driven initiatives.",
  "Combining academic excellence with entrepreneurial spirit to build sustainable solutions in East Africa.",
  "A results-driven individual whose foundation at NMS shaped a lifelong commitment to integrity and service.",
  "Bridging the gap between rural communities and modern opportunities through innovation and hard work."
];

let _id = 1001;
const ALUMNI_DATA = [];
YEARS.forEach((yr, yi) => {
  const counts = [14, 13, 15, 12, 16, 14, 13, 15, 14, 12, 7];
  const count = counts[yi] ?? 10;
  for (let i = 0; i < count; i++) {
    const r = rng(yr * 100 + i + 7);
    const fn = FNAMES[Math.floor(r() * FNAMES.length)];
    const sn = SNAMES[Math.floor(r() * SNAMES.length)];
    const dept = DEPTS[Math.floor(r() * DEPTS.length)];
    const skills = [...SKILLS_POOL].sort(() => r() - 0.5).slice(0, 3);
    ALUMNI_DATA.push({
      id: `NMS/${yr}/${String(_id).padStart(4, "0")}`,
      name: `${fn} ${sn}`,
      initials: `${fn[0]}${sn[0]}`,
      year: yr,
      dept,
      job: JOBS[Math.floor(r() * JOBS.length)],
      company: COMPANIES[Math.floor(r() * COMPANIES.length)],
      location: LOCS[Math.floor(r() * LOCS.length)],
      email: `${fn.toLowerCase()}.${sn.toLowerCase()}@alumni.nms.ac.ke`,
      phone: `+254 7${Math.floor(r() * 9)}${String(
        Math.floor(r() * 9999999)
      ).padStart(7, "0")}`,
      linkedin: `linkedin.com/in/${fn.toLowerCase()}-${sn.toLowerCase()}`,
      bio: BIOS[(_id - 1001) % BIOS.length],
      skills,
      status: r() > 0.2 ? "active" : r() > 0.5 ? "pending" : "inactive",
      approved: r() > 0.12,
      employed: r() > 0.15
    });
    _id++;
  }
});

// ─── Helpers ──────────────────────────────────────────────────────────────────
const PAGE_SIZE = 12;

function Avatar({ initials, size = 44 }) {
  return (
    <div
      className="flex items-center justify-center font-serif text-white font-bold rounded-full bg-gradient-to-br from-zinc-850 to-zinc-950 border border-zinc-800 shadow-inner flex-shrink-0"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.35,
        letterSpacing: "0.05em"
      }}
    >
      {initials}
    </div>
  );
}

function StatusPill({ status }) {
  const map = {
    active: {
      border: "border-zinc-800",
      bg: "bg-zinc-900/30",
      text: "text-zinc-200",
      dot: "bg-white",
      label: "Active"
    },
    pending: {
      border: "border-dashed border-zinc-800",
      bg: "bg-transparent",
      text: "text-zinc-400",
      dot: "bg-zinc-600",
      label: "Pending"
    },
    inactive: {
      border: "border-zinc-950",
      bg: "bg-transparent",
      text: "text-zinc-600",
      dot: "bg-zinc-800",
      label: "Inactive"
    }
  };
  const s = map[status] || map.inactive;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide border ${s.border} ${s.bg} ${s.text}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${s.dot} ${
          status === "active" ? "animate-pulse" : ""
        }`}
      />
      {s.label}
    </span>
  );
}

// ─── Motion Helper Components ──────────────────────────────────────────────────

// 1. Ambient Background Orb Tracker
function AmbientBackground({ stars }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* Dynamic Ambient Orb */}
      <motion.div
        className="absolute rounded-full w-[450px] h-[450px] bg-white/[0.015] blur-[120px]"
        animate={{
          x: mousePos.x - 225,
          y: mousePos.y - 225
        }}
        transition={{ type: "spring", stiffness: 45, damping: 25, mass: 0.15 }}
      />
      
      {/* Stars Layer */}
      {stars && (
        <div
          className="absolute inset-0 opacity-[0.025] mix-blend-screen bg-repeat"
          style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/stardust.png')` }}
        />
      )}

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.006)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.006)_1px,transparent_1px)] bg-[size:50px_50px] opacity-50" />
    </div>
  );
}

// 2. Scroll Reveal Transition Wrapper
function ScrollReveal({ children, delay = 0, yOffset = 15 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay, ease: [0.215, 0.61, 0.355, 1] }}
    >
      {children}
    </motion.div>
  );
}

// 3. High-Fidelity Magnetic Button Component
function MagneticButton({ children, className, onClick, type = "button", disabled = false }) {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    setPosition({ x: x * 0.14, y: y * 0.14 });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 140, damping: 14, mass: 0.1 }}
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={className}
      whileTap={{ scale: 0.97 }}
    >
      {children}
    </motion.button>
  );
}

// ─── Auth Screen ──────────────────────────────────────────────────────────────
function AuthScreen({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [role, setRole] = useState("alumni");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(role);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      <AmbientBackground stars={true} />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-zinc-950 border border-zinc-900 rounded-2xl inline-flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(255,255,255,0.015)]">
            <span className="font-serif text-3xl font-bold text-white">N</span>
          </div>
          <h2 className="font-serif text-2xl font-light tracking-wide text-white">
            Nambale Magnet School
          </h2>
          <p className="text-xs text-zinc-500 mt-1 uppercase tracking-widest font-semibold">
            Alumni Network
          </p>
        </div>

        <div className="bg-[#050505] border border-zinc-900 rounded-2xl p-8 shadow-[0_30px_70px_rgba(0,0,0,0.8),0_0_30px_rgba(255,255,255,0.01)]">
          <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-1 flex gap-1 mb-6">
            {["login", "register"].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all duration-300 ${
                  mode === m
                    ? "bg-zinc-900 text-white shadow-[0_0_10px_rgba(255,255,255,0.02)]"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {m === "login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-[10px] font-bold text-zinc-500 block mb-2 uppercase tracking-wider">
                Role
              </label>
              <div className="flex gap-3">
                {["alumni", "admin"].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`flex-1 py-2.5 rounded-lg border text-xs font-bold transition-all duration-300 ${
                      role === r
                        ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                        : "bg-transparent text-zinc-400 border-zinc-900 hover:border-zinc-700 hover:text-white"
                    }`}
                  >
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-zinc-500 block mb-2 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-600">
                  <Mail size={14} />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-zinc-900 bg-black text-sm text-white placeholder-zinc-700 outline-none transition-all duration-300 focus:border-zinc-700 focus:shadow-[0_0_15px_rgba(255,255,255,0.03)]"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-zinc-500 block mb-2 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-600">
                  <Lock size={14} />
                </span>
                <input
                  type="password"
                  required
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-zinc-900 bg-black text-sm text-white placeholder-zinc-700 outline-none transition-all duration-300 focus:border-zinc-700 focus:shadow-[0_0_15px_rgba(255,255,255,0.03)]"
                />
              </div>
            </div>

            <MagneticButton
              type="submit"
              className="w-full py-3 rounded-lg bg-white hover:bg-zinc-200 text-black font-semibold text-xs tracking-wider uppercase transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.05)] mt-6"
            >
              {mode === "login" ? "SIGN IN" : "CREATE ACCOUNT"}
            </MagneticButton>
          </form>

          <p className="text-center text-[11px] text-zinc-600 mt-6 italic">
            "Live, that there may be Life"
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Alumni Card ──────────────────────────────────────────────────────────────
function AlumniCard({ a, onClick }) {
  return (
    <motion.div
      whileHover={{
        y: -4,
        borderColor: "rgba(255,255,255,0.15)",
        boxShadow: "0 15px 30px rgba(0,0,0,0.8), 0 0 20px rgba(255,255,255,0.02)"
      }}
      onClick={() => onClick(a)}
      className="bg-[#050505] border border-zinc-900 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 flex flex-col justify-between"
    >
      <div className="h-1 bg-gradient-to-r from-zinc-800 via-zinc-550 to-zinc-850" />
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="flex gap-4 items-start mb-4">
          <Avatar initials={a.initials} size={46} />
          <div className="flex-1 min-w-0">
            <h4 className="font-serif text-base font-bold text-white truncate">
              {a.name}
            </h4>
            <p className="text-[10px] text-zinc-500 mt-0.5 tracking-wide">
              {a.id}
            </p>
            <span className="inline-block mt-2 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800/80 text-[10px] font-bold text-zinc-300">
              Class of {a.year}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2 my-2">
          <div className="flex items-center gap-2.5 text-xs text-zinc-400">
            <Briefcase size={12} className="text-zinc-600" />
            <span className="truncate">
              {a.job} · {a.company}
            </span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-zinc-400">
            <MapPin size={12} className="text-zinc-600" />
            <span className="truncate">{a.location}</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-zinc-400">
            <Award size={12} className="text-zinc-600" />
            <span className="truncate">{a.dept}</span>
          </div>
        </div>
      </div>

      <div className="px-5 py-3.5 border-t border-zinc-900/80 bg-zinc-950 flex items-center justify-between">
        <div className="flex gap-1.5 flex-wrap">
          {a.skills.slice(0, 2).map((s) => (
            <span
              key={s}
              className="px-2 py-0.5 bg-zinc-900 border border-zinc-900/60 rounded text-[9px] text-zinc-400 font-medium"
            >
              {s}
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          {[
            { icon: Mail, title: "Email" },
            { icon: Linkedin, title: "LinkedIn" }
          ].map((sc, idx) => {
            const Icon = sc.icon;
            return (
              <div
                key={idx}
                title={sc.title}
                className="w-7 h-7 rounded-lg border border-zinc-900 bg-zinc-950 hover:border-zinc-700 hover:text-white flex items-center justify-center text-zinc-500 transition-colors duration-200"
              >
                <Icon size={12} />
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Profile Modal ────────────────────────────────────────────────────────────
function ProfileModal({ a, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/90 backdrop-blur-md"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-[#050505] border border-zinc-900 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative z-10 flex flex-col max-h-[90vh]"
      >
        <div className="p-8 border-b border-zinc-900 bg-zinc-950 flex flex-col md:flex-row gap-6 items-start md:items-end justify-between relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700 text-zinc-400 hover:text-white rounded-lg p-2 transition-all duration-300"
          >
            <X size={16} />
          </button>

          <div className="flex gap-5 items-center">
            <Avatar initials={a.initials} size={72} />
            <div>
              <h3 className="font-serif text-2xl font-bold text-white">
                {a.name}
              </h3>
              <p className="text-sm text-zinc-400 mt-1">
                {a.job} · {a.company}
              </p>
              <p className="text-xs text-zinc-600 mt-1">
                Class of {a.year} · {a.id}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <StatusPill status={a.status} />
          </div>
        </div>

        <div className="p-8 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider border-b border-zinc-900 pb-2">
                Contact Information
              </h4>
              <div className="space-y-3">
                <div>
                  <span className="text-[10px] text-zinc-600 block uppercase font-semibold">
                    Email
                  </span>
                  <a
                    href={`mailto:${a.email}`}
                    className="text-sm text-zinc-300 hover:text-white transition-colors"
                  >
                    {a.email}
                  </a>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-600 block uppercase font-semibold">
                    Phone
                  </span>
                  <span className="text-sm text-zinc-300">{a.phone}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-600 block uppercase font-semibold">
                    Location
                  </span>
                  <span className="text-sm text-zinc-300">{a.location}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-600 block uppercase font-semibold">
                    LinkedIn
                  </span>
                  <a
                    href={`https://${a.linkedin}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-1"
                  >
                    <Linkedin size={12} /> {a.linkedin.split("/").pop()}
                  </a>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider border-b border-zinc-900 pb-2">
                Academic & Professional
              </h4>
              <div className="space-y-3">
                <div>
                  <span className="text-[10px] text-zinc-600 block uppercase font-semibold">
                    Department
                  </span>
                  <span className="text-sm text-zinc-300">{a.dept}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-600 block uppercase font-semibold">
                    Graduation Year
                  </span>
                  <span className="text-sm text-zinc-300">{a.year}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-600 block uppercase font-semibold">
                    Current Role
                  </span>
                  <span className="text-sm text-zinc-300">{a.job}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-600 block uppercase font-semibold">
                    Organisation
                  </span>
                  <span className="text-sm text-zinc-300">{a.company}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider border-b border-zinc-900 pb-2">
              About
            </h4>
            <p className="text-sm text-zinc-400 leading-relaxed font-light">
              {a.bio}
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider border-b border-zinc-900 pb-2">
              Skills & Interests
            </h4>
            <div className="flex flex-wrap gap-2">
              {a.skills.map((s) => (
                <span
                  key={s}
                  className="px-3 py-1 rounded-lg bg-zinc-950 border border-zinc-900 text-xs text-zinc-400 hover:border-zinc-800 hover:text-white transition-all duration-300"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-zinc-900 bg-zinc-950/80 flex gap-3 justify-end">
          <a
            href={`mailto:${a.email}`}
            className="px-5 py-2.5 rounded-lg bg-white hover:bg-zinc-200 text-black font-semibold text-xs transition-all duration-300 inline-flex items-center gap-2"
          >
            <Mail size={13} /> Send Email
          </a>
          <a
            href={`https://${a.linkedin}`}
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2.5 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-transparent text-zinc-300 hover:text-white font-semibold text-xs transition-all duration-300 inline-flex items-center gap-2"
          >
            <Linkedin size={13} /> Connect
          </a>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Custom Bar Chart Component ──────────────────────────────────────────────
function ChartBar({ label, value, maxVal }) {
  const percentage = maxVal > 0 ? (value / maxVal) * 100 : 0;
  return (
    <div className="group flex flex-col gap-1.5 w-full">
      <div className="flex justify-between text-[11px] font-semibold text-zinc-400">
        <span className="truncate max-w-[80%]">{label}</span>
        <span className="text-white font-bold group-hover:scale-105 transition-transform">
          {value}
        </span>
      </div>
      <div className="h-3 w-full bg-zinc-950 border border-zinc-900/60 rounded-full overflow-hidden relative">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-zinc-800 via-zinc-400 to-zinc-100 rounded-full relative"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
        </motion.div>
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard({ data }) {
  const total = data.length;
  const active = data.filter((a) => a.status === "active").length;
  const employed = data.filter((a) => a.employed).length;
  const perYear = YEARS.map((y) => ({
    y,
    n: data.filter((a) => a.year === y).length
  }));
  const maxN = Math.max(...perYear.map((p) => p.n), 1);

  const jobCounts = JOBS.map((j) => ({
    j,
    n: data.filter((a) => a.job === j).length
  }));
  const maxJobCount = Math.max(...jobCounts.map((jc) => jc.n), 1);

  const statCards = [
    { label: "Total Alumni", val: total },
    { label: "Active Members", val: active },
    { label: "Classes", val: YEARS.length },
    { label: "Employment Rate", val: `${Math.round((employed / total) * 100)}%` }
  ];

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={{
        animate: { transition: { staggerChildren: 0.05 } }
      }}
      className="space-y-8"
    >
      <div>
        <h2 className="font-serif text-3xl font-light text-white tracking-wide">
          Dashboard
        </h2>
        <p className="text-xs text-zinc-500 mt-1">
          Nambale Magnet School · Alumni Network Overview
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((s, i) => (
          <ScrollReveal key={i} delay={i * 0.05} yOffset={10}>
            <motion.div
              whileHover={{
                y: -2,
                borderColor: "rgba(255,255,255,0.1)",
                boxShadow: "0 10px 20px rgba(0,0,0,0.7), 0 0 15px rgba(255,255,255,0.01)"
              }}
              className="bg-[#050505] border border-zinc-900 rounded-xl p-6 relative overflow-hidden transition-all duration-300"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/20" />
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">
                {s.label}
              </div>
              <div className="font-serif text-3xl font-bold text-white tracking-tight leading-none">
                {s.val}
              </div>
            </motion.div>
          </ScrollReveal>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graduating Class Chart */}
        <ScrollReveal delay={0.15}>
          <div className="bg-[#050505] border border-zinc-900 rounded-xl p-6 shadow-xl space-y-6">
            <div>
              <h3 className="font-serif text-lg font-bold text-white">
                Alumni per Graduating Class
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Distribution of alumni by cohort
              </p>
            </div>
            <div className="space-y-4">
              {perYear.map((p) => (
                <ChartBar
                  key={p.y}
                  label={`Class of ${p.y}`}
                  value={p.n}
                  maxVal={maxN}
                />
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Employment by Sector Chart */}
        <ScrollReveal delay={0.2}>
          <div className="bg-[#050505] border border-zinc-900 rounded-xl p-6 shadow-xl space-y-6">
            <div>
              <h3 className="font-serif text-lg font-bold text-white">
                Employment by Sector
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Top occupational distributions
              </p>
            </div>
            <div className="space-y-4">
              {JOBS.slice(0, 7).map((j) => {
                const n = data.filter((a) => a.job === j).length;
                return (
                  <ChartBar
                    key={j}
                    label={j}
                    value={n}
                    maxVal={maxJobCount}
                  />
                );
              })}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </motion.div>
  );
}

// ─── Directory View ───────────────────────────────────────────────────────────
function Directory({ data }) {
  const [search, setSearch] = useState("");
  const [classF, setClassF] = useState("all");
  const [deptF, setDeptF] = useState("all");
  const [locF, setLocF] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("name");
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    let r = data.filter((a) => a.approved);
    if (classF !== "all") r = r.filter((a) => a.year === +classF);
    if (deptF !== "all") r = r.filter((a) => a.dept === deptF);
    if (locF !== "all") r = r.filter((a) => a.location === locF);
    if (search) {
      const q = search.toLowerCase();
      r = r.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.dept.toLowerCase().includes(q) ||
          a.company.toLowerCase().includes(q) ||
          String(a.year).includes(q) ||
          a.job.toLowerCase().includes(q) ||
          a.location.toLowerCase().includes(q)
      );
    }
    return [...r].sort((a, b) =>
      sortBy === "name" ? a.name.localeCompare(b.name) : a.year - b.year
    );
  }, [data, classF, deptF, locF, search, sortBy]);

  useEffect(() => setPage(1), [classF, deptF, locF, search, sortBy]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-serif text-3xl font-light text-white tracking-wide">
            Alumni Directory
          </h2>
          <p className="text-xs text-zinc-500 mt-1">
            {filtered.length} alumni · All graduating classes
          </p>
        </div>
        <div className="flex gap-3 items-center self-start sm:self-auto">
          <div className="bg-zinc-950 border border-zinc-900 rounded-lg p-1 flex gap-1">
            {[
              { mode: "grid", icon: Grid },
              { mode: "list", icon: List }
            ].map((v) => {
              const Icon = v.icon;
              return (
                <button
                  key={v.mode}
                  onClick={() => setViewMode(v.mode)}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === v.mode
                      ? "bg-zinc-900 text-white shadow-sm"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  <Icon size={14} />
                </button>
              );
            })}
          </div>
          <MagneticButton className="px-4 py-2 text-xs font-semibold rounded-lg border border-zinc-900 hover:border-zinc-700 bg-[#050505] text-zinc-300 hover:text-white transition-all flex items-center gap-2">
            <Download size={13} /> Export
          </MagneticButton>
        </div>
      </div>

      {/* Class tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {["all", ...YEARS.map(String)].map((y) => (
          <button
            key={y}
            onClick={() => setClassF(y)}
            title={`Class of ${y}`}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-all duration-300 ${
              classF === y
                ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.06)]"
                : "bg-transparent text-zinc-400 border-zinc-900 hover:border-zinc-700 hover:text-white"
            }`}
          >
            {y === "all" ? "All Classes" : y}
          </button>
        ))}
      </div>

      {/* Filters Bar */}
      <div className="bg-[#050505] border border-zinc-900 rounded-xl p-4 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-600">
            <Search size={14} />
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, company, job..."
            className="w-full pl-9 pr-4 py-2 bg-black border border-zinc-900 rounded-lg text-xs text-white placeholder-zinc-700 outline-none focus:border-zinc-700 focus:shadow-[0_0_15px_rgba(255,255,255,0.02)] transition-all"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <select
            value={deptF}
            onChange={(e) => setDeptF(e.target.value)}
            className="bg-black border border-zinc-900 rounded-lg px-3 py-2 text-xs text-zinc-400 outline-none cursor-pointer focus:border-zinc-700 hover:text-white transition-all"
          >
            <option value="all">All Departments</option>
            {DEPTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <select
            value={locF}
            onChange={(e) => setLocF(e.target.value)}
            className="bg-black border border-zinc-900 rounded-lg px-3 py-2 text-xs text-zinc-400 outline-none cursor-pointer focus:border-zinc-700 hover:text-white transition-all"
          >
            <option value="all">All Locations</option>
            {LOCS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-black border border-zinc-900 rounded-lg px-3 py-2 text-xs text-zinc-400 outline-none cursor-pointer focus:border-zinc-700 hover:text-white transition-all"
          >
            <option value="name">Sort: Name</option>
            <option value="year">Sort: Year</option>
          </select>
        </div>
      </div>

      {/* Grid or List Views */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {pageData.length ? (
            pageData.map((a, idx) => (
              <ScrollReveal key={a.id} delay={(idx % 4) * 0.05} yOffset={15}>
                <AlumniCard a={a} onClick={setSelected} />
              </ScrollReveal>
            ))
          ) : (
            <div className="col-span-full py-20 text-center border border-dashed border-zinc-900 rounded-xl">
              <Users size={36} className="mx-auto text-zinc-800 mb-3" />
              <p className="text-zinc-600 text-sm font-medium">
                No alumni match your filters
              </p>
            </div>
          )}
        </div>
      ) : (
        <ScrollReveal delay={0.05}>
          <div className="bg-[#050505] border border-zinc-900 rounded-xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-zinc-950/80 border-b border-zinc-900">
                    {["", "Name", "Class", "Department", "Role", "Location", "Status"].map((h) => (
                      <th
                        key={h}
                        className="px-6 py-4 text-left text-[10px] font-bold text-zinc-500 uppercase tracking-wider whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900/60">
                  {pageData.length ? (
                    pageData.map((a) => (
                      <tr
                        key={a.id}
                        onClick={() => setSelected(a)}
                        className="hover:bg-zinc-900/20 cursor-pointer transition-colors duration-200"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Avatar initials={a.initials} size={30} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-white">
                          {a.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400">
                          {a.year}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400">
                          {a.dept}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400">
                          {a.job}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400">
                          {a.location}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusPill status={a.status} />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-20 text-center text-zinc-600 text-sm font-medium">
                        No alumni match your filters
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </ScrollReveal>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="w-9 h-9 rounded-lg border border-zinc-900 hover:border-zinc-700 bg-[#050505] text-zinc-400 hover:text-white flex items-center justify-center disabled:opacity-40 disabled:hover:border-zinc-900 transition-all duration-200"
          >
            <ChevronLeft size={16} />
          </button>
          {[...Array(Math.min(totalPages, 8))].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-9 h-9 rounded-lg border text-xs font-semibold transition-all duration-200 ${
                page === i + 1
                  ? "bg-white text-black border-white shadow-sm"
                  : "bg-transparent text-zinc-400 border-zinc-900 hover:border-zinc-700 hover:text-white"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="w-9 h-9 rounded-lg border border-zinc-900 hover:border-zinc-700 bg-[#050505] text-zinc-400 hover:text-white flex items-center justify-center disabled:opacity-40 disabled:hover:border-zinc-900 transition-all duration-200"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      <AnimatePresence>
        {selected && (
          <ProfileModal a={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Registration Form ─────────────────────────────────────────────────────────
function RegisterForm() {
  const [form, setForm] = useState({
    name: "",
    dept: "",
    year: "2026",
    job: "",
    company: "",
    location: "",
    email: "",
    phone: "",
    linkedin: "",
    bio: "",
    skills: ""
  });
  const [done, setDone] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  if (done)
    return (
      <div className="py-20 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-zinc-950 border border-zinc-900 rounded-full flex items-center justify-center mb-6 shadow-inner">
          <Check size={28} className="text-white" />
        </div>
        <h3 className="font-serif text-2xl font-bold text-white mb-2">
          Registration Submitted!
        </h3>
        <p className="text-zinc-500 text-xs max-w-sm leading-relaxed">
          Your profile is pending admin approval. You'll be notified once it's
          live in the directory.
        </p>
        <MagneticButton
          onClick={() => setDone(false)}
          className="mt-8 px-6 py-2.5 rounded-lg bg-white hover:bg-zinc-200 text-black font-semibold text-xs transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.05)]"
        >
          Register Another
        </MagneticButton>
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div>
        <h2 className="font-serif text-3xl font-light text-white tracking-wide">
          Alumni Registration
        </h2>
        <p className="text-xs text-zinc-500 mt-1">
          Submit your profile to join the NMS alumni directory
        </p>
      </div>

      <div className="bg-[#050505] border border-zinc-900 rounded-2xl p-8 max-w-3xl shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { k: "name", label: "Full Name *", placeholder: "Amara Odhiambo" },
            { k: "email", label: "Email Address *", placeholder: "you@example.com" },
            { k: "phone", label: "Phone Number", placeholder: "+254 7XX XXX XXX" },
            { k: "linkedin", label: "LinkedIn URL", placeholder: "linkedin.com/in/yourname" }
          ].map(({ k, label, placeholder }) => (
            <div key={k}>
              <label className="text-[10px] font-bold text-zinc-500 block mb-2 uppercase tracking-wider">
                {label}
              </label>
              <input
                value={form[k]}
                onChange={set(k)}
                placeholder={placeholder}
                className="w-full px-4 py-2.5 bg-black border border-zinc-900 rounded-lg text-xs text-white placeholder-zinc-700 outline-none focus:border-zinc-700 focus:shadow-[0_0_15px_rgba(255,255,255,0.02)] transition-all"
              />
            </div>
          ))}
          <div>
            <label className="text-[10px] font-bold text-zinc-500 block mb-2 uppercase tracking-wider">
              Department *
            </label>
            <select
              value={form.dept}
              onChange={set("dept")}
              className="w-full px-4 py-2.5 bg-black border border-zinc-900 rounded-lg text-xs text-zinc-400 outline-none cursor-pointer focus:border-zinc-700 transition-all"
            >
              <option value="">Select department</option>
              {DEPTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold text-zinc-500 block mb-2 uppercase tracking-wider">
              Graduation Year *
            </label>
            <select
              value={form.year}
              onChange={set("year")}
              className="w-full px-4 py-2.5 bg-black border border-zinc-900 rounded-lg text-xs text-zinc-400 outline-none cursor-pointer focus:border-zinc-700 transition-all"
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold text-zinc-500 block mb-2 uppercase tracking-wider">
              Current Job Title
            </label>
            <input
              value={form.job}
              onChange={set("job")}
              placeholder="e.g. Software Engineer"
              className="w-full px-4 py-2.5 bg-black border border-zinc-900 rounded-lg text-xs text-white placeholder-zinc-700 outline-none focus:border-zinc-700 focus:shadow-[0_0_15px_rgba(255,255,255,0.02)] transition-all"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-zinc-500 block mb-2 uppercase tracking-wider">
              Company / Organisation
            </label>
            <input
              value={form.company}
              onChange={set("company")}
              placeholder="e.g. Safaricom"
              className="w-full px-4 py-2.5 bg-black border border-zinc-900 rounded-lg text-xs text-white placeholder-zinc-700 outline-none focus:border-zinc-700 focus:shadow-[0_0_15px_rgba(255,255,255,0.02)] transition-all"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-zinc-500 block mb-2 uppercase tracking-wider">
              Location
            </label>
            <select
              value={form.location}
              onChange={set("location")}
              className="w-full px-4 py-2.5 bg-black border border-zinc-900 rounded-lg text-xs text-zinc-400 outline-none cursor-pointer focus:border-zinc-700 transition-all"
            >
              <option value="">Select city</option>
              {LOCS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold text-zinc-500 block mb-2 uppercase tracking-wider">
              Skills & Interests
            </label>
            <input
              value={form.skills}
              onChange={set("skills")}
              placeholder="e.g. Leadership, Python, Mentorship"
              className="w-full px-4 py-2.5 bg-black border border-zinc-900 rounded-lg text-xs text-white placeholder-zinc-700 outline-none focus:border-zinc-700 focus:shadow-[0_0_15px_rgba(255,255,255,0.02)] transition-all"
            />
          </div>
          <div className="grid-cols-1 md:col-span-2">
            <label className="text-[10px] font-bold text-zinc-500 block mb-2 uppercase tracking-wider">
              Short Bio
            </label>
            <textarea
              value={form.bio}
              onChange={set("bio")}
              placeholder="Tell us about your journey since graduating from NMS..."
              rows={4}
              className="w-full px-4 py-2.5 bg-black border border-zinc-900 rounded-lg text-xs text-white placeholder-zinc-700 outline-none focus:border-zinc-700 focus:shadow-[0_0_15px_rgba(255,255,255,0.02)] transition-all resize-none"
            />
          </div>
        </div>
        <div className="flex gap-3 mt-8">
          <MagneticButton
            onClick={() => {
              if (form.name && form.email) setDone(true);
            }}
            className="px-6 py-2.5 rounded-lg bg-white hover:bg-zinc-200 text-black font-semibold text-xs transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.05)]"
          >
            Submit Profile
          </MagneticButton>
          <button
            onClick={() =>
              setForm({
                name: "",
                dept: "",
                year: "2026",
                job: "",
                company: "",
                location: "",
                email: "",
                phone: "",
                linkedin: "",
                bio: "",
                skills: ""
              })
            }
            className="px-6 py-2.5 rounded-lg border border-zinc-900 hover:border-zinc-700 bg-transparent text-zinc-400 hover:text-white font-semibold text-xs transition-all duration-300"
          >
            Reset Form
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Admin Panel ──────────────────────────────────────────────────────────────
function AdminPanel({ data, onApprove, onDelete }) {
  const [tab, setTab] = useState("pending");
  const pending = data.filter((a) => !a.approved);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div>
        <h2 className="font-serif text-3xl font-light text-white tracking-wide">
          Admin Control
        </h2>
        <p className="text-xs text-zinc-500 mt-1">
          Manage alumni records, approvals, and exports
        </p>
      </div>

      <div className="flex border-b border-zinc-900 gap-6">
        {[
          { id: "pending", label: `Pending (${pending.length})` },
          { id: "all", label: "All Records" },
          { id: "export", label: "Export Data" }
        ].map((tab_) => (
          <button
            key={tab_.id}
            onClick={() => setTab(tab_.id)}
            className={`pb-3 text-xs font-semibold transition-all relative ${
              tab === tab_.id ? "text-white" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {tab_.label}
            {tab === tab_.id && (
              <motion.div
                layoutId="adminTabUnderline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
              />
            )}
          </button>
        ))}
      </div>

      {tab === "pending" && (
        <ScrollReveal delay={0.05}>
          <div className="bg-[#050505] border border-zinc-900 rounded-xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-zinc-950/80 border-b border-zinc-900">
                    {["Name", "ID", "Year", "Department", "Status", "Actions"].map(
                      (h) => (
                        <th
                          key={h}
                          className="px-6 py-4 text-left text-[10px] font-bold text-zinc-500 uppercase tracking-wider"
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900/60">
                  {pending.length ? (
                    pending.map((a) => (
                      <tr key={a.id} className="hover:bg-zinc-900/10">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-white">
                          {a.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-zinc-500">
                          {a.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400">
                          {a.year}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400">
                          {a.dept}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusPill status="pending" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex gap-2">
                            <button
                              onClick={() => onApprove(a.id)}
                              className="px-3 py-1.5 rounded-lg bg-white hover:bg-zinc-200 text-black text-[11px] font-semibold transition-all flex items-center gap-1"
                            >
                              <Check size={11} /> Approve
                            </button>
                            <button
                              onClick={() => onDelete(a.id)}
                              className="px-3 py-1.5 rounded-lg border border-zinc-950 hover:border-zinc-800 bg-transparent text-zinc-500 hover:text-zinc-200 text-[11px] font-semibold transition-all flex items-center gap-1"
                            >
                              <Trash2 size={11} /> Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-12 text-center text-zinc-500 text-sm font-medium"
                      >
                        ✓ No pending approvals
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </ScrollReveal>
      )}

      {tab === "all" && (
        <ScrollReveal delay={0.05}>
          <div className="bg-[#050505] border border-zinc-900 rounded-xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-zinc-950/80 border-b border-zinc-900">
                    {["", "Name", "Year", "Department", "Location", "Status", "Actions"].map(
                      (h) => (
                        <th
                          key={h}
                          className="px-6 py-4 text-left text-[10px] font-bold text-zinc-500 uppercase tracking-wider"
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900/60">
                  {data.slice(0, 20).map((a) => (
                    <tr key={a.id} className="hover:bg-zinc-900/10">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Avatar initials={a.initials} size={28} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-white">
                        {a.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400">
                        {a.year}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400">
                        {a.dept}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400">
                        {a.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusPill status={a.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <button className="p-1.5 rounded-md border border-zinc-900 hover:border-zinc-700 text-zinc-500 hover:text-white transition-all">
                            <Edit size={12} />
                          </button>
                          <button
                            onClick={() => onDelete(a.id)}
                            className="p-1.5 rounded-md border border-zinc-900 hover:border-zinc-800 text-zinc-500 hover:text-white transition-all"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </ScrollReveal>
      )}

      {tab === "export" && (
        <div className="space-y-6">
          <p className="text-zinc-500 text-xs">
            {data.length} total records available for export. Select a format
            below.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { label: "Export as CSV", note: "Excel / Google Sheets compatible" },
              { label: "Export as Excel", note: "Full spreadsheet formatting" },
              { label: "Export as PDF", note: "Print-ready alumni roster" }
            ].map((ex, idx) => (
              <ScrollReveal key={idx} delay={idx * 0.05} yOffset={10}>
                <div className="bg-[#050505] border border-zinc-900 rounded-xl p-6 text-center space-y-4">
                  <MagneticButton className="w-full py-2.5 rounded-lg bg-white hover:bg-zinc-200 text-black font-semibold text-xs transition-all flex items-center justify-center gap-2">
                    <Download size={13} /> {ex.label}
                  </MagneticButton>
                  <p className="text-[10px] text-zinc-600">{ex.note}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [stars, setStars] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [role, setRole] = useState("alumni");
  const [view, setView] = useState("dashboard");
  const [data, setData] = useState(ALUMNI_DATA);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Reference container for Scroll Progress tracking
  const mainContentRef = useRef(null);
  const { scrollYProgress } = useScroll({ container: mainContentRef });

  const approve = useCallback(
    (id) =>
      setData((d) =>
        d.map((a) =>
          a.id === id ? { ...a, approved: true, status: "active" } : a
        )
      ),
    []
  );
  const del = useCallback(
    (id) => setData((d) => d.filter((a) => a.id !== id)),
    []
  );

  if (!authed)
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=Nunito+Sans:wght@300;400;600;700&display=swap');
          * { box-sizing: border-box; margin: 0; padding: 0; }
        `}</style>
        <AuthScreen onLogin={(r) => {
          setRole(r);
          setAuthed(true);
        }} />
      </>
    );

  const pending = data.filter((a) => !a.approved).length;
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "directory", label: "Directory", icon: Users },
    { id: "register", label: "Self-Register", icon: User },
    ...(role === "admin"
      ? [{ id: "admin", label: "Admin Panel", icon: Settings, badge: pending }]
      : [])
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=Nunito+Sans:wght@300;400;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #27272a; border-radius: 10px; }
        body { font-family: 'Nunito Sans', sans-serif; background-color: #000; color: #fff; }
        @media(max-width: 768px) {
          .sidebar-el { transform: translateX(-240px); }
          .sidebar-el.open { transform: translateX(0); }
          .main-el { margin-left: 0 !important; }
        }
      `}</style>

      {/* Main Layout Grid */}
      <div className="min-h-screen bg-black flex relative overflow-hidden text-zinc-100 font-sans selection:bg-white selection:text-black">
        
        {/* Ambient Background with Cursor Orb and Dotted Mesh */}
        <AmbientBackground stars={stars} />

        {/* Sidebar */}
        <aside
          className={`sidebar-el fixed top-0 left-0 h-screen w-60 bg-[#020202] border-r border-zinc-900/80 flex flex-col z-40 transition-transform duration-300 ease-in-out md:translate-x-0 ${
            sidebarOpen ? "open" : ""
          }`}
        >
          <div className="p-6 border-b border-zinc-900/85 flex items-center gap-3">
            <div className="w-9 h-9 bg-zinc-950 border border-zinc-900 rounded-lg flex items-center justify-center shadow-inner flex-shrink-0">
              <span className="font-serif text-lg font-bold text-white">N</span>
            </div>
            <div className="min-w-0">
              <div className="text-white text-xs font-bold tracking-wide truncate">
                NMS Alumni
              </div>
              <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest truncate mt-0.5">
                Magnet Network
              </div>
            </div>
          </div>

          <div className="flex-grow py-6 px-4 space-y-6 overflow-y-auto custom-scrollbar">
            <div>
              <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider px-3 mb-2">
                Navigation
              </div>
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = view === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setView(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all relative ${
                        isActive
                          ? "text-white bg-zinc-900/60 shadow-[inset_0_0_10px_rgba(255,255,255,0.015)] border-l-2 border-white pl-2.5"
                          : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/20"
                      }`}
                    >
                      <Icon size={14} />
                      <span className="truncate">{item.label}</span>
                      {item.badge > 0 && (
                        <span className="ml-auto bg-white text-black text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div>
              <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider px-3 mb-2">
                Graduation Cohorts
              </div>
              <div className="space-y-0.5 max-h-48 overflow-y-auto custom-scrollbar">
                {YEARS.map((y) => (
                  <button
                    key={y}
                    onClick={() => {
                      setView("directory");
                      setTimeout(() => {
                        const targetBtn = document.querySelector(`button[title="Class of ${y}"]`);
                        if (targetBtn) targetBtn.click();
                      }, 50);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-1.5 rounded-md text-[11px] text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/10 transition-colors"
                  >
                    <span className="w-5 h-5 rounded bg-zinc-950 border border-zinc-900 flex items-center justify-center text-[9px] font-bold text-zinc-400">
                      {String(y).slice(2)}
                    </span>
                    <span className="truncate">Class of {y}</span>
                    <span className="ml-auto text-[9px] text-zinc-600 font-bold">
                      {data.filter((a) => a.year === y).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-zinc-900 bg-zinc-950/40 flex items-center gap-3 justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold text-xs text-white">
                {role === "admin" ? "AD" : "AL"}
              </div>
              <div className="min-w-0">
                <div className="text-white text-xs font-bold truncate">
                  {role === "admin" ? "Administrator" : "Alumnus Profile"}
                </div>
                <div className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">
                  {role}
                </div>
              </div>
            </div>
            <button
              onClick={() => setAuthed(false)}
              title="Sign Out"
              className="p-1.5 rounded-md hover:bg-zinc-900 text-zinc-500 hover:text-white transition-colors"
            >
              <LogOut size={14} />
            </button>
          </div>
        </aside>

        {/* Backdrop for mobile sidebar */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="md:hidden fixed inset-0 bg-black/60 z-30 backdrop-blur-xs"
          />
        )}

        {/* Main Content Area */}
        <div
          className={`flex-grow min-h-screen flex flex-col transition-all duration-300 relative z-10 ${
            sidebarOpen ? "md:ml-60" : "ml-0"
          }`}
        >
          {/* Header */}
          <header className="h-16 bg-black/80 backdrop-blur-md border-b border-zinc-900/60 px-6 flex items-center justify-between sticky top-0 z-20">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-1.5 rounded-lg border border-zinc-900 hover:border-zinc-700 bg-[#050505] text-zinc-400 hover:text-white transition-colors"
              >
                <Menu size={16} />
              </button>
              <span className="font-serif text-sm font-bold text-white tracking-wider uppercase">
                {
                  {
                    dashboard: "Dashboard",
                    directory: "Alumni Directory",
                    register: "Self-Register",
                    admin: "Admin Control"
                  }[view] || "NMS Network"
                }
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Star Background Toggle Button */}
              <button
                onClick={() => setStars(!stars)}
                title={stars ? "Disable Cosmic Background" : "Enable Cosmic Background"}
                className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-all ${
                  stars
                    ? "bg-white border-white text-black hover:bg-zinc-200"
                    : "bg-[#050505] border-zinc-900 text-zinc-400 hover:text-white hover:border-zinc-700"
                }`}
              >
                {stars ? <Sun size={14} /> : <Moon size={14} />}
              </button>
              <MagneticButton
                onClick={() => setView("register")}
                className="px-4 py-2 rounded-lg bg-white hover:bg-zinc-200 text-black font-semibold text-xs transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,255,255,0.04)]"
              >
                <Plus size={13} /> Register
              </MagneticButton>
            </div>
          </header>

          {/* Scroll Progress Bar */}
          <motion.div
            className="h-[2px] bg-white origin-left sticky top-16 left-0 right-0 z-30"
            style={{ scaleX: scrollYProgress }}
          />

          {/* Main Content Body Container with Scroll Tracking */}
          <main
            ref={mainContentRef}
            className="p-6 md:p-8 flex-grow overflow-y-auto max-h-[calc(100vh-64px)] custom-scrollbar"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={view}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="max-w-7xl mx-auto"
              >
                {view === "dashboard" && <Dashboard data={data} />}
                {view === "directory" && <Directory data={data} />}
                {view === "register" && <RegisterForm />}
                {view === "admin" && (
                  <AdminPanel
                    data={data}
                    onApprove={approve}
                    onDelete={del}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </>
  );
}

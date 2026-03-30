import { useState, useMemo } from "react";

/* ─────────────────────────── DATA ─────────────────────────── */
const ALUMNI = [
  /* 1989 */
  { id:1,  name:"Hon. Moses Wafula",    year:1989, prof:"Politician",       spec:"Public Administration", loc:"Nairobi",  country:"Kenya", bio:"Served three terms as MP for Nambale Constituency, pioneering healthcare reforms across Busia County. Now leads a civic foundation championing devolution.", av:"MW", color:"#1e3a5f" },
  { id:2,  name:"Dr. Eunice Akinyi",    year:1989, prof:"Medical Doctor",   spec:"Gynaecology",           loc:"Kisumu",   country:"Kenya", bio:"Pioneer gynaecologist who founded the Western Kenya Women's Health Centre, providing affordable maternal care to 30,000 women annually.", av:"EA", color:"#5b2d82" },
  { id:3,  name:"Thomas Otieno",        year:1989, prof:"Farmer",           spec:"Commercial Agriculture",loc:"Busia",    country:"Kenya", bio:"Transformed a two-acre family plot into a 200-acre commercial farm. Now the largest mango exporter in Busia County, employing 120 locals.", av:"TO", color:"#2d5e2b" },
  /* 1992 */
  { id:4,  name:"Prof. Zawadi Wafula",  year:1992, prof:"Lecturer",         spec:"Mathematics",           loc:"Eldoret",  country:"Kenya", bio:"Professor of Applied Mathematics at Moi University. Published 47 peer-reviewed papers and mentored 200+ doctoral students across East Africa.", av:"ZW", color:"#6a1b9a" },
  { id:5,  name:"Eng. Beatrice Nafula", year:1992, prof:"Civil Engineer",   spec:"Water & Sanitation",    loc:"Nairobi",  country:"Kenya", bio:"Led design of rural water supply systems serving 500,000 people in Busia, Siaya, and Kakamega counties under the World Bank WSUP programme.", av:"BN", color:"#00695c" },
  { id:6,  name:"Fr. Paul Simiyu",      year:1992, prof:"Clergy",           spec:"Catholic Priesthood",   loc:"Bungoma",  country:"Kenya", bio:"Parish priest and founder of a community school serving 900 children from nomadic and marginalised families in Bungoma County.", av:"PS", color:"#37474f" },
  /* 1995 */
  { id:7,  name:"Peter Mukhebi",        year:1995, prof:"Banker",           spec:"Development Finance",   loc:"London",   country:"UK",    bio:"Director at Barclays Africa. Has structured over $2B in lending to African entrepreneurs over 25 years in international banking.", av:"PM", color:"#4527a0" },
  { id:8,  name:"Dr. Irene Khisa",      year:1995, prof:"Veterinarian",     spec:"Wildlife Medicine",     loc:"Naivasha", country:"Kenya", bio:"Chief Veterinary Officer at Ol Pejeta Conservancy. World-leading expert in rhino immobilisation, having worked across 12 African countries.", av:"IK", color:"#558b2f" },
  { id:9,  name:"Robert Ochieng",       year:1995, prof:"Journalist",       spec:"Broadcast",             loc:"Nairobi",  country:"Kenya", bio:"Senior news anchor at KTN News. Has covered four general elections and the ICC proceedings from The Hague.", av:"RO", color:"#bf360c" },
  /* 1998 */
  { id:10, name:"Eng. Onyango Okello",  year:1998, prof:"Civil Engineer",   spec:"Infrastructure",        loc:"Kisumu",   country:"Kenya", bio:"Led construction of the Kisumu bypass road. Delivered 18 major road and bridge projects worth KES 22 billion across East Africa.", av:"OO", color:"#2e7d32" },
  { id:11, name:"Susan Barasa",         year:1998, prof:"Teacher",          spec:"English & Literature",  loc:"Kakamega", country:"Kenya", bio:"Head of English at Kakamega High School for 15 years. Students consistently record top KCSE English performance nationally.", av:"SB", color:"#e65100" },
  { id:12, name:"Michael Wanjala",      year:1998, prof:"Accountant",       spec:"Audit & Assurance",     loc:"Nairobi",  country:"Kenya", bio:"Partner at Deloitte Kenya, heading Financial Services Audit. Sits on the ICPAK council and chairs its education committee.", av:"MW", color:"#0d47a1" },
  /* 2001 */
  { id:13, name:"Dr. Akinyi Otieno",    year:2001, prof:"Medical Doctor",   spec:"Cardiology",            loc:"Nairobi",  country:"Kenya", bio:"Practising cardiologist at KNH who introduced percutaneous coronary intervention to public health facilities, saving 500+ lives annually.", av:"AO", color:"#1a3a6e" },
  { id:14, name:"Agnes Nekesa",         year:2001, prof:"NGO Director",     spec:"Girls' Education",      loc:"Nairobi",  country:"Kenya", bio:"Executive Director of GirlsRise Kenya, which has kept 12,000 girls in secondary school through scholarships and mentorship since 2008.", av:"AN", color:"#880e4f" },
  { id:15, name:"David Odhiambo",       year:2001, prof:"Architect",        spec:"Urban Design",          loc:"Nairobi",  country:"Kenya", bio:"Principal Architect at Urban Studio, behind Nairobi's award-winning affordable housing estate at Pangani. NCA board member.", av:"DO", color:"#01579b" },
  /* 2005 */
  { id:16, name:"Grace Nafula",         year:2005, prof:"Entrepreneur",     spec:"AgriTech",              loc:"Busia",    country:"Kenya", bio:"Founder of FarmFresh Kenya, connecting 5,000 smallholder farmers to urban markets via mobile. Forbes Africa 30 Under 30 and Ashoka Fellow.", av:"GN", color:"#c9922a" },
  { id:17, name:"Victor Ouma",          year:2005, prof:"Lawyer",           spec:"Corporate Law",         loc:"Nairobi",  country:"Kenya", bio:"Senior Associate at Bowman Gilfillan, specialising in M&A and capital markets. Advised on 30+ transactions on the NSE.", av:"VO", color:"#1b5e20" },
  { id:18, name:"Cynthia Adhiambo",     year:2005, prof:"Nurse",            spec:"Intensive Care",        loc:"Mombasa",  country:"Kenya", bio:"ICU Charge Nurse at Coast General Hospital. Established a sepsis response protocol that reduced ICU mortality by 22%.", av:"CA", color:"#4a148c" },
  /* 2008 */
  { id:19, name:"Mercy Anyango",        year:2008, prof:"Journalist",       spec:"Investigative",         loc:"Nairobi",  country:"Kenya", bio:"Senior investigative journalist at Nation Media Group. Pulitzer shortlistee for ground-breaking coverage of illegal fishing on Lake Victoria.", av:"MA", color:"#004d40" },
  { id:20, name:"Dennis Mukhwana",      year:2008, prof:"Software Engineer",spec:"FinTech",               loc:"Nairobi",  country:"Kenya", bio:"Lead engineer at M-KOPA Solar building the embedded finance platform that has powered 1.5 million off-grid homes across Africa.", av:"DM", color:"#1565c0" },
  { id:21, name:"Lilian Wekesa",        year:2008, prof:"Teacher",          spec:"Biology",               loc:"Busia",    country:"Kenya", bio:"Biology teacher and National Science Congress coordinator at Nambale Magnet School — giving back to the institution that shaped her.", av:"LW", color:"#4e342e" },
  /* 2010 */
  { id:22, name:"Amara Simiyu",         year:2010, prof:"Software Engineer",spec:"AI & Machine Learning", loc:"Nairobi",  country:"Kenya", bio:"ML Engineer at Safaricom's AI lab building crop disease detection models used by 200,000 farmers via USSD. Google Developer Expert.", av:"AS", color:"#0277bd" },
  { id:23, name:"Felix Odhiambo",       year:2010, prof:"Pharmacist",       spec:"Clinical Pharmacy",     loc:"Kisumu",   country:"Kenya", bio:"Clinical pharmacist at JOORTH and co-founder of PharmEase, a digital medication adherence app with 50,000 active users.", av:"FO", color:"#37474f" },
  { id:24, name:"Mary Nekesa",          year:2010, prof:"Banker",           spec:"Microfinance",          loc:"Eldoret",  country:"Kenya", bio:"Branch Manager at Equity Bank Eldoret. Facilitated KES 800M in micro-loans to women-led businesses over her 10-year career.", av:"MN", color:"#a5390e" },
  /* 2012 */
  { id:25, name:"Brian Wanjala",        year:2012, prof:"Teacher",          spec:"Chemistry",             loc:"Kakamega", country:"Kenya", bio:"Head of Science at Kakamega High School. Students won 15 National Chemistry Olympiad awards; four have competed internationally.", av:"BW", color:"#e65100" },
  { id:26, name:"Hilda Oduya",          year:2012, prof:"Entrepreneur",     spec:"Fashion & Design",      loc:"Nairobi",  country:"Kenya", bio:"Founder of Asili Wear, a Nairobi fashion label celebrating East African heritage. Presented at Lagos and Johannesburg Fashion Weeks 2023.", av:"HO", color:"#ad1457" },
  { id:27, name:"Kevin Barasa",         year:2012, prof:"Lawyer",           spec:"Human Rights",          loc:"Nairobi",  country:"Kenya", bio:"Human rights lawyer championing digital rights and data protection legislation in Kenya. Argued landmark freedom-of-expression cases.", av:"KB", color:"#b71c1c" },
  /* 2015 */
  { id:28, name:"Sharon Wafula",        year:2015, prof:"Architect",        spec:"Sustainable Design",    loc:"Nairobi",  country:"Kenya", bio:"Award-winning architect and founder of GreenBuild Studio. Designed Kenya's first net-zero primary school, shortlisted for Aga Khan Award 2022.", av:"SW", color:"#558b2f" },
  { id:29, name:"Collins Musungu",      year:2015, prof:"Journalist",       spec:"Data Journalism",       loc:"London",   country:"UK",    bio:"Data journalist at BBC Africa desk producing visualisation-led investigations on governance and health. Reuters Institute Fellow 2023.", av:"CM", color:"#263850" },
  { id:30, name:"Pamela Ouma",          year:2015, prof:"Nurse",            spec:"Paediatrics",           loc:"Eldoret",  country:"Kenya", bio:"Paediatric nurse at MTRH leading a volunteer programme that provides developmental support to premature infants.", av:"PO", color:"#6a1b9a" },
  /* 2018 */
  { id:31, name:"Ian Simiyu",           year:2018, prof:"Software Engineer",spec:"Mobile Apps",           loc:"Nairobi",  country:"Kenya", bio:"Android developer at Twiga Foods building the logistics platform that moves fresh produce from 8,000 farms to 50,000 urban retailers daily.", av:"IS", color:"#01579b" },
  { id:32, name:"Purity Khaemba",       year:2018, prof:"Medical Doctor",   spec:"General Practice",      loc:"Busia",    country:"Kenya", bio:"GP at Nambale Sub-County Hospital running mobile clinics that reach five fishing communities on Lake Victoria each month.", av:"PK", color:"#880e4f" },
  { id:33, name:"Clinton Odhiambo",     year:2018, prof:"Accountant",       spec:"Tax Advisory",          loc:"Nairobi",  country:"Kenya", bio:"Tax consultant at KPMG Kenya advising manufacturing and energy clients on transfer pricing. Pursuing a PhD in International Tax Law.", av:"CO", color:"#37474f" },
  /* 2020 */
  { id:34, name:"Linet Ouma",           year:2020, prof:"Nurse",            spec:"Paediatrics",           loc:"Kisumu",   country:"Kenya", bio:"Paediatric nurse at New Nyanza General Hospital. Volunteer with Médecins Sans Frontières, deployed to South Sudan and Ethiopia.", av:"LO", color:"#ad1457" },
  { id:35, name:"Wycliffe Nafula",      year:2020, prof:"Teacher",          spec:"Mathematics",           loc:"Busia",    country:"Kenya", bio:"Mathematics teacher at Nambale Day Secondary. Founded the NMS Maths Club that prepares students for national competitions.", av:"WN", color:"#1b5e20" },
  { id:36, name:"Faith Anyango",        year:2020, prof:"Entrepreneur",     spec:"EdTech",                loc:"Nairobi",  country:"Kenya", bio:"Co-founder of Soma AI, a Swahili-language adaptive learning app with 80,000 active users across Kenya and Tanzania. Techstars 2023.", av:"FA", color:"#b8471f" },
  /* 2022 */
  { id:37, name:"Jordan Mwangi",        year:2022, prof:"Software Engineer",spec:"Cybersecurity",         loc:"Nairobi",  country:"Kenya", bio:"Junior security engineer at Safaricom on the team that defeated a coordinated M-PESA fraud campaign in 2023. Active bug-bounty hunter.", av:"JM", color:"#1565c0" },
  { id:38, name:"Aisha Barasa",         year:2022, prof:"Medical Student",  spec:"Surgery",               loc:"Eldoret",  country:"Kenya", bio:"Fourth-year medical student at Moi University, top of her class. Research on obstetric fistula presented at the East Africa Surgical Conference.", av:"AB", color:"#5c2d72" },
  { id:39, name:"Peter Wekesa",         year:2022, prof:"Journalist",       spec:"Photojournalism",       loc:"Nairobi",  country:"Kenya", bio:"Staff photographer at The Standard newspaper. Freelances for Reuters covering politics, environment, and cultural events across the region.", av:"PW", color:"#bf360c" },
];

const PROFESSIONS  = [...new Set(ALUMNI.map(a => a.prof))].sort();
const LOCATIONS    = [...new Set(ALUMNI.map(a => a.loc))].sort();
const DECADES      = ["2020s","2010s","2000s","1990s","1980s"];

function decadeOf(year) { return `${Math.floor(year / 10) * 10}s`; }

/* ─────────────────── AVATAR ─────────────────── */
function Avatar({ initials, color, size = "md" }) {
  const sizes = { sm:"w-10 h-10 text-xs", md:"w-14 h-14 text-sm", lg:"w-20 h-20 text-lg" };
  return (
    <div
      className={`${sizes[size]} rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 shadow-lg`}
      style={{ background: `linear-gradient(135deg, ${color}, ${color}aa)` }}
    >
      {initials}
    </div>
  );
}

/* ─────────────────── ALUMNI CARD ─────────────────── */
function AlumniCard({ alumni, view, onOpen }) {
  if (view === "list") {
    return (
      <div
        onClick={() => onOpen(alumni)}
        className="bg-white border border-stone-200 rounded-2xl flex items-center gap-4 px-5 py-4 cursor-pointer hover:border-amber-400 hover:shadow-lg transition-all duration-300 group"
      >
        <Avatar initials={alumni.av} color={alumni.color} size="sm" />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-slate-800 text-sm leading-tight group-hover:text-amber-700 transition-colors">{alumni.name}</p>
          <p className="text-xs text-amber-600 font-medium mt-0.5">{alumni.prof} · {alumni.spec}</p>
        </div>
        <span className="text-xs text-slate-400 hidden sm:block whitespace-nowrap">📍 {alumni.loc}</span>
        <span
          className="text-xs font-bold px-3 py-1 rounded-full text-white flex-shrink-0"
          style={{ backgroundColor: alumni.color }}
        >
          {alumni.year}
        </span>
        <button
          onClick={e => { e.stopPropagation(); onOpen(alumni); }}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 border border-stone-200 hover:border-slate-400 rounded-lg px-3 py-1.5 transition-all hidden sm:block flex-shrink-0"
        >
          View →
        </button>
      </div>
    );
  }

  return (
    <div
      onClick={() => onOpen(alumni)}
      className="bg-white border border-stone-200 rounded-2xl overflow-hidden cursor-pointer hover:-translate-y-1.5 hover:shadow-xl hover:border-amber-300 transition-all duration-300 group flex flex-col"
    >
      {/* Card top banner */}
      <div className="h-20 relative flex items-end px-4 pb-0" style={{ background: `linear-gradient(135deg, ${alumni.color}, ${alumni.color}bb)` }}>
        <div className="absolute top-2.5 right-3 bg-black/25 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">
          {alumni.year}
        </div>
        <div className="relative top-7 border-[3px] border-white rounded-full shadow-md">
          <Avatar initials={alumni.av} color={alumni.color} size="md" />
        </div>
      </div>

      {/* Card body */}
      <div className="pt-9 px-4 pb-4 flex flex-col flex-1">
        <h3 className="font-bold text-slate-800 text-base leading-tight group-hover:text-amber-700 transition-colors">{alumni.name}</h3>
        <p className="text-amber-600 text-xs font-semibold mt-1">{alumni.prof}</p>
        <p className="text-slate-400 text-xs mt-0.5 flex items-center gap-1">
          <span>📍</span>{alumni.loc}, {alumni.country}
        </p>
        <p className="text-slate-500 text-xs leading-relaxed mt-2.5 line-clamp-2 flex-1">{alumni.bio}</p>

        <div className="flex gap-2 mt-3 pt-3 border-t border-stone-100">
          <button
            onClick={e => { e.stopPropagation(); onOpen(alumni); }}
            className="flex-1 py-2 rounded-lg text-xs font-semibold text-white transition-all hover:opacity-90 active:scale-95"
            style={{ backgroundColor: alumni.color }}
          >
            View Profile
          </button>
          <button
            onClick={e => { e.stopPropagation(); }}
            className="flex-1 py-2 rounded-lg text-xs font-semibold border border-stone-200 text-slate-500 hover:border-slate-400 hover:text-slate-700 transition-all"
          >
            Message
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────── YEAR GROUP ─────────────────── */
function YearGroup({ year, members, view, onOpen }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="mb-8">
      {/* Year header */}
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-3 w-full mb-4 group"
      >
        <span
          className="flex items-center gap-2 text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-sm transition-all group-hover:opacity-90"
          style={{ backgroundColor: "#1e3a5f" }}
        >
          Class of {year}
          <svg className={`w-3 h-3 transition-transform duration-200 ${open ? "" : "-rotate-90"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
        <span className="flex-1 h-px bg-stone-200" />
        <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
          {members.length} {members.length === 1 ? "alumnus" : "alumni"}
        </span>
      </button>

      {/* Cards */}
      {open && (
        <div className={
          view === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            : "flex flex-col gap-2"
        }>
          {members.map(a => (
            <AlumniCard key={a.id} alumni={a} view={view} onOpen={onOpen} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────── DECADE BLOCK ─────────────────── */
function DecadeBlock({ decade, years, byYear, view, onOpen }) {
  const [open, setOpen] = useState(true);
  const total = years.reduce((s, y) => s + byYear[y].length, 0);
  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);

  return (
    <section className="mb-12">
      {/* Decade header */}
      <div className="flex items-end gap-4 mb-6 pb-4 border-b-2 border-stone-200 relative">
        <div className="absolute bottom-[-2px] left-0 w-16 h-0.5 bg-amber-500" />
        <button onClick={() => setOpen(o => !o)} className="flex items-center gap-3 group">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest border border-stone-300 rounded-full px-3 py-1 group-hover:border-amber-400 group-hover:text-amber-600 transition-all">
            Decade
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-800 leading-none">
            The <span className="text-amber-600 italic">{decade}</span>
          </h2>
          <svg className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${open ? "" : "-rotate-90"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <span className="ml-auto text-xs font-semibold text-slate-400 bg-stone-100 border border-stone-200 rounded-full px-3 py-1 whitespace-nowrap">
          {total} alumni · Classes {minYear}–{maxYear}
        </span>
      </div>

      {open && years.map(year => (
        <YearGroup key={year} year={year} members={byYear[year]} view={view} onOpen={onOpen} />
      ))}
    </section>
  );
}

/* ─────────────────── PROFILE MODAL ─────────────────── */
function ProfileModal({ alumni, onClose, onMessage }) {
  if (!alumni) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-[fadeUp_0.25s_ease]">
        {/* Top banner */}
        <div className="h-32 relative flex items-end px-8 pb-0" style={{ background: `linear-gradient(135deg, ${alumni.color}, ${alumni.color}99)` }}>
          <button onClick={onClose} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm flex items-center justify-center hover:bg-white/35 transition-all">✕</button>
          <div className="absolute top-4 left-6 bg-black/25 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">Class of {alumni.year}</div>
          <div className="relative top-10 border-4 border-white rounded-full shadow-xl">
            <Avatar initials={alumni.av} color={alumni.color} size="lg" />
          </div>
        </div>

        {/* Body */}
        <div className="pt-14 px-8 pb-8">
          <h2 className="text-2xl font-bold text-slate-800">{alumni.name}</h2>
          <p className="text-amber-600 font-semibold text-sm mt-1">{alumni.prof} · {alumni.spec}</p>

          <div className="flex flex-wrap gap-2 mt-3">
            {[`📍 ${alumni.loc}, ${alumni.country}`, `🎓 Class of ${alumni.year}`, `💼 ${alumni.prof}`].map(tag => (
              <span key={tag} className="text-xs text-slate-500 bg-stone-100 border border-stone-200 rounded-full px-3 py-1">{tag}</span>
            ))}
          </div>

          <hr className="my-5 border-stone-100" />
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">About</p>
          <p className="text-slate-600 text-sm leading-relaxed">{alumni.bio}</p>

          <div className="flex gap-3 mt-6">
            <button
              className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
              style={{ backgroundColor: alumni.color }}
              onClick={() => onMessage(`✅ Connection request sent to ${alumni.name}!`)}
            >
              Connect
            </button>
            <button
              className="flex-1 py-3 rounded-xl text-sm font-semibold border-2 border-stone-200 text-slate-600 hover:border-slate-400 hover:text-slate-800 transition-all"
              onClick={() => onMessage(`📧 Message sent to ${alumni.name}!`)}
            >
              Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────── TOAST ─────────────────── */
function Toast({ message }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-6 right-6 z-[100] bg-slate-800 text-white text-sm font-medium px-5 py-3 rounded-xl shadow-2xl border-l-4 border-amber-400 animate-[slideUp_0.3s_ease]">
      {message}
    </div>
  );
}

/* ─────────────────── MAIN APP ─────────────────── */
export default function NMSAlumniDirectory() {
  const [search, setSearch]         = useState("");
  const [profFilter, setProfFilter] = useState("");
  const [locFilter, setLocFilter]   = useState("");
  const [decFilter, setDecFilter]   = useState("");
  const [view, setView]             = useState("grid");
  const [selected, setSelected]     = useState(null);
  const [toast, setToast]           = useState("");

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  /* Filter */
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return ALUMNI.filter(a => {
      const sq = !q || [a.name, a.prof, a.spec, a.loc, a.country, String(a.year)].some(v => v.toLowerCase().includes(q));
      const sp = !profFilter || a.prof === profFilter;
      const sl = !locFilter  || a.loc  === locFilter;
      const sd = !decFilter  || decadeOf(a.year) === decFilter;
      return sq && sp && sl && sd;
    });
  }, [search, profFilter, locFilter, decFilter]);

  /* Group by decade → year */
  const structure = useMemo(() => {
    const byYear = {};
    filtered.forEach(a => { (byYear[a.year] = byYear[a.year] || []).push(a); });
    const byDecade = {};
    Object.keys(byYear).map(Number).sort((a,b) => b-a).forEach(y => {
      const d = decadeOf(y);
      (byDecade[d] = byDecade[d] || []).push(y);
    });
    return { byYear, byDecade };
  }, [filtered]);

  const activeDecades = DECADES.filter(d => structure.byDecade[d]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&display=swap');
        .font-serif { font-family: 'Cormorant Garamond', Georgia, serif; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        .line-clamp-2 { display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
        * { box-sizing: border-box; }
      `}</style>

      <div className="min-h-screen bg-stone-50">

        {/* ── NAVBAR ── */}
        <nav className="fixed top-0 left-0 right-0 z-40 h-14 flex items-center border-b border-amber-900/20" style={{ background:"rgba(14,26,43,0.97)", backdropFilter:"blur(14px)" }}>
          <div className="max-w-7xl mx-auto w-full px-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-slate-900 font-bold text-sm" style={{ background:"linear-gradient(135deg,#d9a94a,#b8841f)" }}>N</div>
              <span className="text-white font-semibold text-base" style={{ fontFamily:"'Cormorant Garamond', serif" }}>
                NMS <span className="text-amber-400 italic">Alumni Directory</span>
              </span>
            </div>
            <span className="text-xs font-medium bg-amber-900/30 border border-amber-700/40 text-amber-400 px-3 py-1 rounded-full">Class Directory</span>
          </div>
        </nav>

        {/* ── HERO ── */}
        <div className="pt-14">
          <div className="relative overflow-hidden" style={{ background:"linear-gradient(135deg, #0e1a2b 0%, #1f3f72 100%)" }}>
            {/* Grid pattern */}
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage:"repeating-linear-gradient(90deg,#fff 0,#fff 1px,transparent 1px,transparent 60px),repeating-linear-gradient(0deg,#fff 0,#fff 1px,transparent 1px,transparent 60px)" }} />
            {/* Glow */}
            <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background:"radial-gradient(circle, rgba(184,132,31,0.15) 0%, transparent 65%)" }} />

            <div className="relative z-10 max-w-7xl mx-auto px-5 py-14">
              <div className="inline-flex items-center gap-2 bg-amber-900/20 border border-amber-700/30 text-amber-400 text-xs font-medium px-4 py-1.5 rounded-full mb-5">
                📚 Nambale Magnet School · Est. 1985
              </div>
              <h1 className="font-serif text-5xl md:text-6xl font-bold text-white leading-tight mb-3">
                Alumni <span className="text-amber-400 italic">Directory</span>
              </h1>
              <p className="text-white/55 text-base max-w-xl leading-relaxed mb-8">
                Browse and connect with graduates across every class year — from the founding class of 1989 to our most recent alumni. Classified by year of graduation.
              </p>
              {/* Stats */}
              <div className="flex flex-wrap gap-8 pt-6 border-t border-white/10">
                {[
                  [ALUMNI.length+"+" , "Alumni Registered"],
                  [new Set(ALUMNI.map(a=>a.year)).size, "Graduation Classes"],
                  [new Set(ALUMNI.map(a=>a.country)).size, "Countries"],
                  ["1985", "Year Founded"],
                ].map(([n,l]) => (
                  <div key={l}>
                    <div className="font-serif text-3xl font-bold text-amber-400">{n}</div>
                    <div className="text-white/45 text-xs uppercase tracking-widest mt-1">{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── CONTROLS BAR ── */}
        <div className="sticky top-14 z-30 bg-white border-b border-stone-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-5 py-3 flex flex-wrap items-center gap-2.5">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">🔍</span>
              <input
                className="w-full pl-9 pr-4 py-2.5 border-1.5 border-stone-200 rounded-xl text-sm text-slate-700 bg-stone-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                style={{ border:"1.5px solid #e7e5e4" }}
                placeholder="Search name, profession, location…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            {/* Profession */}
            <select
              className="py-2.5 px-3 rounded-xl text-sm text-slate-600 bg-stone-50 cursor-pointer outline-none transition-all"
              style={{ border:"1.5px solid #e7e5e4" }}
              value={profFilter}
              onChange={e => setProfFilter(e.target.value)}
            >
              <option value="">All Professions</option>
              {PROFESSIONS.map(p => <option key={p}>{p}</option>)}
            </select>

            {/* Location */}
            <select
              className="py-2.5 px-3 rounded-xl text-sm text-slate-600 bg-stone-50 cursor-pointer outline-none transition-all"
              style={{ border:"1.5px solid #e7e5e4" }}
              value={locFilter}
              onChange={e => setLocFilter(e.target.value)}
            >
              <option value="">All Locations</option>
              {LOCATIONS.map(l => <option key={l}>{l}</option>)}
            </select>

            {/* Decade */}
            <select
              className="py-2.5 px-3 rounded-xl text-sm text-slate-600 bg-stone-50 cursor-pointer outline-none transition-all"
              style={{ border:"1.5px solid #e7e5e4" }}
              value={decFilter}
              onChange={e => setDecFilter(e.target.value)}
            >
              <option value="">All Decades</option>
              {DECADES.map(d => <option key={d}>{d}</option>)}
            </select>

            {/* View toggle */}
            <div className="flex gap-1 bg-stone-100 border border-stone-200 rounded-xl p-1">
              {[["grid","⊞ Grid"],["list","≡ List"]].map(([v,label]) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${view===v ? "bg-white text-slate-800 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Count pill */}
            <span className="bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap">
              {filtered.length} alumni
            </span>
          </div>
        </div>

        {/* ── DIRECTORY ── */}
        <main className="max-w-7xl mx-auto px-5 py-10">
          {filtered.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-2xl border-2 border-dashed border-stone-200">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="font-serif text-2xl font-bold text-slate-700 mb-2">No alumni found</h3>
              <p className="text-slate-400">Try adjusting your search or filters.</p>
            </div>
          ) : (
            activeDecades.map(decade => (
              <DecadeBlock
                key={decade}
                decade={decade}
                years={structure.byDecade[decade]}
                byYear={structure.byYear}
                view={view}
                onOpen={setSelected}
              />
            ))
          )}
        </main>

        {/* ── FOOTER ── */}
        <footer style={{ background:"#0e1a2b" }} className="py-8 text-center text-white/40 text-sm">
          © 2024 Nambale Magnet School Alumni Network · Connecting Generations of Excellence
        </footer>

        {/* ── MODAL ── */}
        {selected && (
          <ProfileModal
            alumni={selected}
            onClose={() => setSelected(null)}
            onMessage={msg => { showToast(msg); setSelected(null); }}
          />
        )}

        {/* ── TOAST ── */}
        <Toast message={toast} />
      </div>
    </>
  );
}
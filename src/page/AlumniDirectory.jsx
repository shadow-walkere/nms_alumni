import { useState, useMemo, useCallback, useEffect, useRef } from "react";

// ─── Palette & theme ──────────────────────────────────────────────────────────
const THEME = {
  light: {
    bg: "#f7f5f0",
    bg2: "#edeae3",
    card: "#ffffff",
    sidebar: "#1a1a2e",
    sidebarText: "#a8b0c8",
    sidebarActive: "#e8c547",
    border: "#e2ddd6",
    border2: "#ccc7be",
    text: "#1c1a16",
    text2: "#4a4640",
    text3: "#8a8480",
    gold: "#c8a92a",
    goldLight: "#f5e5a0",
    navy: "#1a1a2e",
    teal: "#0d7377",
    tealLight: "#e0f5f5",
    green: "#1b6b3a",
    greenLight: "#e2f5ea",
    red: "#b03030",
    redLight: "#fdeaea",
    amber: "#8a5c00",
    amberLight: "#fff3d0",
    shadow: "0 2px 16px rgba(28,26,22,.10)",
    shadowHover: "0 8px 32px rgba(28,26,22,.16)",
  },
  dark: {
    bg: "#0f0f1a",
    bg2: "#161626",
    card: "#1e1e30",
    sidebar: "#0a0a14",
    sidebarText: "#7a82a0",
    sidebarActive: "#e8c547",
    border: "#2e2e45",
    border2: "#3a3a55",
    text: "#e8e6f0",
    text2: "#a8a4b8",
    text3: "#6a6880",
    gold: "#e8c547",
    goldLight: "#2a2510",
    navy: "#0a0a14",
    teal: "#14b8a6",
    tealLight: "#0a2a28",
    green: "#4ade80",
    greenLight: "#0a2018",
    red: "#f87171",
    redLight: "#2a0f0f",
    amber: "#fbbf24",
    amberLight: "#2a1a00",
    shadow: "0 2px 16px rgba(0,0,0,.4)",
    shadowHover: "0 8px 32px rgba(0,0,0,.6)",
  },
};

// ─── Seeded RNG & data generation ────────────────────────────────────────────
const rng = (seed) => { let s = seed; return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; }; };

const YEARS = [2016,2017,2018,2019,2020,2021,2022,2023,2024,2025,2026];
const DEPTS = ["Computer Science","Business Administration","Education","Health Sciences","Engineering","Social Work","Agricultural Science","Communication","Accounting","Law"];
const COMPANIES = ["Safaricom PLC","Google Kenya","KCB Bank","Nation Media Group","KEMRI","M-Pesa Africa","UN Kenya","Equity Bank","Kenya Airways","Ministry of Education","Self-Employed","USAID Kenya","East African Breweries"];
const LOCS = ["Nairobi","Kisumu","Mombasa","Eldoret","Busia","Kampala","London","Toronto","Dubai","Kigali","Dar es Salaam","Juba"];
const JOBS = ["Software Engineer","Teacher","Registered Nurse","Accountant","Project Manager","Entrepreneur","Data Analyst","Medical Doctor","Legal Officer","Sales Manager","NGO Programme Officer","University Lecturer","Agricultural Officer"];
const SKILLS_POOL = ["Leadership","Python","Public Speaking","Data Analysis","Research","Community Dev","Financial Mgmt","Teaching","Healthcare","Software Dev","Marketing","Agronomy","Legal Research","Journalism","Mentorship"];
const FNAMES = ["Amara","Brian","Cynthia","Daniel","Evaline","Felix","Grace","Hassan","Irene","Joel","Kalinda","Lawrence","Mercy","Nelson","Olivia","Patrick","Queen","Robert","Sarah","Timothy","Urasula","Vincent","Winnie","Xavier","Yasmin","Zack","Asha","Benedict","Caroline","David","Eunice","Francis","Gloria","Henry","Immaculate","James","Kezia","Lilian","Michael","Naomi"];
const SNAMES = ["Odhiambo","Wafula","Achieng","Barasa","Njoroge","Kimani","Otieno","Mwangi","Chebet","Koech","Mutua","Nzomo","Wangari","Kipkemoi","Auma","Simiyu","Juma","Ndirangu","Kamau","Ruto","Wekesa","Namukho","Nabwire","Imbahale","Wanyama"];
const AVATAR_COLORS = ["#1a3a6b","#7c3a6b","#1a6b4a","#6b4a1a","#3a1a6b","#1a5a6b","#6b1a2a","#4a6b1a","#2a4a6b","#6b3a2a"];
const BIOS = [
  "A passionate professional committed to using technology and education to drive positive change in the community.",
  "Dedicated to empowering the next generation through mentorship and community-driven initiatives.",
  "Combining academic excellence with entrepreneurial spirit to build sustainable solutions in East Africa.",
  "A results-driven individual whose foundation at NMS shaped a lifelong commitment to integrity and service.",
  "Bridging the gap between rural communities and modern opportunities through innovation and hard work.",
];

let _id = 1001;
const ALUMNI_DATA = [];
YEARS.forEach((yr, yi) => {
  const counts = [14,13,15,12,16,14,13,15,14,12,7];
  const count = counts[yi] ?? 10;
  for (let i = 0; i < count; i++) {
    const r = rng(yr * 100 + i + 7);
    const fn = FNAMES[Math.floor(r() * FNAMES.length)];
    const sn = SNAMES[Math.floor(r() * SNAMES.length)];
    const dept = DEPTS[Math.floor(r() * DEPTS.length)];
    const skills = [...SKILLS_POOL].sort(() => r() - 0.5).slice(0, 3);
    ALUMNI_DATA.push({
      id: `NMS/${yr}/${String(_id).padStart(4,"0")}`,
      name: `${fn} ${sn}`,
      initials: `${fn[0]}${sn[0]}`,
      color: AVATAR_COLORS[(_id - 1001) % AVATAR_COLORS.length],
      year: yr,
      dept,
      job: JOBS[Math.floor(r() * JOBS.length)],
      company: COMPANIES[Math.floor(r() * COMPANIES.length)],
      location: LOCS[Math.floor(r() * LOCS.length)],
      email: `${fn.toLowerCase()}.${sn.toLowerCase()}@alumni.nms.ac.ke`,
      phone: `+254 7${Math.floor(r()*9)}${String(Math.floor(r()*9999999)).padStart(7,"0")}`,
      linkedin: `linkedin.com/in/${fn.toLowerCase()}-${sn.toLowerCase()}`,
      bio: BIOS[(_id - 1001) % BIOS.length],
      skills,
      status: r() > 0.2 ? "active" : r() > 0.5 ? "pending" : "inactive",
      approved: r() > 0.12,
      employed: r() > 0.15,
    });
    _id++;
  }
});

// ─── Tiny icon set ────────────────────────────────────────────────────────────
const IC = {
  home: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
  users: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75",
  search: "M11 11m-8 0a8 8 0 1 0 16 0a8 8 0 1 0-16 0 M21 21l-4.35-4.35",
  settings: "M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0",
  chart: "M18 20V10 M12 20V4 M6 20v-6 M2 20h20",
  bell: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0",
  plus: "M12 5v14 M5 12h14",
  x: "M18 6 6 18 M6 6l12 12",
  check: "M20 6 9 17 4 12",
  edit: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z",
  trash: "M3 6h18 M19 6v14H5V6 M8 6V4h8v2",
  download: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3",
  mail: "M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z M22 6l-10 7L2 6",
  phone: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.55 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6z",
  pin: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 10m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0",
  brief: "M22 9H2v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9z M16 9V7a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2",
  award: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z",
  grid: "M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z",
  list: "M8 6h13 M8 12h13 M8 18h13 M3 6h.01 M3 12h.01 M3 18h.01",
  menu: "M3 6h18 M3 12h18 M3 18h18",
  moon: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z",
  sun: "M12 2v2 M12 20v2 M4.22 4.22l1.42 1.42 M18.36 18.36l1.42 1.42 M2 12h2 M20 12h2 M4.22 19.78l1.42-1.42 M18.36 5.64l1.42-1.42 M12 7a5 5 0 1 0 0 10A5 5 0 0 0 12 7z",
  user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
  linkedin: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z M2 9h4v12H2z M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  filter: "M22 3H2l8 9.46V19l4 2v-8.54z",
  lock: "M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z M7 11V7a5 5 0 0 1 10 0v4",
  logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9",
};

function Svg({ name, size = 16, color = "currentColor", strokeWidth = 1.8 }) {
  const d = IC[name] || "";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      {d.split(" M").map((seg, i) => (
        <path key={i} d={i === 0 ? seg : "M" + seg} />
      ))}
    </svg>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const PAGE_SIZE = 12;

function Avatar({ initials, color, size = 44 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", background: color,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.3, fontWeight: 700, color: "#fff", flexShrink: 0,
      fontFamily: "Cormorant Garamond, serif", letterSpacing: "0.05em",
    }}>{initials}</div>
  );
}

function StatusPill({ status, t }) {
  const map = {
    active: { bg: t.greenLight, color: t.green, label: "Active" },
    pending: { bg: t.amberLight, color: t.amber, label: "Pending" },
    inactive: { bg: t.bg2, color: t.text3, label: "Inactive" },
  };
  const s = map[status] || map.inactive;
  return (
    <span style={{ padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: s.bg, color: s.color }}>
      {s.label}
    </span>
  );
}

// ─── Auth Screen ──────────────────────────────────────────────────────────────
function AuthScreen({ onLogin, t, dark }) {
  const [mode, setMode] = useState("login");
  const [role, setRole] = useState("alumni");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const inputStyle = {
    width: "100%", padding: "11px 14px", borderRadius: 10, border: `1px solid ${t.border2}`,
    background: t.bg, color: t.text, fontSize: 14, outline: "none",
    fontFamily: "Nunito Sans, sans-serif", boxSizing: "border-box",
  };
  return (
    <div style={{ minHeight: "100vh", background: t.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 64, height: 64, background: t.navy, borderRadius: 16, display: "inline-flex",
            alignItems: "center", justifyContent: "center", marginBottom: 12,
          }}>
            <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 28, fontWeight: 700, color: t.gold }}>N</span>
          </div>
          <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 22, fontWeight: 700, color: t.text }}>Nambale Magnet School</div>
          <div style={{ fontSize: 12, color: t.text3, marginTop: 2, letterSpacing: "0.06em" }}>ALUMNI NETWORK</div>
        </div>
        <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 16, padding: "28px 28px 24px", boxShadow: t.shadow }}>
          <div style={{ display: "flex", gap: 0, marginBottom: 24, border: `1px solid ${t.border}`, borderRadius: 10, overflow: "hidden" }}>
            {["login", "register"].map(m => (
              <button key={m} onClick={() => setMode(m)} style={{
                flex: 1, padding: "9px 0", fontSize: 13, fontWeight: 600, cursor: "pointer", border: "none",
                background: mode === m ? t.navy : "transparent", color: mode === m ? t.gold : t.text3,
                fontFamily: "Nunito Sans, sans-serif", transition: "all .15s",
              }}>
                {m === "login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>
          {/* Role select */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: t.text3, display: "block", marginBottom: 6, letterSpacing: "0.05em", textTransform: "uppercase" }}>Role</label>
            <div style={{ display: "flex", gap: 8 }}>
              {["alumni","admin"].map(r => (
                <button key={r} onClick={() => setRole(r)} style={{
                  flex: 1, padding: "8px 0", borderRadius: 8, border: `1.5px solid ${role === r ? t.gold : t.border2}`,
                  background: role === r ? t.goldLight : "transparent", color: role === r ? t.navy : t.text2,
                  fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "Nunito Sans, sans-serif", transition: "all .15s",
                }}>
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: t.text3, display: "block", marginBottom: 6, letterSpacing: "0.05em", textTransform: "uppercase" }}>Email</label>
            <input style={inputStyle} value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" type="email" />
          </div>
          <div style={{ marginBottom: 22 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: t.text3, display: "block", marginBottom: 6, letterSpacing: "0.05em", textTransform: "uppercase" }}>Password</label>
            <input style={inputStyle} value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••••" type="password" />
          </div>
          <button onClick={() => onLogin(role)} style={{
            width: "100%", padding: "12px 0", borderRadius: 10, border: "none",
            background: t.navy, color: t.gold, fontWeight: 700,
            cursor: "pointer", fontFamily: "Cormorant Garamond, serif", letterSpacing: "0.06em", fontSize: 15,
          }}>
            {mode === "login" ? "SIGN IN" : "CREATE ACCOUNT"}
          </button>
          <p style={{ textAlign: "center", fontSize: 12, color: t.text3, marginTop: 16 }}>
            <em>"Live, that there may be Life"</em>
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Alumni Card ──────────────────────────────────────────────────────────────
function AlumniCard({ a, onClick, t }) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={() => onClick(a)}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: t.card, border: `1px solid ${hov ? t.gold : t.border}`,
        borderRadius: 14, overflow: "hidden", cursor: "pointer",
        boxShadow: hov ? t.shadowHover : t.shadow,
        transform: hov ? "translateY(-3px)" : "none",
        transition: "all .2s ease",
      }}>
      <div style={{ height: 5, background: `linear-gradient(90deg, ${t.navy}, ${t.teal})` }} />
      <div style={{ padding: "16px 16px 12px" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 12 }}>
          <Avatar initials={a.initials} color={a.color} size={46} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, color: t.text, fontFamily: "Cormorant Garamond, serif", fontSize: 16, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.name}</div>
            <div style={{ fontSize: 11, color: t.text3, marginTop: 1 }}>{a.id}</div>
            <span style={{ display: "inline-block", marginTop: 4, padding: "2px 8px", borderRadius: 10, fontSize: 10, fontWeight: 700, background: t.goldLight, color: t.navy, letterSpacing: "0.04em" }}>Class of {a.year}</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {[
            { icon: "brief", val: `${a.job} · ${a.company}` },
            { icon: "pin", val: a.location },
            { icon: "award", val: a.dept },
          ].map(row => (
            <div key={row.icon} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: t.text2 }}>
              <Svg name={row.icon} size={12} color={t.text3} />
              <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{row.val}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: "10px 16px", borderTop: `1px solid ${t.border}`, background: t.bg, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {a.skills.slice(0, 2).map(s => (
            <span key={s} style={{ padding: "2px 7px", background: t.bg2, border: `1px solid ${t.border}`, borderRadius: 6, fontSize: 10, color: t.text3 }}>{s}</span>
          ))}
        </div>
        <div style={{ display: "flex", gap: 5 }}>
          {[{ icon: "mail", title: "Email" }, { icon: "linkedin", title: "LinkedIn" }].map(sc => (
            <div key={sc.icon} title={sc.title} style={{
              width: 26, height: 26, borderRadius: 7, border: `1px solid ${t.border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: t.card, cursor: "pointer",
            }}>
              <Svg name={sc.icon} size={12} color={t.text3} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Profile Modal ────────────────────────────────────────────────────────────
function ProfileModal({ a, onClose, t }) {
  useEffect(() => {
    const h = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);
  const Field = ({ label, value, link }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <span style={{ fontSize: 10, fontWeight: 700, color: t.text3, textTransform: "uppercase", letterSpacing: "0.07em" }}>{label}</span>
      {link
        ? <a href={link} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: t.teal, fontWeight: 500, textDecoration: "none" }}>{value}</a>
        : <span style={{ fontSize: 13, color: t.text, fontWeight: 500 }}>{value}</span>}
    </div>
  );
  return (
    <div onClick={e => e.target === e.currentTarget && onClose()}
      style={{ position: "fixed", inset: 0, background: "rgba(10,10,20,.7)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: t.card, borderRadius: 18, width: "100%", maxWidth: 640, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 24px 64px rgba(0,0,0,.4)" }}>
        {/* Header */}
        <div style={{ background: t.navy, borderRadius: "18px 18px 0 0", padding: "24px 24px 20px", position: "relative" }}>
          <button onClick={onClose} style={{
            position: "absolute", top: 14, right: 14, background: "rgba(255,255,255,.1)", border: "none",
            borderRadius: 8, width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff",
          }}><Svg name="x" size={15} color="#fff" /></button>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 16 }}>
            <Avatar initials={a.initials} color={a.color} size={72} />
            <div>
              <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 24, fontWeight: 700, color: "#fff" }}>{a.name}</div>
              <div style={{ color: "#e8c547", fontSize: 13, marginTop: 2 }}>{a.job} · {a.company}</div>
              <div style={{ color: "rgba(255,255,255,.45)", fontSize: 11, marginTop: 2 }}>Class of {a.year} · {a.id}</div>
            </div>
          </div>
        </div>
        {/* Body */}
        <div style={{ padding: 24 }}>
          {[
            { title: "Contact Information", fields: [
              { label: "Email", value: a.email, link: `mailto:${a.email}` },
              { label: "Phone", value: a.phone },
              { label: "Location", value: a.location },
              { label: "LinkedIn", value: a.linkedin, link: `https://${a.linkedin}` },
            ]},
            { title: "Academic & Professional", fields: [
              { label: "Department", value: a.dept },
              { label: "Graduation Year", value: a.year },
              { label: "Current Role", value: a.job },
              { label: "Organisation", value: a.company },
            ]},
          ].map(section => (
            <div key={section.title} style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: t.text3, textTransform: "uppercase", letterSpacing: "0.08em", paddingBottom: 8, borderBottom: `1px solid ${t.border}`, marginBottom: 12 }}>{section.title}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {section.fields.map(f => <Field key={f.label} {...f} />)}
              </div>
            </div>
          ))}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: t.text3, textTransform: "uppercase", letterSpacing: "0.08em", paddingBottom: 8, borderBottom: `1px solid ${t.border}`, marginBottom: 12 }}>About</div>
            <p style={{ fontSize: 13, color: t.text2, lineHeight: 1.7 }}>{a.bio}</p>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: t.text3, textTransform: "uppercase", letterSpacing: "0.08em", paddingBottom: 8, borderBottom: `1px solid ${t.border}`, marginBottom: 12 }}>Skills & Interests</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {a.skills.map(s => <span key={s} style={{ padding: "4px 12px", background: t.bg2, border: `1px solid ${t.border}`, borderRadius: 7, fontSize: 12, color: t.text2 }}>{s}</span>)}
            </div>
          </div>
        </div>
        <div style={{ padding: "14px 24px", borderTop: `1px solid ${t.border}`, background: t.bg, borderRadius: "0 0 18px 18px", display: "flex", gap: 10 }}>
          <button onClick={() => window.open(`mailto:${a.email}`)} style={btnStyle(t, "primary")}>
            <Svg name="mail" size={14} /> Send Email
          </button>
          <button style={btnStyle(t, "outline")}>
            <Svg name="linkedin" size={14} /> Connect
          </button>
          <button style={{ ...btnStyle(t, "outline"), marginLeft: "auto" }}>
            <Svg name="download" size={14} /> Export
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Reusable button style ────────────────────────────────────────────────────
function btnStyle(t, variant = "primary") {
  if (variant === "primary") return {
    display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px",
    borderRadius: 9, border: "none", background: t.navy, color: t.gold,
    fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "Nunito Sans, sans-serif",
  };
  if (variant === "gold") return {
    display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px",
    borderRadius: 9, border: "none", background: t.gold, color: t.navy,
    fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "Nunito Sans, sans-serif",
  };
  return {
    display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px",
    borderRadius: 9, border: `1px solid ${t.border2}`, background: "transparent", color: t.text2,
    fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "Nunito Sans, sans-serif",
  };
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard({ data, t }) {
  const total = data.length;
  const active = data.filter(a => a.status === "active").length;
  const employed = data.filter(a => a.employed).length;
  const perYear = YEARS.map(y => ({ y, n: data.filter(a => a.year === y).length }));
  const maxN = Math.max(...perYear.map(p => p.n));
  const statCards = [
    { label: "Total Alumni", val: total, icon: "users", accent: t.navy },
    { label: "Active Members", val: active, icon: "check", accent: t.teal },
    { label: "Classes", val: YEARS.length, icon: "award", accent: t.gold },
    { label: "Employed", val: `${Math.round(employed/total*100)}%`, icon: "brief", accent: "#7c3a6b" },
  ];
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 26, fontWeight: 700, color: t.text, margin: 0 }}>Welcome back</h2>
        <p style={{ fontSize: 13, color: t.text3, margin: "4px 0 0" }}>Nambale Magnet School · Alumni Network Overview</p>
      </div>
      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 24 }}>
        {statCards.map((s, i) => (
          <div key={i} style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 14, padding: "18px 20px", position: "relative", overflow: "hidden", boxShadow: t.shadow }}>
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: s.accent, borderRadius: "14px 0 0 14px" }} />
            <div style={{ fontSize: 11, fontWeight: 700, color: t.text3, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 32, fontWeight: 700, color: t.text, lineHeight: 1 }}>{s.val}</div>
          </div>
        ))}
      </div>
      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 16 }}>
        {/* Per-year bar chart */}
        <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 14, padding: "20px 22px", boxShadow: t.shadow }}>
          <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 17, fontWeight: 700, color: t.text, marginBottom: 18 }}>Alumni per Graduating Class</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {perYear.map(p => (
              <div key={p.y} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 11, color: t.text3, width: 64, textAlign: "right", flexShrink: 0 }}>Class {p.y}</span>
                <div style={{ flex: 1, background: t.bg2, borderRadius: 4, height: 20, overflow: "hidden" }}>
                  <div style={{
                    width: `${Math.round(p.n/maxN*100)}%`, height: "100%", borderRadius: 4,
                    background: `linear-gradient(90deg, ${t.navy}, ${t.teal})`,
                    display: "flex", alignItems: "center", paddingLeft: 8, transition: "width .6s ease",
                  }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#fff" }}>{p.n}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Employment breakdown */}
        <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 14, padding: "20px 22px", boxShadow: t.shadow }}>
          <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 17, fontWeight: 700, color: t.text, marginBottom: 18 }}>Employment by Sector</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {JOBS.slice(0,6).map(j => {
              const n = data.filter(a => a.job === j).length;
              return (
                <div key={j}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3, fontSize: 11, color: t.text2 }}>
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "80%" }}>{j}</span>
                    <span style={{ fontWeight: 700, color: t.text, flexShrink: 0, marginLeft: 6 }}>{n}</span>
                  </div>
                  <div style={{ height: 6, background: t.bg2, borderRadius: 3 }}>
                    <div style={{ width: `${Math.max(Math.round(n/15*100), 5)}%`, height: "100%", borderRadius: 3, background: t.teal }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Directory View ───────────────────────────────────────────────────────────
function Directory({ data, t }) {
  const [search, setSearch] = useState("");
  const [classF, setClassF] = useState("all");
  const [deptF, setDeptF] = useState("all");
  const [locF, setLocF] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("name");
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    let r = data.filter(a => a.approved);
    if (classF !== "all") r = r.filter(a => a.year === +classF);
    if (deptF !== "all") r = r.filter(a => a.dept === deptF);
    if (locF !== "all") r = r.filter(a => a.location === locF);
    if (search) {
      const q = search.toLowerCase();
      r = r.filter(a =>
        a.name.toLowerCase().includes(q) ||
        a.dept.toLowerCase().includes(q) ||
        a.company.toLowerCase().includes(q) ||
        String(a.year).includes(q) ||
        a.job.toLowerCase().includes(q) ||
        a.location.toLowerCase().includes(q)
      );
    }
    return [...r].sort((a, b) => sortBy === "name" ? a.name.localeCompare(b.name) : a.year - b.year);
  }, [data, classF, deptF, locF, search, sortBy]);

  useEffect(() => setPage(1), [classF, deptF, locF, search, sortBy]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const inputStyle = { padding: "8px 12px 8px 32px", border: `1px solid ${t.border2}`, borderRadius: 9, background: t.bg, color: t.text, fontSize: 13, outline: "none", fontFamily: "Nunito Sans, sans-serif", width: "100%", boxSizing: "border-box" };
  const selectStyle = { padding: "8px 28px 8px 10px", border: `1px solid ${t.border2}`, borderRadius: 9, background: t.bg, color: t.text2, fontSize: 12, outline: "none", cursor: "pointer", fontFamily: "Nunito Sans, sans-serif", appearance: "none" };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 26, fontWeight: 700, color: t.text, margin: 0 }}>Alumni Directory</h2>
          <p style={{ fontSize: 13, color: t.text3, margin: "4px 0 0" }}>{filtered.length} alumni · All graduating classes</p>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ display: "flex", border: `1px solid ${t.border}`, borderRadius: 9, overflow: "hidden" }}>
            {[{ mode: "grid", icon: "grid" }, { mode: "list", icon: "list" }].map(v => (
              <button key={v.mode} onClick={() => setViewMode(v.mode)} style={{
                padding: "7px 11px", border: "none", cursor: "pointer",
                background: viewMode === v.mode ? t.navy : "transparent",
                color: viewMode === v.mode ? "#fff" : t.text3,
                display: "flex", alignItems: "center",
              }}><Svg name={v.icon} size={14} color={viewMode === v.mode ? "#fff" : t.text3} /></button>
            ))}
          </div>
          <button style={btnStyle(t, "outline")}><Svg name="download" size={14} />Export</button>
        </div>
      </div>

      {/* Class tabs */}
      <div style={{ display: "flex", gap: 5, marginBottom: 14, overflowX: "auto", paddingBottom: 4, flexWrap: "wrap" }}>
        {["all", ...YEARS.map(String)].map(y => (
          <button key={y} onClick={() => setClassF(y)} style={{
            padding: "5px 13px", borderRadius: 20, fontSize: 12, fontWeight: 600,
            border: `1px solid ${classF === y ? t.navy : t.border2}`,
            background: classF === y ? t.navy : "transparent",
            color: classF === y ? (y === "all" ? t.gold : "#fff") : t.text2,
            cursor: "pointer", whiteSpace: "nowrap", fontFamily: "Nunito Sans, sans-serif",
          }}>{y === "all" ? "All Classes" : y}</button>
        ))}
      </div>

      {/* Filters */}
      <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, padding: "12px 16px", marginBottom: 18, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 160 }}>
          <div style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
            <Svg name="search" size={14} color={t.text3} />
          </div>
          <input style={inputStyle} value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, company, year…" />
        </div>
        <select style={selectStyle} value={deptF} onChange={e => setDeptF(e.target.value)}>
          <option value="all">All Depts</option>
          {DEPTS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select style={selectStyle} value={locF} onChange={e => setLocF(e.target.value)}>
          <option value="all">All Locations</option>
          {LOCS.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
        <select style={selectStyle} value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="name">Sort: Name</option>
          <option value="year">Sort: Year</option>
        </select>
      </div>

      {viewMode === "grid" ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 15 }}>
          {pageData.length ? pageData.map(a => <AlumniCard key={a.id} a={a} onClick={setSelected} t={t} />) : (
            <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "48px 0", color: t.text3 }}>
              <Svg name="users" size={40} color={t.border2} /><p style={{ marginTop: 12 }}>No alumni match your filters</p>
            </div>
          )}
        </div>
      ) : (
        <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: t.bg2 }}>
                {["", "Name", "Class", "Department", "Role", "Location", "Status"].map(h => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, fontWeight: 700, color: t.text3, textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageData.map(a => (
                <tr key={a.id} onClick={() => setSelected(a)} style={{ cursor: "pointer", borderTop: `1px solid ${t.border}` }}
                  onMouseEnter={e => { e.currentTarget.style.background = t.bg; }}
                  onMouseLeave={e => { e.currentTarget.style.background = ""; }}>
                  <td style={{ padding: "10px 14px" }}><Avatar initials={a.initials} color={a.color} size={30} /></td>
                  <td style={{ padding: "10px 14px", fontWeight: 700, fontSize: 13, color: t.text }}>{a.name}</td>
                  <td style={{ padding: "10px 14px", fontSize: 13, color: t.text2 }}>{a.year}</td>
                  <td style={{ padding: "10px 14px", fontSize: 13, color: t.text2 }}>{a.dept}</td>
                  <td style={{ padding: "10px 14px", fontSize: 13, color: t.text2 }}>{a.job}</td>
                  <td style={{ padding: "10px 14px", fontSize: 13, color: t.text2 }}>{a.location}</td>
                  <td style={{ padding: "10px 14px" }}><StatusPill status={a.status} t={t} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 20 }}>
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} style={{ ...pgBtn(t), opacity: page === 1 ? 0.4 : 1 }}>‹</button>
          {[...Array(Math.min(totalPages, 8))].map((_, i) => (
            <button key={i} onClick={() => setPage(i + 1)} style={{ ...pgBtn(t), background: page === i + 1 ? t.navy : "transparent", color: page === i + 1 ? "#fff" : t.text2, border: `1px solid ${page === i + 1 ? t.navy : t.border}` }}>{i + 1}</button>
          ))}
          <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} style={{ ...pgBtn(t), opacity: page === totalPages ? 0.4 : 1 }}>›</button>
        </div>
      )}

      {selected && <ProfileModal a={selected} onClose={() => setSelected(null)} t={t} />}
    </div>
  );
}

function pgBtn(t) {
  return { width: 34, height: 34, borderRadius: 8, border: `1px solid ${t.border}`, background: "transparent", color: t.text2, fontSize: 14, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "Nunito Sans, sans-serif" };
}

// ─── Registration Form ─────────────────────────────────────────────────────────
function RegisterForm({ t }) {
  const [form, setForm] = useState({ name: "", dept: "", year: "2026", job: "", company: "", location: "", email: "", phone: "", linkedin: "", bio: "", skills: "" });
  const [done, setDone] = useState(false);
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const inp = { padding: "10px 13px", border: `1px solid ${t.border2}`, borderRadius: 9, background: t.bg, color: t.text, fontSize: 13, outline: "none", fontFamily: "Nunito Sans, sans-serif", width: "100%", boxSizing: "border-box" };
  if (done) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 20px", textAlign: "center" }}>
      <div style={{ width: 64, height: 64, background: t.greenLight, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
        <Svg name="check" size={28} color={t.green} />
      </div>
      <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 22, color: t.text, margin: "0 0 8px" }}>Registration Submitted!</h3>
      <p style={{ color: t.text3, fontSize: 13, maxWidth: 340 }}>Your profile is pending admin approval. You'll be notified once it's live in the directory.</p>
      <button onClick={() => setDone(false)} style={{ ...btnStyle(t, "primary"), marginTop: 20 }}>Register Another</button>
    </div>
  );
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 26, fontWeight: 700, color: t.text, margin: 0 }}>Alumni Registration</h2>
        <p style={{ fontSize: 13, color: t.text3, margin: "4px 0 0" }}>Submit your profile to join the NMS alumni directory</p>
      </div>
      <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 16, padding: 26, maxWidth: 700, boxShadow: t.shadow }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {[
            { k: "name", label: "Full Name *", placeholder: "Amara Odhiambo" },
            { k: "email", label: "Email Address *", placeholder: "you@example.com" },
            { k: "phone", label: "Phone Number", placeholder: "+254 7XX XXX XXX" },
            { k: "linkedin", label: "LinkedIn URL", placeholder: "linkedin.com/in/yourname" },
          ].map(({ k, label, placeholder }) => (
            <div key={k}>
              <label style={{ fontSize: 11, fontWeight: 700, color: t.text3, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</label>
              <input style={inp} value={form[k]} onChange={set(k)} placeholder={placeholder} />
            </div>
          ))}
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: t.text3, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Department *</label>
            <select style={{ ...inp, appearance: "none" }} value={form.dept} onChange={set("dept")}>
              <option value="">Select department</option>
              {DEPTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: t.text3, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Graduation Year *</label>
            <select style={{ ...inp, appearance: "none" }} value={form.year} onChange={set("year")}>
              {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: t.text3, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Current Job Title</label>
            <input style={inp} value={form.job} onChange={set("job")} placeholder="e.g. Software Engineer" />
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: t.text3, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Company / Organisation</label>
            <input style={inp} value={form.company} onChange={set("company")} placeholder="e.g. Safaricom" />
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: t.text3, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Location</label>
            <select style={{ ...inp, appearance: "none" }} value={form.location} onChange={set("location")}>
              <option value="">Select city</option>
              {LOCS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: t.text3, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Skills & Interests</label>
            <input style={inp} value={form.skills} onChange={set("skills")} placeholder="e.g. Leadership, Python, Mentorship" />
          </div>
          <div style={{ gridColumn: "1/-1" }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: t.text3, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Short Bio</label>
            <textarea style={{ ...inp, minHeight: 90, resize: "vertical" }} value={form.bio} onChange={set("bio")} placeholder="Tell us about your journey since graduating from NMS…" />
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button onClick={() => { if (form.name && form.email) setDone(true); }} style={btnStyle(t, "gold")}>
            <Svg name="check" size={14} /> Submit Profile
          </button>
          <button onClick={() => setForm({ name: "", dept: "", year: "2026", job: "", company: "", location: "", email: "", phone: "", linkedin: "", bio: "", skills: "" })} style={btnStyle(t, "outline")}>
            Reset Form
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Admin Panel ──────────────────────────────────────────────────────────────
function AdminPanel({ data, onApprove, onDelete, t }) {
  const [tab, setTab] = useState("pending");
  const pending = data.filter(a => !a.approved);
  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 26, fontWeight: 700, color: t.text, margin: 0 }}>Admin Panel</h2>
        <p style={{ fontSize: 13, color: t.text3, margin: "4px 0 0" }}>Manage alumni records, approvals, and exports</p>
      </div>
      <div style={{ display: "flex", gap: 0, borderBottom: `2px solid ${t.border}`, marginBottom: 20 }}>
        {[
          { id: "pending", label: `Pending (${pending.length})` },
          { id: "all", label: "All Records" },
          { id: "export", label: "Export Data" },
        ].map(tab_ => (
          <button key={tab_.id} onClick={() => setTab(tab_.id)} style={{
            padding: "10px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer",
            border: "none", background: "transparent",
            color: tab === tab_.id ? t.text : t.text3,
            borderBottom: `2px solid ${tab === tab_.id ? t.gold : "transparent"}`,
            marginBottom: -2, fontFamily: "Nunito Sans, sans-serif",
          }}>{tab_.label}</button>
        ))}
      </div>
      {tab === "pending" && (
        <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: t.bg2 }}>
                {["Name", "ID", "Year", "Department", "Status", "Actions"].map(h => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, fontWeight: 700, color: t.text3, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pending.length ? pending.map(a => (
                <tr key={a.id} style={{ borderTop: `1px solid ${t.border}` }}>
                  <td style={{ padding: "10px 14px", fontWeight: 700, fontSize: 13, color: t.text }}>{a.name}</td>
                  <td style={{ padding: "10px 14px", fontSize: 12, color: t.text3 }}>{a.id}</td>
                  <td style={{ padding: "10px 14px", fontSize: 13, color: t.text2 }}>{a.year}</td>
                  <td style={{ padding: "10px 14px", fontSize: 13, color: t.text2 }}>{a.dept}</td>
                  <td style={{ padding: "10px 14px" }}><StatusPill status="pending" t={t} /></td>
                  <td style={{ padding: "10px 14px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => onApprove(a.id)} style={{ ...btnStyle(t, "outline"), padding: "5px 11px", fontSize: 12, background: t.greenLight, color: t.green, border: "none" }}>
                        <Svg name="check" size={12} color={t.green} /> Approve
                      </button>
                      <button onClick={() => onDelete(a.id)} style={{ ...btnStyle(t, "outline"), padding: "5px 11px", fontSize: 12, background: t.redLight, color: t.red, border: "none" }}>
                        <Svg name="trash" size={12} color={t.red} /> Reject
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={6} style={{ padding: 40, textAlign: "center", color: t.text3 }}>✓ No pending approvals</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      {tab === "all" && (
        <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: t.bg2 }}>
                {["", "Name", "Year", "Department", "Location", "Status", "Actions"].map(h => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, fontWeight: 700, color: t.text3, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.slice(0, 20).map(a => (
                <tr key={a.id} style={{ borderTop: `1px solid ${t.border}` }}>
                  <td style={{ padding: "10px 14px" }}><Avatar initials={a.initials} color={a.color} size={28} /></td>
                  <td style={{ padding: "10px 14px", fontWeight: 700, fontSize: 13, color: t.text }}>{a.name}</td>
                  <td style={{ padding: "10px 14px", fontSize: 13, color: t.text2 }}>{a.year}</td>
                  <td style={{ padding: "10px 14px", fontSize: 13, color: t.text2 }}>{a.dept}</td>
                  <td style={{ padding: "10px 14px", fontSize: 13, color: t.text2 }}>{a.location}</td>
                  <td style={{ padding: "10px 14px" }}><StatusPill status={a.status} t={t} /></td>
                  <td style={{ padding: "10px 14px" }}>
                    <div style={{ display: "flex", gap: 5 }}>
                      <button style={{ ...btnStyle(t, "outline"), padding: "5px 8px" }}><Svg name="edit" size={12} /></button>
                      <button onClick={() => onDelete(a.id)} style={{ ...btnStyle(t, "outline"), padding: "5px 8px", background: t.redLight, color: t.red, border: "none" }}><Svg name="trash" size={12} color={t.red} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {tab === "export" && (
        <div>
          <p style={{ fontSize: 13, color: t.text3, marginBottom: 16 }}>{data.length} total records available for export.</p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            {[{ label: "Export as CSV", note: "Excel / Google Sheets compatible" }, { label: "Export as Excel", note: "Full spreadsheet with formatting" }, { label: "Export as PDF", note: "Print-ready alumni roster" }].map(ex => (
              <div key={ex.label} style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 14, padding: "18px 22px", minWidth: 200, textAlign: "center" }}>
                <button style={{ ...btnStyle(t, "primary"), width: "100%", justifyContent: "center", marginBottom: 8 }}><Svg name="download" size={14} />{ex.label}</button>
                <p style={{ fontSize: 11, color: t.text3 }}>{ex.note}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [dark, setDark] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [role, setRole] = useState("alumni");
  const [view, setView] = useState("dashboard");
  const [data, setData] = useState(ALUMNI_DATA);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const t = dark ? THEME.dark : THEME.light;

  const approve = useCallback(id => setData(d => d.map(a => a.id === id ? { ...a, approved: true, status: "active" } : a)), []);
  const del = useCallback(id => setData(d => d.filter(a => a.id !== id)), []);

  if (!authed) return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Nunito+Sans:wght@300;400;600;700&display=swap');*{box-sizing:border-box;margin:0;padding:0}`}</style>
      <AuthScreen onLogin={r => { setRole(r); setAuthed(true); }} t={t} dark={dark} />
    </>
  );

  const pending = data.filter(a => !a.approved).length;
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "home" },
    { id: "directory", label: "Directory", icon: "users" },
    { id: "register", label: "Self-Register", icon: "user" },
    ...(role === "admin" ? [{ id: "admin", label: "Admin Panel", icon: "settings", badge: pending }] : []),
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Nunito+Sans:wght@300;400;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:${t.border2};border-radius:10px}
        body{font-family:'Nunito Sans',sans-serif}
        @media(max-width:768px){.sidebar-el{transform:translateX(-240px)}.sidebar-el.open{transform:translateX(0)}.main-el{margin-left:0!important}}
      `}</style>
      <div style={{ display: "flex", minHeight: "100vh", background: t.bg, fontFamily: "Nunito Sans, sans-serif" }}>
        {/* Sidebar */}
        <div className={`sidebar-el${sidebarOpen ? " open" : ""}`} style={{
          width: 240, background: t.sidebar, position: "fixed", top: 0, left: 0, height: "100vh",
          display: "flex", flexDirection: "column", zIndex: 100, transition: "transform .25s",
          transform: sidebarOpen ? "translateX(0)" : "translateX(-240px)",
        }}>
          <div style={{ padding: "20px 18px 14px", borderBottom: "1px solid rgba(255,255,255,.07)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 38, height: 38, background: t.gold, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, fontWeight: 700, color: t.navy }}>N</span>
              </div>
              <div>
                <div style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>NMS Alumni</div>
                <div style={{ color: t.sidebarText, fontSize: 10, letterSpacing: "0.06em" }}>NAMBALE MAGNET SCHOOL</div>
              </div>
            </div>
          </div>
          <div style={{ padding: "14px 10px", flex: 1, overflowY: "auto" }}>
            <div style={{ fontSize: 10, color: t.sidebarText, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "8px 8px 6px" }}>Navigation</div>
            {navItems.map(item => (
              <button key={item.id} onClick={() => setView(item.id)} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "9px 10px",
                borderRadius: 9, cursor: "pointer", width: "100%", border: "none",
                background: view === item.id ? "rgba(232,197,71,.12)" : "transparent",
                color: view === item.id ? t.sidebarActive : t.sidebarText,
                fontSize: 13, fontWeight: view === item.id ? 600 : 400,
                marginBottom: 2, fontFamily: "Nunito Sans, sans-serif", textAlign: "left",
                transition: "all .15s",
              }}>
                <Svg name={item.icon} size={15} color={view === item.id ? t.sidebarActive : t.sidebarText} />
                {item.label}
                {item.badge > 0 && (
                  <span style={{ marginLeft: "auto", background: t.gold, color: t.navy, fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 20 }}>{item.badge}</span>
                )}
              </button>
            ))}
            <div style={{ fontSize: 10, color: t.sidebarText, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "14px 8px 6px" }}>Classes</div>
            {YEARS.map(y => (
              <button key={y} onClick={() => setView("directory")} style={{
                display: "flex", alignItems: "center", gap: 8, padding: "7px 10px",
                borderRadius: 9, cursor: "pointer", width: "100%", border: "none",
                background: "transparent", color: t.sidebarText, fontSize: 12,
                marginBottom: 1, fontFamily: "Nunito Sans, sans-serif", textAlign: "left",
              }}>
                <span style={{ width: 20, height: 20, background: "rgba(255,255,255,.07)", borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, flexShrink: 0 }}>{String(y).slice(2)}</span>
                Class of {y}
                <span style={{ marginLeft: "auto", fontSize: 10, color: "rgba(168,176,200,.5)" }}>{data.filter(a => a.year === y).length}</span>
              </button>
            ))}
          </div>
          <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,.07)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: t.gold, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: t.navy }}>
                {role === "admin" ? "AD" : "AL"}
              </div>
              <div>
                <div style={{ color: "#fff", fontSize: 12, fontWeight: 600 }}>{role === "admin" ? "Admin User" : "Alumni User"}</div>
                <div style={{ color: t.sidebarText, fontSize: 10, textTransform: "capitalize" }}>{role}</div>
              </div>
              <button onClick={() => setAuthed(false)} title="Sign out" style={{ marginLeft: "auto", background: "transparent", border: "none", cursor: "pointer", color: t.sidebarText, display: "flex", alignItems: "center" }}>
                <Svg name="logout" size={14} color={t.sidebarText} />
              </button>
            </div>
          </div>
        </div>

        {/* Main */}
        <div className="main-el" style={{ marginLeft: sidebarOpen ? 240 : 0, flex: 1, display: "flex", flexDirection: "column", transition: "margin .25s" }}>
          {/* Top bar */}
          <div style={{ background: t.card, borderBottom: `1px solid ${t.border}`, padding: "0 24px", height: 60, display: "flex", alignItems: "center", gap: 14, position: "sticky", top: 0, zIndex: 50 }}>
            <button onClick={() => setSidebarOpen(o => !o)} style={{ background: "transparent", border: "none", cursor: "pointer", padding: 6, borderRadius: 7, color: t.text2, display: "flex" }}>
              <Svg name="menu" size={18} color={t.text2} />
            </button>
            <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 17, fontWeight: 700, color: t.text }}>
              {{ dashboard: "Dashboard", directory: "Alumni Directory", register: "Self-Register", admin: "Admin Panel" }[view] ?? "NMS Alumni"}
            </span>
            <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
              <button onClick={() => setDark(d => !d)} style={{ background: "transparent", border: `1px solid ${t.border}`, borderRadius: 8, width: 36, height: 36, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: t.text2 }}>
                <Svg name={dark ? "sun" : "moon"} size={15} color={t.text2} />
              </button>
              <button onClick={() => setView("register")} style={btnStyle(t, "gold")}>
                <Svg name="plus" size={14} color={t.navy} /> Register
              </button>
            </div>
          </div>
          {/* Content */}
          <div style={{ padding: 24, flex: 1 }}>
            {view === "dashboard" && <Dashboard data={data} t={t} />}
            {view === "directory" && <Directory data={data} t={t} />}
            {view === "register" && <RegisterForm t={t} />}
            {view === "admin" && <AdminPanel data={data} onApprove={approve} onDelete={del} t={t} />}
          </div>
        </div>
      </div>
    </>
  );
}

"use client";

import {
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
  useCallback,
  type ReactNode,
  type CSSProperties,
} from "react";
import Image from "next/image";

/* ═══════════════════════════════════════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════════════════════════════════════ */
type ThemeId = "ivory" | "slate" | "sage" | "midnight" | "blush";

interface Theme {
  id: ThemeId;
  label: string;
  swatch: string;
  bg: string;
  bgAlt: string;
  bgCard: string;
  fg: string;
  fgMuted: string;
  fgSubtle: string;
  accent: string;
  accentFg: string;
  border: string;
  borderStrong: string;
  navBg: string;
  tag: string;
  tagFg: string;
}

interface Property {
  id: number;
  name: string;
  location: string;
  price: string;
  bed: number;
  bath: number;
  sqft: string;
  img: string;
  tag: string;
  isNew: boolean;
}

/* ═══════════════════════════════════════════════════════════════════════════════
   THEMES
═══════════════════════════════════════════════════════════════════════════════ */
const THEMES: Record<ThemeId, Theme> = {
  ivory: {
    id: "ivory", label: "Ivory", swatch: "#f0e8d8",
    bg: "#faf8f4", bgAlt: "#f2ede4", bgCard: "#ffffff",
    fg: "#1a1714", fgMuted: "#6b6560", fgSubtle: "#a09890",
    accent: "#1a1714", accentFg: "#faf8f4",
    border: "rgba(26,23,20,0.1)", borderStrong: "rgba(26,23,20,0.2)",
    navBg: "rgba(250,248,244,0.97)",
    tag: "#e8e0d4", tagFg: "#1a1714",
  },
  slate: {
    id: "slate", label: "Slate", swatch: "#0f1923",
    bg: "#0b1118", bgAlt: "#111922", bgCard: "#141d26",
    fg: "#e8ecf0", fgMuted: "#8a9aaa", fgSubtle: "#4a5a6a",
    accent: "#c9a84c", accentFg: "#0b1118",
    border: "rgba(200,216,230,0.08)", borderStrong: "rgba(200,216,230,0.18)",
    navBg: "rgba(11,17,24,0.97)",
    tag: "rgba(201,168,76,0.12)", tagFg: "#c9a84c",
  },
  sage: {
    id: "sage", label: "Sage", swatch: "#2d3b2e",
    bg: "#f7f6f2", bgAlt: "#eeecea", bgCard: "#ffffff",
    fg: "#1e2b1f", fgMuted: "#5a6b5b", fgSubtle: "#8fa090",
    accent: "#2d3b2e", accentFg: "#f7f6f2",
    border: "rgba(30,43,31,0.1)", borderStrong: "rgba(30,43,31,0.2)",
    navBg: "rgba(247,246,242,0.97)",
    tag: "#dce5dc", tagFg: "#2d3b2e",
  },
  midnight: {
    id: "midnight", label: "Midnight", swatch: "#1a0a2e",
    bg: "#100720", bgAlt: "#160a28", bgCard: "#1c0f30",
    fg: "#f0ecf8", fgMuted: "#9b8db0", fgSubtle: "#5c4f70",
    accent: "#d4a8ff", accentFg: "#100720",
    border: "rgba(212,168,255,0.08)", borderStrong: "rgba(212,168,255,0.2)",
    navBg: "rgba(16,7,32,0.97)",
    tag: "rgba(212,168,255,0.1)", tagFg: "#d4a8ff",
  },
  blush: {
    id: "blush", label: "Blush", swatch: "#f8e8e0",
    bg: "#fdf6f2", bgAlt: "#f5ebe4", bgCard: "#ffffff",
    fg: "#2a1a14", fgMuted: "#7a5a52", fgSubtle: "#b09088",
    accent: "#c45e3e", accentFg: "#ffffff",
    border: "rgba(42,26,20,0.1)", borderStrong: "rgba(42,26,20,0.2)",
    navBg: "rgba(253,246,242,0.97)",
    tag: "#f0d8d0", tagFg: "#c45e3e",
  },
};

/* ═══════════════════════════════════════════════════════════════════════════════
   CONTEXT
═══════════════════════════════════════════════════════════════════════════════ */
const ThemeCtx = createContext<{ t: Theme; setId: (id: ThemeId) => void } | null>(null);
const useT = () => {
  const c = useContext(ThemeCtx);
  if (!c) throw new Error("No ThemeCtx");
  return c;
};

/* ═══════════════════════════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════════════════════════ */
const PROPERTIES: Property[] = [
  { id: 1, name: "The Kensington", location: "Mayfair, London", price: "£4.2M", bed: 4, bath: 4, sqft: "3,840", img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=700&q=80", tag: "Penthouse", isNew: true },
  { id: 2, name: "Park Lane Residences", location: "Upper East Side, NY", price: "$6.8M", bed: 5, bath: 5, sqft: "5,200", img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=700&q=80", tag: "Townhouse", isNew: false },
  { id: 3, name: "Belgravia House", location: "Chelsea, London", price: "£2.9M", bed: 3, bath: 3, sqft: "2,640", img: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=700&q=80", tag: "Villa", isNew: true },
  { id: 4, name: "Hudson Yards Tower", location: "Manhattan, New York", price: "$9.1M", bed: 6, bath: 6, sqft: "7,100", img: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=700&q=80", tag: "Sky Residence", isNew: false },
  { id: 5, name: "St. John's Wood", location: "Hampstead, London", price: "£3.6M", bed: 5, bath: 4, sqft: "4,200", img: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=700&q=80", tag: "Detached", isNew: false },
  { id: 6, name: "The Greenwich", location: "Greenwich Village, NY", price: "$5.4M", bed: 4, bath: 3, sqft: "3,500", img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=700&q=80", tag: "Loft", isNew: true },
];

const TESTIMONIALS = [
  { name: "Jonathan & Claire Ashworth", loc: "London", quote: "Rudhra & Co. found us our forever home in Mayfair within six weeks. The discretion, attention to detail, and deep market knowledge set them apart from every other agency we worked with.", img: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&q=80" },
  { name: "Alexandra Pemberton", loc: "New York", quote: "The concierge service was impeccable. From the private viewings to the legal coordination — everything was handled with extraordinary care. Truly a white-glove experience.", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&q=80" },
  { name: "Robert & Diana Sutherland", loc: "Edinburgh", quote: "We have worked with many agencies across two continents. None have matched the calibre of advice and the genuine passion Rudhra & Co. brought to our search.", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80" },
];

const POSTS = [
  { title: "The Mayfair Market: What Buyers Need to Know in 2025", cat: "Market Analysis", date: "Mar 2025", read: "6 min", img: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&q=80" },
  { title: "New York's Ultra-Luxury Segment Defies Broader Trends", cat: "New York", date: "Feb 2025", read: "8 min", img: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=600&q=80" },
  { title: "Inside the World of Off-Market Property Transactions", cat: "Insight", date: "Jan 2025", read: "5 min", img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80" },
];

const SERVICES = [
  { n: "01", title: "Private Sales", desc: "Discreet, off-market transactions for buyers and sellers who value absolute privacy and precision." },
  { n: "02", title: "Acquisition Advisory", desc: "Expert guidance through every stage — from search strategy to legal completion." },
  { n: "03", title: "Portfolio Management", desc: "Comprehensive management for high-net-worth individuals and family offices." },
  { n: "04", title: "Interior Consultancy", desc: "Introductions to the world's finest designers, architects, and contractors." },
  { n: "05", title: "Relocation Services", desc: "End-to-end relocation support — schools, staffing, concierge, and lifestyle needs." },
  { n: "06", title: "Market Intelligence", desc: "Proprietary data and bespoke research for informed global investment decisions." },
];

const STATS = [
  { v: "£2.4B+", l: "In Sales 2024" },
  { v: "340+", l: "Properties Sold" },
  { v: "18", l: "Years of Excellence" },
  { v: "98%", l: "Client Satisfaction" },
];

const MARQUEE = ["Mayfair · London", "Upper East Side · New York", "Belgravia · London", "Beverly Hills · Los Angeles", "Knightsbridge · London", "Tribeca · New York", "Chelsea · London", "Pacific Heights · San Francisco"];

/* ═══════════════════════════════════════════════════════════════════════════════
   HOOKS
═══════════════════════════════════════════════════════════════════════════════ */
function useReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, vis };
}

/* ═══════════════════════════════════════════════════════════════════════════════
   REVEAL WRAPPER
═══════════════════════════════════════════════════════════════════════════════ */
function Reveal({ children, delay = 0, dir = "up", className = "", style = {} }: {
  children: ReactNode; delay?: number; dir?: "up" | "left" | "right" | "fade";
  className?: string; style?: CSSProperties;
}) {
  const { ref, vis } = useReveal();
  const transforms: Record<string, string> = {
    up: "translateY(30px)", left: "translateX(36px)", right: "translateX(-36px)", fade: "none",
  };
  return (
    <div ref={ref} className={className} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "none" : transforms[dir],
      transition: `opacity 0.85s cubic-bezier(0.19,1,0.22,1) ${delay}s, transform 0.85s cubic-bezier(0.19,1,0.22,1) ${delay}s`,
      ...style,
    }}>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   EYEBROW
═══════════════════════════════════════════════════════════════════════════════ */
function Eyebrow({ label }: { label: string }) {
  const { t } = useT();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
      <div style={{ width: 24, height: 1, background: t.accent, flexShrink: 0 }} />
      <span style={{ color: t.fgMuted, fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase" as const, fontFamily: "var(--font-body)", fontWeight: 300 }}>{label}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   GLOBAL STYLES
═══════════════════════════════════════════════════════════════════════════════ */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@200;300;400;500&display=swap');
    :root { --font-display: 'Cormorant Garamond', Georgia, serif; --font-body: 'DM Sans', system-ui, sans-serif; }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; -webkit-font-smoothing: antialiased; }
    body { font-family: var(--font-body); overflow-x: hidden; }
    ::selection { background: var(--sel-bg, #1a1714); color: var(--sel-fg, #faf8f4); }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--sb, #1a1714); border-radius: 99px; }
    @keyframes fadeUp { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:none; } }
    @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
    @keyframes marquee { from { transform:translateX(0); } to { transform:translateX(-50%); } }
    @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
    .marquee-track { animation: marquee 28s linear infinite; }
    .hero-grain {
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E");
      background-size: 180px;
    }
    a { text-decoration: none; color: inherit; }
    button { font-family: var(--font-body); cursor: pointer; }
    img { display: block; }
    /* Responsive grid helpers */
    .props-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
    .services-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0; }
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); }
    .editorial-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
    .journal-grid { display: grid; grid-template-columns: 1.4fr 1fr 1fr; gap: 28px; }
    .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 100px; }
    .footer-grid { display: grid; grid-template-columns: 1.5fr 1fr 1fr 1fr; gap: 60px; }
    .search-bar { display: flex; }
    .img-collage { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

    @media (max-width: 1100px) {
      .props-grid { grid-template-columns: repeat(2, 1fr); }
      .footer-grid { grid-template-columns: 1fr 1fr; gap: 40px; }
      .editorial-grid { gap: 48px; }
    }
    @media (max-width: 900px) {
      .services-grid { grid-template-columns: repeat(2, 1fr); }
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
      .journal-grid { grid-template-columns: 1fr 1fr; }
      .contact-grid { grid-template-columns: 1fr; gap: 56px; }
      .editorial-grid { grid-template-columns: 1fr; gap: 40px; }
      .img-collage { display: none; }
    }
    @media (max-width: 640px) {
      .props-grid { grid-template-columns: 1fr; }
      .services-grid { grid-template-columns: 1fr; }
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
      .journal-grid { grid-template-columns: 1fr; }
      .footer-grid { grid-template-columns: 1fr 1fr; }
      .search-bar { flex-direction: column; border-radius: 10px !important; }
      .search-field { border-left: none !important; border-top: 1px solid var(--sb-border); }
      .search-btn { border-left: none !important; border-top: 1px solid var(--sb-border); padding: 16px !important; }
    }
  `}</style>
);

/* ═══════════════════════════════════════════════════════════════════════════════
   NAVBAR
═══════════════════════════════════════════════════════════════════════════════ */
function Navbar({ onBook }: { onBook: () => void }) {
  const { t, setId } = useT();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const themeRef = useRef<HTMLDivElement>(null);
  const isLight = ["ivory", "sage", "blush"].includes(t.id);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (themeRef.current && !themeRef.current.contains(e.target as Node)) setThemeOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const logoCol = scrolled || !isLight ? t.fg : "#fff";
  const linkCol = scrolled || !isLight ? t.fgMuted : "rgba(255,255,255,0.82)";

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? t.navBg : "transparent",
        borderBottom: scrolled ? `1px solid ${t.border}` : "1px solid transparent",
        backdropFilter: scrolled ? "blur(18px)" : "none",
        transition: "all 0.4s ease",
      }}>
        <div style={{ maxWidth: 1440, margin: "0 auto", padding: "0 clamp(20px, 4vw, 48px)", height: 70, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Logo */}
          <a href="#" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, width: 26 }}>
              <div style={{ height: 1.5, background: logoCol, transition: "background 0.4s" }} />
              <div style={{ height: 1.5, background: t.accent, width: "68%" }} />
              <div style={{ height: 1.5, background: logoCol, transition: "background 0.4s" }} />
            </div>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "clamp(17px,2.2vw,21px)", fontWeight: 400, color: logoCol, letterSpacing: "0.05em", transition: "color 0.4s" }}>
              Rudhra <span style={{ color: t.accent }}>&</span> Co.
            </span>
          </a>

          {/* Desktop nav */}
          <div style={{ display: "flex", gap: "clamp(20px,3vw,36px)", alignItems: "center" }} className="desktop-nav">
            {["Properties", "About", "Services", "Journal", "Contact"].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`}
                style={{ color: linkCol, fontSize: 11, fontWeight: 300, letterSpacing: "0.14em", textTransform: "uppercase", transition: "color 0.25s" }}
                onMouseEnter={e => (e.currentTarget.style.color = t.accent)}
                onMouseLeave={e => (e.currentTarget.style.color = linkCol)}
              >{l}</a>
            ))}
          </div>

          {/* Right */}
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            {/* Theme picker */}
            <div ref={themeRef} style={{ position: "relative" }}>
              <button onClick={() => setThemeOpen(p => !p)}
                style={{ display: "flex", alignItems: "center", gap: 7, padding: "7px 13px", borderRadius: 99, border: `1px solid ${scrolled || !isLight ? t.borderStrong : "rgba(255,255,255,0.32)"}`, background: "transparent", transition: "all 0.3s" }}>
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: t.accent, display: "block", boxShadow: `0 0 0 2px ${t.bg}` }} />
                <span style={{ color: linkCol, fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 300 }}>{t.label}</span>
              </button>
              {themeOpen && (
                <div style={{ position: "absolute", right: 0, top: "calc(100% + 8px)", background: t.bgCard, border: `1px solid ${t.borderStrong}`, borderRadius: 10, overflow: "hidden", minWidth: 170, boxShadow: "0 24px 48px rgba(0,0,0,0.22)", zIndex: 200 }}>
                  {(Object.keys(THEMES) as ThemeId[]).map(id => {
                    const th = THEMES[id];
                    return (
                      <button key={id} onClick={() => { setId(id); setThemeOpen(false); }}
                        style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "11px 16px", background: id === t.id ? t.bgAlt : "transparent", border: "none", cursor: "pointer", transition: "background 0.2s" }}
                        onMouseEnter={e => (e.currentTarget.style.background = t.bgAlt)}
                        onMouseLeave={e => (e.currentTarget.style.background = id === t.id ? t.bgAlt : "transparent")}>
                        <span style={{ width: 18, height: 18, borderRadius: "50%", background: th.swatch, border: `2px solid ${th.accent}`, display: "block", flexShrink: 0 }} />
                        <span style={{ color: t.fg, fontSize: 13, fontWeight: 400 }}>{th.label}</span>
                        {id === t.id && <span style={{ marginLeft: "auto", color: t.accent }}>✓</span>}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <button onClick={onBook}
              style={{ padding: "10px clamp(14px,2vw,22px)", background: t.accent, color: t.accentFg, border: "none", borderRadius: 5, fontSize: 11, fontWeight: 500, letterSpacing: "0.13em", textTransform: "uppercase", transition: "opacity 0.2s", whiteSpace: "nowrap" }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.82")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
              Book Viewing
            </button>

            {/* Burger */}
            <button onClick={() => setMenuOpen(p => !p)}
              style={{ display: "none", flexDirection: "column", gap: 4, background: "none", border: "none", padding: 6 }}
              className="burger-btn">
              {[0, 1, 2].map(i => (
                <span key={i} style={{ display: "block", width: 22, height: 1.5, background: logoCol, transition: "all 0.3s", transform: menuOpen && i === 0 ? "rotate(45deg) translateY(5.5px)" : menuOpen && i === 2 ? "rotate(-45deg) translateY(-5.5px)" : "none", opacity: menuOpen && i === 1 ? 0 : 1 }} />
              ))}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{ background: t.navBg, borderTop: `1px solid ${t.border}`, padding: "20px 24px 28px" }}>
            {["Properties", "About", "Services", "Journal", "Contact"].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMenuOpen(false)}
                style={{ display: "block", padding: "12px 0", color: t.fg, fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", borderBottom: `1px solid ${t.border}` }}>
                {l}
              </a>
            ))}
            <div style={{ display: "flex", gap: 10, marginTop: 20, flexWrap: "wrap" }}>
              {(Object.keys(THEMES) as ThemeId[]).map(id => (
                <button key={id} onClick={() => { setId(id); setMenuOpen(false); }}
                  style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 12px", borderRadius: 99, border: `1px solid ${id === t.id ? t.accent : t.border}`, background: id === t.id ? t.accent : "transparent", color: id === t.id ? t.accentFg : t.fgMuted, fontSize: 11 }}>
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: THEMES[id].swatch, display: "block" }} />
                  {THEMES[id].label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      <style>{`
        @media (max-width: 768px) { .desktop-nav { display: none !important; } .burger-btn { display: flex !important; } }
        @media (min-width: 769px) { .burger-btn { display: none !important; } }
      `}</style>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   HERO
═══════════════════════════════════════════════════════════════════════════════ */
function Hero({ onContact }: { onContact: () => void }) {
  const { t } = useT();
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 180); }, []);

  const trans = (delay: number) => ({
    opacity: loaded ? 1 : 0,
    transform: loaded ? "none" : "translateY(22px)",
    transition: `opacity 2s cubic-bezier(0.19,1,0.22,1) ${delay}s, transform 0.9s cubic-bezier(0.19,1,0.22,1) ${delay}s`,
  });

  return (
    <section style={{ position: "relative", height: "100svh", minHeight: 600, display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
      <video autoPlay muted loop playsInline style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        poster="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1800&q=80">
        <source src="/RealEstate_Hero_30s.mp4" type="video/mp4" />
      </video>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(105deg, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.3) 55%, rgba(0,0,0,0.1) 100%)" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 52%)" }} />
      <div className="hero-grain" style={{ position: "absolute", inset: 0, opacity: 0.18 }} />

      <div style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: 1440, margin: "0 auto", padding: "0 clamp(20px,4vw,48px) clamp(60px,8vh,96px)" }}>
        <div style={{ maxWidth: 700 }}>
          <div style={{ ...trans(0.3), display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
            <div style={{ width: 32, height: 1, background: t.accent }} />
          
          </div>


          <div style={{ ...trans(0.9), display: "flex", gap: 14, flexWrap: "wrap",alignItems:"center" }}>
            {/* <a href="#properties"
              style={{ padding: "clamp(13px,1.5vh,16px) clamp(22px,3vw,38px)", background: "#fff", color: "#0f0f0f", fontSize: 11, fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", borderRadius: 4, fontFamily: "var(--font-body)", transition: "all 0.3s", display: "inline-block" }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = t.accent; (e.currentTarget as HTMLAnchorElement).style.color = t.accentFg; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "#fff"; (e.currentTarget as HTMLAnchorElement).style.color = "#0f0f0f"; }}>
              View Collection
            </a>
            <button onClick={onContact}
              style={{ padding: "clamp(13px,1.5vh,16px) clamp(22px,3vw,38px)", background: "transparent", color: "#fff", fontSize: 11, fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", border: "1px solid rgba(255,255,255,0.38)", borderRadius: 4, fontFamily: "var(--font-body)", transition: "all 0.3s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.8)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.38)"; }}>
              Private Enquiry
            </button> */}
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div style={{ position: "absolute", bottom: 32, right: "clamp(20px,4vw,48px)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, zIndex: 2 }}>
        <div style={{ width: 1, height: 52, background: "linear-gradient(to bottom, rgba(255,255,255,0.5), transparent)" }} />
        <span style={{ color: "rgba(255,255,255,0.42)", fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase", writingMode: "vertical-rl", fontFamily: "var(--font-body)" }}>Scroll</span>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   MARQUEE
═══════════════════════════════════════════════════════════════════════════════ */
function MarqueeBanner() {
  const { t } = useT();
  const items = [...MARQUEE, ...MARQUEE, ...MARQUEE];
  return (
    <div style={{ borderTop: `1px solid ${t.border}`, borderBottom: `1px solid ${t.border}`, padding: "14px 0", overflow: "hidden", background: t.bgAlt }}>
      <div className="marquee-track" style={{ display: "flex", gap: 52, whiteSpace: "nowrap" }}>
        {items.map((item, i) => (
          <span key={i} style={{ color: t.fgMuted, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "var(--font-body)", fontWeight: 300, display: "inline-flex", alignItems: "center", gap: 52 }}>
            {item}
            <span style={{ color: t.accent, fontSize: 12 }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   STATS
═══════════════════════════════════════════════════════════════════════════════ */
function Stats() {
  const { t } = useT();
  return (
    <section style={{ background: t.bg, padding: "clamp(56px,8vh,100px) clamp(20px,4vw,48px)" }}>
      <div style={{ maxWidth: 1440, margin: "0 auto" }}>
        <Reveal>
          <div className="stats-grid">
            {STATS.map((s, i) => (
              <div key={s.l} style={{ padding: "clamp(28px,4vh,44px) clamp(20px,3vw,36px)", borderLeft: i > 0 ? `1px solid ${t.border}` : "none", textAlign: i === 0 ? "left" : "center" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px,4vw,56px)", fontWeight: 300, color: t.fg, letterSpacing: "-0.025em", lineHeight: 1 }}>{s.v}</div>
                <div style={{ color: t.fgMuted, fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", marginTop: 10, fontFamily: "var(--font-body)", fontWeight: 300 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   SEARCH
═══════════════════════════════════════════════════════════════════════════════ */
function SearchSection() {
  const { t } = useT();
  const [loc, setLoc] = useState("London");
  const [type, setType] = useState("All Types");
  const [price, setPrice] = useState("Any Price");
  const [bed, setBed] = useState("Any");

  const selStyle: CSSProperties = {
    width: "100%", padding: "13px 16px", background: "transparent", border: "none",
    color: t.fg, fontSize: 14, fontFamily: "var(--font-body)", fontWeight: 300, cursor: "pointer", outline: "none",
  };

  const fields = [
    { label: "Location", val: loc, set: setLoc, opts: ["London", "New York", "Los Angeles", "Edinburgh", "Manchester"] },
    { label: "Type", val: type, set: setType, opts: ["All Types", "Penthouse", "Townhouse", "Villa", "Apartment", "Loft"] },
    { label: "Price", val: price, set: setPrice, opts: ["Any Price", "Up to £1M", "£1M–£3M", "£3M–£6M", "£6M+"] },
    { label: "Bedrooms", val: bed, set: setBed, opts: ["Any", "1+", "2+", "3+", "4+", "5+"] },
  ];

  return (
    <section style={{ background: t.bgAlt, padding: "0 clamp(20px,4vw,48px) clamp(56px,8vh,80px)" }}>
      <div style={{ maxWidth: 1440, margin: "0 auto" }}>
        <Reveal>
          <div className="search-bar" style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 8, overflow: "hidden", boxShadow: "0 8px 40px rgba(0,0,0,0.06)" }}
            ref={(el: HTMLDivElement | null) => { if (el) el.style.setProperty("--sb-border", t.border); }}>
            {fields.map((f, i) => (
              <div key={f.label} className="search-field" style={{ flex: 1, borderLeft: i > 0 ? `1px solid ${t.border}` : "none", padding: "0 4px" }}>
                <label style={{ display: "block", padding: "12px 12px 0", fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase", color: t.fgSubtle, fontFamily: "var(--font-body)" }}>{f.label}</label>
                <select value={f.val} onChange={e => f.set(e.target.value)} style={selStyle}>
                  {f.opts.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
            <div className="search-btn" style={{ borderLeft: `1px solid ${t.border}`, display: "flex" }}>
              <button style={{ padding: "0 clamp(20px,3vw,36px)", background: t.accent, color: t.accentFg, border: "none", fontSize: 11, fontWeight: 500, letterSpacing: "0.16em", textTransform: "uppercase", cursor: "pointer", fontFamily: "var(--font-body)", whiteSpace: "nowrap", transition: "opacity 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "0.82")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
                Search →
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   PROPERTIES
═══════════════════════════════════════════════════════════════════════════════ */
function PropertyCard({ p, i }: { p: Property; i: number }) {
  const { t } = useT();
  const [hov, setHov] = useState(false);
  return (
    <Reveal delay={i * 0.07}>
      <article onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
        style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 4, overflow: "hidden", cursor: "pointer", transform: hov ? "translateY(-6px)" : "none", boxShadow: hov ? "0 28px 56px rgba(0,0,0,0.14)" : "none", transition: "all 0.45s cubic-bezier(0.19,1,0.22,1)" }}>
        <div style={{ position: "relative", height: "clamp(200px,22vw,280px)", overflow: "hidden" }}>
          <Image src={p.img} alt={p.name} fill sizes="(max-width:640px) 100vw,(max-width:1100px) 50vw,33vw" className="object-cover"
            style={{ transform: hov ? "scale(1.06)" : "scale(1)", transition: "transform 0.85s cubic-bezier(0.19,1,0.22,1)" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.44), transparent 55%)", opacity: hov ? 1 : 0, transition: "opacity 0.4s" }} />
          <div style={{ position: "absolute", top: 16, left: 16 }}>
            <span style={{ padding: "5px 11px", background: t.bgCard, color: t.fg, fontSize: 9, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", borderRadius: 2, fontFamily: "var(--font-body)" }}>{p.tag}</span>
          </div>
          {p.isNew && (
            <div style={{ position: "absolute", top: 16, right: 16 }}>
              <span style={{ padding: "5px 11px", background: t.accent, color: t.accentFg, fontSize: 9, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", borderRadius: 2, fontFamily: "var(--font-body)" }}>New</span>
            </div>
          )}
          <div style={{ position: "absolute", bottom: 16, left: 16, opacity: hov ? 1 : 0, transform: hov ? "none" : "translateY(6px)", transition: "all 0.4s" }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 400, color: "#fff" }}>{p.price}</span>
          </div>
        </div>
        <div style={{ padding: "clamp(16px,2vw,24px)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 7 }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(18px,2vw,22px)", fontWeight: 400, color: t.fg, letterSpacing: "-0.01em" }}>{p.name}</h3>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "clamp(16px,1.8vw,20px)", fontWeight: 400, color: t.accent }}>{p.price}</span>
          </div>
          <p style={{ color: t.fgMuted, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16, fontFamily: "var(--font-body)", fontWeight: 300 }}>📍 {p.location}</p>
          <div style={{ display: "flex", gap: "clamp(12px,2vw,22px)", paddingTop: 16, borderTop: `1px solid ${t.border}` }}>
            {[["🛏", `${p.bed} Bed`], ["🛁", `${p.bath} Bath`], ["◻", `${p.sqft} ft²`]].map(([icon, val]) => (
              <div key={val as string} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ fontSize: 12 }}>{icon}</span>
                <span style={{ color: t.fgMuted, fontSize: 12, fontFamily: "var(--font-body)", fontWeight: 300 }}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      </article>
    </Reveal>
  );
}

function Properties() {
  const { t } = useT();
  return (
    <section id="properties" style={{ background: t.bg, padding: "clamp(64px,10vh,110px) clamp(20px,4vw,48px)" }}>
      <div style={{ maxWidth: 1440, margin: "0 auto" }}>
        <Reveal style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "clamp(36px,5vh,64px)", flexWrap: "wrap", gap: 16 }}>
          <div>
            <Eyebrow label="Curated Collection" />
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px,4.5vw,60px)", fontWeight: 300, color: t.fg, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
              Featured<br /><em>Residences</em>
            </h2>
          </div>
          <a href="#" style={{ color: t.fgMuted, fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", fontFamily: "var(--font-body)", display: "flex", alignItems: "center", gap: 8, transition: "color 0.25s" }}
            onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = t.accent)}
            onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = t.fgMuted)}>
            View All <span style={{ fontSize: 16 }}>→</span>
          </a>
        </Reveal>
        <div className="props-grid">
          {PROPERTIES.map((p, i) => <PropertyCard key={p.id} p={p} i={i} />)}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   EDITORIAL / ABOUT
═══════════════════════════════════════════════════════════════════════════════ */
function Editorial() {
  const { t } = useT();
  return (
    <section id="about" style={{ background: t.bgAlt, padding: "clamp(64px,10vh,120px) clamp(20px,4vw,48px)" }}>
      <div style={{ maxWidth: 1440, margin: "0 auto" }}>
        <div className="editorial-grid">
          <Reveal>
            <Eyebrow label="Our Approach" />
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px,3.5vw,54px)", fontWeight: 300, color: t.fg, lineHeight: 1.15, letterSpacing: "-0.02em", marginBottom: 26 }}>
              Discretion.<br /><em>Expertise.</em><br />Results.
            </h2>
            <p style={{ color: t.fgMuted, fontSize: "clamp(13px,1.2vw,15px)", lineHeight: 1.88, fontFamily: "var(--font-body)", fontWeight: 300, marginBottom: 20 }}>
              Founded in 2006, Rudhra  & Co. has become synonymous with the highest echelon of residential property. We operate on a strictly private basis — offering exclusive access to off-market properties across London, New York, Los Angeles, and Edinburgh.
            </p>
            <p style={{ color: t.fgMuted, fontSize: "clamp(13px,1.2vw,15px)", lineHeight: 1.88, fontFamily: "var(--font-body)", fontWeight: 300, marginBottom: 44 }}>
              Our team of 40 specialists brings unrivalled local knowledge, a global network, and a commitment to service that is simply without parallel in the luxury property market.
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <a href="#services" style={{ padding: "13px 28px", background: t.accent, color: t.accentFg, fontSize: 11, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "var(--font-body)", borderRadius: 4, transition: "opacity 0.2s" }}
                onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.opacity = "0.82")}
                onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.opacity = "1")}>
                Our Services
              </a>
              <a href="#contact" style={{ padding: "13px 28px", background: "transparent", color: t.fg, fontSize: 11, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "var(--font-body)", border: `1px solid ${t.borderStrong}`, borderRadius: 4 }}>
                Enquire Now
              </a>
            </div>
          </Reveal>
          <Reveal delay={0.2} dir="left">
            <div className="img-collage">
              <div style={{ borderRadius: 4, overflow: "hidden", height: "clamp(180px,20vw,280px)", position: "relative" }}>
                <Image src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=600&q=80" alt="Interior" fill sizes="300px" className="object-cover" style={{ transition: "transform 0.7s ease" }}
                  onMouseEnter={e => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.05)")}
                  onMouseLeave={e => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1)")} />
              </div>
              <div style={{ borderRadius: 4, overflow: "hidden", height: "clamp(180px,20vw,280px)", marginTop: 32, position: "relative" }}>
                <Image src="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600&q=80" alt="Living" fill sizes="300px" className="object-cover" style={{ transition: "transform 0.7s ease" }}
                  onMouseEnter={e => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.05)")}
                  onMouseLeave={e => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1)")} />
              </div>
              <div style={{ borderRadius: 4, overflow: "hidden", height: "clamp(140px,15vw,200px)", gridColumn: "1/-1", position: "relative" }}>
                <Image src="https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800&q=80" alt="Location" fill sizes="600px" className="object-cover" style={{ transition: "transform 0.7s ease" }}
                  onMouseEnter={e => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.05)")}
                  onMouseLeave={e => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1)")} />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   SERVICES
═══════════════════════════════════════════════════════════════════════════════ */
function Services() {
  const { t } = useT();
  return (
    <section id="services" style={{ background: t.bg, padding: "clamp(64px,10vh,120px) clamp(20px,4vw,48px)" }}>
      <div style={{ maxWidth: 1440, margin: "0 auto" }}>
        <Reveal style={{ marginBottom: "clamp(40px,6vh,72px)" }}>
          <Eyebrow label="What We Offer" />
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px,4vw,56px)", fontWeight: 300, color: t.fg, letterSpacing: "-0.02em" }}>
            A Full Suite of<br /><em>Bespoke Services</em>
          </h2>
        </Reveal>
        <div className="services-grid">
          {SERVICES.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.06}>
              <div style={{ padding: "clamp(28px,3vw,44px)", borderRight: i % 3 !== 2 ? `1px solid ${t.border}` : "none", borderBottom: i < 3 ? `1px solid ${t.border}` : "none", transition: "background 0.3s" }}
                onMouseEnter={e => ((e.currentTarget as HTMLDivElement).style.background = t.bgAlt)}
                onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.background = "transparent")}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px,4vw,48px)", fontWeight: 300, color: t.accent, opacity: 0.28, lineHeight: 1, marginBottom: 18 }}>{s.n}</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(18px,2vw,24px)", fontWeight: 400, color: t.fg, marginBottom: 12 }}>{s.title}</h3>
                <p style={{ color: t.fgMuted, fontSize: "clamp(12px,1.1vw,14px)", lineHeight: 1.78, fontFamily: "var(--font-body)", fontWeight: 300 }}>{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   TESTIMONIALS
═══════════════════════════════════════════════════════════════════════════════ */
function Testimonials() {
  const { t } = useT();
  const [active, setActive] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setActive(p => (p + 1) % TESTIMONIALS.length), 5200);
    return () => clearInterval(id);
  }, []);
  const tm = TESTIMONIALS[active];
  return (
    <section style={{ background: t.bgAlt, padding: "clamp(64px,10vh,120px) clamp(20px,4vw,48px)" }}>
      <div style={{ maxWidth: 960, margin: "0 auto", textAlign: "center" }}>
        <Reveal>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 16, marginBottom: "clamp(36px,5vh,60px)" }}>
            <div style={{ width: 22, height: 1, background: t.accent }} />
            <span style={{ color: t.fgMuted, fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", fontFamily: "var(--font-body)", fontWeight: 300 }}>Client Stories</span>
            <div style={{ width: 22, height: 1, background: t.accent }} />
          </div>
        </Reveal>
        <div key={active} style={{ animation: "fadeIn 0.55s ease" }}>
          <blockquote style={{ fontFamily: "var(--font-display)", fontSize: "clamp(18px,2.6vw,30px)", fontWeight: 300, fontStyle: "italic", color: t.fg, lineHeight: 1.65, marginBottom: "clamp(28px,4vh,48px)", letterSpacing: "-0.01em" }}>
            &ldquo;{tm.quote}&rdquo;
          </blockquote>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14 }}>
            <div style={{ width: 46, height: 46, borderRadius: "50%", overflow: "hidden", position: "relative", flexShrink: 0 }}>
              <Image src={tm.img} alt={tm.name} fill sizes="46px" className="object-cover" />
            </div>
            <div style={{ textAlign: "left" }}>
              <div style={{ color: t.fg, fontSize: 14, fontWeight: 500, fontFamily: "var(--font-body)" }}>{tm.name}</div>
              <div style={{ color: t.fgMuted, fontSize: 12, fontFamily: "var(--font-body)", fontWeight: 300 }}>{tm.loc}</div>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 40 }}>
          {TESTIMONIALS.map((_, i) => (
            <button key={i} onClick={() => setActive(i)}
              style={{ width: i === active ? 28 : 6, height: 6, borderRadius: 99, background: i === active ? t.accent : t.border, border: "none", cursor: "pointer", transition: "all 0.4s" }} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   JOURNAL
═══════════════════════════════════════════════════════════════════════════════ */
function Journal() {
  const { t } = useT();
  return (
    <section id="journal" style={{ background: t.bg, padding: "clamp(64px,10vh,120px) clamp(20px,4vw,48px)" }}>
      <div style={{ maxWidth: 1440, margin: "0 auto" }}>
        <Reveal style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "clamp(36px,5vh,60px)", flexWrap: "wrap", gap: 16 }}>
          <div>
            <Eyebrow label="The Journal" />
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px,4vw,52px)", fontWeight: 300, color: t.fg, letterSpacing: "-0.02em" }}>
              Intelligence &<br /><em>Perspective</em>
            </h2>
          </div>
          <a href="#" style={{ color: t.fgMuted, fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", fontFamily: "var(--font-body)", transition: "color 0.25s" }}
            onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = t.accent)}
            onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = t.fgMuted)}>
            All Articles →
          </a>
        </Reveal>
        <div className="journal-grid">
          {POSTS.map((post, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <article style={{ cursor: "pointer" }}>
                <div style={{ borderRadius: 4, overflow: "hidden", height: i === 0 ? "clamp(200px,22vw,320px)" : "clamp(160px,18vw,220px)", marginBottom: 20, position: "relative" }}>
                  <Image src={post.img} alt={post.title} fill sizes="(max-width:640px) 100vw,(max-width:900px) 50vw,40vw" className="object-cover"
                    style={{ transition: "transform 0.75s cubic-bezier(0.19,1,0.22,1)" }}
                    onMouseEnter={e => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.05)")}
                    onMouseLeave={e => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1)")} />
                </div>
                <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 10 }}>
                  <span style={{ padding: "3px 9px", background: t.tag, color: t.tagFg, fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", fontFamily: "var(--font-body)", borderRadius: 2 }}>{post.cat}</span>
                  <span style={{ color: t.fgSubtle, fontSize: 12, fontFamily: "var(--font-body)", fontWeight: 300 }}>{post.date} · {post.read} read</span>
                </div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: i === 0 ? "clamp(16px,1.8vw,22px)" : "clamp(14px,1.5vw,18px)", fontWeight: 400, color: t.fg, lineHeight: 1.32, letterSpacing: "-0.01em", transition: "color 0.25s" }}
                  onMouseEnter={e => ((e.currentTarget as HTMLHeadingElement).style.color = t.accent)}
                  onMouseLeave={e => ((e.currentTarget as HTMLHeadingElement).style.color = t.fg)}>
                  {post.title}
                </h3>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   CONTACT
═══════════════════════════════════════════════════════════════════════════════ */
function Contact() {
  const { t } = useT();
  const [form, setForm] = useState({ name: "", email: "", phone: "", interest: "", message: "" });
  const [sent, setSent] = useState(false);
  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const inputStyle: CSSProperties = {
    width: "100%", padding: "12px 0", background: "transparent", border: "none",
    borderBottom: `1px solid ${t.border}`, color: t.fg, fontSize: 14,
    fontFamily: "var(--font-body)", fontWeight: 300, outline: "none", transition: "border-color 0.3s",
  };
  const labelStyle: CSSProperties = {
    display: "block", color: t.fgSubtle, fontSize: 9, letterSpacing: "0.22em",
    textTransform: "uppercase", fontFamily: "var(--font-body)", marginBottom: 7,
  };

  return (
    <section id="contact" style={{ background: t.bgAlt, padding: "clamp(64px,10vh,120px) clamp(20px,4vw,48px)" }}>
      <div style={{ maxWidth: 1440, margin: "0 auto" }}>
        <div className="contact-grid">
          <Reveal>
            <Eyebrow label="Get In Touch" />
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px,4vw,52px)", fontWeight: 300, color: t.fg, lineHeight: 1.15, letterSpacing: "-0.02em", marginBottom: 26 }}>
              Begin Your<br /><em>Property Journey</em>
            </h2>
            <p style={{ color: t.fgMuted, fontSize: "clamp(13px,1.2vw,15px)", lineHeight: 1.82, fontFamily: "var(--font-body)", fontWeight: 300, maxWidth: 420, marginBottom: 48 }}>
              Whether searching for your first luxury residence or expanding a global portfolio, our advisors are ready to provide a completely personalised consultation.
            </p>
            {[
              { label: "London Office", val: "+44 20 7946 0201\nhello@Rudhra andco.com\n12 Grosvenor Square, W1K 6JP" },
              { label: "New York Office", val: "+1 (212) 555 0147\nny@Rudhra andco.com\n740 Park Avenue, NY 10021" },
            ].map(o => (
              <div key={o.label} style={{ marginBottom: 28 }}>
                <div style={{ color: t.fgSubtle, fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase", fontFamily: "var(--font-body)", marginBottom: 8 }}>{o.label}</div>
                <div style={{ color: t.fgMuted, fontSize: 13, lineHeight: 1.72, fontFamily: "var(--font-body)", fontWeight: 300, whiteSpace: "pre-line" }}>{o.val}</div>
              </div>
            ))}
          </Reveal>

          <Reveal delay={0.2}>
            {sent ? (
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "100%" }}>
                <div style={{ width: 52, height: 52, borderRadius: "50%", background: t.accent, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 22 }}>
                  <span style={{ color: t.accentFg, fontSize: 20 }}>✓</span>
                </div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 300, color: t.fg, marginBottom: 14 }}>Thank You</h3>
                <p style={{ color: t.fgMuted, fontSize: 14, lineHeight: 1.72, fontFamily: "var(--font-body)" }}>Your enquiry has been received. A senior advisor will be in touch within one business day.</p>
              </div>
            ) : (
              <form onSubmit={e => { e.preventDefault(); setSent(true); }} style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                  {[["name","Full Name","text"],["email","Email","email"],["phone","Phone","tel"],["interest","Interest","text"]].map(([n,l,tp]) => (
                    <div key={n}>
                      <label style={labelStyle}>{l}</label>
                      <input name={n} type={tp} value={form[n as keyof typeof form]} onChange={handle} style={inputStyle}
                        onFocus={e => (e.currentTarget.style.borderBottomColor = t.accent)}
                        onBlur={e => (e.currentTarget.style.borderBottomColor = t.border)} />
                    </div>
                  ))}
                </div>
                <div>
                  <label style={labelStyle}>Message</label>
                  <textarea name="message" value={form.message} onChange={handle} rows={4} style={{ ...inputStyle, resize: "none" }}
                    onFocus={e => (e.currentTarget.style.borderBottomColor = t.accent)}
                    onBlur={e => (e.currentTarget.style.borderBottomColor = t.border)} />
                </div>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <button type="submit" style={{ flex: 1, minWidth: 140, padding: "14px", background: t.accent, color: t.accentFg, border: "none", fontSize: 11, fontWeight: 500, letterSpacing: "0.16em", textTransform: "uppercase", borderRadius: 4, cursor: "pointer", fontFamily: "var(--font-body)", transition: "opacity 0.2s" }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = "0.82")}
                    onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
                    Send Enquiry
                  </button>
                  <button type="button" style={{ padding: "14px 24px", background: "transparent", color: t.fg, border: `1px solid ${t.borderStrong}`, fontSize: 11, fontWeight: 500, letterSpacing: "0.16em", textTransform: "uppercase", borderRadius: 4, cursor: "pointer", fontFamily: "var(--font-body)" }}>
                    Call Back
                  </button>
                </div>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   FOOTER
═══════════════════════════════════════════════════════════════════════════════ */
function Footer() {
  const { t } = useT();
  const isLight = ["ivory", "sage", "blush"].includes(t.id);
  const bg = isLight ? "#111" : "#000";
  const fg = "rgba(255,255,255,0.56)";
  const fg2 = "#fff";
  const bdr = "rgba(255,255,255,0.08)";
  const cols = [
    { h: "Properties", ls: ["Mayfair Collection", "NY Penthouses", "Chelsea Townhouses", "Off-Market", "New Developments"] },
    { h: "Services", ls: ["Private Sales", "Acquisition Advisory", "Portfolio Management", "Relocation", "Market Intelligence"] },
    { h: "Company", ls: ["About Us", "Our Team", "Press & Awards", "Sustainability", "Careers"] },
  ];
  return (
    <footer style={{ background: bg, padding: "clamp(52px,8vh,80px) clamp(20px,4vw,48px) clamp(28px,4vh,36px)" }}>
      <div style={{ maxWidth: 1440, margin: "0 auto" }}>
        <div className="footer-grid" style={{ marginBottom: "clamp(40px,6vh,70px)", paddingBottom: "clamp(40px,6vh,60px)", borderBottom: `1px solid ${bdr}` }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, width: 24 }}>
                <div style={{ height: 1.5, background: fg2 }} />
                <div style={{ height: 1.5, background: t.accent, width: "68%" }} />
                <div style={{ height: 1.5, background: fg2 }} />
              </div>
              <span style={{ fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 400, color: fg2, letterSpacing: "0.04em" }}>
                Rudhra  <span style={{ color: t.accent }}>&</span> Co.
              </span>
            </div>
            <p style={{ color: fg, fontSize: 13, lineHeight: 1.8, fontFamily: "var(--font-body)", fontWeight: 300, maxWidth: 270, marginBottom: 28 }}>
              London&apos;s and New York&apos;s preeminent luxury property consultancy. Established 2006.
            </p>
            <div style={{ display: "flex", gap: 9, flexWrap: "wrap" }}>
              {["IG", "LI", "YT", "TW"].map(s => (
                <button key={s} style={{ width: 34, height: 34, borderRadius: "50%", border: `1px solid ${bdr}`, background: "transparent", color: fg, fontSize: 10, cursor: "pointer", letterSpacing: "0.08em", fontFamily: "var(--font-body)", transition: "all 0.25s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = t.accent; e.currentTarget.style.color = t.accent; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = bdr; e.currentTarget.style.color = fg; }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          {cols.map(col => (
            <div key={col.h}>
              <h5 style={{ color: fg2, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "var(--font-body)", marginBottom: 22, fontWeight: 400 }}>{col.h}</h5>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 11 }}>
                {col.ls.map(l => (
                  <li key={l}>
                    <a href="#" style={{ color: fg, fontSize: 13, fontFamily: "var(--font-body)", fontWeight: 300, transition: "color 0.2s" }}
                      onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = fg2)}
                      onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = fg)}>
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
          <p style={{ color: fg, fontSize: 11, fontFamily: "var(--font-body)" }}>© 2025 Rudhra  & Co. Ltd. All rights reserved. FCA Authorised.</p>
          <div style={{ display: "flex", gap: "clamp(14px,2vw,26px)", flexWrap: "wrap" }}>
            {["Privacy", "Terms", "Cookies", "Accessibility"].map(l => (
              <a key={l} href="#" style={{ color: fg, fontSize: 11, fontFamily: "var(--font-body)", transition: "color 0.2s" }}
                onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = fg2)}
                onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = fg)}>
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   BOOKING MODAL
═══════════════════════════════════════════════════════════════════════════════ */
function BookingModal({ onClose }: { onClose: () => void }) {
  const { t } = useT();
  const [step, setStep] = useState<1 | 2>(1);
  const [sel, setSel] = useState<number | null>(null);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, [onClose]);

  const inputStyle: CSSProperties = {
    width: "100%", padding: "11px 0", background: "transparent", border: "none",
    borderBottom: `1px solid ${t.border}`, color: t.fg, fontSize: 14,
    fontFamily: "var(--font-body)", fontWeight: 300, outline: "none", transition: "border-color 0.3s",
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: "clamp(12px,2vw,20px)" }} onClick={onClose}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.72)", backdropFilter: "blur(10px)" }} />
      <div onClick={e => e.stopPropagation()} style={{ position: "relative", background: t.bgCard, width: "100%", maxWidth: 500, borderRadius: 8, overflow: "hidden", animation: "fadeUp 0.4s ease", boxShadow: "0 40px 80px rgba(0,0,0,0.44)", maxHeight: "90vh", overflowY: "auto" }}>
        {/* Header */}
        <div style={{ height: 170, position: "relative", overflow: "hidden" }}>
          <Image src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=700&q=80" alt="" fill sizes="500px" className="object-cover" />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.58))" }} />
          <button onClick={onClose} style={{ position: "absolute", top: 14, right: 14, width: 30, height: 30, borderRadius: "50%", background: "rgba(0,0,0,0.5)", border: "none", color: "#fff", cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
          <div style={{ position: "absolute", bottom: 18, left: 22 }}>
            <span style={{ fontFamily: "var(--font-display)", color: "#fff", fontSize: 21, fontWeight: 300 }}>Book a Private Viewing</span>
          </div>
        </div>

        {/* Steps */}
        <div style={{ display: "flex", gap: 20, padding: "14px 28px", borderBottom: `1px solid ${t.border}` }}>
          {[1, 2].map(s => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 22, height: 22, borderRadius: "50%", background: step === s ? t.accent : t.bgAlt, border: `1px solid ${step === s ? t.accent : t.border}`, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s" }}>
                <span style={{ color: step === s ? t.accentFg : t.fgMuted, fontSize: 10, fontWeight: 500, fontFamily: "var(--font-body)" }}>{s}</span>
              </div>
              <span style={{ color: step === s ? t.fg : t.fgMuted, fontSize: 11, fontFamily: "var(--font-body)", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: step === s ? 500 : 300 }}>
                {s === 1 ? "Your Details" : "Date & Property"}
              </span>
            </div>
          ))}
        </div>

        <div style={{ padding: "clamp(24px,3vw,36px)" }}>
          {step === 1 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {[["Full Name", "text"], ["Email Address", "email"], ["Phone Number", "tel"]].map(([l, tp]) => (
                <div key={l}>
                  <label style={{ display: "block", color: t.fgSubtle, fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "var(--font-body)", marginBottom: 6 }}>{l}</label>
                  <input type={tp} style={inputStyle}
                    onFocus={e => (e.currentTarget.style.borderBottomColor = t.accent)}
                    onBlur={e => (e.currentTarget.style.borderBottomColor = t.border)} />
                </div>
              ))}
              <button onClick={() => setStep(2)} style={{ padding: "14px", background: t.accent, color: t.accentFg, border: "none", fontSize: 11, fontWeight: 500, letterSpacing: "0.16em", textTransform: "uppercase", cursor: "pointer", fontFamily: "var(--font-body)", borderRadius: 4, marginTop: 6, transition: "opacity 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "0.82")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
                Continue →
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div>
                <label style={{ display: "block", color: t.fgSubtle, fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "var(--font-body)", marginBottom: 6 }}>Preferred Date</label>
                <input type="date" style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderBottomColor = t.accent)}
                  onBlur={e => (e.currentTarget.style.borderBottomColor = t.border)} />
              </div>
              <div>
                <label style={{ display: "block", color: t.fgSubtle, fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "var(--font-body)", marginBottom: 14 }}>Select Property</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9 }}>
                  {PROPERTIES.slice(0, 4).map(p => (
                    <button key={p.id} onClick={() => setSel(p.id)}
                      style={{ padding: "10px 12px", background: t.bgAlt, border: `1px solid ${sel === p.id ? t.accent : t.border}`, borderRadius: 4, color: sel === p.id ? t.fg : t.fgMuted, fontSize: 11, fontFamily: "var(--font-body)", cursor: "pointer", textAlign: "left", transition: "all 0.2s" }}>
                      <div style={{ fontWeight: 500, marginBottom: 2 }}>{p.name}</div>
                      <div style={{ fontSize: 10, opacity: 0.7 }}>{p.price}</div>
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={onClose} style={{ padding: "14px", background: t.accent, color: t.accentFg, border: "none", fontSize: 11, fontWeight: 500, letterSpacing: "0.16em", textTransform: "uppercase", cursor: "pointer", fontFamily: "var(--font-body)", borderRadius: 4, transition: "opacity 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "0.82")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
                Confirm Viewing, ✓
              </button>
              <button onClick={() => setStep(1)} style={{ background: "none", border: "none", color: t.fgMuted, fontSize: 12, cursor: "pointer", fontFamily: "var(--font-body)", textAlign: "center" }}>
                ← Back
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   SCROLL-TO-TOP
═══════════════════════════════════════════════════════════════════════════════ */
function ScrollTop() {
  const { t } = useT();
  const [show, setShow] = useState(false);
  useEffect(() => {
    const h = () => setShow(window.scrollY > 600);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  if (!show) return null;
  return (
    <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      style={{ position: "fixed", bottom: "clamp(20px,3vw,32px)", right: "clamp(20px,3vw,32px)", width: 42, height: 42, borderRadius: "50%", background: t.accent, color: t.accentFg, border: "none", fontSize: 17, cursor: "pointer", zIndex: 50, boxShadow: "0 8px 28px rgba(0,0,0,0.22)", transition: "transform 0.3s", display: "flex", alignItems: "center", justifyContent: "center" }}
      onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-3px)")}
      onMouseLeave={e => (e.currentTarget.style.transform = "none")}>
      ↑
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════════════════════════════════════════ */
export default function HarbourCoPage() {
  const [themeId, setThemeId] = useState<ThemeId>(() => {
    if (typeof window === "undefined") return "ivory";
    return (localStorage.getItem("hbr-theme") as ThemeId) || "ivory";
  });
  const [modal, setModal] = useState(false);

  const setId = useCallback((id: ThemeId) => {
    setThemeId(id);
    try { localStorage.setItem("hbr-theme", id); } catch {}
  }, []);

  const t = THEMES[themeId];

  // Apply scrollbar color
  useEffect(() => {
    document.documentElement.style.setProperty("--sb", t.accent);
    document.documentElement.style.setProperty("--sel-bg", t.accent);
    document.documentElement.style.setProperty("--sel-fg", t.accentFg);
  }, [t]);

  return (
    <ThemeCtx.Provider value={{ t, setId }}>
      <GlobalStyles />
      <div style={{ background: t.bg, color: t.fg, minHeight: "100vh", transition: "background 0.4s, color 0.4s" }}>
        <Navbar onBook={() => setModal(true)} />
        <Hero onContact={() => setModal(true)} />
        <MarqueeBanner />
        <Stats />
        <SearchSection />
        <Properties />
        <Editorial />
        <Services />
        <Testimonials />
        <Journal />
        <Contact />
        <Footer />
        <ScrollTop />
        {modal && <BookingModal onClose={() => setModal(false)} />}
      </div>
    </ThemeCtx.Provider>
  );
}

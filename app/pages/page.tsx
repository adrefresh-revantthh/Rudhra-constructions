
"use client"

import { useState, useEffect, useRef } from "react";
import {
  FiMapPin, FiPhone, FiMail, FiArrowRight, FiArrowUpRight,
  FiPlay, FiPause, FiChevronDown, FiStar, FiAward,
  FiUsers, FiHome, FiCheck, FiMenu, FiX
} from "react-icons/fi";
import {
  LuBuilding2, LuBadgeCheck, LuFlame, LuLeaf,
  LuShield, LuKey, LuLandmark, LuHardHat
} from "react-icons/lu";

const themes = {
  ruby: {
    name: "Ruby Stone",
    bg: "#F6F4EF", surface: "#FFFFFF", card: "#DCD7C9", border: "#D3D3D3",
    accent: "#C50000", accentSoft: "#C5000020", accentGlow: "#C5000040",
    text: "#1A1A1A", textMuted: "#6B6B6B", textSub: "#9A9A9A",
    gradient: "linear-gradient(135deg, #C50000 0%, #E10600 50%, #C50000 100%)",
    heroOverlay: "linear-gradient(180deg, rgba(246,244,239,0.1) 0%, rgba(246,244,239,0.6) 60%, rgba(246,244,239,1) 100%)",
    font: "'Playfair Display', Georgia, serif",
    fontSans: "'Inter', system-ui, sans-serif",
  },
  obsidian: {
    name: "Obsidian Gold",
    bg: "#0A0A0A", surface: "#111111", card: "#161616", border: "#222222",
    accent: "#C9A84C", accentSoft: "#C9A84C22", accentGlow: "#C9A84C44",
    text: "#F5F0E8", textMuted: "#888880", textSub: "#555550",
    gradient: "linear-gradient(135deg, #C9A84C 0%, #F0D080 50%, #C9A84C 100%)",
    heroOverlay: "linear-gradient(180deg, rgba(10,10,10,0.3) 0%, rgba(10,10,10,0.7) 60%, rgba(10,10,10,1) 100%)",
    font: "'Cormorant Garamond', Georgia, serif",
    fontSans: "'DM Sans', system-ui, sans-serif",
  },
  midnight: {
    name: "Midnight Azure",
    bg: "#06080F", surface: "#0C1020", card: "#101528", border: "#1A2240",
    accent: "#4F8EF7", accentSoft: "#4F8EF722", accentGlow: "#4F8EF744",
    text: "#EEF2FF", textMuted: "#8896BB", textSub: "#445577",
    gradient: "linear-gradient(135deg, #4F8EF7 0%, #A78BFA 50%, #4F8EF7 100%)",
    heroOverlay: "linear-gradient(180deg, rgba(6,8,15,0.2) 0%, rgba(6,8,15,0.7) 60%, rgba(6,8,15,1) 100%)",
    font: "'Cormorant Garamond', Georgia, serif",
    fontSans: "'Outfit', system-ui, sans-serif",
  },
};

type ThemeKey = keyof typeof themes;

const projects = [
  { tag: "Villas", name: "Royal Village 2", location: "Gandi Maisamma, Hyderabad", desc: "99 majestic triplex villas across 7.29 acres — where legacy meets modern royalty.", img: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80", price: "₹1.2 Cr onwards", beds: "4 BHK Triplex", status: "Ongoing" },
  { tag: "Apartments", name: "Rudhra Estates", location: "Bowrampet, Hyderabad", desc: "164 premium flats with panoramic views and world-class amenities near ORR.", img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80", price: "₹75 L onwards", beds: "2 & 3 BHK", status: "Ongoing" },
  { tag: "Apartments", name: "Hasthina", location: "Pragathi Nagar, Hyderabad", desc: "120 thoughtfully designed apartments in Hyderabad's thriving residential hub.", img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80", price: "₹60 L onwards", beds: "2 & 3 BHK", status: "Completed" },
  { tag: "Villas", name: "Magadha", location: "Bowrampet, Hyderabad", desc: "400+ villas — the most anticipated villa community in North Hyderabad.", img: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80", price: "₹90 L onwards", beds: "3 & 4 BHK", status: "Upcoming" },
  { tag: "Apartments", name: "Rudhra's Bhuvi", location: "Pragathi Nagar, Hyderabad", desc: "90 units across 10 floors — contemporary design meets urban convenience.", img: "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=800&q=80", price: "₹65 L onwards", beds: "2 & 3 BHK", status: "Completed" },
  { tag: "Villas", name: "Green Lands", location: "Bodhan, Nizamabad", desc: "Charming eco-villas crafted for a perfect life surrounded by nature.", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80", price: "₹45 L onwards", beds: "3 BHK", status: "Completed" },
];

const amenities = [
  { icon: <LuShield size={24} />, label: "24/7 Security" },
  { icon: <FiStar size={24} />, label: "Club House" },
  { icon: <LuLeaf size={24} />, label: "Landscaped Gardens" },
  { icon: <FiHome size={24} />, label: "Children's Play Area" },
  { icon: <LuFlame size={24} />, label: "Gymnasium" },
  { icon: <LuBadgeCheck size={24} />, label: "RERA Certified" },
  { icon: <FiAward size={24} />, label: "Award Winning Design" },
  { icon: <LuKey size={24} />, label: "Smart Home Ready" },
];

const stats = [
  { value: "18+", label: "Years of Excellence" },
  { value: "20+", label: "Landmark Projects" },
  { value: "2000+", label: "Happy Families" },
  { value: "4", label: "Cities Served" },
];

const testimonials = [
  { name: "Ravi Kumar", role: "Resident, Hasthina", text: "Rudhra delivered beyond our expectations. The quality, attention to detail, and after-sales support is unmatched in Hyderabad's real estate market.", rating: 5 },
  { name: "Priya Sharma", role: "Homeowner, Royal Village", text: "Our triplex villa is everything we dreamed of. Rudhra's team walked with us through every step. Truly a builder you can trust.", rating: 5 },
  { name: "Srinivas Reddy", role: "Investor, Rudhra Estates", text: "The location intelligence and construction quality at Rudhra Estates gave us excellent ROI. Professional, transparent, and premium.", rating: 5 },
];

const whyUs = [
  { icon: <LuHardHat size={28} />, title: "Crafted with Precision", desc: "Every structure is built to last — with premium materials, certified engineers, and strict quality benchmarks." },
  { icon: <LuLandmark size={28} />, title: "Prime Locations", desc: "Strategically chosen plots in growth corridors with excellent connectivity, schools, and infrastructure." },
  { icon: <LuBadgeCheck size={28} />, title: "RERA Compliant", desc: "100% transparent dealings with all projects fully RERA registered and legally vetted for your peace of mind." },
  { icon: <FiUsers size={28} />, title: "Customer First Culture", desc: "From site visit to possession and beyond — our dedicated team ensures a seamless homebuying journey." },
];

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let start = 0;
        const dur = 2000, step = 16;
        const inc = target / (dur / step);
        const timer = setInterval(() => {
          start += inc;
          if (start >= target) { setCount(target); clearInterval(timer); }
          else setCount(Math.floor(start));
        }, step);
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);
  return <span ref={ref}>{count}{suffix}</span>;
}

export default function RudhraConstructions() {
  const [themeKey, setThemeKey] = useState<ThemeKey>("ruby");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const t = themes[themeKey];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleVideo = () => {
    if (videoRef.current) {
      videoPlaying ? videoRef.current.pause() : videoRef.current.play();
      setVideoPlaying(!videoPlaying);
    }
  };

  const filtered = activeFilter === "All" ? projects : projects.filter((p) => p.tag === activeFilter || p.status === activeFilter);

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&family=Outfit:wght@300;400;500;600&family=Inter:wght@300;400;500;600&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { background: ${t.bg}; color: ${t.text}; font-family: ${t.fontSans}; overflow-x: hidden; }
    ::selection { background: ${t.accent}44; color: ${t.text}; }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: ${t.bg}; }
    ::-webkit-scrollbar-thumb { background: ${t.accent}66; border-radius: 2px; }

    .serif { font-family: ${t.font}; }
    .sans { font-family: ${t.fontSans}; }

    /* NAV */
    .nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1); padding: 0 5%; }
    .nav.scrolled { background: ${t.bg}F0; backdrop-filter: blur(20px); border-bottom: 1px solid ${t.border}; box-shadow: 0 4px 40px ${t.accent}11; }
    .nav-inner { display: flex; align-items: center; justify-content: space-between; max-width: 1400px; margin: 0 auto; height: 80px; }
    .logo-mark { font-family: ${t.font}; font-size: 1.6rem; font-weight: 600; color: ${t.text}; letter-spacing: 0.02em; text-decoration: none; }
    .logo-mark span { color: ${t.accent}; }
    .nav-links { display: flex; gap: 2.5rem; align-items: center; }
    .nav-link { font-size: 0.82rem; font-weight: 500; color: black; text-decoration: none; text-transform: uppercase; letter-spacing: 0.12em; transition: color 0.3s; cursor: pointer; }
    .nav-link:hover { color: ${t.accent}; }
    .nav-cta { background: ${t.accent}; color: ${t.bg}; border: none; padding: 0.65rem 1.6rem; font-size: 0.8rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; cursor: pointer; transition: all 0.3s; font-family: ${t.fontSans}; }
    .nav-cta:hover { opacity: 0.85; transform: translateY(-1px); }
    .hamburger { display: none; background: none; border: none; color: ${t.text}; cursor: pointer; }

    /* HERO */
    .hero { position: relative; height: 100vh; min-height: 700px; display: flex; align-items: flex-end; overflow: hidden; }
    .hero-video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 0; }
    .hero-img-fallback { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 0; }
    .hero-overlay { position: absolute; inset: 0; background: ${t.heroOverlay}; z-index: 1; }
    .hero-content { position: relative; z-index: 2; padding: 0 5% 8%; max-width: 1400px; margin: 0 auto; width: 100%; }
    .hero-tag { display: inline-flex; align-items: center; gap: 0.5rem; border: 1px solid ${t.accent}60; color: ${t.accent}; font-size: 0.72rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; padding: 0.4rem 1rem; margin-bottom: 1.5rem; animation: fadeUp 0.8s ease both; }
    .hero-tag::before { content: ''; width: 18px; height: 1px; background: ${t.accent}; }
    .hero-title { font-family: ${t.font}; font-size: clamp(2.8rem, 7vw, 6.5rem); font-weight: 400; line-height: 1.05; color: ${t.text}; max-width: 860px; margin-bottom: 1.5rem; animation: fadeUp 0.8s ease 0.1s both; }
    .hero-title em { font-style: italic; color: ${t.accent}; }
    .hero-sub { font-size: 1rem; color: black; max-width: 520px; line-height: 1.7; margin-bottom: 2.5rem; animation: fadeUp 0.8s ease 0.2s both; font-weight: 300; }
    .hero-actions { display: flex; gap: 1rem; align-items: center; animation: fadeUp 0.8s ease 0.3s both; flex-wrap: wrap; }
    .btn-primary { display: inline-flex; align-items: center; gap: 0.6rem; background: ${t.accent}; color: ${t.bg}; padding: 1rem 2rem; font-size: 0.82rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; border: none; cursor: pointer; transition: all 0.3s; font-family: ${t.fontSans}; text-decoration: none; }
    .btn-primary:hover { opacity: 0.85; gap: 1rem; }
    .btn-ghost { display: inline-flex; align-items: center; gap: 0.6rem; background: transparent; color: ${t.text}; padding: 1rem 2rem; font-size: 0.82rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.12em; border: 1px solid ${t.border}; cursor: pointer; transition: all 0.3s; font-family: ${t.fontSans}; }
    .btn-ghost:hover { border-color: ${t.accent}; color: ${t.accent}; }
    .hero-scroll { position: absolute; bottom: 2rem; right: 5%; z-index: 2; display: flex; flex-direction: column; align-items: center; gap: 0.4rem; font-size: 0.65rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: ${t.textMuted}; animation: fadeUp 1.2s ease 0.5s both; }
    .scroll-line { width: 1px; height: 50px; background: linear-gradient(to bottom, ${t.accent}, transparent); animation: scrollPulse 2s ease-in-out infinite; }
    .video-toggle { position: absolute; bottom: 2rem; left: 5%; z-index: 2; display: flex; align-items: center; gap: 0.5rem; background: ${t.bg}80; backdrop-filter: blur(10px); border: 1px solid ${t.border}; color: ${t.text}; padding: 0.5rem 1rem; font-size: 0.7rem; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; transition: all 0.3s; font-family: ${t.fontSans}; }
    .video-toggle:hover { border-color: ${t.accent}; }

    /* STATS BAR */
    .stats-bar { background: ${t.surface}; border-top: 1px solid ${t.border}; border-bottom: 1px solid ${t.border}; }
    .stats-inner { max-width: 1400px; margin: 0 auto; padding: 0 5%; display: grid; grid-template-columns: repeat(4, 1fr); }
    .stat-item { padding: 2.5rem 2rem; border-right: 1px solid ${t.border}; text-align: center; }
    .stat-item:last-child { border-right: none; }
    .stat-num { font-family: ${t.font}; font-size: 3rem; font-weight: 600; color: ${t.accent}; line-height: 1; display: block; }
    .stat-label { font-size: 0.75rem; color: ${t.textMuted}; text-transform: uppercase; letter-spacing: 0.12em; margin-top: 0.4rem; display: block; }

    /* SECTIONS */
    section { padding: 7rem 5%; }
    .container { max-width: 1400px; margin: 0 auto; }
    .section-tag { display: flex; align-items: center; gap: 0.8rem; font-size: 0.72rem; font-weight: 600; color: ${t.accent}; text-transform: uppercase; letter-spacing: 0.2em; margin-bottom: 1.2rem; }
    .section-tag::before { content: ''; width: 30px; height: 1px; background: ${t.accent}; }
    .section-title { font-family: ${t.font}; font-size: clamp(2rem, 4vw, 3.4rem); font-weight: 400; line-height: 1.1; color: ${t.text}; margin-bottom: 1.2rem; }
    .section-title em { font-style: italic; color: ${t.accent}; }
    .section-sub { font-size: 1rem; color: ${t.textMuted}; max-width: 560px; line-height: 1.8; font-weight: 300; margin-bottom: 3rem; }

    /* ABOUT */
    .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 5rem; align-items: center; }
    .about-images { position: relative; height: 600px; }
    .about-img-main { position: absolute; top: 0; left: 0; width: 75%; height: 80%; object-fit: cover; }
    .about-img-accent { position: absolute; bottom: 0; right: 0; width: 55%; height: 55%; object-fit: cover; border: 6px solid ${t.bg}; }
    .about-badge { position: absolute; top: 50%; left: 60%; transform: translate(-50%, -50%); background: ${t.accent}; color: ${t.bg}; padding: 1.5rem; text-align: center; min-width: 120px; z-index: 2; }
    .about-badge-num { font-family: ${t.font}; font-size: 2.2rem; font-weight: 700; display: block; line-height: 1; }
    .about-badge-label { font-size: 0.65rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; }
    .about-features { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 2.5rem; }
    .about-feature { display: flex; align-items: flex-start; gap: 0.7rem; }
    .check-icon { color: ${t.accent}; margin-top: 2px; flex-shrink: 0; }
    .feature-text { font-size: 0.88rem; color: ${t.textMuted}; line-height: 1.5; }

    /* PROJECTS */
    .filter-tabs { display: flex; gap: 0.5rem; margin-bottom: 3rem; flex-wrap: wrap; }
    .filter-tab { padding: 0.6rem 1.4rem; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; border: 1px solid ${t.border}; background: transparent; color: ${t.textMuted}; cursor: pointer; transition: all 0.3s; font-family: ${t.fontSans}; }
    .filter-tab.active, .filter-tab:hover { background: ${t.accent}; color: ${t.bg}; border-color: ${t.accent}; }
    .projects-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5px; }
    .project-card { position: relative; aspect-ratio: 3/4; overflow: hidden; cursor: pointer; background: ${t.card}; }
    .project-card:first-child { grid-column: span 2; aspect-ratio: auto; min-height: 480px; }
    .project-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1); }
    .project-card:hover .project-img { transform: scale(1.08); }
    .project-overlay { position: absolute; inset: 0; background: linear-gradient(to top, ${t.bg}EE 0%, ${t.bg}44 50%, transparent 100%); transition: opacity 0.4s; }
    .project-info { position: absolute; bottom: 0; left: 0; right: 0; padding: 2rem; transform: translateY(0); transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
    .project-tag-badge { display: inline-block; background: ${t.accent}; color: ${t.bg}; font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; padding: 0.3rem 0.8rem; margin-bottom: 0.7rem; }
    .project-name { font-family: ${t.font}; font-size: 1.6rem; font-weight: 500; color: ${t.text}; margin-bottom: 0.3rem; }
    .project-card:first-child .project-name { font-size: 2.2rem; }
    .project-loc { font-size: 0.78rem; color: ${t.textMuted}; display: flex; align-items: center; gap: 0.3rem; margin-bottom: 0.8rem; }
    .project-meta { display: flex; gap: 1.5rem; font-size: 0.78rem; color: ${t.textMuted}; }
    .project-price { color: ${t.accent}; font-weight: 600; }
    .project-hover-cta { display: flex; align-items: center; gap: 0.4rem; color: ${t.accent}; font-size: 0.78rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 1rem; opacity: 0; transform: translateY(10px); transition: all 0.3s; }
    .project-card:hover .project-hover-cta { opacity: 1; transform: translateY(0); }

    /* WHY US */
    .why-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0; }
    .why-card { padding: 3rem 2rem; border: 1px solid ${t.border}; border-right: none; background: ${t.surface}; transition: all 0.4s; cursor: default; position: relative; overflow: hidden; }
    .why-card:last-child { border-right: 1px solid ${t.border}; }
    .why-card::before { content: ''; position: absolute; bottom: 0; left: 0; height: 3px; width: 0; background: ${t.accent}; transition: width 0.4s; }
    .why-card:hover::before { width: 100%; }
    .why-card:hover { background: ${t.card}; }
    .why-icon { color: ${t.accent}; margin-bottom: 1.2rem; display: block; }
    .why-title { font-family: ${t.font}; font-size: 1.2rem; font-weight: 500; color: ${t.text}; margin-bottom: 0.8rem; }
    .why-desc { font-size: 0.84rem; color: ${t.textMuted}; line-height: 1.7; }

    /* AMENITIES */
    .amenities-section { background: ${t.surface}; }
    .amenities-layout { display: grid; grid-template-columns: 1fr 1.2fr; gap: 5rem; align-items: center; }
    .amenities-img { width: 100%; height: 500px; object-fit: cover; }
    .amenities-img-wrap { position: relative; }
    .amenities-img-wrap::after { content: ''; position: absolute; top: 20px; left: 20px; right: -20px; bottom: -20px; border: 1px solid ${t.accent}40; z-index: -1; }
    .amenities-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: ${t.border}; border: 1px solid ${t.border}; }
    .amenity-item { display: flex; align-items: center; gap: 1rem; padding: 1.4rem 1.5rem; background: ${t.surface}; transition: background 0.3s; }
    .amenity-item:hover { background: ${t.card}; }
    .amenity-icon { color: ${t.accent}; flex-shrink: 0; }
    .amenity-label { font-size: 0.85rem; font-weight: 500; color: ${t.text}; }

    /* TESTIMONIALS */
    .testimonials-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
    .testimonial-card { background: ${t.surface}; border: 1px solid ${t.border}; padding: 2.5rem; transition: all 0.4s; position: relative; }
    .testimonial-card:hover { border-color: ${t.accent}44; transform: translateY(-4px); box-shadow: 0 20px 60px ${t.accent}11; }
    .testimonial-card::before { content: '"'; position: absolute; top: 1rem; right: 1.5rem; font-family: ${t.font}; font-size: 5rem; color: ${t.accent}22; line-height: 1; }
    .stars { display: flex; gap: 0.2rem; margin-bottom: 1rem; }
    .star { color: ${t.accent}; font-size: 0.85rem; }
    .testimonial-text { font-size: 0.9rem; color: ${t.textMuted}; line-height: 1.8; margin-bottom: 1.5rem; font-style: italic; }
    .testimonial-author { display: flex; align-items: center; gap: 0.8rem; }
    .author-avatar { width: 42px; height: 42px; border-radius: 50%; background: ${t.accent}22; border: 2px solid ${t.accent}44; display: flex; align-items: center; justify-content: center; font-family: ${t.font}; font-size: 1.1rem; color: ${t.accent}; }
    .author-name { font-size: 0.9rem; font-weight: 600; color: ${t.text}; }
    .author-role { font-size: 0.75rem; color: ${t.textMuted}; }

    /* CONTACT */
    .contact-section { background: ${t.surface}; }
    .contact-layout { display: grid; grid-template-columns: 1fr 1.2fr; gap: 5rem; align-items: start; }
    .contact-info-items { display: flex; flex-direction: column; gap: 1.5rem; margin-top: 2rem; }
    .contact-info-item { display: flex; align-items: flex-start; gap: 1rem; padding: 1.2rem; border: 1px solid ${t.border}; background: ${t.card}; transition: border-color 0.3s; }
    .contact-info-item:hover { border-color: ${t.accent}44; }
    .contact-icon { color: ${t.accent}; margin-top: 2px; flex-shrink: 0; }
    .contact-info-label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.12em; color: ${t.textSub}; margin-bottom: 0.2rem; }
    .contact-info-value { font-size: 0.9rem; color: ${t.text}; font-weight: 500; }
    .contact-form { display: flex; flex-direction: column; gap: 1rem; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .form-field { display: flex; flex-direction: column; gap: 0.4rem; }
    .form-label { font-size: 0.72rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: ${t.textMuted}; }
    .form-input, .form-textarea, .form-select { background: ${t.card}; border: 1px solid ${t.border}; color: ${t.text}; padding: 0.9rem 1rem; font-size: 0.88rem; font-family: ${t.fontSans}; outline: none; transition: border-color 0.3s; }
    .form-input:focus, .form-textarea:focus, .form-select:focus { border-color: ${t.accent}66; }
    .form-input::placeholder, .form-textarea::placeholder { color: ${t.textSub}; }
    .form-textarea { resize: none; height: 120px; }
    .form-select option { background: ${t.card}; }

    /* CTA BANNER */
    .cta-banner { background: ${t.accent}; padding: 5rem 5%; text-align: center; position: relative; overflow: hidden; }
    .cta-banner::before { content: ''; position: absolute; inset: 0; background: repeating-linear-gradient(45deg, transparent, transparent 60px, rgba(0,0,0,0.03) 60px, rgba(0,0,0,0.03) 61px); }
    .cta-title { font-family: ${t.font}; font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 600; color: ${t.bg}; margin-bottom: 1rem; position: relative; }
    .cta-sub { font-size: 1rem; color: ${t.bg}BB; margin-bottom: 2.5rem; position: relative; }
    .btn-dark { display: inline-flex; align-items: center; gap: 0.6rem; background: ${t.bg}; color: ${t.accent}; padding: 1rem 2.5rem; font-size: 0.82rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; border: none; cursor: pointer; transition: all 0.3s; font-family: ${t.fontSans}; position: relative; }
    .btn-dark:hover { opacity: 0.9; gap: 1rem; }

    /* FOOTER */
    .footer { background: ${t.bg}; border-top: 1px solid ${t.border}; padding: 4rem 5% 2rem; }
    .footer-grid { display: grid; grid-template-columns: 1.5fr 1fr 1fr 1fr; gap: 3rem; max-width: 1400px; margin: 0 auto; }
    .footer-logo { font-family: ${t.font}; font-size: 1.4rem; font-weight: 600; color: ${t.text}; margin-bottom: 1rem; display: block; }
    .footer-logo span { color: ${t.accent}; }
    .footer-desc { font-size: 0.82rem; color: ${t.textMuted}; line-height: 1.8; margin-bottom: 1.5rem; }
    .social-links { display: flex; gap: 0.7rem; }
    .social-link { width: 36px; height: 36px; border: 1px solid ${t.border}; display: flex; align-items: center; justify-content: center; color: ${t.textMuted}; font-size: 0.85rem; cursor: pointer; transition: all 0.3s; text-decoration: none; }
    .social-link:hover { border-color: ${t.accent}; color: ${t.accent}; }
    .footer-col-title { font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; color: ${t.accent}; margin-bottom: 1.2rem; }
    .footer-links { display: flex; flex-direction: column; gap: 0.6rem; }
    .footer-link { font-size: 0.84rem; color: ${t.textMuted}; text-decoration: none; transition: color 0.3s; cursor: pointer; }
    .footer-link:hover { color: ${t.text}; }
    .footer-bottom { max-width: 1400px; margin: 3rem auto 0; padding-top: 1.5rem; border-top: 1px solid ${t.border}; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; font-size: 0.75rem; color: ${t.textSub}; }
    .rera-badge { display: flex; align-items: center; gap: 0.5rem; font-size: 0.72rem; color: ${t.textMuted}; }
    .rera-dot { width: 8px; height: 8px; border-radius: 50%; background: ${t.accent}; }

    /* THEME SWITCHER */
    .theme-switcher { position: fixed; right: 1.5rem; top: 50%; transform: translateY(-50%); z-index: 200; display: flex; flex-direction: column; gap: 0.5rem; }
    .theme-btn { width: 14px; height: 14px; border-radius: 50%; border: 2px solid transparent; cursor: pointer; transition: all 0.3s; }
    .theme-btn.active { transform: scale(1.4); border-color: white; }

    /* MOBILE MENU */
    .mobile-menu { position: fixed; inset: 0; z-index: 99; background: ${t.bg}; display: flex; flex-direction: column; padding: 6rem 5% 3rem; transform: translateX(100%); transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
    .mobile-menu.open { transform: translateX(0); }
    .mobile-nav-links { display: flex; flex-direction: column; gap: 0.5rem; }
    .mobile-nav-link { font-family: ${t.font}; font-size: 2.5rem; font-weight: 400; color: ${t.textMuted}; border: none; background: none; text-align: left; cursor: pointer; padding: 0.5rem 0; transition: color 0.3s; border-bottom: 1px solid ${t.border}; }
    .mobile-nav-link:hover { color: ${t.accent}; }

    /* ANIMATIONS */
    @keyframes fadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes scrollPulse { 0%, 100% { opacity: 1; transform: scaleY(1); } 50% { opacity: 0.4; transform: scaleY(0.6); } }
    @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
    .fade-in { animation: fadeUp 0.7s ease both; }

    /* ═══════════════════════════════════════════════════
       TABLET RESPONSIVE — 1024px and below
    ═══════════════════════════════════════════════════ */
    @media (max-width: 1024px) {
      section { padding: 5rem 5%; }

      /* Stats: 2×2 grid */
      .stats-inner { grid-template-columns: repeat(2, 1fr); }
      .stat-item:nth-child(1),
      .stat-item:nth-child(2) { border-bottom: 1px solid ${t.border}; }
      .stat-item:nth-child(2) { border-right: none; }
      .stat-item:nth-child(4) { border-right: none; }

      /* About */
      .about-grid { grid-template-columns: 1fr; gap: 3rem; }
      .about-images { height: 420px; }

      /* Projects */
      .projects-grid { grid-template-columns: 1fr 1fr; }
      .project-card:first-child { grid-column: span 2; }

      /* Why Us: 2×2 */
      .why-grid { grid-template-columns: 1fr 1fr; }
      .why-card { border-right: 1px solid ${t.border}; border-bottom: none; }
      .why-card:nth-child(1),
      .why-card:nth-child(2) { border-bottom: 1px solid ${t.border}; }

      /* Amenities */
      .amenities-layout { grid-template-columns: 1fr; gap: 3rem; }
      .amenities-img-wrap { order: -1; }
      .amenities-img { height: 380px; }
      .amenities-img-wrap::after { display: none; }

      /* Contact */
      .contact-layout { grid-template-columns: 1fr; gap: 3rem; }

      /* Footer */
      .footer-grid { grid-template-columns: 1fr 1fr; gap: 2.5rem; }

      /* Nav */
      .nav-cta { padding: 0.55rem 1.2rem; font-size: 0.75rem; }

      /* Projects header */
      .projects-filter-header { flex-direction: column !important; align-items: flex-start !important; }
      .filter-tabs { margin-bottom: 2rem; }
    }

    /* ═══════════════════════════════════════════════════
       MOBILE RESPONSIVE — 768px and below
    ═══════════════════════════════════════════════════ */
    @media (max-width: 768px) {
      /* Nav */
      .nav-links { display: none; }
      .hamburger { display: flex; }
      .nav-cta { display: none; }
      .nav-inner { height: 64px; }
      .logo-mark { font-size: 1.4rem; }

      /* Hero */
      .hero { min-height: 100svh; }
      .hero-content { padding: 0 5% 6rem; }
      .hero-title { font-size: clamp(2.1rem, 8vw, 2.9rem); max-width: 100%; }
      .hero-sub { font-size: 0.9rem; max-width: 100%; margin-bottom: 2rem; }
      .hero-actions { flex-direction: column; align-items: stretch; gap: 0.75rem; }
      .btn-primary, .btn-ghost { width: 100%; justify-content: center; padding: 0.9rem 1.5rem; font-size: 0.78rem; }
      .hero-scroll { display: none; }
      .video-toggle { bottom: 1.5rem; left: 5%; font-size: 0.62rem; padding: 0.38rem 0.75rem; }

      /* Sections */
      section { padding: 3.5rem 5%; }
      .section-title { font-size: clamp(1.8rem, 6vw, 2.4rem); }
      .section-sub { font-size: 0.92rem; margin-bottom: 1.8rem; }

      /* Stats: 2×2 on mobile */
      .stats-inner { grid-template-columns: repeat(2, 1fr); }
      .stat-item { padding: 1.6rem 1rem; }
      .stat-num { font-size: 2.2rem; }
      .stat-label { font-size: 0.65rem; letter-spacing: 0.07em; }
      .stat-item:nth-child(2) { border-right: none; }
      .stat-item:nth-child(1),
      .stat-item:nth-child(2) { border-bottom: 1px solid ${t.border}; }
      .stat-item:nth-child(3),
      .stat-item:nth-child(4) { border-bottom: none; }
      .stat-item:nth-child(4) { border-right: none; }
      .stat-item:nth-child(3) { border-right: 1px solid ${t.border}; }

      /* About */
      .about-grid { gap: 2rem; }
      .about-images { height: 300px; }
      .about-img-accent { border-width: 4px; }
      .about-badge { padding: 1rem; min-width: 85px; }
      .about-badge-num { font-size: 1.5rem; }
      .about-badge-label { font-size: 0.58rem; }
      .about-features { grid-template-columns: 1fr; gap: 0.65rem; margin-top: 1.5rem; }

      /* Projects */
      .projects-grid { grid-template-columns: 1fr; gap: 2px; }
      .project-card:first-child { grid-column: span 1; min-height: 280px; aspect-ratio: 4/3; }
      .project-card { aspect-ratio: 4/3; }
      .project-info { padding: 1.4rem; }
      .project-name { font-size: 1.25rem; }
      .project-card:first-child .project-name { font-size: 1.5rem; }
      /* Always show hover CTA on touch devices */
      .project-hover-cta { opacity: 1; transform: translateY(0); margin-top: 0.5rem; font-size: 0.72rem; }

      /* Filter tabs — horizontal scroll */
      .filter-tabs {
        flex-wrap: nowrap;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        padding-bottom: 0.4rem;
        scrollbar-width: none;
        gap: 0.4rem;
        margin-bottom: 1.8rem;
      }
      .filter-tabs::-webkit-scrollbar { display: none; }
      .filter-tab { white-space: nowrap; flex-shrink: 0; padding: 0.45rem 0.9rem; font-size: 0.68rem; }

      /* Why Us: single column */
      .why-grid { grid-template-columns: 1fr; }
      .why-card { border-right: 1px solid ${t.border}; border-bottom: none; padding: 1.8rem 1.5rem; }
      .why-card:not(:last-child) { border-bottom: 1px solid ${t.border}; }
      .why-card:last-child { border-right: 1px solid ${t.border}; }

      /* Amenities */
      .amenities-layout { gap: 2rem; }
      .amenities-img { height: 260px; }
      .amenities-grid { grid-template-columns: 1fr; }
      .amenity-item { padding: 0.9rem 1.1rem; }
      .amenity-label { font-size: 0.82rem; }

      /* Testimonials */
      .testimonials-grid { grid-template-columns: 1fr; }
      .testimonial-card { padding: 1.8rem; }
      .testimonial-text { font-size: 0.87rem; }

      /* Gallery */
      #gallery { height: 50vh !important; }

      /* CTA Banner */
      .cta-banner { padding: 3.5rem 5%; }
      .cta-sub { font-size: 0.88rem; margin-bottom: 2rem; }
      .cta-banner > .container > div { flex-direction: column; align-items: center; }
      .btn-dark { width: 100%; max-width: 300px; justify-content: center; padding: 0.9rem 1.5rem; }

      /* Contact */
      .contact-layout { gap: 2rem; }
      .contact-info-items { gap: 0.9rem; margin-top: 1.2rem; }
      .contact-info-item { padding: 0.9rem; }
      .contact-info-value { font-size: 0.83rem; }
      .form-row { grid-template-columns: 1fr; }

      /* Footer */
      .footer-grid { grid-template-columns: 1fr; gap: 2rem; }
      .footer { padding: 3rem 5% 1.5rem; }
      .footer-bottom { flex-direction: column; align-items: flex-start; gap: 0.8rem; }

      /* Mobile menu */
      .mobile-menu-cta-show { display: block !important; }
      .mobile-nav-link { font-size: 2rem; }

      /* Theme switcher */
      .theme-switcher { display: none; }
    }

    /* ═══════════════════════════════════════════════════
       SMALL MOBILE — 480px and below
    ═══════════════════════════════════════════════════ */
    @media (max-width: 480px) {
      .logo-mark { font-size: 1.25rem; }
      .nav-inner { height: 60px; }

      /* Hero */
      .hero-content { padding: 0 5% 4.5rem; }
      .hero-title { font-size: clamp(1.75rem, 7vw, 2.3rem); line-height: 1.1; }
      .hero-sub { font-size: 0.82rem; line-height: 1.65; }

      /* Stats */
      .stat-num { font-size: 1.9rem; }
      .stat-label { font-size: 0.6rem; }
      .stat-item { padding: 1.3rem 0.7rem; }

      /* About */
      .about-images { height: 250px; }
      .about-badge { padding: 0.75rem; min-width: 72px; left: 58%; }
      .about-badge-num { font-size: 1.25rem; }
      .about-badge-label { font-size: 0.52rem; }

      /* Sections */
      section { padding: 3rem 5%; }
      .section-title { font-size: clamp(1.6rem, 6vw, 2rem); }
      .section-sub { font-size: 0.85rem; }

      /* Projects */
      .project-card,
      .project-card:first-child { aspect-ratio: 3/2; min-height: unset; }
      .project-info { padding: 1.1rem; }
      .project-name { font-size: 1.05rem; }
      .project-card:first-child .project-name { font-size: 1.25rem; }
      .project-meta { gap: 0.7rem; font-size: 0.68rem; }
      .project-tag-badge { font-size: 0.58rem; padding: 0.22rem 0.6rem; }

      /* Why us */
      .why-card { padding: 1.5rem 1.1rem; }
      .why-title { font-size: 1.05rem; }
      .why-desc { font-size: 0.8rem; }

      /* Testimonials */
      .testimonial-card { padding: 1.3rem; }
      .testimonial-text { font-size: 0.82rem; }

      /* Contact */
      .form-input, .form-textarea, .form-select { padding: 0.72rem 0.85rem; font-size: 0.82rem; }

      /* CTA */
      .cta-banner { padding: 2.5rem 5%; }
      .btn-dark { font-size: 0.73rem; padding: 0.82rem 1.4rem; max-width: 100%; }

      /* Gallery */
      #gallery { height: 40vh !important; }

      /* Footer */
      .footer-bottom { font-size: 0.68rem; }
      .mobile-nav-link { font-size: 1.65rem; }
    }
  `;

  return (
    <>
      <style>{css}</style>

      {/* THEME SWITCHER */}
      <div className="theme-switcher">
        {(Object.keys(themes) as ThemeKey[]).map((key) => (
          <div key={key} style={{ position: "relative" }}>
            <button
              className={`theme-btn ${themeKey === key ? "active" : ""}`}
              style={{ background: themes[key].accent }}
              onClick={() => setThemeKey(key)}
              title={themes[key].name}
            />
          </div>
        ))}
      </div>

      {/* MOBILE MENU */}
      <div className={`mobile-menu${mobileMenuOpen ? " open" : ""}`}>
        <div className="mobile-nav-links">
          {["Home", "About", "Projects", "Amenities", "Contact"].map((l) => (
            <button key={l} className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>{l}</button>
          ))}
        </div>
        <button className="nav-cta" style={{ marginTop: "2rem", width: "fit-content", display: "block" }}>
          Schedule a Visit
        </button>
      </div>

      {/* NAVBAR */}
      <nav className={`nav${scrolled ? " scrolled" : ""}`}>
        <div className="nav-inner">
          <a className="logo-mark" href="#">Rudhra<span>.</span></a>
          <div className="nav-links">
            {["Home", "About", "Projects", "Amenities", "Gallery", "Contact"].map((l) => (
              <a key={l} className="nav-link" href={`#${l.toLowerCase()}`}>{l}</a>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button className="nav-cta">Schedule a Visit</button>
            <button className="hamburger" onClick={() => setMobileMenuOpen(true)}>
              <FiMenu size={22} />
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero" id="home">
        <img className="hero-img-fallback" src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1800&q=85" alt="Luxury Villas Hyderabad" />
        <div className="hero-overlay" />
        <div className="hero-content container">
          <h1 className="hero-title serif">Where <em>Dreams</em> Find<br />Their Address</h1>
          <p className="hero-sub">Crafting iconic villas and apartments in Hyderabad for over 18 years. Experience the art of refined living with Rudhra Constructions.</p>
          <div className="hero-actions">
            <button className="btn-primary">Explore Projects <FiArrowRight /></button>
            <button className="btn-ghost">Watch Story <FiPlay size={13} /></button>
          </div>
        </div>
        <button className="video-toggle" onClick={toggleVideo}>
          {videoPlaying ? <FiPause size={12} /> : <FiPlay size={12} />}
          {videoPlaying ? "Pause" : "Play"}
        </button>
        <div className="hero-scroll">
          <div className="scroll-line" />
          Scroll
        </div>
      </section>

      {/* STATS BAR */}
      <div className="stats-bar">
        <div className="stats-inner">
          {stats.map((s) => (
            <div className="stat-item" key={s.label}>
              <span className="stat-num serif">
                <AnimatedCounter target={parseInt(s.value)} suffix={s.value.replace(/\d/g, "")} />
              </span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ABOUT */}
      <section id="about">
        <div className="container about-grid">
          <div className="about-images">
            <img className="about-img-main" src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80" alt="Luxury interior" />
            <img className="about-img-accent" src="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600&q=80" alt="Building exterior" />
            <div className="about-badge">
              <span className="about-badge-num">18</span>
              <span className="about-badge-label">Years of<br />Excellence</span>
            </div>
          </div>
          <div>
            <div className="section-tag">Our Story</div>
            <h2 className="section-title serif">Building Legacies,<br /><em>Crafting Homes</em></h2>
            <p className="section-sub">For nearly two decades, Rudhra Constructions has been synonymous with architectural excellence and unwavering trust across Hyderabad and Telangana. We don't just build structures — we sculpt lifestyles.</p>
            <div className="about-features">
              {["Premium construction materials", "RERA registered projects", "Vastu compliant designs", "On-time delivery commitment", "In-house design studio", "Post-possession support"].map((f) => (
                <div className="about-feature" key={f}>
                  <FiCheck className="check-icon" size={15} />
                  <span className="feature-text">{f}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: "2.5rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <button className="btn-primary">Our Journey <FiArrowRight /></button>
              <button className="btn-ghost">Meet the Team</button>
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" style={{ background: themes[themeKey].surface }}>
        <div className="container">
          <div className="projects-filter-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1.5rem" }}>
            <div>
              <div className="section-tag">Our Portfolio</div>
              <h2 className="section-title serif">Landmark <em>Projects</em><br />Across Hyderabad</h2>
            </div>
            <div className="filter-tabs">
              {["All", "Villas", "Apartments", "Ongoing", "Completed", "Upcoming"].map((f) => (
                <button key={f} className={`filter-tab${activeFilter === f ? " active" : ""}`} onClick={() => setActiveFilter(f)}>{f}</button>
              ))}
            </div>
          </div>
          <div style={{ marginTop: "2.5rem" }}>
            <div className="projects-grid">
              {filtered.map((p, i) => (
                <div key={p.name} className="project-card" onMouseEnter={() => setHoveredProject(i)} onMouseLeave={() => setHoveredProject(null)}>
                  <img className="project-img" src={p.img} alt={p.name} />
                  <div className="project-overlay" />
                  <div className="project-info">
                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.5rem" }}>
                      <span className="project-tag-badge">{p.tag}</span>
                      <span style={{ display: "inline-block", padding: "0.2rem 0.6rem", fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", border: `1px solid ${p.status === "Upcoming" ? t.accent : p.status === "Ongoing" ? "#4ade80" : t.textMuted}`, color: p.status === "Upcoming" ? t.accent : p.status === "Ongoing" ? "#4ade80" : t.textMuted }}>{p.status}</span>
                    </div>
                    <div className="project-name serif">{p.name}</div>
                    <div className="project-loc"><FiMapPin size={11} /> {p.location}</div>
                    <div className="project-meta">
                      <span className="project-price">{p.price}</span>
                      <span>·</span>
                      <span>{p.beds}</span>
                    </div>
                    <div className="project-hover-cta">View Details <FiArrowUpRight size={13} /></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ textAlign: "center", marginTop: "3rem" }}>
            <button className="btn-primary">View All Projects <FiArrowRight /></button>
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section id="whyus">
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: "640px", margin: "0 auto 3.5rem" }}>
            <div className="section-tag" style={{ justifyContent: "center" }}>Why Rudhra</div>
            <h2 className="section-title serif">The Rudhra <em>Difference</em></h2>
            <p className="section-sub" style={{ margin: "0 auto" }}>Our commitment to quality, transparency, and customer delight has made us Hyderabad's most trusted real estate developer.</p>
          </div>
          <div className="why-grid">
            {whyUs.map((w) => (
              <div className="why-card" key={w.title}>
                <span className="why-icon">{w.icon}</span>
                <div className="why-title serif">{w.title}</div>
                <div className="why-desc">{w.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AMENITIES */}
      <section className="amenities-section" id="amenities">
        <div className="container amenities-layout">
          <div>
            <div className="section-tag">World-Class Living</div>
            <h2 className="section-title serif">Amenities That<br /><em>Elevate</em> Every Day</h2>
            <p className="section-sub">From landscaped gardens to smart home features, every Rudhra community is designed to enrich your daily lifestyle.</p>
            <div className="amenities-grid">
              {amenities.map((a) => (
                <div className="amenity-item" key={a.label}>
                  <span className="amenity-icon">{a.icon}</span>
                  <span className="amenity-label">{a.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="amenities-img-wrap">
            <img className="amenities-img" src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=900&q=80" alt="Luxury pool amenities" />
          </div>
        </div>
      </section>

      {/* GALLERY / VIRTUAL TOUR */}
      <section id="gallery" style={{ padding: "0", position: "relative", height: "60vh", overflow: "hidden" }}>
        <img src="https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1800&q=85" alt="Aerial villa view" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 100%)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "1.5rem", textAlign: "center", padding: "2rem" }}>
          <div className="section-tag" style={{ justifyContent: "center" }}>Virtual Tour</div>
          <h2 className="section-title serif" style={{ color: "#fff" }}>Experience Your Future<br /><em>Home Before You Buy</em></h2>
          <p style={{ color: "rgba(255,255,255,0.7)", maxWidth: "480px", lineHeight: 1.8, fontSize: "0.95rem" }}>Take an immersive 3D walkthrough of our flagship projects from the comfort of your home.</p>
          <button className="btn-primary" style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.3)", color: "#fff" }}>
            <FiPlay size={14} /> Watch Virtual Tour
          </button>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials">
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: "640px", margin: "0 auto 3.5rem" }}>
            <div className="section-tag" style={{ justifyContent: "center" }}>Happy Families</div>
            <h2 className="section-title serif">Stories of <em>Trust</em> &<br />Transformation</h2>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((t) => (
              <div className="testimonial-card" key={t.name}>
                <div className="stars">{Array(t.rating).fill(null).map((_, i) => <FiStar key={i} className="star" fill="currentColor" />)}</div>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <div className="author-avatar serif">{t.name.charAt(0)}</div>
                  <div>
                    <div className="author-name">{t.name}</div>
                    <div className="author-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <div className="cta-banner">
        <div className="container" style={{ position: "relative" }}>
          <h2 className="cta-title serif">Ready to Find Your Perfect Home?</h2>
          <p className="cta-sub">Talk to our property experts today. Site visits available 7 days a week.</p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn-dark">Book a Site Visit <FiArrowRight /></button>
            <button className="btn-dark" style={{ background: "transparent", border: `1px solid ${t.bg}44`, color: t.bg }}>
              <FiPhone size={14} /> Call Us Now
            </button>
          </div>
        </div>
      </div>

      {/* CONTACT */}
      <section className="contact-section" id="contact">
        <div className="container contact-layout">
          <div>
            <div className="section-tag">Get in Touch</div>
            <h2 className="section-title serif">Let's Begin Your<br /><em>Home Journey</em></h2>
            <p className="section-sub">Our team is ready to assist you in finding the perfect property tailored to your lifestyle and budget.</p>
            <div className="contact-info-items">
              <div className="contact-info-item">
                <FiMapPin className="contact-icon" />
                <div>
                  <div className="contact-info-label">Corporate Office</div>
                  <div className="contact-info-value">Rudhra House, 3rd & 4th Floor, Plot 8&9, Kakatiya Hills, Bachupally, Hyderabad — 500090</div>
                </div>
              </div>
              <div className="contact-info-item">
                <FiPhone className="contact-icon" />
                <div>
                  <div className="contact-info-label">Sales Hotline</div>
                  <div className="contact-info-value">+91 83094 75836 / +91 99498 36096</div>
                </div>
              </div>
              <div className="contact-info-item">
                <FiMail className="contact-icon" />
                <div>
                  <div className="contact-info-label">Email Us</div>
                  <div className="contact-info-value">sales@rudhraconstructions.com</div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div style={{ background: themes[themeKey].card, border: `1px solid ${themes[themeKey].border}`, padding: "2.5rem" }}>
              <h3 className="serif" style={{ fontSize: "1.4rem", marginBottom: "1.5rem", color: themes[themeKey].text }}>Request a Callback</h3>
              <div className="contact-form">
                <div className="form-row">
                  <div className="form-field">
                    <label className="form-label">Full Name</label>
                    <input className="form-input" placeholder="Your name" />
                  </div>
                  <div className="form-field">
                    <label className="form-label">Phone</label>
                    <input className="form-input" placeholder="+91 XXXXX XXXXX" />
                  </div>
                </div>
                <div className="form-field">
                  <label className="form-label">Email</label>
                  <input className="form-input" placeholder="you@email.com" />
                </div>
                <div className="form-field">
                  <label className="form-label">Interested In</label>
                  <select className="form-select">
                    <option value="">Select a project</option>
                    {projects.map((p) => <option key={p.name} value={p.name}>{p.name} — {p.location}</option>)}
                  </select>
                </div>
                <div className="form-field">
                  <label className="form-label">Message</label>
                  <textarea className="form-textarea" placeholder="Tell us about your requirements…" />
                </div>
                <button className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                  Send Enquiry <FiArrowRight />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <span className="footer-logo serif">Rudhra<span>.</span></span>
            <p className="footer-desc">Building premium homes and lasting legacies across Hyderabad and Telangana since 2006. Quality. Trust. Excellence.</p>
            <div className="social-links">
              {["F", "X", "in", "▶"].map((s) => <a key={s} className="social-link" href="#">{s}</a>)}
            </div>
          </div>
          <div>
            <div className="footer-col-title">Projects</div>
            <div className="footer-links">
              {["Royal Village 2", "Rudhra Estates", "Magadha", "Hasthina", "Rudhra's Bhuvi", "Green Lands"].map((l) => <a key={l} className="footer-link" href="#">{l}</a>)}
            </div>
          </div>
          <div>
            <div className="footer-col-title">Company</div>
            <div className="footer-links">
              {["About Us", "Our Team", "Media", "CSR Initiatives", "Awards", "Careers"].map((l) => <a key={l} className="footer-link" href="#">{l}</a>)}
            </div>
          </div>
          <div>
            <div className="footer-col-title">Support</div>
            <div className="footer-links">
              {["Contact Us", "Site Visits", "Home Loan Help", "RERA Details", "Privacy Policy", "Disclaimer"].map((l) => <a key={l} className="footer-link" href="#">{l}</a>)}
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Rudhra Constructions Pvt. Ltd. All rights reserved.</span>
          <div className="rera-badge">
            <div className="rera-dot" />
            RERA Registered Developer · Telangana
          </div>
        </div>
      </footer>
    </>
  );
}

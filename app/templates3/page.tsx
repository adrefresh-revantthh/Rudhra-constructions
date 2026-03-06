
"use client";

import { useState, useEffect, useRef, ReactNode } from "react";
import {
  MapPin, Phone, Mail, Clock, ArrowRight, ArrowUpRight,
  Star, Award, Users, Building2, TrendingUp, CheckCircle2,
  Waves, Dumbbell, Trees, PlayCircle, PersonStanding, Home,
  Shield, Zap, Layers, Target, ChevronRight, Palette,
  Instagram, Facebook, Youtube, Linkedin, Menu, X,
  CalendarCheck, Ruler, BedDouble, Bath, Car, Wifi,
  Sun, Wind, Eye, Heart, Play, Quote, MoveRight,
  Landmark, BarChart3, Globe, Sparkles,
} from "lucide-react";

/* ─── TYPES ─────────────────────────────────────────────────────────────────── */

interface Theme {
  name: string; label: string; dark: boolean;
  bg: string; bg2: string; bg3: string; bg4: string;
  acc: string; accText: string;
  text: string; textMid: string; textFaint: string;
  border: string; grad: string;
  swatch: string[]; font: string; fontBody: string; fontImport: string;
}
type ThemeKey = "arctic"|"obsidian"  | "forest" | "dusk" | "clay";

interface Project {
  name: string; location: string; type: string;
  tag: "COMPLETED" | "ONGOING" | "UPCOMING";
  beds: string; baths: string; sqft: string; img: string;
}
interface Room {
  id: string; label: string; size: string; area: string;
  top: number; left: number; w: number; h: number;
}
interface RotState { x: number; y: number; }
interface DragStart { x: number; y: number; }

/* ─── THEMES ─────────────────────────────────────────────────────────────────── */

const THEMES: Record<ThemeKey, Theme> = {
      arctic: {
    name: "Arctic Steel", label: "Light · Electric Blue", dark: false,
    bg: "#F4F6F9", bg2: "#EAEEF3", bg3: "#DDE3EC", bg4: "#CDD6E4",
    acc: "#1A56DB", accText: "#fff",
    text: "#0F1923", textMid: "rgba(15,25,35,0.55)", textFaint: "rgba(15,25,35,0.3)",
    border: "rgba(26,86,219,0.15)", grad: "linear-gradient(135deg,#1A56DB,#0E3EB0)",
    swatch: ["#1A56DB", "#3B82F6", "#0E3EB0"],
     font: "Libre Baskerville", fontBody: "Karla",
    fontImport: "https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Karla:wght@300;400;500;600;700&display=swap",
  },
  obsidian: {
    name: "Obsidian Ember", label: "Dark · Burnt Orange", dark: true,
    bg: "#0A0A0A", bg2: "#111111", bg3: "#181818", bg4: "#222222",
    acc: "#E8602A", accText: "#fff",
    text: "#F0EDE8", textMid: "rgba(240,237,232,0.55)", textFaint: "rgba(240,237,232,0.28)",
    border: "rgba(232,96,42,0.18)", grad: "linear-gradient(135deg,#E8602A,#C43E10)",
    swatch: ["#E8602A", "#C43E10", "#FF8C5A"],
    font: "Fraunces", fontBody: "Outfit",
    fontImport: "https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,400;0,600;0,700;0,900;1,300;1,400;1,600;1,900&family=Outfit:wght@300;400;500;600&display=swap",
  },

  forest: {
    name: "Midnight Forest", label: "Dark · Emerald Green", dark: true,
    bg: "#070E0A", bg2: "#0D1710", bg3: "#142016", bg4: "#1B2B1E",
    acc: "#2ECC71", accText: "#000",
    text: "#E8F5EE", textMid: "rgba(232,245,238,0.55)", textFaint: "rgba(232,245,238,0.28)",
    border: "rgba(46,204,113,0.18)", grad: "linear-gradient(135deg,#2ECC71,#1A9E52)",
    swatch: ["#2ECC71", "#1A9E52", "#52E08A"],
    font: "Cormorant Garamond", fontBody: "Jost",
    fontImport: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600;1,700&family=Jost:wght@300;400;500;600&display=swap",
  },
  dusk: {
    name: "Dusk Mauve", label: "Dark · Rose Pink", dark: true,
    bg: "#0E0810", bg2: "#160D18", bg3: "#1E1220", bg4: "#27182A",
    acc: "#D946A8", accText: "#fff",
    text: "#F5EEF7", textMid: "rgba(245,238,247,0.55)", textFaint: "rgba(245,238,247,0.28)",
    border: "rgba(217,70,168,0.18)", grad: "linear-gradient(135deg,#D946A8,#A82882)",
    swatch: ["#D946A8", "#A82882", "#F472CC"],
    font: "Abril Fatface", fontBody: "DM Sans",
    fontImport: "https://fonts.googleapis.com/css2?family=Abril+Fatface&family=DM+Sans:wght@300;400;500;600&display=swap",
  },
  clay: {
    name: "Warm Clay", label: "Light · Terracotta", dark: false,
    bg: "#FAF6F2", bg2: "#F2EBE3", bg3: "#E8DDD2", bg4: "#DDD0C3",
    acc: "#B5451B", accText: "#fff",
    text: "#1C1008", textMid: "rgba(28,16,8,0.55)", textFaint: "rgba(28,16,8,0.3)",
    border: "rgba(181,69,27,0.15)", grad: "linear-gradient(135deg,#B5451B,#8C3010)",
    swatch: ["#B5451B", "#8C3010", "#D4623A"],
    font: "Libre Baskerville", fontBody: "Karla",
    fontImport: "https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Karla:wght@300;400;500;600;700&display=swap",
  },
};

/* ─── STATIC DATA ────────────────────────────────────────────────────────────── */

const PROJECTS: Project[] = [
  { name: "Rudhra Bhuvi",    location: "Pragathi Nagar", tag: "COMPLETED", type: "3 / 4 BHK Luxury Villas",   beds: "3–4 BHK", baths: "4", sqft: "2200–3100", img: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=700&q=85" },
  { name: "Rudhra Grandeur", location: "Miyapur",        tag: "ONGOING",   type: "3 / 4 BHK Premium Apts",    beds: "3–4 BHK", baths: "3", sqft: "1850–2600", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=700&q=85" },
  { name: "Rudhra Elite",    location: "Bachupally",     tag: "UPCOMING",  type: "2 / 3 BHK Smart Homes",     beds: "2–3 BHK", baths: "3", sqft: "1400–2100", img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=700&q=85" },
  { name: "Rudhra Heights",  location: "KPHB Colony",    tag: "ONGOING",   type: "2 / 3 BHK Apartments",      beds: "2–3 BHK", baths: "2", sqft: "1200–1900", img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=700&q=85" },
  { name: "Rudhra Serenity", location: "Kukatpally",     tag: "COMPLETED", type: "3 BHK Premium Villas",      beds: "3 BHK",   baths: "3", sqft: "1900–2400", img: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=700&q=85" },
  { name: "Rudhra Skyline",  location: "Chandanagar",    tag: "UPCOMING",  type: "2 / 3 / 4 BHK Luxury",     beds: "2–4 BHK", baths: "3", sqft: "1600–3200", img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=700&q=85" },
];

const ROOMS: Room[] = [
  { id: "master",  label: "Master Bedroom", size: "16×14", area: "224 sqft", top: 30,  left: 30,  w: 190, h: 170 },
  { id: "bed2",    label: "Bedroom 2",      size: "14×12", area: "168 sqft", top: 30,  left: 240, w: 160, h: 130 },
  { id: "living",  label: "Living Room",    size: "20×18", area: "360 sqft", top: 220, left: 30,  w: 210, h: 195 },
  { id: "kitchen", label: "Kitchen",        size: "12×10", area: "120 sqft", top: 180, left: 260, w: 140, h: 115 },
  { id: "balcony", label: "Balcony",        size: "10×6",  area: "60 sqft",  top: 310, left: 260, w: 140, h: 80  },
  { id: "bath",    label: "Bathrooms",      size: "2×8×6", area: "96 sqft",  top: 30,  left: 420, w: 88,  h: 150 },
];

const GALLERY_IMGS: string[] = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&q=85",
  "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=700&q=85",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=700&q=85",
  "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=700&q=85",
  "https://images.unsplash.com/photo-1560185127-6a192a7a0b8b?w=700&q=85",
];

const TESTIMONIALS = [
  { name: "Rajesh Reddy", role: "IT Director · Gachibowli",    init: "RR", text: "Rudhra delivered our dream villa with impeccable craftsmanship. Every detail — from the Italian marble to the panoramic balcony — surpassed what we envisioned." },
  { name: "Priya Sharma",  role: "Entrepreneur · Kondapur",    init: "PS", text: "We trusted Rudhra with our most important investment and they delivered on every promise, on time. The construction quality is simply unmatched in Hyderabad." },
  { name: "Venkat Rao",    role: "NRI Client · San Jose, USA", init: "VR", text: "Buying from abroad was seamless with Rudhra. Their transparency, virtual walkthroughs, and constant updates made the entire journey truly stress-free." },
];

const VT_THUMBS = [
  "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=400&q=80",
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=400&q=80",
  "https://images.unsplash.com/photo-1560185127-6a192a7a0b8b?w=400&q=80",
];
const VT_MAIN = [
  "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=900&q=85",
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=900&q=85",
  "https://images.unsplash.com/photo-1560185127-6a192a7a0b8b?w=900&q=85",
];

const NAV_LINKS = ["Projects", "Amenities", "Process", "Gallery", "Invest", "Contact"];
const QUICK_LINKS = ["About Rudhra", "Our Projects", "Amenities", "Gallery", "NRI Corner", "Careers"];

/* ─── CSS FACTORY ────────────────────────────────────────────────────────────── */

function makeCSS(t: Theme): string {
  const isFatface = t.font === "Abril Fatface";
  const headFW = isFatface ? "400" : "700";

  return `
@import url('${t.fontImport}');

/* ── RESET & BASE ── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; -webkit-text-size-adjust: 100%; }
body {
  background: ${t.bg};
  color: ${t.text};
  font-family: '${t.fontBody}', sans-serif;
  overflow-x: hidden;
  line-height: 1.5;
}
img { display: block; max-width: 100%; }
button { font-family: inherit; }
::-webkit-scrollbar { width: 3px; }
::-webkit-scrollbar-track { background: ${t.bg}; }
::-webkit-scrollbar-thumb { background: ${t.grad}; }

/* ── THEME SWITCHER ── */
.ts-wrap { position: fixed; bottom: 24px; right: 24px; z-index: 500; }
.ts-btn {
  width: 48px; height: 48px;
  background: ${t.grad}; border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  color: ${t.accText};
  box-shadow: 0 6px 24px rgba(0,0,0,0.35);
  border-radius: 4px;
  transition: transform 0.3s;
}
.ts-btn:hover { transform: scale(1.08) rotate(20deg); }
.ts-menu {
  position: absolute; bottom: 58px; right: 0;
  background: ${t.dark ? "#1e1e1e" : "#ffffff"};
  border: 1px solid ${t.border};
  width: 220px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  overflow: hidden;
}
.ts-head {
  padding: 12px 16px 8px;
  font-family: '${t.fontBody}', sans-serif;
  font-size: 9px; letter-spacing: 3px; text-transform: uppercase;
  color: ${t.textFaint}; font-weight: 700;
}
.ts-item {
  display: flex; align-items: center; gap: 12px;
  padding: 10px 14px; cursor: pointer;
  border-left: 2px solid transparent;
  transition: all 0.18s;
}
.ts-item:hover { background: ${t.bg2}; }
.ts-item.on { background: ${t.bg3}; border-left-color: ${t.acc}; }
.ts-dots { display: flex; gap: 4px; flex-shrink: 0; }
.ts-dot { width: 10px; height: 10px; border-radius: 50%; }
.ts-nm { font-family: '${t.fontBody}', sans-serif; font-size: 12px; font-weight: 600; color: ${t.text}; }
.ts-lb { font-family: '${t.fontBody}', sans-serif; font-size: 10px; color: ${t.textMid}; }

/* ── NAV ── */
.nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 200;
  display: flex; align-items: center; justify-content: space-between;
  padding: 18px 64px;
  transition: all 0.4s ease;
}
.nav.scrolled {
  background: ${t.dark ? "rgba(10,10,10,0.97)" : "rgba(244,246,249,0.97)"};
  backdrop-filter: blur(20px);
  padding: 12px 64px;
  border-bottom: 1px solid ${t.border};
  box-shadow: 0 2px 24px rgba(0,0,0,0.12);
}
.nav-logo { display: flex; align-items: center; gap: 13px; cursor: pointer; flex-shrink: 0; }
.nav-sq {
  width: 40px; height: 40px;
  background: ${t.grad};
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.nav-brand { font-family: '${t.font}', serif; font-size: 17px; color: ${t.acc}; letter-spacing: 1.5px; line-height: 1.1; }
.nav-sub { font-size: 8px; letter-spacing: 4px; color: ${t.textMid}; text-transform: uppercase; font-family: '${t.fontBody}', sans-serif; }
.nav-links { display: flex; gap: 32px; }
.nav-link {
  font-family: '${t.fontBody}', sans-serif;
  font-size: 11px; letter-spacing: 2px; text-transform: uppercase;
  color: ${t.textMid}; cursor: pointer;
  transition: color 0.25s; position: relative; font-weight: 500;
}
.nav-link::after {
  content: ''; position: absolute; bottom: -4px; left: 0;
  width: 0; height: 1.5px; background: ${t.acc}; transition: width 0.28s;
}
.nav-link:hover { color: ${t.acc}; }
.nav-link:hover::after { width: 100%; }
.nav-cta {
  padding: 10px 24px;
  border: 1.5px solid ${t.acc};
  font-family: '${t.fontBody}', sans-serif;
  font-size: 10px; letter-spacing: 2px; text-transform: uppercase;
  color: ${t.acc}; background: transparent; cursor: pointer;
  transition: all 0.3s; position: relative; overflow: hidden;
  font-weight: 600;
}
.nav-cta::before {
  content: ''; position: absolute; inset: 0;
  background: ${t.acc}; transform: translateX(-101%);
  transition: transform 0.32s ease;
}
.nav-cta:hover::before { transform: translateX(0); }
.nav-cta span { position: relative; z-index: 1; transition: color 0.32s; }
.nav-cta:hover span { color: ${t.accText}; }
.nav-ham { display: none; background: transparent; border: none; cursor: pointer; color: ${t.acc}; padding: 4px; }

/* ── MOBILE NAV DRAWER ── */
.mob-nav {
  position: fixed; top: 0; right: 0; bottom: 0; width: min(320px, 85vw);
  background: ${t.dark ? "#131313" : "#ffffff"};
  z-index: 600; transform: translateX(100%);
  transition: transform 0.35s cubic-bezier(0.4,0,0.2,1);
  display: flex; flex-direction: column;
  border-left: 1px solid ${t.border};
  box-shadow: -20px 0 60px rgba(0,0,0,0.25);
}
.mob-nav.open { transform: translateX(0); }
.mob-nav-head {
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid ${t.border};
}
.mob-nav-body { flex: 1; padding: 12px 0; overflow-y: auto; }
.mob-nav-link {
  display: block; padding: 16px 24px;
  font-family: '${t.fontBody}', sans-serif;
  font-size: 14px; letter-spacing: 1.5px; text-transform: uppercase;
  color: ${t.textMid}; font-weight: 600; cursor: pointer;
  border-bottom: 1px solid ${t.border};
  transition: color 0.2s, background 0.2s;
}
.mob-nav-link:hover { color: ${t.acc}; background: ${t.bg2}; }
.mob-nav-foot { padding: 20px 24px; }
.mob-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.6);
  z-index: 590; opacity: 0; pointer-events: none;
  transition: opacity 0.3s;
}
.mob-overlay.open { opacity: 1; pointer-events: all; }

/* ── HERO ── */
.hero {
  position: relative; min-height: 100vh;
  display: flex; align-items: center;
  overflow: hidden;
}
.hero-bg {
  position: absolute; inset: 0;
  background: url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=90') center / cover no-repeat;
  transform: scale(1.06);
  animation: zoomOut 14s ease forwards;
}
@keyframes zoomOut { from { transform: scale(1.08); } to { transform: scale(1.0); } }
.hero-ov {
  position: absolute; inset: 0;
  background: ${t.dark
    ? `linear-gradient(110deg, ${t.bg}F5 0%, ${t.bg}C0 50%, ${t.bg}55 100%)`
    : `linear-gradient(110deg, ${t.bg}F8 0%, ${t.bg}D0 55%, ${t.bg}70 100%)`};
}
.hero-grain {
  position: absolute; inset: 0; opacity: 0.025;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 200px;
}
.hero-inner {
  position: relative; z-index: 2;
  padding: 120px 64px 80px;
  max-width: 900px; width: 100%;
}
.hero-eyebrow {
  display: inline-flex; align-items: center; gap: 12px;
  margin-bottom: 28px;
  opacity: 0; animation: fadeUp 0.9s ease 0.3s forwards;
}
.eyebrow-bar { width: 28px; height: 2px; background: ${t.acc}; flex-shrink: 0; }
.eyebrow-txt {
  font-family: '${t.fontBody}', sans-serif;
  font-size: 10px; letter-spacing: 4px; text-transform: uppercase;
  color: ${t.acc}; font-weight: 700;
}
.hero-h1 {
  font-family: '${t.font}', serif;
  font-size: clamp(34px, 6.5vw, 66px);
  font-weight: ${headFW};
  line-height: ${isFatface ? "1.1" : "1.0"};
  color: ${t.text};
  margin-bottom: 24px;
  opacity: 0; animation: fadeUp 0.9s ease 0.5s forwards;
}
.hero-h1 em { font-style: italic; color: ${t.acc}; }
.hero-p {
  font-size: clamp(15px, 1.8vw, 18px);
  line-height: 1.75; color: ${t.textMid};
  max-width: 520px; margin-bottom: 44px; font-weight: 300;
  opacity: 0; animation: fadeUp 0.9s ease 0.7s forwards;
}
.hero-btns {
  display: flex; gap: 14px; flex-wrap: wrap;
  opacity: 0; animation: fadeUp 0.9s ease 0.9s forwards;
}
.btn-fill {
  display: inline-flex; align-items: center; gap: 9px;
  padding: 15px 36px;
  background: ${t.grad}; color: ${t.accText};
  font-family: '${t.fontBody}', sans-serif;
  font-size: 11px; letter-spacing: 2px; text-transform: uppercase;
  border: none; cursor: pointer; font-weight: 700;
  transition: all 0.3s;
}
.btn-fill:hover { transform: translateY(-2px); box-shadow: 0 14px 36px ${t.acc}40; }
.btn-out {
  display: inline-flex; align-items: center; gap: 9px;
  padding: 15px 36px; background: transparent;
  border: 1.5px solid ${t.dark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.2)"};
  color: ${t.text};
  font-family: '${t.fontBody}', sans-serif;
  font-size: 11px; letter-spacing: 2px; text-transform: uppercase;
  cursor: pointer; font-weight: 600; transition: all 0.3s;
}
.btn-out:hover { border-color: ${t.acc}; color: ${t.acc}; }
.hero-scroll {
  position: absolute; bottom: 36px; left: 64px; z-index: 2;
  display: flex; align-items: center; gap: 12px;
  opacity: 0; animation: fadeUp 0.9s ease 1.1s forwards;
}
.scroll-line { width: 48px; height: 1px; background: linear-gradient(to right, ${t.acc}, transparent); }
.scroll-txt {
  font-family: '${t.fontBody}', sans-serif;
  font-size: 9px; letter-spacing: 4px; text-transform: uppercase; color: ${t.textMid};
}
.hero-stats {
  position: absolute; right: 64px; bottom: 36px; z-index: 2;
  background: ${t.dark ? "rgba(12,12,12,0.9)" : "rgba(255,255,255,0.9)"};
  backdrop-filter: blur(20px);
  border: 1px solid ${t.border};
  padding: 22px 28px;
  opacity: 0; animation: fadeUp 0.9s ease 1.3s forwards;
}
.hs-row { display: flex; gap: 28px; }
.hs-item { text-align: center; }
.hs-num { font-family: '${t.font}', serif; font-size: 30px; font-weight: ${headFW}; color: ${t.acc}; line-height: 1; }
.hs-lbl { font-family: '${t.fontBody}', sans-serif; font-size: 9px; letter-spacing: 3px; text-transform: uppercase; color: ${t.textMid}; margin-top: 4px; }

/* ── SECTION COMMON ── */
.sec { padding: 100px 64px; }
.sec-alt { padding: 100px 64px; background: ${t.bg2}; }
.lbl { display: flex; align-items: center; gap: 11px; margin-bottom: 14px; }
.lbl-bar { width: 26px; height: 2px; background: ${t.acc}; flex-shrink: 0; }
.lbl-txt {
  font-family: '${t.fontBody}', sans-serif;
  font-size: 9px; letter-spacing: 4px; text-transform: uppercase; color: ${t.acc}; font-weight: 700;
}
.sh {
  font-family: '${t.font}', serif;
  font-size: clamp(28px, 4vw, 56px);
  font-weight: ${headFW}; line-height: 1.1; color: ${t.text}; margin-bottom: 14px;
}
.sh em { font-style: italic; color: ${t.acc}; }
.sdiv { width: 38px; height: 2px; background: ${t.acc}; margin: 16px 0; }
.sp { font-size: 15px; color: ${t.textMid}; line-height: 1.8; max-width: 520px; font-weight: 300; }

/* ── STATS STRIP ── */
.stats-strip {
  background: ${t.bg2};
  border-top: 1px solid ${t.border};
  border-bottom: 1px solid ${t.border};
  padding: 0 64px;
}
.stats-grid {
  display: grid; grid-template-columns: repeat(4, 1fr);
  gap: 1px; background: ${t.border};
}
.stat-card {
  padding: 52px 32px; text-align: center;
  background: ${t.bg3}; position: relative; overflow: hidden;
  transition: background 0.35s;
}
.stat-card::after {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
  background: ${t.grad}; transform: scaleX(0); transform-origin: left; transition: transform 0.4s;
}
.stat-card:hover { background: ${t.bg4}; }
.stat-card:hover::after { transform: scaleX(1); }
.stat-icon {
  width: 44px; height: 44px;
  background: ${t.acc}18; border: 1px solid ${t.acc}30;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 16px; color: ${t.acc};
}
.stat-n { font-family: '${t.font}', serif; font-size: 48px; font-weight: ${headFW}; color: ${t.acc}; line-height: 1; }
.stat-l { font-family: '${t.fontBody}', sans-serif; font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: ${t.textMid}; margin-top: 7px; font-weight: 500; }

/* ── PROJECTS ── */
.proj-grid {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 2px; margin-top: 52px;
}
.pc {
  position: relative; overflow: hidden; cursor: pointer;
  aspect-ratio: 3 / 4;
}
.pc img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.7s ease; }
.pc:hover img { transform: scale(1.08); }
.pc-ov {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.1) 55%, transparent 100%);
}
.pc-tag {
  position: absolute; top: 16px; left: 16px;
  padding: 4px 11px;
  background: ${t.acc};
  font-family: '${t.fontBody}', sans-serif;
  font-size: 8px; letter-spacing: 2px; text-transform: uppercase; color: ${t.accText}; font-weight: 700;
}
.pc-body { position: absolute; bottom: 0; left: 0; right: 0; padding: 24px; }
.pc-name { font-family: '${t.font}', serif; font-size: 22px; font-weight: ${headFW}; line-height: 1.15; margin-bottom: 6px; color: #fff; }
.pc-loc { display: flex; align-items: center; gap: 5px; font-size: 11px; color: rgba(255,255,255,0.55); margin-bottom: 10px; font-family: '${t.fontBody}', sans-serif; }
.pc-specs { display: flex; gap: 10px; flex-wrap: wrap; }
.pc-spec { display: flex; align-items: center; gap: 4px; font-size: 10px; color: rgba(255,255,255,0.5); font-family: '${t.fontBody}', sans-serif; }
.pc-arrow {
  position: absolute; top: 16px; right: 16px;
  width: 36px; height: 36px;
  background: ${t.acc}25; border: 1px solid ${t.acc};
  display: flex; align-items: center; justify-content: center;
  color: ${t.acc}; opacity: 0; transform: translateY(-6px); transition: all 0.3s;
}
.pc:hover .pc-arrow { opacity: 1; transform: translateY(0); }

/* ── AMENITIES ── */
.am-grid {
  display: grid; grid-template-columns: repeat(6, 1fr);
  gap: 1px; background: ${t.border}; margin-top: 52px;
}
.am-card {
  padding: 36px 14px; text-align: center;
  background: ${t.bg3}; position: relative; overflow: hidden;
  transition: all 0.32s; cursor: default;
}
.am-card::after {
  content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
  background: ${t.grad}; transform: scaleX(0); transition: transform 0.32s;
}
.am-card:hover::after { transform: scaleX(1); }
.am-card:hover { background: ${t.bg4}; transform: translateY(-4px); }
.am-icon {
  width: 50px; height: 50px; margin: 0 auto 13px;
  background: ${t.acc}14; border: 1px solid ${t.acc}28;
  display: flex; align-items: center; justify-content: center;
  color: ${t.acc}; transition: all 0.3s;
}
.am-card:hover .am-icon { background: ${t.acc}28; border-color: ${t.acc}; }
.am-name {
  font-family: '${t.fontBody}', sans-serif;
  font-size: 10px; letter-spacing: 2px; text-transform: uppercase;
  color: ${t.textMid}; font-weight: 500; transition: color 0.3s;
}
.am-card:hover .am-name { color: ${t.acc}; }

/* ── WHY ── */
.why-grid {
  display: grid; grid-template-columns: repeat(2, 1fr);
  gap: 1px; background: ${t.border}; margin-top: 52px;
}
.why-card {
  padding: 56px; background: ${t.bg2};
  position: relative; overflow: hidden; transition: background 0.32s;
}
.why-card:hover { background: ${t.bg3}; }
.why-ghost {
  font-family: '${t.font}', serif; font-size: 88px; font-weight: ${headFW};
  color: ${t.acc}07; position: absolute; top: 8px; right: 18px;
  line-height: 1; user-select: none; transition: color 0.4s;
}
.why-card:hover .why-ghost { color: ${t.acc}14; }
.why-icon {
  width: 48px; height: 48px;
  background: ${t.acc}14; border: 1px solid ${t.acc}28;
  display: flex; align-items: center; justify-content: center;
  color: ${t.acc}; margin-bottom: 20px;
}
.why-title { font-family: '${t.font}', serif; font-size: 24px; font-weight: ${headFW}; margin-bottom: 12px; color: ${t.text}; }
.why-text { font-size: 14px; line-height: 1.85; color: ${t.textMid}; font-weight: 300; }

/* ── FLOOR PLAN ── */
.fp-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: center; }
.fp-viewer {
  position: relative; height: 460px;
  background: ${t.dark ? "#000" : t.bg3};
  overflow: hidden; cursor: grab;
  border: 1px solid ${t.border};
  touch-action: none;
}
.fp-viewer:active { cursor: grabbing; }
.fp-scene { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
.fp-plan { position: relative; width: 560px; height: 400px; transform-style: preserve-3d; transition: transform 0.08s linear; }
.fp-room {
  position: absolute;
  border: 1px solid ${t.acc}40; background: ${t.acc}05;
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px;
  cursor: pointer; transition: all 0.25s;
}
.fp-room:hover, .fp-room.active { background: ${t.acc}18; border-color: ${t.acc}; }
.fp-room.active { box-shadow: inset 0 0 20px ${t.acc}18; }
.fp-grid {
  position: absolute; inset: 0;
  background-image: linear-gradient(${t.acc}07 1px, transparent 1px),
    linear-gradient(90deg, ${t.acc}07 1px, transparent 1px);
  background-size: 30px 30px;
}
.fp-hint {
  position: absolute; bottom: 12px; left: 50%; transform: translateX(-50%);
  display: flex; align-items: center; gap: 7px;
  font-family: '${t.fontBody}', sans-serif;
  font-size: 9px; letter-spacing: 3px; text-transform: uppercase; color: ${t.textFaint};
}
.room-lbl { font-family: '${t.fontBody}', sans-serif; font-size: 8px; letter-spacing: 2px; text-transform: uppercase; color: ${t.acc}; font-weight: 600; }
.room-sz { font-family: '${t.font}', serif; font-size: 17px; color: ${t.text}; font-weight: ${headFW}; }
.room-sq { font-family: '${t.fontBody}', sans-serif; font-size: 9px; color: ${t.textMid}; }
.fp-info { display: flex; flex-direction: column; }
.fi-top { background: ${t.bg2}; border: 1px solid ${t.border}; padding: 28px; }
.fi-title { font-family: '${t.font}', serif; font-size: 36px; font-weight: ${headFW}; color: ${t.acc}; margin-bottom: 4px; }
.fi-sub { font-family: '${t.fontBody}', sans-serif; font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: ${t.textMid}; font-weight: 600; }
.fi-specs { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: ${t.border}; margin-top: 18px; }
.fi-spec { background: ${t.bg3}; padding: 15px 18px; }
.fi-sl { font-family: '${t.fontBody}', sans-serif; font-size: 9px; letter-spacing: 3px; text-transform: uppercase; color: ${t.textMid}; margin-bottom: 4px; font-weight: 600; }
.fi-sv { font-family: '${t.fontBody}', sans-serif; font-size: 14px; font-weight: 600; color: ${t.text}; display: flex; align-items: center; gap: 6px; }
.fi-tabs { display: flex; flex-direction: column; gap: 1px; background: ${t.border}; }
.fi-tab {
  padding: 12px 18px; background: ${t.bg3};
  font-family: '${t.fontBody}', sans-serif;
  font-size: 10px; letter-spacing: 2px; text-transform: uppercase;
  color: ${t.textMid}; cursor: pointer;
  transition: all 0.2s; border-left: 2px solid transparent;
  display: flex; justify-content: space-between; align-items: center; font-weight: 600;
}
.fi-tab:hover { color: ${t.text}; border-left-color: ${t.acc}60; }
.fi-tab.active { color: ${t.acc}; background: ${t.bg4}; border-left-color: ${t.acc}; }

/* ── GALLERY ── */
.gal-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: 250px 250px;
  gap: 3px; margin-top: 52px;
}
.gi { overflow: hidden; position: relative; cursor: pointer; }
.gi img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.7s ease; }
.gi:hover img { transform: scale(1.07); }
.gi:nth-child(1) { grid-column: span 5; grid-row: span 2; }
.gi:nth-child(2) { grid-column: span 4; }
.gi:nth-child(3) { grid-column: span 3; }
.gi:nth-child(4) { grid-column: span 4; }
.gi:nth-child(5) { grid-column: span 3; }
.gi-ov {
  position: absolute; inset: 0; background: transparent;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.32s;
}
.gi:hover .gi-ov { background: rgba(0,0,0,0.42); }
.gi-zoom {
  width: 44px; height: 44px;
  border: 1.5px solid ${t.acc};
  display: flex; align-items: center; justify-content: center;
  color: ${t.acc}; opacity: 0; transform: scale(0.7); transition: all 0.3s;
}
.gi:hover .gi-zoom { opacity: 1; transform: scale(1); }

/* ── INVESTMENT ── */
.inv-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; }
.inv-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: ${t.border}; margin-top: 30px; }
.inv-stat { padding: 24px; background: ${t.bg3}; border-left: 2px solid ${t.acc}; transition: background 0.3s; }
.inv-stat:hover { background: ${t.bg4}; }
.inv-n { font-family: '${t.font}', serif; font-size: 34px; font-weight: ${headFW}; color: ${t.acc}; }
.inv-l { font-family: '${t.fontBody}', sans-serif; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: ${t.textMid}; margin-top: 3px; font-weight: 500; }
.city-img-wrap { position: relative; overflow: hidden; }
.city-img-wrap img { width: 100%; height: 480px; object-fit: cover; display: block; }
.city-ov { position: absolute; inset: 0; background: linear-gradient(to right, ${t.bg2}CC, transparent 60%); }
.city-badge { position: absolute; bottom: 28px; left: 28px; }
.city-badge-lbl { font-family: '${t.fontBody}', sans-serif; font-size: 9px; letter-spacing: 4px; text-transform: uppercase; color: ${t.acc}; margin-bottom: 6px; font-weight: 700; }
.city-badge-title { font-family: '${t.font}', serif; font-size: 30px; font-weight: ${headFW}; color: #fff; line-height: 1.15; }

/* ── PROCESS ── */
.proc-row {
  display: flex; gap: 0; margin-top: 56px; position: relative;
}
.proc-row::before {
  content: ''; position: absolute; top: 32px; left: 0; right: 0; height: 1px;
  background: linear-gradient(to right, transparent, ${t.acc} 10%, ${t.acc} 90%, transparent);
}
.proc-step { flex: 1; padding-top: 64px; padding-right: 24px; position: relative; }
.proc-dot {
  position: absolute; top: 18px; left: 0;
  width: 24px; height: 24px;
  border: 1.5px solid ${t.acc}; background: ${t.bg};
  display: flex; align-items: center; justify-content: center; transition: all 0.3s;
}
.proc-dot span { font-family: '${t.fontBody}', sans-serif; font-size: 9px; color: ${t.acc}; font-weight: 700; }
.proc-step:hover .proc-dot { background: ${t.acc}; }
.proc-step:hover .proc-dot span { color: ${t.accText}; }
.proc-icon {
  width: 44px; height: 44px;
  background: ${t.acc}14; border: 1px solid ${t.acc}28;
  display: flex; align-items: center; justify-content: center;
  color: ${t.acc}; margin-bottom: 15px; transition: all 0.3s;
}
.proc-step:hover .proc-icon { background: ${t.acc}28; border-color: ${t.acc}; }
.proc-title { font-family: '${t.font}', serif; font-size: 20px; font-weight: ${headFW}; margin-bottom: 8px; color: ${t.text}; }
.proc-text { font-family: '${t.fontBody}', sans-serif; font-size: 13px; line-height: 1.8; color: ${t.textMid}; font-weight: 300; }

/* ── VIRTUAL TOUR ── */
.vt-bg { background: ${t.bg3}; position: relative; overflow: hidden; }
.vt-bg::before {
  content: ''; position: absolute; inset: 0;
  background: radial-gradient(ellipse at 70% 50%, ${t.acc}0A, transparent 60%);
}
.vt-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: center; }
.vt-screen { position: relative; overflow: hidden; }
.vt-main-img { width: 100%; height: 420px; object-fit: cover; display: block; }
.vt-play {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  background: rgba(0,0,0,0.28); cursor: pointer; transition: background 0.3s;
}
.vt-play:hover { background: rgba(0,0,0,0.1); }
.vt-circle {
  width: 76px; height: 76px;
  border: 1.5px solid ${t.acc}80; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  backdrop-filter: blur(8px); background: ${t.acc}20; transition: all 0.3s;
}
.vt-play:hover .vt-circle { background: ${t.acc}; border-color: ${t.acc}; }
.vt-thumbs { display: grid; grid-template-columns: repeat(3, 1fr); gap: 3px; margin-top: 3px; }
.vt-thumb { position: relative; overflow: hidden; cursor: pointer; aspect-ratio: 16/9; }
.vt-thumb img { width: 100%; height: 100%; object-fit: cover; transition: all 0.3s; }
.vt-thumb.active::after { content: ''; position: absolute; inset: 0; border: 2px solid ${t.acc}; }
.vt-thumb-ov { position: absolute; inset: 0; background: rgba(0,0,0,0.46); transition: background 0.3s; }
.vt-thumb.active .vt-thumb-ov, .vt-thumb:hover .vt-thumb-ov { background: rgba(0,0,0,0.08); }
.vt-feats { display: flex; flex-direction: column; }
.vt-feat {
  display: flex; gap: 16px; align-items: flex-start;
  padding: 22px 0;
  border-bottom: 1px solid ${t.dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)"};
}
.vt-feat:first-child { padding-top: 0; }
.vt-feat:last-child { border-bottom: none; }
.vt-feat-icon {
  width: 42px; height: 42px; flex-shrink: 0;
  background: ${t.acc}14; border: 1px solid ${t.acc}28;
  display: flex; align-items: center; justify-content: center; color: ${t.acc};
}
.vt-feat-title { font-family: '${t.font}', serif; font-size: 18px; font-weight: ${headFW}; margin-bottom: 4px; color: ${t.text}; }
.vt-feat-text { font-family: '${t.fontBody}', sans-serif; font-size: 13px; color: ${t.textMid}; line-height: 1.75; font-weight: 300; }

/* ── TESTIMONIALS ── */
.test-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: ${t.border}; margin-top: 52px; }
.tc {
  padding: 40px 36px; background: ${t.bg2};
  position: relative; overflow: hidden; transition: background 0.32s;
}
.tc::after {
  content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
  background: ${t.grad}; transform: scaleX(0); transition: transform 0.4s;
}
.tc:hover::after { transform: scaleX(1); }
.tc:hover { background: ${t.bg3}; }
.tc-q { color: ${t.acc}; opacity: 0.1; position: absolute; top: 16px; right: 20px; }
.tc-stars { display: flex; gap: 3px; color: ${t.acc}; margin-bottom: 16px; }
.tc-text { font-family: '${t.font}', serif; font-size: 17px; line-height: 1.78; color: ${t.text}; opacity: 0.85; font-style: italic; margin-bottom: 26px; }
.tc-author { display: flex; align-items: center; gap: 12px; }
.tc-avatar {
  width: 42px; height: 42px; border-radius: 50%; flex-shrink: 0;
  background: ${t.grad};
  display: flex; align-items: center; justify-content: center;
  font-family: '${t.font}', serif; font-size: 16px; color: ${t.accText}; font-weight: ${headFW};
}
.tc-name { font-family: '${t.fontBody}', sans-serif; font-size: 14px; font-weight: 600; color: ${t.text}; }
.tc-role { font-family: '${t.fontBody}', sans-serif; font-size: 11px; color: ${t.textMid}; margin-top: 2px; }

/* ── CONTACT ── */
.cont-top { position: relative; }
.cont-top::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(to right, transparent, ${t.acc}, transparent); }
.cont-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: start; }
.ci { display: flex; gap: 15px; margin-bottom: 26px; align-items: flex-start; }
.ci-icon {
  width: 42px; height: 42px; flex-shrink: 0;
  background: ${t.bg2}; border: 1px solid ${t.border};
  display: flex; align-items: center; justify-content: center; color: ${t.acc};
}
.ci-lbl { font-family: '${t.fontBody}', sans-serif; font-size: 8px; letter-spacing: 3px; text-transform: uppercase; color: ${t.acc}; margin-bottom: 4px; font-weight: 700; }
.ci-val { font-family: '${t.fontBody}', sans-serif; font-size: 14px; color: ${t.text}; }
.f-inp {
  width: 100%; padding: 16px 18px;
  background: ${t.bg2}; border: 1px solid ${t.border};
  color: ${t.text}; font-family: '${t.fontBody}', sans-serif; font-size: 14px;
  transition: all 0.3s; outline: none; margin-bottom: 2px; font-weight: 300;
}
.f-inp:focus { border-color: ${t.acc}; background: ${t.bg3}; }
.f-inp::placeholder { color: ${t.textFaint}; }
.f-sel { appearance: none; cursor: pointer; }
.f-ta { min-height: 110px; resize: vertical; }

/* ── FOOTER ── */
.foot {
  padding: 56px 64px 36px;
  background: ${t.dark ? "#050505" : t.bg3};
  border-top: 1px solid ${t.border};
}
.foot-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 48px; margin-bottom: 44px; }
.foot-col-title { font-family: '${t.fontBody}', sans-serif; font-size: 9px; letter-spacing: 3px; text-transform: uppercase; color: ${t.acc}; margin-bottom: 18px; font-weight: 700; }
.foot-link { font-family: '${t.fontBody}', sans-serif; font-size: 13px; color: ${t.textMid}; display: block; margin-bottom: 10px; cursor: pointer; transition: color 0.2s; }
.foot-link:hover { color: ${t.acc}; }
.foot-socials { display: flex; gap: 7px; margin-top: 20px; }
.foot-soc {
  width: 33px; height: 33px;
  border: 1px solid ${t.border};
  display: flex; align-items: center; justify-content: center;
  color: ${t.textMid}; cursor: pointer; transition: all 0.25s;
}
.foot-soc:hover { border-color: ${t.acc}; color: ${t.acc}; }
.foot-bot {
  border-top: 1px solid ${t.dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)"};
  padding-top: 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;
}
.foot-copy { font-family: '${t.fontBody}', sans-serif; font-size: 11px; color: ${t.textFaint}; }

/* ── SCROLL ANIMATIONS ── */
@keyframes fadeUp { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
.fu { opacity: 0; transform: translateY(32px); transition: opacity 0.7s ease, transform 0.7s ease; }
.fu.vis { opacity: 1; transform: translateY(0); }
.d1 { transition-delay: 0.08s; } .d2 { transition-delay: 0.18s; }
.d3 { transition-delay: 0.28s; } .d4 { transition-delay: 0.38s; }

/* ── RESPONSIVE: TABLET 1200px ── */
@media (max-width: 1200px) {
  .nav { padding: 16px 40px; }
  .nav.scrolled { padding: 12px 40px; }
  .hero-inner { padding: 110px 40px 80px; }
  .hero-scroll { left: 40px; }
  .hero-stats { right: 40px; }
  .sec { padding: 80px 40px; }
  .sec-alt { padding: 80px 40px; }
  .stats-strip { padding: 0 40px; }
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .proj-grid { grid-template-columns: repeat(2, 1fr); }
  .am-grid { grid-template-columns: repeat(4, 1fr); }
  .why-grid { grid-template-columns: 1fr; }
  .fp-inner { grid-template-columns: 1fr; gap: 36px; }
  .inv-inner { grid-template-columns: 1fr; gap: 40px; }
  .vt-inner { grid-template-columns: 1fr; gap: 40px; }
  .cont-grid { grid-template-columns: 1fr; gap: 48px; }
  .foot { padding: 52px 40px 32px; }
  .foot-grid { grid-template-columns: 1fr 1fr; gap: 36px; }
  .gal-grid { grid-template-columns: 1fr 1fr; grid-template-rows: auto; }
  .gi:nth-child(1), .gi:nth-child(2), .gi:nth-child(3),
  .gi:nth-child(4), .gi:nth-child(5) { grid-column: span 1; grid-row: auto; height: 220px; }
  .proc-row { flex-direction: column; }
  .proc-row::before { display: none; }
  .proc-step { padding-top: 0; padding-left: 42px; padding-right: 0; padding-bottom: 32px; }
  .proc-dot { top: 0; left: 0; }
}

/* ── RESPONSIVE: TABLET SMALL 900px ── */
@media (max-width: 900px) {
  .nav-links { display: none; }
  .nav-cta { display: none; }
  .nav-ham { display: flex; }
  .hero-stats { display: none; }
  .hero-scroll { display: none; }
  .am-grid { grid-template-columns: repeat(3, 1fr); }
}

/* ── RESPONSIVE: MOBILE 600px ── */
@media (max-width: 600px) {
  .nav { padding: 14px 20px; }
  .nav.scrolled { padding: 11px 20px; }
  .hero-inner { padding: 100px 20px 64px; }
  .hero-h1 { font-size: clamp(36px, 10vw, 52px); }
  .hero-p { font-size: 15px; }
  .hero-btns { flex-direction: column; align-items: flex-start; }
  .btn-fill, .btn-out { width: 100%; justify-content: center; padding: 15px 28px; }
  .sec { padding: 60px 20px; }
  .sec-alt { padding: 60px 20px; }
  .stats-strip { padding: 0 20px; }
  .stats-grid { grid-template-columns: 1fr 1fr; }
  .stat-card { padding: 36px 16px; }
  .stat-n { font-size: 36px; }
  .proj-grid { grid-template-columns: 1fr; }
  .am-grid { grid-template-columns: repeat(2, 1fr); }
  .why-card { padding: 36px 28px; }
  .why-ghost { font-size: 64px; }
  .test-grid { grid-template-columns: 1fr; }
  .gal-grid { grid-template-columns: 1fr; grid-template-rows: auto; }
  .gi:nth-child(n) { height: 200px; }
  .fp-viewer { height: 300px; }
  .fp-plan { transform: scale(0.55) translateZ(0) !important; transform-origin: center center; }
  .city-img-wrap img { height: 320px; }
  .vt-main-img { height: 280px; }
  .foot { padding: 40px 20px 28px; }
  .foot-grid { grid-template-columns: 1fr; gap: 28px; }
  .foot-bot { flex-direction: column; align-items: flex-start; gap: 6px; }
  .ts-wrap { bottom: 16px; right: 16px; }
  .hero-stats { display: none; }
}

/* ── RESPONSIVE: MOBILE XS 380px ── */
@media (max-width: 380px) {
  .stats-grid { grid-template-columns: 1fr; }
  .am-grid { grid-template-columns: 1fr 1fr; }
  .hs-row { gap: 16px; }
  .hs-num { font-size: 24px; }
}
`;
}

/* ─── MAIN COMPONENT ─────────────────────────────────────────────────────────── */

export default function RudhraHome(): JSX.Element {
  const [themeKey, setThemeKey]     = useState<ThemeKey>("obsidian");
  const [tsOpen, setTsOpen]         = useState<boolean>(false);
  const [mobNav, setMobNav]         = useState<boolean>(false);
  const [scrolled, setScrolled]     = useState<boolean>(false);
  const [activeRoom, setActiveRoom] = useState<string>("living");
  const [rot, setRot]               = useState<RotState>({ x: -18, y: 22 });
  const [drag, setDrag]             = useState<boolean>(false);
  const [ds, setDs]                 = useState<DragStart>({ x: 0, y: 0 });
  const [vtIdx, setVtIdx]           = useState<number>(0);
  const tsRef                       = useRef<HTMLDivElement>(null);

  const t = THEMES[themeKey];

  /* Fade-up observer */
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) e.target.classList.add("vis"); }),
      { threshold: 0.08 }
    );
    setTimeout(() => {
      document.querySelectorAll<HTMLElement>(".fu").forEach((el) => io.observe(el));
    }, 50);
    return () => io.disconnect();
  }, [themeKey]);

  /* Scroll listener */
  useEffect(() => {
    const s = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", s, { passive: true });
    return () => window.removeEventListener("scroll", s);
  }, []);

  /* Close theme switcher on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (tsRef.current && !tsRef.current.contains(e.target as Node)) setTsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* Lock body scroll when mobile nav open */
  useEffect(() => {
    document.body.style.overflow = mobNav ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobNav]);

  const sel: Room = ROOMS.find((r) => r.id === activeRoom) ?? ROOMS[0];

  const onMD = (e: React.MouseEvent<HTMLDivElement>): void => {
    setDrag(true);
    setDs({ x: e.clientX, y: e.clientY });
  };
  const onMM = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (!drag) return;
    setRot((p) => ({
      x: Math.max(-40, Math.min(8, p.x + (e.clientY - ds.y) * 0.28)),
      y: p.y + (e.clientX - ds.x) * 0.28,
    }));
    setDs({ x: e.clientX, y: e.clientY });
  };

  /* Touch support for floor plan */
  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>): void => {
    const touch = e.touches[0];
    setDrag(true);
    setDs({ x: touch.clientX, y: touch.clientY });
  };
  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>): void => {
    if (!drag) return;
    const touch = e.touches[0];
    setRot((p) => ({
      x: Math.max(-40, Math.min(8, p.x + (touch.clientY - ds.y) * 0.28)),
      y: p.y + (touch.clientX - ds.x) * 0.28,
    }));
    setDs({ x: touch.clientX, y: touch.clientY });
  };

  const amenities = [
    { icon: <Waves size={21} />,          name: "Swimming Pool" },
    { icon: <Landmark size={21} />,       name: "Clubhouse" },
    { icon: <Dumbbell size={21} />,       name: "Fitness Centre" },
    { icon: <Trees size={21} />,          name: "Zen Gardens" },
    { icon: <PlayCircle size={21} />,     name: "Kids' Zone" },
    { icon: <PersonStanding size={21} />, name: "Jogging Track" },
    { icon: <Car size={21} />,            name: "Covered Parking" },
    { icon: <Wifi size={21} />,           name: "Smart Home" },
    { icon: <Shield size={21} />,         name: "24/7 Security" },
    { icon: <Sun size={21} />,            name: "Solar Energy" },
    { icon: <Wind size={21} />,           name: "Vastu Compliant" },
    { icon: <Eye size={21} />,            name: "CCTV Surveillance" },
  ];

  const whys = [
    { icon: <MapPin size={20} />,   title: "Premium Locations",    n: "01", text: "Strategically positioned in Hyderabad's fastest-growing corridors — unmatched connectivity, convenience, and long-term value appreciation for your investment." },
    { icon: <Layers size={20} />,   title: "Superior Construction", n: "02", text: "Grade A certified materials, in-house quality supervision and rigorous testing — ensuring every unit exceeds your highest expectations." },
    { icon: <Sparkles size={20} />, title: "Modern Architecture",   n: "03", text: "Award-winning designs balancing aesthetic brilliance with intelligent living spaces — crafted for those who believe home is the greatest luxury." },
    { icon: <Zap size={20} />,      title: "Timely Delivery",       n: "04", text: "18 years. Zero delays. Systematic project management and dedicated execution teams ensure your dream home is delivered exactly when promised." },
  ];

  const procSteps = [
    { num: "01", icon: <CalendarCheck size={20} />, title: "Site Visit & Consultation", text: "Schedule a private tour. Our consultants walk you through every unit and specification at your convenience." },
    { num: "02", icon: <Target size={20} />,        title: "Choose Your Perfect Home",  text: "Select your floor, view and configuration. Our experts identify the unit that best fits your lifestyle and goals." },
    { num: "03", icon: <CheckCircle2 size={20} />,  title: "Documentation & Booking",   text: "Seamless RERA-compliant paperwork. Our legal team ensures every document is transparent and watertight." },
    { num: "04", icon: <Home size={20} />,           title: "Keys to Your Dream Home",   text: "On handover day we walk every corner with you — ensuring you're completely delighted before we leave." },
  ];

  const vtFeatures = [
    { icon: <Eye size={18} />,       title: "360° Immersive Walkthrough",    text: "Experience every room and view angle from your screen — just like being physically present on site." },
    { icon: <Globe size={18} />,     title: "NRI-Friendly Virtual Visits",    text: "Guided virtual tours with live consultants let NRI clients explore and transact with complete peace of mind." },
    { icon: <BarChart3 size={18} />, title: "Real-Time Construction Updates", text: "Track project progress with monthly video updates, drone footage and milestone reports delivered to you." },
    { icon: <Heart size={18} />,     title: "Personalise Before Possession",  text: "Choose flooring, fittings and finish palette — personalise your home before you receive the keys." },
  ];

  return (
    <>
      <style>{makeCSS(t)}</style>

      {/* ══ MOBILE NAV OVERLAY ══ */}
      <div className={`mob-overlay${mobNav ? " open" : ""}`} onClick={() => setMobNav(false)} />

      {/* ══ MOBILE NAV DRAWER ══ */}
      <div className={`mob-nav${mobNav ? " open" : ""}`}>
        <div className="mob-nav-head">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className="nav-sq" style={{ width: 34, height: 34 }}>
              <Building2 size={16} color={t.accText} strokeWidth={2.5} />
            </div>
            <span className="nav-brand" style={{ fontSize: 15 }}>RUDHRA</span>
          </div>
          <button style={{ background: "transparent", border: "none", cursor: "pointer", color: t.text }} onClick={() => setMobNav(false)}>
            <X size={22} />
          </button>
        </div>
        <div className="mob-nav-body">
          {NAV_LINKS.map((l) => (
            <span key={l} className="mob-nav-link" onClick={() => setMobNav(false)}>{l}</span>
          ))}
        </div>
        <div className="mob-nav-foot">
          <button className="btn-fill" style={{ width: "100%", justifyContent: "center" }}>
            Book Site Visit <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* ══ THEME SWITCHER ══ */}
      <div className="ts-wrap" ref={tsRef}>
        {tsOpen && (
          <div className="ts-menu">
            <div className="ts-head">Choose Theme</div>
            {(Object.entries(THEMES) as [ThemeKey, Theme][]).map(([key, th]) => (
              <div
                key={key}
                className={`ts-item${themeKey === key ? " on" : ""}`}
                onClick={() => { setThemeKey(key); setTsOpen(false); }}
              >
                <div className="ts-dots">
                  {th.swatch.map((s, i) => <div key={i} className="ts-dot" style={{ background: s }} />)}
                </div>
                <div>
                  <div className="ts-nm">{th.name}</div>
                  <div className="ts-lb">{th.label}</div>
                </div>
              </div>
            ))}
          </div>
        )}
        <button className="ts-btn" onClick={() => setTsOpen((p) => !p)} aria-label="Change theme">
          {tsOpen ? <X size={19} /> : <Palette size={19} />}
        </button>
      </div>

      {/* ══ NAVBAR ══ */}
      <nav className={`nav${scrolled ? " scrolled" : ""}`}>
        <div className="nav-logo">
          <div className="nav-sq"><Building2 size={18} color={t.accText} strokeWidth={2.5} /></div>
          <div>
            <div className="nav-brand">RUDHRA</div>
            <div className="nav-sub">Constructions</div>
          </div>
        </div>
        <div className="nav-links">
          {NAV_LINKS.map((l) => <span key={l} className="nav-link">{l}</span>)}
        </div>
        <button className="nav-cta"><span>Book Site Visit</span></button>
        <button className="nav-ham" onClick={() => setMobNav(true)} aria-label="Open menu">
          <Menu size={22} />
        </button>
      </nav>

      {/* ══ HERO ══ */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-ov" />
        <div className="hero-grain" />
        <div className="hero-inner">
          <div className="hero-eyebrow">
            <div className="eyebrow-bar" />
            <span className="eyebrow-txt">Award-Winning Luxury Residences</span>
          </div>
          <h1 className="hero-h1">
            Where Architecture<br />
            Meets <em>Timeless</em><br />
            Living
          </h1>
          <p className="hero-p">
            Crafting landmark residences across Hyderabad's most coveted addresses — where every detail is a testament to uncompromising quality and refined elegance.
          </p>
          <div className="hero-btns">
            <button className="btn-fill">Explore Projects <ArrowRight size={14} /></button>
            <button className="btn-out">Book Site Visit <ArrowUpRight size={14} /></button>
          </div>
        </div>
        <div className="hero-scroll">
          <div className="scroll-line" />
          <span className="scroll-txt">Scroll to explore</span>
        </div>
        <div className="hero-stats">
          <div className="hs-row">
            {[["18+", "Years"], ["1000+", "Families"], ["18", "Projects"], ["8", "Ongoing"]].map(([n, l]) => (
              <div key={l} className="hs-item">
                <div className="hs-num">{n}</div>
                <div className="hs-lbl">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ STATS ══ */}
      <div className="stats-strip">
        <div className="stats-grid">
          {[
            { ic: <Award size={20} />,     n: "18+",   l: "Years of Excellence" },
            { ic: <Users size={20} />,     n: "1000+", l: "Happy Families" },
            { ic: <Building2 size={20} />, n: "18",    l: "Delivered Projects" },
            { ic: <TrendingUp size={20} />,n: "8",     l: "Ongoing Projects" },
          ].map((s, i) => (
            <div key={s.l} className={`stat-card fu d${i + 1}`}>
              <div className="stat-icon">{s.ic}</div>
              <div className="stat-n">{s.n}</div>
              <div className="stat-l">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ══ PROJECTS ══ */}
      <section className="sec">
        <div className="lbl fu"><div className="lbl-bar" /><span className="lbl-txt">Our Portfolio</span></div>
        <h2 className="sh fu">Signature <em>Projects</em></h2>
        <div className="sdiv fu" />
        <p className="sp fu">Each Rudhra project is conceived as a landmark — blending contemporary architectural language with the enduring spirit of luxury living.</p>
        <div className="proj-grid">
          {PROJECTS.map((p, i) => (
            <div key={p.name} className={`pc fu d${(i % 3) + 1}`}>
              <img src={p.img} alt={p.name} loading="lazy" />
              <div className="pc-ov" />
              <div className="pc-tag">{p.tag}</div>
              <div className="pc-body">
                <div className="pc-name">{p.name}</div>
                <div className="pc-loc"><MapPin size={10} /> {p.location} · {p.type}</div>
                <div className="pc-specs">
                  <div className="pc-spec"><BedDouble size={11} /> {p.beds}</div>
                  <div className="pc-spec"><Bath size={11} /> {p.baths} Bath</div>
                  <div className="pc-spec"><Ruler size={11} /> {p.sqft} sqft</div>
                </div>
              </div>
              <div className="pc-arrow"><ArrowUpRight size={15} /></div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ AMENITIES ══ */}
      <section className="sec-alt">
        <div className="lbl fu"><div className="lbl-bar" /><span className="lbl-txt">Premium Lifestyle</span></div>
        <h2 className="sh fu">World-Class <em>Amenities</em></h2>
        <div className="sdiv fu" />
        <p className="sp fu">Every Rudhra community is a self-contained luxury ecosystem — where every convenience and indulgence is just steps away.</p>
        <div className="am-grid">
          {amenities.map((a, i) => (
            <div key={a.name} className={`am-card fu d${(i % 4) + 1}`}>
              <div className="am-icon">{a.icon}</div>
              <div className="am-name">{a.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ WHY CHOOSE ══ */}
      <section className="sec">
        <div className="lbl fu"><div className="lbl-bar" /><span className="lbl-txt">Our Promise</span></div>
        <h2 className="sh fu">Why Choose <em>Rudhra</em></h2>
        <div className="sdiv fu" />
        <div className="why-grid">
          {whys.map((w, i) => (
            <div key={w.title} className={`why-card fu d${(i % 2) + 1}`}>
              <div className="why-ghost">{w.n}</div>
              <div className="why-icon">{w.icon}</div>
              <div className="why-title">{w.title}</div>
              <p className="why-text">{w.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ 3D FLOOR PLAN ══ */}
      <section className="sec-alt">
        <div className="lbl fu"><div className="lbl-bar" /><span className="lbl-txt">Interactive Preview</span></div>
        <h2 className="sh fu">Explore Your <em>Future Home</em></h2>
        <div className="sdiv fu" />
        <p className="sp fu" style={{ marginBottom: 44 }}>Drag to rotate the 3D floor plan. Click any room to view its dimensions and specifications.</p>
        <div className="fp-inner">
          <div
            className="fp-viewer fu"
            onMouseDown={onMD}
            onMouseMove={onMM}
            onMouseUp={() => setDrag(false)}
            onMouseLeave={() => setDrag(false)}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={() => setDrag(false)}
          >
            <div className="fp-scene">
              <div
                className="fp-plan"
                style={{ transform: `perspective(1100px) rotateX(${rot.x}deg) rotateY(${rot.y}deg)` }}
              >
                <div className="fp-grid" />
                {ROOMS.map((r) => (
                  <div
                    key={r.id}
                    className={`fp-room${activeRoom === r.id ? " active" : ""}`}
                    style={{ top: r.top, left: r.left, width: r.w, height: r.h }}
                    onClick={() => setActiveRoom(r.id)}
                  >
                    <span className="room-lbl">{r.label}</span>
                    <span className="room-sz">{r.size}</span>
                    <span className="room-sq">{r.area}</span>
                  </div>
                ))}
                <div style={{
                  position: "absolute", bottom: 8, right: 8,
                  width: 24, height: 24, border: `1px solid ${t.acc}60`, borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 9, color: t.acc, fontFamily: t.fontBody, fontWeight: 700,
                }}>N</div>
              </div>
            </div>
            <div className="fp-hint"><MoveRight size={12} /> Drag to rotate</div>
          </div>

          <div className="fp-info fu">
            <div className="fi-top">
              <div className="fi-title">3 BHK</div>
              <div className="fi-sub">Premium Apartment — 1,850 Sq Ft</div>
              <div className="fi-specs">
                <div className="fi-spec">
                  <div className="fi-sl">Selected Room</div>
                  <div className="fi-sv" style={{ color: t.acc }}>{sel.label}</div>
                </div>
                <div className="fi-spec">
                  <div className="fi-sl">Dimensions</div>
                  <div className="fi-sv"><Ruler size={12} /> {sel.size} ft</div>
                </div>
                <div className="fi-spec">
                  <div className="fi-sl">Carpet Area</div>
                  <div className="fi-sv">{sel.area}</div>
                </div>
                <div className="fi-spec">
                  <div className="fi-sl">Total Area</div>
                  <div className="fi-sv">1,850 sqft</div>
                </div>
              </div>
            </div>
            <div className="fi-tabs">
              {ROOMS.map((r) => (
                <div
                  key={r.id}
                  className={`fi-tab${activeRoom === r.id ? " active" : ""}`}
                  onClick={() => setActiveRoom(r.id)}
                >
                  <span>{r.label}</span>
                  <ChevronRight size={12} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ GALLERY ══ */}
      <section className="sec">
        <div className="lbl fu"><div className="lbl-bar" /><span className="lbl-txt">Visual Showcase</span></div>
        <h2 className="sh fu">Project <em>Gallery</em></h2>
        <div className="sdiv fu" />
        <div className="gal-grid fu">
          {GALLERY_IMGS.map((img, i) => (
            <div key={i} className="gi">
              <img src={img} alt={`Gallery ${i + 1}`} loading="lazy" />
              <div className="gi-ov"><div className="gi-zoom"><Eye size={17} /></div></div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ INVESTMENT ══ */}
      <section className="sec-alt">
        <div className="inv-inner">
          <div>
            <div className="lbl fu"><div className="lbl-bar" /><span className="lbl-txt">Smart Investment</span></div>
            <h2 className="sh fu">Invest in Hyderabad's Most<br /><em>Promising Locations</em></h2>
            <div className="sdiv fu" />
            <p className="sp fu">Hyderabad's real estate market has delivered consistent double-digit appreciation. With HITEC City, Gachibowli, and the western corridor booming, the opportunity has never been greater.</p>
            <div className="inv-stats fu">
              {[
                { n: "18%",   l: "Annual Appreciation" },
                { n: "#1",    l: "IT Hub in South India" },
                { n: "₹6.2L", l: "Growth per Sq Yd" },
                { n: "40K+",  l: "NRI Investments/Year" },
              ].map((s) => (
                <div key={s.l} className="inv-stat">
                  <div className="inv-n">{s.n}</div>
                  <div className="inv-l">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="city-img-wrap fu d2">
            <img src="https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=400&q=80" alt="Hyderabad Skyline" loading="lazy" />
            <div className="city-ov" />
            <div className="city-badge">
              <div className="city-badge-lbl">The City of Pearls</div>
              <div className="city-badge-title">Hyderabad —<br /><span style={{ fontStyle: "italic", color: t.acc }}>Rising Fast</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ PROCESS ══ */}
      <section className="sec">
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <div className="lbl fu" style={{ justifyContent: "center" }}>
            <div className="lbl-bar" /><span className="lbl-txt">How It Works</span><div className="lbl-bar" />
          </div>
          <h2 className="sh fu" style={{ textAlign: "center" }}>Your Journey to <em>Dream Living</em></h2>
          <div className="sdiv fu" style={{ margin: "16px auto" }} />
          <p className="sp fu" style={{ textAlign: "center", margin: "0 auto" }}>
            From first enquiry to final key handover — we make buying your luxury home completely effortless.
          </p>
        </div>
        <div className="proc-row fu">
          {procSteps.map((s) => (
            <div key={s.num} className="proc-step">
              <div className="proc-dot"><span>{s.num}</span></div>
              <div className="proc-icon">{s.icon}</div>
              <div className="proc-title">{s.title}</div>
              <p className="proc-text">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ VIRTUAL TOUR ══ */}
      <section className="sec vt-bg">
        <div className="vt-inner">
          <div className="fu">
            <div className="vt-screen">
              <img className="vt-main-img" src={VT_MAIN[vtIdx]} alt="Virtual Tour" loading="lazy" />
              <div className="vt-play">
                <div className="vt-circle"><Play size={22} color={t.acc} fill={t.acc} /></div>
              </div>
            </div>
            <div className="vt-thumbs">
              {VT_THUMBS.map((th, i) => (
                <div key={i} className={`vt-thumb${vtIdx === i ? " active" : ""}`} onClick={() => setVtIdx(i)}>
                  <img src={th} alt={`Room view ${i + 1}`} loading="lazy" />
                  <div className="vt-thumb-ov" />
                </div>
              ))}
            </div>
          </div>
          <div className="vt-feats fu d2">
            <div className="lbl"><div className="lbl-bar" /><span className="lbl-txt">Virtual Experience</span></div>
            <h2 className="sh" style={{ marginBottom: 8 }}>Tour Your Home<br /><em>Before You Buy</em></h2>
            <div className="sdiv" />
            {vtFeatures.map((f) => (
              <div key={f.title} className="vt-feat">
                <div className="vt-feat-icon">{f.icon}</div>
                <div>
                  <div className="vt-feat-title">{f.title}</div>
                  <p className="vt-feat-text">{f.text}</p>
                </div>
              </div>
            ))}
            <button className="btn-fill" style={{ marginTop: 22, width: "fit-content" }}>
              Start Virtual Tour <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ══ */}
      <section className="sec">
        <div className="lbl fu"><div className="lbl-bar" /><span className="lbl-txt">Client Stories</span></div>
        <h2 className="sh fu">Words From Our <em>Families</em></h2>
        <div className="sdiv fu" />
        <div className="test-grid">
          {TESTIMONIALS.map((tc, i) => (
            <div key={tc.name} className={`tc fu d${i + 1}`}>
              <Quote size={52} className="tc-q" strokeWidth={1} />
              <div className="tc-stars">
                {Array.from({ length: 5 }).map((_, j) => <Star key={j} size={12} fill="currentColor" />)}
              </div>
              <p className="tc-text">"{tc.text}"</p>
              <div className="tc-author">
                <div className="tc-avatar">{tc.init}</div>
                <div>
                  <div className="tc-name">{tc.name}</div>
                  <div className="tc-role">{tc.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ CONTACT ══ */}
      <section className="sec-alt cont-top">
        <div className="cont-grid">
          <div>
            <div className="lbl fu"><div className="lbl-bar" /><span className="lbl-txt">Get In Touch</span></div>
            <h2 className="sh fu">Begin Your <em>Journey</em><br />With Us</h2>
            <div className="sdiv fu" />
            <p className="sp fu" style={{ marginBottom: 40 }}>
              Our luxury property consultants are ready to guide you home. Schedule a private site visit — no obligation, just possibilities.
            </p>
            {[
              { ic: <MapPin size={17} />,  lbl: "Visit Us",     val: "Plot 42, KPHB Phase 1, Hyderabad – 500085" },
              { ic: <Phone size={17} />,   lbl: "Call Us",      val: "+91 98765 43210  /  +91 98765 43211" },
              { ic: <Mail size={17} />,    lbl: "Email Us",     val: "enquiry@rudhraconstructions.com" },
              { ic: <Clock size={17} />,   lbl: "Open Hours",   val: "Monday – Sunday: 9:00 AM – 7:00 PM" },
            ].map((c, i) => (
              <div key={c.lbl} className={`ci fu d${i + 1}`}>
                <div className="ci-icon">{c.ic}</div>
                <div>
                  <div className="ci-lbl">{c.lbl}</div>
                  <div className="ci-val">{c.val}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="fu d2">
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <input className="f-inp" placeholder="Your Full Name" />
              <input className="f-inp" placeholder="Phone Number" />
              <input className="f-inp" placeholder="Email Address" />
              <select className="f-inp f-sel">
                <option value="">Select Project Interest</option>
                {PROJECTS.map((p) => <option key={p.name}>{p.name} — {p.location}</option>)}
              </select>
              <textarea className="f-inp f-ta" placeholder="Your Message (Optional)" />
              <button className="btn-fill" style={{ width: "100%", justifyContent: "center", marginTop: 4 }}>
                <CalendarCheck size={14} /> Schedule a Site Visit
              </button>
              <p style={{ fontSize: 11, color: t.textFaint, textAlign: "center", marginTop: 10, fontFamily: t.fontBody }}>
                Zero spam. Your privacy is our promise.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="foot">
        <div className="foot-grid">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 13 }}>
              <div className="nav-sq" style={{ width: 36, height: 36 }}>
                <Building2 size={16} color={t.accText} strokeWidth={2.5} />
              </div>
              <span className="nav-brand" style={{ fontSize: 16 }}>RUDHRA CONSTRUCTIONS</span>
            </div>
            <p style={{ fontSize: 13, color: t.textMid, lineHeight: 1.8, maxWidth: 270, fontWeight: 300, fontFamily: t.fontBody }}>
              Building Hyderabad's most prestigious addresses. Where every brick is laid with pride and every home tells a story.
            </p>
            <div className="foot-socials">
              {([<Instagram size={13} />, <Facebook size={13} />, <Youtube size={13} />, <Linkedin size={13} />] as ReactNode[]).map((ic, i) => (
                <div key={i} className="foot-soc">{ic}</div>
              ))}
            </div>
          </div>
          <div>
            <div className="foot-col-title">Quick Links</div>
            {QUICK_LINKS.map((l) => <span key={l} className="foot-link">{l}</span>)}
          </div>
          <div>
            <div className="foot-col-title">Projects</div>
            {PROJECTS.map((p) => <span key={p.name} className="foot-link">{p.name}</span>)}
          </div>
          <div>
            <div className="foot-col-title">Contact</div>
            {([
              [<MapPin size={10} />, "KPHB Phase 1, Hyd – 500085"],
              [<Phone size={10} />,  "+91 98765 43210"],
              [<Mail size={10} />,   "enquiry@rudhra.com"],
              [<Clock size={10} />,  "Mon–Sun 9AM–7PM"],
            ] as [ReactNode, string][]).map(([ic, v], i) => (
              <span key={i} className="foot-link" style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                <span style={{ color: t.acc, marginTop: 2, flexShrink: 0 }}>{ic}</span>
                <span>{v}</span>
              </span>
            ))}
          </div>
        </div>
        <div className="foot-bot">
          <span className="foot-copy">© 2024 Rudhra Constructions Pvt. Ltd. All Rights Reserved.</span>
          <span className="foot-copy">RERA Reg: P02400003456 · AP RERA Approved</span>
        </div>
      </footer>
    </>
  );
}


"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  FC,
  MouseEvent as ReactMouseEvent,
} from "react";
import {
  FiMenu, FiX, FiArrowRight, FiArrowUpRight, FiPhone, FiMail,
  FiMapPin, FiPlay, FiChevronDown, FiInstagram, FiYoutube,
  FiStar, FiLayers,
} from "react-icons/fi";
import { TbBuildingSkyscraper, TbRuler, TbDrone } from "react-icons/tb";
import { MdOutlineVilla, MdOutlineApartment } from "react-icons/md";
import { BsBuildings } from "react-icons/bs";
import { LuBadgeCheck, LuCompass } from "react-icons/lu";
import { PiArrowsOutCardinalLight } from "react-icons/pi";
import { IconType } from "react-icons";

const T = {
  bg:            "#0D0C0A",
  surface:       "#141210",
  surfaceRaised: "#1C1A16",
  surfaceHigh:   "#242018",
  border:        "#2E2A22",
  borderGold:    "#6B5420",
  borderSilver:  "#3A3F45",
  gold:          "#B8962E",
  goldLight:     "#D4AF54",
  goldBright:    "#F0CC6A",
  goldDim:       "#7A6120",
  goldGlow:      "rgba(184,150,46,0.22)",
  goldFaint:     "rgba(184,150,46,0.07)",
  goldFaint2:    "rgba(184,150,46,0.04)",
  silver:        "#9EA8B3",
  silverLight:   "#C8D0D8",
  silverDim:     "#6A7580",
  silverGlow:    "rgba(158,168,179,0.18)",
  silverFaint:   "rgba(158,168,179,0.06)",
  textPrimary:   "#EDE8DF",
  textSecondary: "#9A9488",
  textMuted:     "#5A5650",
  white:         "#FFFFFF",
  black:         "#000000",
  grain: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E\")",
} as const;

interface Property { id: number; tag: string; title: string; loc: string; price: string; sqft: string; img: string; }
interface Service { icon: IconType; title: string; desc: string; }
interface Stat { value: number; suffix: string; label: string; decimals?: number; }
interface Testimonial { name: string; role: string; rating: number; text: string; img: string; }
interface Room { id: string; label: string; top: string; left: string; w: string; h: string; sqft: number; feature: string; }
interface SkylineProject { city: string; x: number; y: number; count: number; }
interface Material { name: string; origin: string; use: string; img: string; }
interface Award { year: string; title: string; org: string; project: string; }
interface NavLink { label: string; href: string; }
interface VideoItem { title: string; views: string; dur: string; img: string; }
interface StatBadge { n: string; l: string; }
interface FooterColumn { title: string; links: string[]; }

const GlobalStyles: FC = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Infant:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600&family=Jost:wght@200;300;400;500;600&family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; font-size: 16px; }
    body {
      background: ${T.bg};
      color: ${T.textPrimary};
      font-family: 'Jost', sans-serif;
      font-weight: 300;
      overflow-x: hidden;
    }
    ::-webkit-scrollbar { width: 3px; }
    ::-webkit-scrollbar-track { background: ${T.bg}; }
    ::-webkit-scrollbar-thumb { background: linear-gradient(to bottom, ${T.gold}, ${T.silver}); }
    ::selection { background: ${T.gold}; color: ${T.black}; }

    .font-corm  { font-family: 'Cormorant Infant', serif; }
    .font-gara  { font-family: 'EB Garamond', serif; }
    .font-jost  { font-family: 'Jost', sans-serif; }

    /* ── LAYOUT ── */
    .section   { padding: 130px 0; }
    .container { max-width: 1400px; margin: 0 auto; padding: 0 72px; }
    @media(max-width:900px)  { .container{ padding:0 28px; } .section{ padding:80px 0; } }
    @media(max-width:600px)  { .container{ padding:0 20px; } .section{ padding:60px 0; } }

    /* ── EYEBROW ── */
    .eyebrow {
      font-family: 'Jost', sans-serif;
      font-size: 0.58rem; letter-spacing: 0.42em; text-transform: uppercase;
      font-weight: 500; display: flex; align-items: center; gap: 14px;
      background: linear-gradient(90deg, ${T.goldLight}, ${T.silverLight});
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    }
    .eyebrow::before {
      content:''; display:inline-block; width:32px; height:1px;
      background: linear-gradient(90deg, ${T.gold}, ${T.silver});
      flex-shrink: 0;
      -webkit-background-clip: unset; -webkit-text-fill-color: unset;
      background-clip: unset;
    }

    /* ── SECTION TITLE ── */
    .sec-title {
      font-family: 'Cormorant Infant', serif;
      font-size: clamp(2.6rem, 4.5vw, 4.2rem);
      font-weight: 500; line-height: 1.06;
      color: ${T.textPrimary};
    }
    .sec-title em {
      font-style: italic;
      background: linear-gradient(135deg, ${T.goldBright} 0%, ${T.gold} 50%, ${T.goldLight} 100%);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    }

    /* ── GOLD GRADIENT LINE ── */
    .gold-line {
      height: 1px;
      background: linear-gradient(90deg, ${T.gold}, ${T.silverLight}, transparent);
    }

    /* ── BUTTONS ── */
    .btn-gold {
      background: linear-gradient(135deg, ${T.goldDim} 0%, ${T.gold} 50%, ${T.goldLight} 100%);
      background-size: 200% 200%; background-position: 100% 0;
      color: ${T.black};
      font-family: 'Jost', sans-serif; font-weight: 600;
      font-size: 0.68rem; letter-spacing: 0.2em; text-transform: uppercase;
      padding: 16px 40px; border: none; cursor: pointer;
      position: relative; overflow: hidden;
      display: inline-flex; align-items: center; gap: 10px;
      transition: all 0.45s ease;
      clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%);
    }
    .btn-gold:hover {
      background-position: 0 0;
      box-shadow: 0 0 50px ${T.goldGlow}, 0 8px 32px rgba(0,0,0,0.4);
      transform: translateY(-2px);
    }
    .btn-gold span { position: relative; z-index: 1; }

    .btn-silver {
      background: transparent;
      color: ${T.silverLight};
      border: 1px solid ${T.silver}60;
      font-family: 'Jost', sans-serif; font-weight: 400;
      font-size: 0.68rem; letter-spacing: 0.16em; text-transform: uppercase;
      padding: 15px 40px; cursor: pointer;
      display: inline-flex; align-items: center; gap: 10px;
      transition: all 0.3s ease;
      clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%);
    }
    .btn-silver:hover {
      border-color: ${T.silverLight};
      color: ${T.white};
      background: ${T.silverFaint};
      box-shadow: 0 0 30px ${T.silverGlow};
    }

    /* ── NAV LINK ── */
    .nav-link {
      font-family: 'Jost', sans-serif;
      font-size: 0.66rem; letter-spacing: 0.18em; text-transform: uppercase;
      color: ${T.textSecondary}; text-decoration: none; transition: color 0.25s; font-weight: 400;
    }
    .nav-link:hover { color: ${T.goldLight}; }

    /* ── GLASS CARD ── */
    .glass-card {
      background: ${T.surfaceRaised};
      border: 1px solid ${T.border};
      transition: border-color 0.4s, box-shadow 0.4s;
    }
    .glass-card:hover { border-color: ${T.borderGold}; box-shadow: 0 0 60px ${T.goldFaint}; }

    /* ── PROP CARD ── */
    .prop-card { position: relative; overflow: hidden; cursor: pointer; transition: transform 0.5s cubic-bezier(.16,1,.3,1); }
    .prop-card:hover { transform: translateY(-8px); }
    .prop-card img { width:100%; height:100%; object-fit:cover; transition:transform 0.7s ease; position:absolute; inset:0; }
    .prop-card:hover img { transform: scale(1.08); }
    .prop-ov { position:absolute; inset:0; background:linear-gradient(to top, rgba(5,4,3,.97) 0%, rgba(5,4,3,.3) 60%, transparent 100%); transition:all 0.4s; }
    .prop-card:hover .prop-ov { background:linear-gradient(to top, rgba(5,4,3,.99) 0%, rgba(5,4,3,.55) 75%, rgba(0,0,0,.1) 100%); }
    .prop-reveal { transform:translateY(18px); opacity:0; transition:transform 0.4s ease, opacity 0.4s ease; }
    .prop-card:hover .prop-reveal { transform:translateY(0); opacity:1; }

    /* ── SERVICE CARD ── */
    .svc-card {
      padding: 52px 44px;
      border: 1px solid ${T.border};
      background: ${T.surface};
      position: relative; overflow: hidden;
      cursor: pointer; transition: border-color 0.35s, background 0.35s;
    }
    .svc-card::before {
      content:''; position:absolute; bottom:0; left:0;
      width:0; height:1px;
      background: linear-gradient(90deg, ${T.gold}, ${T.silver});
      transition: width 0.55s cubic-bezier(.16,1,.3,1);
    }
    .svc-card:hover { border-color: ${T.borderGold}; background: ${T.goldFaint2}; }
    .svc-card:hover::before { width:100%; }
    .svc-icon {
      width:54px; height:54px;
      border:1px solid ${T.borderGold};
      display:flex; align-items:center; justify-content:center;
      margin-bottom:28px; transition:border-color 0.3s, background 0.3s;
      clip-path:polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,0 100%);
    }
    .svc-card:hover .svc-icon { border-color:${T.goldLight}; background:${T.goldFaint}; }

    /* ── BLUEPRINT ── */
    .bp-room {
      position:absolute; cursor:pointer;
      background: rgba(184,150,46,0.03);
      border: 1px solid rgba(184,150,46,0.14);
      transition: all 0.3s ease;
    }
    .bp-room:hover { background:rgba(184,150,46,0.09); border-color:${T.gold}; box-shadow:0 0 24px rgba(184,150,46,0.1) inset; }
    .bp-label {
      position:absolute; bottom:6px; left:8px;
      font-size:0.5rem; letter-spacing:0.24em; text-transform:uppercase;
      color:rgba(184,150,46,0.45); font-family:'Jost',sans-serif;
      transition:color 0.3s;
    }
    .bp-room:hover .bp-label { color:${T.goldLight}; }

    /* ── MEDIA ── */
    .media-thumb { position:relative; overflow:hidden; cursor:pointer; }
    .media-thumb img { width:100%; height:100%; object-fit:cover; transition:transform 0.6s ease; display:block; }
    .media-thumb:hover img { transform:scale(1.07); }
    .media-ov { position:absolute; inset:0; background:rgba(5,4,3,0.65); opacity:0; transition:opacity 0.35s; display:flex; align-items:center; justify-content:center; }
    .media-thumb:hover .media-ov { opacity:1; }

    /* ── TESTIMONIAL ── */
    .testi-card { padding:52px; border:1px solid ${T.border}; background:${T.surface}; position:relative; transition:border-color 0.35s; }
    .testi-card:hover { border-color:${T.borderGold}; }

    /* ── CONTACT INPUT ── */
    .c-input {
      width:100%; background:transparent;
      border:none; border-bottom:1px solid ${T.border};
      padding:16px 0; color:${T.textPrimary};
      font-family:'Jost',sans-serif; font-size:0.9rem; font-weight:300;
      outline:none; transition:border-color 0.3s;
    }
    .c-input::placeholder { color:${T.textMuted}; }
    .c-input:focus { border-color:${T.gold}; }

    /* ── SKYLINE DOT ── */
    .sky-dot {
      width:9px; height:9px; border-radius:50%;
      background:${T.gold}; position:absolute;
      animation:pulseDot 2.2s ease-in-out infinite; cursor:pointer;
    }
    .sky-dot::after {
      content:''; position:absolute; inset:-6px;
      border:1px solid ${T.goldLight}; border-radius:50%;
      animation:ripple 2.2s ease-out infinite;
    }

    /* ── FOOTER LINK ── */
    .foot-link { color:${T.textSecondary}; text-decoration:none; font-size:0.82rem; display:block; padding:5px 0; transition:color 0.2s; }
    .foot-link:hover { color:${T.goldLight}; }

    /* ── SCAN LINE ── */
    .scan-line {
      position:absolute; left:0; right:0; height:1px;
      background:linear-gradient(90deg, transparent, ${T.goldLight}, ${T.silverLight}, transparent);
      opacity:0.15; animation:scanLine 4s linear infinite; z-index:2;
    }

    /* ── GRID LINES ── */
    .grid-lines {
      position:absolute; inset:0; pointer-events:none;
      background-image:
        linear-gradient(rgba(184,150,46,0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(184,150,46,0.05) 1px, transparent 1px);
      background-size:80px 80px;
    }

    /* ── GRAIN ── */
    .grain { position:absolute; inset:0; pointer-events:none; z-index:1; background:${T.grain}; background-size:256px 256px; opacity:0.9; }

    /* ── MARQUEE ── */
    .marquee-track { display:flex; width:max-content; animation:marquee 35s linear infinite; }

    /* ── AWARD CARD ── */
    .award-card {
      padding:38px; border:1px solid ${T.border};
      display:flex; flex-direction:column; gap:14px;
      transition:all 0.35s; position:relative; overflow:hidden;
      background: ${T.surfaceRaised};
    }
    .award-card::after {
      content:''; position:absolute; top:0; left:0; right:0; height:1px;
      background:linear-gradient(90deg, transparent, ${T.gold}, ${T.silverLight}, transparent);
      transform:scaleX(0); transition:transform 0.55s; transform-origin:center;
    }
    .award-card:hover { border-color:${T.borderGold}; background:${T.goldFaint2}; }
    .award-card:hover::after { transform:scaleX(1); }

    /* ── MAT CARD ── */
    .mat-card {
      padding:32px; border:1px solid ${T.border}; cursor:pointer;
      transition:all 0.35s; position:relative; overflow:hidden;
      background:${T.surface};
    }
    .mat-card:hover { border-color:${T.gold}; transform:translateY(-5px); box-shadow:0 20px 60px rgba(184,150,46,0.12); }
    .mat-swatch { width:100%; height:80px; margin-bottom:20px; position:relative; overflow:hidden; }
    .mat-swatch img { width:100%; height:100%; object-fit:cover; transition:transform 0.5s ease; }
    .mat-card:hover .mat-swatch img { transform:scale(1.08); }

    /* ── REVEAL ANIMATIONS ── */
    .reveal { opacity:0; transform:translateY(40px); transition:opacity 0.85s cubic-bezier(.16,1,.3,1), transform 0.85s cubic-bezier(.16,1,.3,1); }
    .reveal.visible { opacity:1; transform:translateY(0); }
    .reveal-left  { opacity:0; transform:translateX(-50px); transition:opacity 0.85s cubic-bezier(.16,1,.3,1), transform 0.85s cubic-bezier(.16,1,.3,1); }
    .reveal-left.visible  { opacity:1; transform:translateX(0); }
    .reveal-right { opacity:0; transform:translateX(50px);  transition:opacity 0.85s cubic-bezier(.16,1,.3,1), transform 0.85s cubic-bezier(.16,1,.3,1); }
    .reveal-right.visible { opacity:1; transform:translateX(0); }
    .d1{transition-delay:.05s}.d2{transition-delay:.12s}.d3{transition-delay:.20s}
    .d4{transition-delay:.28s}.d5{transition-delay:.36s}.d6{transition-delay:.44s}

    /* ── GRID HELPERS ── */
    .grid-3   { display:grid; grid-template-columns:repeat(3,1fr); gap:1px; }
    .grid-4   { display:grid; grid-template-columns:repeat(4,1fr); gap:1px; }
    .grid-props { display:grid; grid-template-columns:repeat(3,1fr); gap:2px; }
    @media(max-width:1100px){ .grid-3{grid-template-columns:repeat(2,1fr)} .grid-props{grid-template-columns:repeat(2,1fr)} }
    @media(max-width:900px) { .grid-4{grid-template-columns:repeat(2,1fr)} }
    @media(max-width:640px) { .grid-3{grid-template-columns:1fr} .grid-4{grid-template-columns:1fr} .grid-props{grid-template-columns:1fr} }

    /* ── MOBILE NAV ── */
    @media(max-width:900px)  { .desktop-nav{ display:none !important; } }
    @media(min-width:901px)  { .mob-ham{ display:none !important; } }

    /* ══════════════════════════════════════════════════════════
       📱  RESPONSIVE — TABLET (≤ 1024px)
    ══════════════════════════════════════════════════════════ */
    @media(max-width:1024px) {

      /* NAV padding */
      nav { padding: 0 28px !important; }

      /* HERO — stack layout */
      .hero-right-image { width: 100% !important; }
      .hero-content-wrap { max-width: 100% !important; padding-top: 110px !important; }
      .hero-stat-pills { display: none !important; }
      .hero-vertical-label { display: none !important; }

      /* ABOUT grid → 1 col for blueprint & skyline */
      .blueprint-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
      .blueprint-canvas { aspect-ratio: 1/0.85 !important; }

      .skyline-grid { grid-template-columns: 1fr !important; gap: 28px !important; }
      .skyline-list { display: grid; grid-template-columns: repeat(2,1fr); gap: 2px; }

      /* MATERIALS grid */
      .materials-grid { grid-template-columns: 1fr !important; gap: 2px !important; }
      .materials-left { grid-template-columns: repeat(2,1fr); }

      /* AWARDS grid */
      .awards-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
      .awards-sticky { position: static !important; }

      /* CONTACT grid */
      .contact-grid { grid-template-columns: 1fr !important; gap: 52px !important; }

      /* FOOTER grid */
      .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 36px !important; }
      .footer-brand-col { grid-column: span 2; }

      /* STATS */
      .stats-grid-4 { grid-template-columns: repeat(2,1fr) !important; }
      .stats-grid-4 > div { border-right: none !important; border-bottom: 1px solid ${T.border} !important; }
      .stats-grid-4 > div:nth-child(odd) { border-right: 1px solid ${T.border} !important; }
      .stats-grid-4 > div:last-child { border-bottom: none !important; }
      .stats-grid-4 > div:nth-last-child(2):nth-child(odd) { border-bottom: none !important; }
    }

    /* ══════════════════════════════════════════════════════════
       📱  RESPONSIVE — MOBILE (≤ 768px)
    ══════════════════════════════════════════════════════════ */
    @media(max-width:768px) {

      /* NAV */
      nav { padding: 0 20px !important; height: 64px !important; }
      .nav-logo-text { font-size: 1.1rem !important; }
      .nav-logo-sub { display: none !important; }
      .btn-gold { padding: 12px 22px !important; font-size: 0.62rem !important; }

      /* HERO */
      .hero-section { height: auto !important; min-height: 100svh !important; }
      .hero-right-image {
        position: absolute !important; width: 100% !important; height: 100% !important;
        left: 0 !important; opacity: 1 !important;
      }
      .hero-right-image > div:first-child { transform: none !important; inset: 0 !important; }
      .hero-img-overlay-left {
        background: linear-gradient(to bottom, ${T.bg}99 0%, ${T.bg}BB 40%, ${T.bg}EE 75%, ${T.bg} 100%) !important;
      }
      .hero-content-wrap {
        padding-top: 80px !important;
        padding-bottom: 60px !important;
        max-width: 100% !important;
      }
      .hero-headline { font-size: clamp(3rem, 13vw, 4.5rem) !important; }
      .hero-eyebrow { margin-bottom: 24px !important; }
      .hero-sub-copy { font-size: 0.88rem !important; max-width: 100% !important; }
      .hero-cta-row { flex-direction: column !important; gap: 10px !important; }
      .hero-cta-row .btn-gold,
      .hero-cta-row .btn-silver { width: 100% !important; justify-content: center !important; }
      .hero-gold-rule { display: none !important; }
      .hero-stat-pills { display: none !important; }
      .hero-vertical-label { display: none !important; }
      .hero-scroll-cue { display: none !important; }
      .hero-ornament { display: none !important; }

      /* MARQUEE */
      .marquee-track span { font-size: 0.55rem !important; }

      /* STATS STRIP */
      .stats-grid-4 { grid-template-columns: repeat(2,1fr) !important; }

      /* PROPERTIES header row */
      .props-header { flex-direction: column !important; align-items: flex-start !important; gap: 16px !important; }

      /* SERVICES */
      .svc-card { padding: 36px 28px !important; }

      /* BLUEPRINT */
      .blueprint-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
      .blueprint-canvas { aspect-ratio: 1/1 !important; min-height: 320px !important; }
      .blueprint-floors { flex-wrap: wrap !important; }
      .blueprint-floors button { flex: 1 !important; min-width: 90px !important; font-size: 0.58rem !important; padding: 8px 10px !important; }
      .blueprint-info-box { min-height: 100px !important; }

      /* SKYLINE */
      .skyline-header { flex-direction: column !important; align-items: flex-start !important; gap: 16px !important; }
      .skyline-grid { grid-template-columns: 1fr !important; gap: 20px !important; }
      .skyline-list { grid-template-columns: repeat(2,1fr) !important; }
      .skyline-footer { flex-direction: column !important; gap: 20px !important; padding: 20px !important; }
      .skyline-footer-stats { flex-wrap: wrap !important; gap: 16px !important; }

      /* MATERIALS */
      .materials-grid { grid-template-columns: 1fr !important; }
      .materials-left { grid-template-columns: repeat(2,1fr) !important; }
      .mat-card { padding: 20px !important; }

      /* AWARDS */
      .awards-grid { grid-template-columns: 1fr !important; gap: 36px !important; }
      .awards-sticky { position: static !important; top: auto !important; }
      .awards-mini-stats { flex-wrap: wrap !important; gap: 16px !important; }
      .award-card { padding: 24px !important; }

      /* PROCESS */
      .process-header { text-align: center; }

      /* MEDIA */
      .media-header { flex-direction: column !important; align-items: flex-start !important; gap: 16px !important; }
      .media-tabs { flex-wrap: wrap !important; }
      .insta-grid { grid-template-columns: repeat(2,1fr) !important; }

      /* TESTIMONIALS */
      .testi-card { padding: 32px 24px !important; }
      .testi-text { font-size: 1.05rem !important; }

      /* CONTACT */
      .contact-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
      .contact-form-grid { grid-template-columns: 1fr !important; }

      /* FOOTER */
      .footer-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
      .footer-brand-col { grid-column: span 1 !important; }
      .footer-bottom-row { flex-direction: column !important; gap: 12px !important; text-align: center !important; }
      .footer-legal-links { justify-content: center !important; }
    }

    /* ══════════════════════════════════════════════════════════
       📱  RESPONSIVE — SMALL MOBILE (≤ 420px)
    ══════════════════════════════════════════════════════════ */
    @media(max-width:420px) {
      .sec-title { font-size: 2.1rem !important; }
      .stats-grid-4 { grid-template-columns: 1fr 1fr !important; }
      .skyline-list { grid-template-columns: 1fr 1fr !important; }
      .materials-left { grid-template-columns: 1fr 1fr !important; }
      .insta-grid { grid-template-columns: repeat(2,1fr) !important; }
      .hero-headline { font-size: clamp(2.6rem, 12vw, 3.5rem) !important; }
      .btn-gold { padding: 13px 18px !important; }
      .btn-silver { padding: 12px 18px !important; }
    }

    /* ── KEYFRAMES ── */
    @keyframes fadeUp   { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
    @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
    @keyframes marquee  { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
    @keyframes pulseDot { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.8);opacity:.4} }
    @keyframes scanLine { 0%{top:-2px} 100%{top:100%} }
    @keyframes ripple   { 0%{transform:scale(0);opacity:.7} 100%{transform:scale(4);opacity:0} }
    @keyframes breathe  { 0%,100%{box-shadow:0 0 0 0 rgba(184,150,46,.5)} 50%{box-shadow:0 0 0 14px rgba(184,150,46,0)} }
    @keyframes float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
    @keyframes goldShimmer {
      0%   { background-position: -200% center; }
      100% { background-position:  200% center; }
    }
    @keyframes rotateRing { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
    @keyframes counterRotate { from{transform:rotate(0deg)} to{transform:rotate(-360deg)} }
    @keyframes heroLineIn { from{width:0} to{width:100%} }
  `}</style>
);

function useReveal(): void {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal,.reveal-left,.reveal-right");
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.08 }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

const PROPERTIES: Property[] = [
  { id:1, tag:"Penthouse",     title:"The Obsidian Sky",   loc:"Downtown Manhattan",        price:"$14.8M", sqft:"9,200",  img:"https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80" },
  { id:2, tag:"Villa",         title:"Crestview Manor",    loc:"Beverly Hills, CA",         price:"$31.5M", sqft:"16,400", img:"https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80" },
  { id:3, tag:"Tower",         title:"Nexus Hub",          loc:"Midtown Business District", price:"$110M",  sqft:"58,000", img:"https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80" },
  { id:4, tag:"Townhome",      title:"The Aureum Row",     loc:"Pacific Heights, SF",       price:"$5.2M",  sqft:"3,800",  img:"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80" },
  { id:5, tag:"Skyrise",       title:"Zenith Residences",  loc:"Marina Bay District",       price:"$8.4M",  sqft:"5,600",  img:"https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80" },
  { id:6, tag:"Coastal Villa", title:"Elara Oceanfront",   loc:"Malibu Coastline",          price:"$22.9M", sqft:"12,800", img:"https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80" },
];

const SERVICES: Service[] = [
  { icon:MdOutlineVilla,       title:"Luxury Residential",    desc:"Bespoke homes engineered for the extraordinary — penthouses, villas, and private estates conceived with obsessive precision." },
  { icon:TbBuildingSkyscraper, title:"Commercial Towers",     desc:"Iconic towers that define skylines and engineer the future of business, built with structural artistry." },
  { icon:MdOutlineApartment,   title:"Mixed-Use Communities", desc:"Integrated live-work-play developments that shape how cities breathe, grow, and connect." },
  { icon:TbDrone,              title:"Drone Site Monitoring", desc:"Real-time aerial construction intelligence — keeping every stakeholder fully informed, daily." },
  { icon:BsBuildings,          title:"Urban Redevelopment",   desc:"Transforming dormant urban parcels into thriving, high-value assets that shape the future." },
  { icon:FiLayers,             title:"Investment Advisory",   desc:"Strategic portfolio guidance backed by two decades of construction and real estate mastery." },
];

const STATS: Stat[] = [
  { value:320, suffix:"+",  label:"Projects Delivered" },
  { value:2.8, suffix:"B",  label:"Portfolio Value ($)", decimals:1 },
  { value:18,  suffix:"",   label:"Years of Excellence" },
  { value:98,  suffix:"%",  label:"Client Satisfaction" },
];

const TESTIMONIALS: Testimonial[] = [
  { name:"Alexandra Whitmore", role:"CEO, Whitmore Capital",    rating:5, text:"Working with this team was unlike anything I'd experienced. They understood our vision before we articulated it — and the result became the most-photographed building in the district.", img:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80" },
  { name:"Marcus Devereaux",   role:"Founder, Devereaux Group", rating:5, text:"The craftsmanship, the project management, the relentless pursuit of quality — truly world class. Our headquarters set a new benchmark for the entire city's skyline.", img:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80" },
  { name:"Priya Anand",        role:"Director, Anand Ventures", rating:5, text:"They don't just build structures. They craft legacies. Every square foot of our campus speaks to the vision they brought to life with surgical precision.", img:"https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80" },
];

const INSTA: string[] = [
  "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=500&q=80",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=500&q=80",
  "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=500&q=80",
  "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=500&q=80",
  "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=500&q=80",
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=500&q=80",
];

const YTVIDEOS: VideoItem[] = [
  { title:"The Making of Crestview Manor",  views:"248K", dur:"8:42",  img:"https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=700&q=80" },
  { title:"Inside the Obsidian Penthouse",  views:"412K", dur:"6:15",  img:"https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=700&q=80" },
  { title:"Nexus Tower — Full Documentary", views:"1.2M", dur:"22:08", img:"https://images.unsplash.com/photo-1486325212027-8081e485255e?w=700&q=80" },
];

const ROOMS: Room[] = [
  { id:"master",  label:"Master Suite",   top:"8%",  left:"5%",  w:"38%", h:"28%", sqft:1200, feature:"Panoramic ocean views, walk-in wardrobe, private balcony" },
  { id:"living",  label:"Living Area",    top:"8%",  left:"45%", w:"52%", h:"40%", sqft:2400, feature:"Double-height ceiling, floor-to-ceiling glass, statement fireplace" },
  { id:"kitchen", label:"Chef's Kitchen", top:"38%", left:"5%",  w:"28%", h:"26%", sqft:800,  feature:"Bulthaup cabinetry, Sub-Zero appliances, butler pantry" },
  { id:"dining",  label:"Dining Room",    top:"50%", left:"35%", w:"22%", h:"20%", sqft:600,  feature:"Statement chandelier, butler service access, wine cellar adjacent" },
  { id:"study",   label:"Private Study",  top:"38%", left:"35%", w:"22%", h:"10%", sqft:400,  feature:"Acoustic insulation, bespoke built-in library" },
  { id:"bath",    label:"Spa Bathroom",   top:"52%", left:"59%", w:"38%", h:"24%", sqft:500,  feature:"Bain Ultra soaking tub, heated Calacatta marble, rainfall shower" },
  { id:"terrace", label:"Sky Terrace",    top:"78%", left:"5%",  w:"92%", h:"16%", sqft:1800, feature:"Infinity pool, outdoor kitchen, 360° city views" },
];

const SKYLINE_PROJECTS: SkylineProject[] = [
  { city:"New York",    x:72, y:28, count:48 },
  { city:"Los Angeles", x:12, y:48, count:31 },
  { city:"Chicago",     x:58, y:30, count:22 },
  { city:"Miami",       x:64, y:62, count:18 },
  { city:"Seattle",     x:8,  y:22, count:14 },
  { city:"Boston",      x:76, y:26, count:19 },
  { city:"Dubai",       x:88, y:52, count:27 },
  { city:"London",      x:46, y:20, count:16 },
];

const MATERIALS: Material[] = [
  { name:"Calacatta Oro",   origin:"Carrara, Italy",  use:"Feature walls, flooring",   img:"https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&q=80" },
  { name:"Aged Copper",     origin:"Chile",           use:"Façade cladding, hardware", img:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80" },
  { name:"Black Travertine",origin:"Tivoli, Italy",   use:"Lobby, bathrooms",          img:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80" },
  { name:"White Oak",       origin:"Appalachian, USA",use:"Flooring, millwork",         img:"https://images.unsplash.com/photo-1541123437800-1bb1317badc2?w=400&q=80" },
];

const AWARDS: Award[] = [
  { year:"2024", title:"Pritzker Architecture Prize", org:"Pritzker Architecture Prize Foundation", project:"Nexus Tower, New York" },
  { year:"2023", title:"RIBA Stirling Prize",         org:"Royal Institute of British Architects",  project:"Crestview Manor, Beverly Hills" },
  { year:"2022", title:"AIA Honor Award",             org:"American Institute of Architects",       project:"Zenith Residences, Marina Bay" },
  { year:"2021", title:"World Architecture Festival", org:"WAF Global",                             project:"Elara Oceanfront, Malibu" },
  { year:"2020", title:"Dezeen Award for Build",      org:"Dezeen Magazine",                        project:"The Aureum Row, San Francisco" },
];

const NAV_LINKS: NavLink[] = [
  { label:"Template2", href:"/pages" },
  { label:"Template3",   href:"/templates3" },
  { label:"Blueprint",  href:"#blueprint" },
  { label:"Skyline",    href:"#skyline" },
  { label:"Contact",    href:"#contact" },
];

interface CounterProps { target: number; suffix: string; decimals?: number; }
const Counter: FC<CounterProps> = ({ target, suffix, decimals = 0 }) => {
  const [val, setVal] = useState<number>(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      let start = 0;
      const dur = 2400;
      const step = (ts: number): void => {
        if (!start) start = ts;
        const prog = Math.min((ts - start) / dur, 1);
        const ease = 1 - Math.pow(1 - prog, 4);
        setVal(parseFloat((ease * target).toFixed(decimals)));
        if (prog < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, { threshold: 0.5 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [target, decimals]);
  return <span ref={ref}>{decimals > 0 ? val.toFixed(decimals) : Math.round(val)}{suffix}</span>;
};

/* ─── NAVBAR ─────────────────────────────────────────────── */
const Navbar: FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);

  useEffect(() => {
    const fn = (): void => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <nav style={{
      position:"fixed", top:0, left:0, right:0, zIndex:1000, height:76,
      background: scrolled ? "rgba(8,7,5,0.97)" : "transparent",
      backdropFilter: scrolled ? "blur(28px)" : "none",
      borderBottom: scrolled ? `1px solid ${T.border}` : "none",
      transition:"all 0.45s ease",
      display:"flex", alignItems:"center",
      padding:"0 72px", justifyContent:"space-between",
    }}>
      {/* Logo */}
      <div style={{ display:"flex", alignItems:"center", gap:13 }}>
        <div style={{
          width:40, height:40,
          border:`1px solid ${T.borderGold}`,
          display:"flex", alignItems:"center", justifyContent:"center",
          clipPath:"polygon(0 0,calc(100% - 9px) 0,100% 9px,100% 100%,0 100%)",
          background:`linear-gradient(135deg, ${T.goldFaint} 0%, transparent 100%)`,
          flexShrink: 0,
        }}>
          <TbBuildingSkyscraper size={17} color={T.goldLight}/>
        </div>
        <div>
          <div className="nav-logo-text" style={{
            fontFamily:"'Cormorant Infant',serif", fontSize:"1.3rem", fontWeight:600,
            letterSpacing:"0.1em", lineHeight:1,
            background:`linear-gradient(135deg, ${T.goldBright}, ${T.gold}, ${T.silverLight})`,
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
          }}>Rudhra</div>
          <div className="nav-logo-sub" style={{ fontFamily:"Jost,sans-serif", fontSize:"0.46rem", letterSpacing:"0.38em", color:T.silverDim, textTransform:"uppercase", fontWeight:500 }}>Estates & Constructions</div>
        </div>
      </div>

      {/* Desktop nav */}
      <div className="desktop-nav" style={{ display:"flex", gap:38 }}>
        {NAV_LINKS.map((l: NavLink) => (
          <a key={l.label} href={l.href} className="nav-link">{l.label}</a>
        ))}
      </div>

      {/* Right */}
      <div style={{ display:"flex", gap:14, alignItems:"center" }}>
        <a href="tel:" className="desktop-nav" style={{ color:T.textSecondary, fontSize:"0.68rem", letterSpacing:"0.08em", textDecoration:"none", display:"flex", alignItems:"center", gap:6 }}>
          <FiPhone size={11} color={T.goldLight}/> +1 800 Rudhra
        </a>
        <button className="btn-gold"><span>Book a Tour</span></button>
        <button className="mob-ham" onClick={() => setOpen(o => !o)}
          style={{ background:"none", border:"none", color:T.textPrimary, display:"flex", cursor:"pointer", padding:"4px" }}>
          {open ? <FiX size={22}/> : <FiMenu size={22}/>}
        </button>
      </div>

      {/* Mobile overlay */}
      {open && (
        <div style={{
          position:"fixed", inset:0, top:64,
          background:"rgba(5,4,3,0.98)", backdropFilter:"blur(30px)",
          display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
          gap:44, zIndex:999, animation:"fadeIn .3s ease",
        }}>
          {NAV_LINKS.map((l: NavLink) => (
            <a key={l.label} href={l.href} className="nav-link"
              style={{ fontSize:"1.6rem", letterSpacing:"0.22em" }}
              onClick={() => setOpen(false)}>{l.label}
            </a>
          ))}
          <button className="btn-gold" onClick={() => setOpen(false)}><span>Book a Tour</span></button>
        </div>
      )}
    </nav>
  );
};

/* ─── HERO ───────────────────────────────────────────────── */
const Hero: FC = () => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [mouse, setMouse] = useState<{ x: number; y: number }>({ x:0, y:0 });

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  const onMove = useCallback((e: ReactMouseEvent<HTMLElement>): void => {
    setMouse({
      x: (e.clientX / window.innerWidth  - 0.5) * 18,
      y: (e.clientY / window.innerHeight - 0.5) * 10,
    });
  }, []);

  const statBadges: StatBadge[] = [
    { n:"320+",  l:"Projects" },
    { n:"$2.8B", l:"Value" },
    { n:"18yr",  l:"Legacy" },
  ];

  return (
    <section
      className="hero-section"
      style={{ position:"relative", height:"100vh", minHeight:720, overflow:"hidden", display:"flex" }}
      onMouseMove={onMove}
    >
      {/* Background base */}
      <div style={{ position:"absolute", inset:0, background:T.bg, zIndex:0 }}/>

      {/* Right half — architectural photo */}
      <div className="hero-right-image" style={{
        position:"absolute", right:0, top:0, bottom:0, width:"52%",
        overflow:"hidden", zIndex:1,
      }}>
        <div style={{
          position:"absolute", inset:"-6%", willChange:"transform",
          transform:`translate(${mouse.x * 0.6}px, ${mouse.y * 0.6}px) scale(1.08)`,
          transition:"transform .12s linear",
        }}>
          <img
            src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1600&q=90"
            alt="luxury penthouse"
            style={{ width:"100%", height:"100%", objectFit:"cover" }}
          />
        </div>
        <div className="hero-img-overlay-left" style={{
          position:"absolute", inset:0,
          background:`linear-gradient(to right, ${T.bg} 0%, ${T.bg}E0 8%, ${T.bg}80 30%, ${T.bg}20 60%, transparent 100%)`,
          zIndex:2,
        }}/>
        <div style={{ position:"absolute", inset:0, background:`linear-gradient(to bottom, ${T.bg}88 0%, transparent 25%, transparent 75%, ${T.bg}88 100%)`, zIndex:2 }}/>
        <div style={{
          position:"absolute", left:0, top:0, bottom:0, width:2,
          background:`linear-gradient(to bottom, transparent, ${T.gold}, ${T.silverLight}, ${T.gold}, transparent)`,
          zIndex:4,
        }}/>
      </div>

      {/* Grain */}
      <div className="grain" style={{ opacity:0.6, zIndex:3 }}/>

      {/* Decorative corner ornament */}
      <div className="hero-ornament" style={{ position:"absolute", top:32, right:32, zIndex:6, opacity:0.45 }}>
        <svg width="90" height="90" viewBox="0 0 90 90">
          <circle cx="45" cy="45" r="40" fill="none" stroke={T.gold} strokeWidth="0.5" strokeDasharray="4 6"
            style={{ transformOrigin:"45px 45px", animation:"rotateRing 24s linear infinite" }}/>
          <circle cx="45" cy="45" r="28" fill="none" stroke={T.silverLight} strokeWidth="0.5"
            style={{ transformOrigin:"45px 45px", animation:"counterRotate 18s linear infinite" }}/>
          <circle cx="45" cy="45" r="3" fill={T.gold}/>
          <line x1="45" y1="5" x2="45" y2="85" stroke={T.gold} strokeWidth="0.4" opacity="0.4"/>
          <line x1="5" y1="45" x2="85" y2="45" stroke={T.gold} strokeWidth="0.4" opacity="0.4"/>
        </svg>
      </div>

      {/* Left text content */}
      <div className="container" style={{ position:"relative", zIndex:10, display:"flex", flexDirection:"column", justifyContent:"center", paddingTop:90, width:"100%" }}>
        <div className="hero-content-wrap" style={{ maxWidth:640 }}>

          {/* Eyebrow */}
          <div className="hero-eyebrow" style={{
            display:"flex", alignItems:"center", gap:14, marginBottom:36,
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(20px)",
            transition:"all 0.9s ease 0.2s",
          }}>
            <div style={{ width:48, height:1, background:`linear-gradient(90deg, ${T.gold}, ${T.silverLight})`, flexShrink:0 }}/>
            <span style={{
              fontFamily:"Jost,sans-serif", fontSize:"0.58rem", letterSpacing:"0.44em",
              textTransform:"uppercase", fontWeight:500,
              background:`linear-gradient(90deg, ${T.goldLight}, ${T.silverLight})`,
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
            }}>Luxury Construction · Est. 2006</span>
          </div>

          {/* Headlines */}
          <div style={{ overflow:"hidden", marginBottom:0 }}>
            <div className="hero-headline" style={{
              fontFamily:"'Cormorant Infant', serif",
              fontSize:"clamp(4rem, 7.5vw, 7.8rem)",
              fontWeight:300, lineHeight:0.92, letterSpacing:"-0.01em",
              color:T.textPrimary,
              opacity: loaded ? 1 : 0,
              transform: loaded ? "translateY(0)" : "translateY(70px)",
              transition:"all 1.1s cubic-bezier(.16,1,.3,1) 0.35s",
            }}>Building</div>
          </div>

          <div style={{ overflow:"hidden", marginBottom:0 }}>
            <div className="hero-headline" style={{
              fontFamily:"'Cormorant Infant', serif",
              fontSize:"clamp(4rem, 7.5vw, 7.8rem)",
              fontWeight:600, lineHeight:0.92, fontStyle:"italic",
              letterSpacing:"-0.01em",
              background:`linear-gradient(135deg, ${T.goldBright} 0%, ${T.gold} 45%, ${T.goldLight} 70%, ${T.silverLight} 100%)`,
              backgroundSize:"200% 200%",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
              animation: loaded ? "goldShimmer 6s ease-in-out infinite" : "none",
              opacity: loaded ? 1 : 0,
              transform: loaded ? "translateY(0)" : "translateY(70px)",
              transition:"all 1.1s cubic-bezier(.16,1,.3,1) 0.52s",
            }}>Tomorrow's</div>
          </div>

          <div style={{ overflow:"hidden", marginBottom:44 }}>
            <div className="hero-headline" style={{
              fontFamily:"'Cormorant Infant', serif",
              fontSize:"clamp(4rem, 7.5vw, 7.8rem)",
              fontWeight:300, lineHeight:0.92, letterSpacing:"-0.01em",
              color:T.silverLight,
              opacity: loaded ? 1 : 0,
              transform: loaded ? "translateY(0)" : "translateY(70px)",
              transition:"all 1.1s cubic-bezier(.16,1,.3,1) 0.68s",
            }}>Legends</div>
          </div>

          {/* Animated gold rule */}
          <div className="hero-gold-rule" style={{
            height:1,
            background:`linear-gradient(90deg, ${T.gold}, ${T.silverLight}, transparent)`,
            marginBottom:36,
            opacity: loaded ? 1 : 0,
            transition:"opacity 0.6s ease 0.9s",
          }}/>

          {/* Sub copy */}
          <p className="hero-sub-copy" style={{
            fontFamily:"Jost,sans-serif", color:T.textSecondary,
            fontSize:"clamp(0.85rem,1.2vw,0.98rem)", lineHeight:1.85,
            fontWeight:300, maxWidth:460, marginBottom:44,
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(14px)",
            transition:"all 0.9s ease 1.0s",
          }}>
            Award-winning architecture and precision construction that transforms ambitious visions into iconic structures defining the skylines of tomorrow.
          </p>

          {/* CTA buttons */}
          <div className="hero-cta-row" style={{
            display:"flex", gap:14, flexWrap:"wrap",
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(14px)",
            transition:"all 0.9s ease 1.1s",
          }}>
            <button className="btn-gold"><span>Explore Portfolio <FiArrowRight size={13}/></span></button>
            <button className="btn-silver"><FiPlay size={12}/> Watch Showreel</button>
          </div>
        </div>
      </div>

      {/* Floating stat pills */}
      <div className="hero-stat-pills" style={{
        position:"absolute", bottom:56, right:68,
        display:"flex", flexDirection:"column", gap:2, zIndex:10,
        opacity: loaded ? 1 : 0,
        transform: loaded ? "translateX(0)" : "translateX(30px)",
        transition:"all 0.9s ease 1.3s",
      }}>
        {statBadges.map((s: StatBadge, i: number) => (
          <div key={s.l} style={{
            display:"flex", alignItems:"center", gap:18,
            background:"rgba(8,7,5,0.88)", backdropFilter:"blur(24px)",
            border:`1px solid ${i === 0 ? T.borderGold : T.borderSilver}`,
            padding:"14px 24px",
            clipPath:"polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,0 100%)",
          }}>
            <div style={{
              fontFamily:"'Cormorant Infant',serif", fontSize:"1.9rem", fontWeight:600, lineHeight:1,
              background: i === 0
                ? `linear-gradient(135deg, ${T.goldBright}, ${T.gold})`
                : `linear-gradient(135deg, ${T.silverLight}, ${T.silver})`,
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
            }}>{s.n}</div>
            <div style={{ fontFamily:"Jost,sans-serif", fontSize:"0.56rem", letterSpacing:"0.26em", color:T.textSecondary, textTransform:"uppercase" }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Vertical label */}
      <div className="hero-vertical-label" style={{
        position:"absolute", left:22, top:"50%", transform:"translateY(-50%)",
        display:"flex", flexDirection:"column", alignItems:"center", gap:14,
        zIndex:10, opacity: loaded ? 1 : 0, transition:"opacity 0.8s ease 1.4s",
      }}>
        <div style={{ width:1, height:52, background:`linear-gradient(to bottom, transparent, ${T.gold})` }}/>
        <span style={{
          writingMode:"vertical-rl", transform:"rotate(180deg)",
          fontSize:"0.52rem", letterSpacing:"0.34em",
          color:T.textMuted, textTransform:"uppercase",
          fontFamily:"Jost,sans-serif", fontWeight:400,
        }}>Award-Winning Architecture · Sincce 2006</span>
        <div style={{ width:1, height:52, background:`linear-gradient(to bottom, ${T.gold}, transparent)` }}/>
      </div>

      {/* Scroll cue */}
      <div className="hero-scroll-cue" style={{
        position:"absolute", bottom:28, left:"50%", transform:"translateX(-50%)",
        display:"flex", flexDirection:"column", alignItems:"center", gap:6, zIndex:10,
        opacity: loaded ? 1 : 0, transition:"opacity 0.8s ease 1.5s",
      }}>
        <span style={{ fontFamily:"Jost,sans-serif", fontSize:"0.52rem", letterSpacing:"0.32em", color:T.textMuted, textTransform:"uppercase" }}>Scroll</span>
        <FiChevronDown size={13} color={T.goldLight} style={{ animation:"float 2.2s ease-in-out infinite" }}/>
      </div>
    </section>
  );
};

/* ─── MARQUEE ────────────────────────────────────────────── */
const MarqueeStrip: FC = () => {
  const items: string[] = ["Award-Winning Design","Precision Engineering","Luxury Residences","Commercial Excellence","Iconic Architecture","Premium Craftsmanship","World-Class Build"];
  const dbl: string[] = [...items, ...items];
  return (
    <div style={{ background:T.surfaceRaised, borderTop:`1px solid ${T.borderGold}`, borderBottom:`1px solid ${T.borderGold}`, padding:"10px 0", overflow:"hidden" }}>
      <div className="marquee-track">
        {dbl.map((text: string, i: number) => (
          <span key={i} style={{
            whiteSpace:"nowrap", paddingRight:56,
            fontSize:"0.62rem", fontWeight:500, letterSpacing:"0.26em", textTransform:"uppercase",
            fontFamily:"Jost,sans-serif",
            background:`linear-gradient(90deg, ${T.goldLight}, ${T.silverLight})`,
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
          }}>
            {text} <span style={{ opacity:0.3, marginLeft:26 }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  );
};

/* ─── STATS STRIP ────────────────────────────────────────── */
const StatsStrip: FC = () => {
  useReveal();
  return (
    <div style={{ background:T.surface, borderBottom:`1px solid ${T.border}` }}>
      <div className="container">
        <div className="stats-grid-4 grid-4">
          {STATS.map((s: Stat, i: number) => (
            <div key={s.label} className={`reveal d${i + 1}`} style={{
              padding:"56px 0", textAlign:"center",
              borderRight: i < 3 ? `1px solid ${T.border}` : "none",
            }}>
              <div style={{
                fontFamily:"'Cormorant Infant',serif", fontSize:"clamp(2.8rem,5vw,4.8rem)", fontWeight:600, lineHeight:1,
                background:`linear-gradient(135deg, ${T.goldBright}, ${T.gold}, ${T.silverLight})`,
                WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
              }}>
                <Counter target={s.value} suffix={s.suffix} decimals={s.decimals ?? 0}/>
              </div>
              <div style={{ fontFamily:"Jost,sans-serif", fontSize:"0.6rem", letterSpacing:"0.26em", color:T.textSecondary, textTransform:"uppercase", marginTop:10, fontWeight:400 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─── PROPERTIES ─────────────────────────────────────────── */
const Properties: FC = () => {
  useReveal();
  return (
    <section id="properties" className="section" style={{ background:T.bg }}>
      <div className="container">
        <div className="props-header" style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:60, flexWrap:"wrap", gap:20 }}>
          <div className="reveal">
            <div className="eyebrow" style={{ marginBottom:16 }}>Portfolio</div>
            <h2 className="sec-title">Signature <em>Properties</em></h2>
          </div>
          <button className="btn-silver reveal" style={{ display:"flex", alignItems:"center", gap:10 }}>View All <FiArrowUpRight size={14}/></button>
        </div>
        <div className="grid-props">
          {PROPERTIES.map((p: Property, i: number) => (
            <div key={p.id} className={`prop-card reveal d${i + 1}`} style={{ aspectRatio:"3/4", background:T.surface }}>
              <img src={p.img} alt={p.title}/>
              <div className="prop-ov"/>
              <div style={{
                position:"absolute", top:18, left:18,
                background:`linear-gradient(135deg, ${T.goldDim}, ${T.gold})`,
                color:T.black, padding:"4px 14px",
                fontSize:"0.56rem", letterSpacing:"0.2em", textTransform:"uppercase",
                fontFamily:"Jost,sans-serif", fontWeight:600,
                clipPath:"polygon(0 0,calc(100% - 6px) 0,100% 6px,100% 100%,0 100%)",
              }}>{p.tag}</div>
              <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"28px 28px 32px" }}>
                <div style={{ fontFamily:"Jost,sans-serif", fontSize:"0.58rem", letterSpacing:"0.18em", color:T.silverDim, textTransform:"uppercase", marginBottom:6, display:"flex", alignItems:"center", gap:6 }}>
                  <FiMapPin size={9} color={T.goldLight}/> {p.loc}
                </div>
                <div className="font-corm" style={{ fontSize:"1.45rem", fontWeight:500, marginBottom:14, lineHeight:1.15, color:T.textPrimary }}>{p.title}</div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div style={{
                    fontFamily:"'Cormorant Infant',serif", fontSize:"1.65rem", fontWeight:700,
                    background:`linear-gradient(135deg, ${T.goldBright}, ${T.goldLight})`,
                    WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
                  }}>{p.price}</div>
                  <div style={{ fontFamily:"Jost,sans-serif", fontSize:"0.65rem", color:T.textSecondary }}>{p.sqft} sq.ft</div>
                </div>
                <div className="prop-reveal" style={{ marginTop:16, paddingTop:16, borderTop:`1px solid rgba(184,150,46,0.2)` }}>
                  <button className="btn-silver" style={{ padding:"10px 22px", fontSize:"0.6rem", display:"flex", alignItems:"center", gap:8 }}>
                    View Property <FiArrowRight size={12}/>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─── SERVICES ───────────────────────────────────────────── */
const Services: FC = () => {
  useReveal();
  return (
    <section id="services" className="section" style={{ background:T.surface }}>
      <div className="container">
        <div style={{ textAlign:"center", marginBottom:72 }}>
          <div className="eyebrow reveal" style={{ justifyContent:"center", marginBottom:16 }}>What We Do</div>
          <h2 className="sec-title reveal">Our <em>Capabilities</em></h2>
          <div className="gold-line reveal" style={{ width:100, margin:"22px auto 0" }}/>
        </div>
        <div className="grid-3">
          {SERVICES.map(({ icon:Icon, title, desc }: Service, i: number) => (
            <div key={title} className={`svc-card reveal d${i + 1}`}>
              <div className="svc-icon"><Icon size={21} color={T.goldLight}/></div>
              <h3 className="font-corm" style={{ fontSize:"1.45rem", fontWeight:500, marginBottom:14, lineHeight:1.2, color:T.textPrimary }}>{title}</h3>
              <p style={{ fontFamily:"Jost,sans-serif", color:T.textSecondary, fontSize:"0.88rem", lineHeight:1.82, fontWeight:300 }}>{desc}</p>
              <div style={{ marginTop:28, display:"flex", alignItems:"center", gap:8, fontFamily:"Jost,sans-serif", fontSize:"0.64rem", letterSpacing:"0.16em", textTransform:"uppercase", fontWeight:500,
                background:`linear-gradient(90deg, ${T.goldLight}, ${T.silverLight})`,
                WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
              }}>
                Learn More <FiArrowRight size={12} color={T.goldLight}/>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─── BLUEPRINT ──────────────────────────────────────────── */
const Blueprint: FC = () => {
  const [hovered, setHovered] = useState<Room | null>(null);
  const [floor, setFloor] = useState<number>(0);
  useReveal();
  const floors: string[] = ["Ground Floor","Mezzanine","Sky Penthouse"];
  return (
    <section id="blueprint" className="section" style={{ background:T.bg }}>
      <div className="container">
        <div className="blueprint-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1.4fr", gap:88, alignItems:"center" }}>
          <div>
            <div className="eyebrow reveal" style={{ marginBottom:16 }}>Interactive</div>
            <h2 className="sec-title reveal" style={{ marginBottom:20 }}>Explore the<br/><em>Blueprint</em></h2>
            <div className="gold-line reveal" style={{ width:80, marginBottom:28 }}/>
            <p className="reveal" style={{ fontFamily:"Jost,sans-serif", color:T.textSecondary, lineHeight:1.88, fontSize:"0.92rem", marginBottom:34, fontWeight:300 }}>
              Hover over any room to reveal dimensions, materials, and design intent. Every inch is precision-engineered.
            </p>
            <div className="blueprint-floors" style={{ display:"flex", gap:0, marginBottom:36 }}>
              {floors.map((f: string, i: number) => (
                <button key={f} onClick={() => setFloor(i)} style={{
                  padding:"10px 18px", fontSize:"0.63rem", letterSpacing:"0.12em",
                  textTransform:"uppercase", fontFamily:"Jost,sans-serif", fontWeight:400,
                  background: floor === i ? T.goldFaint : "transparent",
                  border:`1px solid ${floor === i ? T.gold : T.border}`,
                  color: floor === i ? T.goldLight : T.textSecondary,
                  transition:"all 0.3s", marginRight:-1, cursor:"pointer",
                }}>{f}</button>
              ))}
            </div>
            <div className="blueprint-info-box" style={{
              background:T.surfaceRaised, border:`1px solid ${hovered ? T.borderGold : T.border}`,
              padding:28, minHeight:130, transition:"border-color 0.35s",
              clipPath:"polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,0 100%)",
            }}>
              {hovered ? (
                <div key={hovered.id} style={{ animation:"fadeUp .3s ease forwards" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                    <div style={{ width:7, height:7, borderRadius:"50%", background:T.gold, animation:"breathe 1.5s ease-in-out infinite" }}/>
                    <span className="font-corm" style={{ fontSize:"1.3rem",
                      background:`linear-gradient(135deg, ${T.goldBright}, ${T.silverLight})`,
                      WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
                    }}>{hovered.label}</span>
                  </div>
                  <div style={{ fontFamily:"Jost,sans-serif", fontSize:"0.74rem", color:T.textSecondary, marginBottom:8, display:"flex", alignItems:"center", gap:6 }}>
                    <TbRuler size={11} color={T.goldLight}/> {hovered.sqft} sq.ft
                  </div>
                  <div style={{ fontFamily:"Jost,sans-serif", fontSize:"0.88rem", color:T.textPrimary, lineHeight:1.68, fontWeight:300 }}>{hovered.feature}</div>
                </div>
              ) : (
                <div style={{ display:"flex", alignItems:"center", gap:12, color:T.textMuted }}>
                  <LuCompass size={17} color={T.textMuted}/>
                  <span style={{ fontFamily:"Jost,sans-serif", fontSize:"0.82rem", letterSpacing:"0.04em", fontWeight:300 }}>Hover over any room to explore</span>
                </div>
              )}
            </div>
          </div>
          <div className="blueprint-canvas reveal-right" style={{ position:"relative", aspectRatio:"1/1.1", background:"rgba(184,150,46,0.02)", border:`1px solid rgba(184,150,46,0.14)`, overflow:"hidden" }}>
            <div className="scan-line"/>
            <div style={{ position:"absolute", inset:0, backgroundImage:`linear-gradient(rgba(184,150,46,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(184,150,46,0.04) 1px,transparent 1px)`, backgroundSize:"40px 40px" }}/>
            <div style={{ position:"absolute", top:13, right:13, fontFamily:"Jost,sans-serif", fontSize:"0.54rem", letterSpacing:"0.28em",
              background:`linear-gradient(90deg, ${T.goldLight}, ${T.silverLight})`,
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
              textTransform:"uppercase" }}>
              {floors[floor]} · Crestview Manor
            </div>
            <div style={{ position:"absolute", bottom:13, right:13, width:34, height:34, border:`1px solid rgba(184,150,46,0.22)`, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span style={{ fontSize:"0.56rem", color:T.silverDim, fontFamily:"Jost,sans-serif" }}>N</span>
            </div>
            {ROOMS.map((r: Room) => (
              <div key={r.id} className="bp-room"
                style={{ top:r.top, left:r.left, width:r.w, height:r.h, boxShadow:hovered?.id === r.id ? "0 0 40px rgba(184,150,46,0.1) inset" : "none" }}
                onMouseEnter={() => setHovered(r)}
                onMouseLeave={() => setHovered(null)}>
                <span className="bp-label">{r.label}</span>
                {hovered?.id === r.id && (
                  <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)" }}>
                    <PiArrowsOutCardinalLight size={18} color={T.goldLight} style={{ opacity:0.7 }}/>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ─── SKYLINE MAP ────────────────────────────────────────── */
const SkylineMap: FC = () => {
  const [tooltip, setTooltip] = useState<SkylineProject | null>(null);
  const [active, setActive] = useState<SkylineProject>(SKYLINE_PROJECTS[0]);
  useReveal();
  return (
    <section id="skyline" className="section" style={{ background:T.surface, position:"relative", overflow:"hidden" }}>
      <div className="grid-lines" style={{ opacity:0.5 }}/>
      <div className="container" style={{ position:"relative", zIndex:1 }}>
        <div className="skyline-header" style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:60, flexWrap:"wrap", gap:24 }}>
          <div>
            <div className="eyebrow reveal" style={{ marginBottom:16 }}>Global Footprint</div>
            <h2 className="sec-title reveal">Live <em>Skyline</em> Map</h2>
          </div>
          <div className="reveal" style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 20px", border:`1px solid ${T.borderGold}`, background:T.surfaceRaised }}>
            <div style={{ width:7, height:7, borderRadius:"50%", background:T.gold, animation:"pulseDot 1.5s ease-in-out infinite" }}/>
            <span style={{ fontFamily:"Jost,sans-serif", fontSize:"0.64rem", letterSpacing:"0.18em", color:T.textSecondary, textTransform:"uppercase", fontWeight:400 }}>
              {SKYLINE_PROJECTS.reduce((a: number, b: SkylineProject) => a + b.count, 0)} Active Projects
            </span>
          </div>
        </div>
        <div className="skyline-grid" style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:36, alignItems:"start" }}>
          <div className="reveal" style={{ position:"relative", aspectRatio:"2/1", background:"rgba(184,150,46,0.02)", border:`1px solid ${T.border}`, overflow:"hidden" }}>
            <div style={{ position:"absolute", inset:0, backgroundImage:`linear-gradient(rgba(184,150,46,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(184,150,46,0.04) 1px,transparent 1px)`, backgroundSize:"60px 60px" }}/>
            <img src="https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1200&q=60" alt="world map" style={{ width:"100%", height:"100%", objectFit:"cover", opacity:0.05 }}/>
            {SKYLINE_PROJECTS.map((p: SkylineProject, i: number) => (
              <div key={p.city} style={{ position:"absolute", left:`${p.x}%`, top:`${p.y}%`, transform:"translate(-50%,-50%)" }}
                onMouseEnter={() => setTooltip(p)} onMouseLeave={() => setTooltip(null)} onClick={() => setActive(p)}>
                <div className="sky-dot" style={{ animationDelay:`${i * 0.3}s`, background: active.city === p.city ? T.goldBright : "rgba(184,150,46,0.5)" }}/>
                {tooltip?.city === p.city && (
                  <div style={{ position:"absolute", bottom:18, left:"50%", transform:"translateX(-50%)", whiteSpace:"nowrap", background:T.surfaceHigh, border:`1px solid ${T.gold}`, padding:"5px 14px", fontSize:"0.6rem", letterSpacing:"0.1em", color:T.textPrimary, fontFamily:"Jost,sans-serif", animation:"fadeUp .2s ease forwards", zIndex:10, clipPath:"polygon(0 0,calc(100% - 6px) 0,100% 6px,100% 100%,0 100%)" }}>
                    {p.city} · {p.count} projects
                  </div>
                )}
              </div>
            ))}
            <div className="scan-line" style={{ opacity:0.1 }}/>
          </div>
          <div className="skyline-list reveal-right" style={{ display:"flex", flexDirection:"column", gap:2 }}>
            {SKYLINE_PROJECTS.map((p: SkylineProject) => (
              <button key={p.city} onClick={() => setActive(p)} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"13px 18px", background: active.city === p.city ? T.goldFaint : T.surfaceRaised, border:`1px solid ${active.city === p.city ? T.borderGold : T.border}`, cursor:"pointer", transition:"all 0.3s", textAlign:"left" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:5, height:5, borderRadius:"50%", background: active.city === p.city ? T.gold : T.textMuted, transition:"background .3s" }}/>
                  <span style={{ fontFamily:"Jost,sans-serif", fontSize:"0.8rem", color: active.city === p.city ? T.textPrimary : T.textSecondary, fontWeight:300 }}>{p.city}</span>
                </div>
                <span style={{ fontFamily:"'Cormorant Infant',serif", fontSize:"1.05rem", fontWeight:700, color: active.city === p.city ? T.goldLight : T.textMuted }}>{p.count}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="skyline-footer reveal" style={{ marginTop:28, padding:"26px 36px", background:T.surfaceRaised, border:`1px solid ${T.borderGold}`, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:20, clipPath:"polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,0 100%)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ width:9, height:9, borderRadius:"50%", background:T.gold, animation:"breathe 2s ease-in-out infinite" }}/>
            <span className="font-corm" style={{ fontSize:"1.6rem", color:T.textPrimary, fontWeight:700 }}>{active.city}</span>
            <span style={{ fontFamily:"Jost,sans-serif", fontSize:"0.64rem", letterSpacing:"0.18em", color:T.textSecondary, textTransform:"uppercase" }}>Regional Hub</span>
          </div>
          <div className="skyline-footer-stats" style={{ display:"flex", gap:36 }}>
            {[
              { l:"Active Projects", v: active.count },
              { l:"Est. Value", v: `$${(active.count * 42).toLocaleString()}M` },
              { l:"Team Members", v: active.count * 18 },
            ].map((s: { l: string; v: number | string }) => (
              <div key={s.l} style={{ textAlign:"center" }}>
                <div style={{ fontFamily:"'Cormorant Infant',serif", fontSize:"1.8rem", fontWeight:700, lineHeight:1,
                  background:`linear-gradient(135deg, ${T.goldBright}, ${T.silverLight})`,
                  WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
                }}>{s.v}</div>
                <div style={{ fontFamily:"Jost,sans-serif", fontSize:"0.54rem", letterSpacing:"0.2em", color:T.textSecondary, textTransform:"uppercase" }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ─── MATERIALS LIBRARY ──────────────────────────────────── */
const MaterialsLibrary: FC = () => {
  const [active, setActive] = useState<number>(0);
  useReveal();
  const mat: Material = MATERIALS[active];
  return (
    <section id="materials" className="section" style={{ background:T.bg, position:"relative", overflow:"hidden" }}>
      <div className="grain" style={{ opacity:0.5 }}/>
      <div className="container" style={{ position:"relative", zIndex:2 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:64, flexWrap:"wrap", gap:20 }}>
          <div>
            <div className="eyebrow reveal" style={{ marginBottom:16 }}>Craftsmanship</div>
            <h2 className="sec-title reveal">Our Materials <em>Library</em></h2>
          </div>
          <p className="reveal" style={{ fontFamily:"Jost,sans-serif", color:T.textSecondary, fontSize:"0.9rem", maxWidth:380, lineHeight:1.78, fontWeight:300 }}>
            Every Rudhra project sources from the world's rarest natural materials — hand-selected for texture, permanence, and provenance.
          </p>
        </div>
        <div className="materials-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:2, alignItems:"stretch" }}>
          <div className="materials-left" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:2 }}>
            {MATERIALS.map((m: Material, i: number) => (
              <div key={m.name} className={`mat-card reveal d${i + 1}`} onClick={() => setActive(i)}
                style={{ border:`1px solid ${active === i ? T.borderGold : T.border}`, background: active === i ? T.goldFaint2 : T.surface }}>
                <div className="mat-swatch">
                  <img src={m.img} alt={m.name}/>
                  {active === i && <div style={{ position:"absolute", inset:0, background:"rgba(184,150,46,0.12)", border:`1px solid ${T.gold}` }}/>}
                </div>
                <div style={{ fontFamily:"'Cormorant Infant',serif", fontSize:"1.05rem", fontWeight:500, color:T.textPrimary, marginBottom:6 }}>{m.name}</div>
                <div style={{ fontFamily:"Jost,sans-serif", fontSize:"0.58rem", letterSpacing:"0.22em",
                  background:`linear-gradient(90deg, ${T.goldLight}, ${T.silver})`,
                  WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
                  textTransform:"uppercase", fontWeight:500 }}>{m.origin}</div>
              </div>
            ))}
          </div>
          <div className="reveal-right" style={{ background:T.surfaceRaised, border:`1px solid ${T.border}`, padding:48, display:"flex", flexDirection:"column", justifyContent:"space-between", position:"relative", overflow:"hidden" }}>
            <div>
              <div style={{ width:"100%", height:240, overflow:"hidden", marginBottom:32, position:"relative" }}>
                <img key={active} src={mat.img} alt={mat.name} style={{ width:"100%", height:"100%", objectFit:"cover", animation:"fadeIn 0.5s ease forwards" }}/>
                <div style={{ position:"absolute", inset:0, background:`linear-gradient(to bottom, transparent 55%, ${T.surfaceRaised})` }}/>
              </div>
              <div style={{ fontFamily:"Jost,sans-serif", fontSize:"0.56rem", letterSpacing:"0.34em", textTransform:"uppercase", marginBottom:8, fontWeight:500,
                background:`linear-gradient(90deg, ${T.goldLight}, ${T.silver})`,
                WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
              }}>Material No. {String(active + 1).padStart(2, "0")}</div>
              <div className="font-corm" style={{ fontSize:"2.1rem", fontWeight:700, color:T.textPrimary, marginBottom:6, lineHeight:1.1 }}>{mat.name}</div>
              <div style={{ fontFamily:"Jost,sans-serif", fontSize:"0.68rem", letterSpacing:"0.14em", color:T.textSecondary, marginBottom:20, textTransform:"uppercase" }}>Origin: {mat.origin}</div>
              <div style={{ width:56, height:1, background:`linear-gradient(90deg, ${T.gold}, ${T.silver})`, marginBottom:20 }}/>
              <div style={{ fontFamily:"Jost,sans-serif", fontSize:"0.88rem", color:T.textSecondary, lineHeight:1.82, fontWeight:300 }}>
                Sourced directly from certified quarries, each piece is hand-inspected by our master material specialists before being approved for use in any Rudhra project.
              </div>
            </div>
            <div style={{ marginTop:28 }}>
              <div style={{ fontFamily:"Jost,sans-serif", fontSize:"0.58rem", letterSpacing:"0.24em", color:T.textMuted, textTransform:"uppercase", marginBottom:8 }}>Used In</div>
              <div style={{ fontFamily:"Jost,sans-serif", fontSize:"0.92rem", color:T.silverLight, fontWeight:400 }}>{mat.use}</div>
            </div>
            <div style={{ position:"absolute", bottom:0, right:0, width:80, height:80, borderTop:`1px solid ${T.borderGold}`, borderLeft:`1px solid ${T.borderGold}`, opacity:0.4 }}/>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ─── AWARDS ─────────────────────────────────────────────── */
const Awards: FC = () => {
  const [hovered, setHovered] = useState<number | null>(null);
  useReveal();
  return (
    <section id="awards" className="section" style={{ background:T.surface, position:"relative", overflow:"hidden" }}>
      <div className="grid-lines" style={{ opacity:0.3 }}/>
      <div className="container" style={{ position:"relative", zIndex:1 }}>
        <div className="awards-grid" style={{ display:"grid", gridTemplateColumns:"1fr 2fr", gap:88, alignItems:"start" }}>
          <div className="awards-sticky" style={{ position:"sticky", top:120 }}>
            <div className="eyebrow reveal" style={{ marginBottom:16 }}>Recognition</div>
            <h2 className="sec-title reveal" style={{ marginBottom:20 }}>Global <em>Awards</em></h2>
            <div className="gold-line reveal" style={{ width:64, marginBottom:26 }}/>
            <p className="reveal" style={{ fontFamily:"Jost,sans-serif", color:T.textSecondary, lineHeight:1.88, fontSize:"0.9rem", fontWeight:300, marginBottom:36 }}>
              Our work has been recognised by the world's most prestigious architectural institutions — a testament to our relentless pursuit of excellence.
            </p>
            <div className="awards-mini-stats reveal" style={{ display:"flex", gap:32 }}>
              {([{ n:24, l:"Total Awards" },{ n:11, l:"Countries" }] as Array<{n:number;l:string}>).map((s, i: number) => (
                <React.Fragment key={s.l}>
                  {i > 0 && <div style={{ width:1, background:T.border }}/>}
                  <div style={{ textAlign:"center" }}>
                    <div className="font-corm" style={{ fontSize:"2.4rem", fontWeight:700,
                      background:`linear-gradient(135deg, ${T.goldBright}, ${T.silverLight})`,
                      WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
                    }}>{s.n}</div>
                    <div style={{ fontFamily:"Jost,sans-serif", fontSize:"0.58rem", letterSpacing:"0.22em", color:T.textSecondary, textTransform:"uppercase" }}>{s.l}</div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
            {AWARDS.map((a: Award, i: number) => (
              <div key={a.title} className={`award-card reveal d${i + 1}`}
                onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}
                style={{ background: hovered === i ? T.goldFaint2 : T.surfaceRaised }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:20 }}>
                  <div style={{ fontFamily:"'Cormorant Infant',serif", fontSize:"0.8rem", fontWeight:700,
                    background:`linear-gradient(90deg, ${T.goldLight}, ${T.silver})`,
                    WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
                    letterSpacing:"0.06em" }}>{a.year}</div>
                  <div style={{ padding:"3px 12px", border:`1px solid ${T.borderGold}`, fontFamily:"Jost,sans-serif", fontSize:"0.54rem", letterSpacing:"0.18em", color:T.goldLight, textTransform:"uppercase", flexShrink:0 }}>Landmark</div>
                </div>
                <div className="font-corm" style={{ fontSize:"1.28rem", fontWeight:500, color:T.textPrimary, lineHeight:1.2 }}>{a.title}</div>
                <div style={{ fontFamily:"Jost,sans-serif", fontSize:"0.78rem", color:T.textSecondary, fontWeight:300 }}>{a.org}</div>
                <div style={{ display:"flex", alignItems:"center", gap:8, fontFamily:"Jost,sans-serif", fontSize:"0.7rem", color:T.textMuted }}>
                  <FiMapPin size={10} color={T.goldLight}/> {a.project}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ─── PROCESS ────────────────────────────────────────────── */
interface ProcessStep { n: string; title: string; desc: string; icon: IconType; }
const Process: FC = () => {
  useReveal();
  const steps: ProcessStep[] = [
    { n:"01", title:"Vision & Discovery",    desc:"Deep-dive sessions to understand your ambitions, site constraints, and legacy goals before a line is drawn.", icon:LuCompass },
    { n:"02", title:"Design & Architecture", desc:"Our studios translate raw vision into award-worthy blueprints — pushing structural art to its limits.", icon:TbRuler },
    { n:"03", title:"Precision Build",       desc:"Master craftspeople and cutting-edge technology converge on site, delivering millimeter accuracy at every scale.", icon:TbBuildingSkyscraper },
    { n:"04", title:"Delivery & Legacy",     desc:"White-glove handover with a 10-year maintenance covenant — because the relationship never ends at completion.", icon:LuBadgeCheck },
  ];
  return (
    <section id="process" className="section" style={{ background:T.bg }}>
      <div className="container">
        <div className="process-header" style={{ textAlign:"center", marginBottom:72 }}>
          <div className="eyebrow reveal" style={{ justifyContent:"center", marginBottom:16 }}>How We Work</div>
          <h2 className="sec-title reveal">The <em>Process</em></h2>
        </div>
        <div className="grid-4">
          {steps.map(({ n, title, desc, icon:Icon }: ProcessStep, i: number) => (
            <div key={n} className={`reveal d${i + 1}`}
              style={{ padding:"46px 32px", border:`1px solid ${T.border}`, background:T.surface, position:"relative", overflow:"hidden", transition:"border-color .3s, background .3s" }}
              onMouseEnter={(e: ReactMouseEvent<HTMLDivElement>) => { (e.currentTarget as HTMLDivElement).style.borderColor = T.borderGold; (e.currentTarget as HTMLDivElement).style.background = T.goldFaint2; }}
              onMouseLeave={(e: ReactMouseEvent<HTMLDivElement>) => { (e.currentTarget as HTMLDivElement).style.borderColor = T.border; (e.currentTarget as HTMLDivElement).style.background = T.surface; }}>
              <div style={{ position:"absolute", top:-10, right:14, fontFamily:"'Cormorant Infant',serif", fontSize:"5.5rem", lineHeight:1, fontWeight:700, color:T.gold, opacity:0.06 }}>{n}</div>
              <div style={{ width:46, height:46, border:`1px solid ${T.borderGold}`, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:22, clipPath:"polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,0 100%)" }}>
                <Icon size={19} color={T.goldLight}/>
              </div>
              <div style={{ fontFamily:"Jost,sans-serif", fontSize:"0.68rem", fontWeight:500, letterSpacing:"0.24em", marginBottom:10, textTransform:"uppercase",
                background:`linear-gradient(90deg, ${T.goldLight}, ${T.silver})`,
                WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
              }}>STEP {n}</div>
              <h3 className="font-corm" style={{ fontSize:"1.28rem", fontWeight:500, marginBottom:14, lineHeight:1.2, color:T.textPrimary }}>{title}</h3>
              <p style={{ fontFamily:"Jost,sans-serif", color:T.textSecondary, fontSize:"0.86rem", lineHeight:1.8, fontWeight:300 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─── MEDIA ──────────────────────────────────────────────── */
const MediaSection: FC = () => {
  const [tab, setTab] = useState<"instagram" | "youtube">("instagram");
  useReveal();
  return (
    <section id="media" className="section" style={{ background:T.surface }}>
      <div className="container">
        <div className="media-header" style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:52, flexWrap:"wrap", gap:20 }}>
          <div>
            <div className="eyebrow reveal" style={{ marginBottom:16 }}>Follow Our Journey</div>
            <h2 className="sec-title reveal">Behind the <em>Build</em></h2>
          </div>
          <div className="media-tabs" style={{ display:"flex", gap:2 }}>
            {(["instagram","youtube"] as const).map((t: "instagram" | "youtube") => (
              <button key={t} onClick={() => setTab(t)} style={{ display:"flex", alignItems:"center", gap:8, padding:"11px 22px", fontSize:"0.64rem", letterSpacing:"0.14em", textTransform:"uppercase", fontFamily:"Jost,sans-serif", background: tab === t ? T.goldFaint2 : "transparent", cursor:"pointer", border:`1px solid ${tab === t ? T.borderGold : T.border}`, color: tab === t ? T.goldLight : T.textSecondary, transition:"all 0.3s" }}>
                {t === "instagram" ? <FiInstagram size={12}/> : <FiYoutube size={12}/>}
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>
        {tab === "instagram" && (
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:24 }}>
              <FiInstagram size={14} color={T.goldLight}/>
              <span style={{ fontFamily:"Jost,sans-serif", fontSize:"0.74rem", letterSpacing:"0.1em", color:T.textSecondary }}>@Rudhra.estates — Daily luxury construction content</span>
            </div>
            <div className="insta-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:2 }}>
              {INSTA.map((src: string, i: number) => (
                <div key={i} className={`media-thumb reveal d${i + 1}`} style={{ aspectRatio:"1/1" }}>
                  <img src={src} alt=""/>
                  <div className="media-ov">
                    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
                      <FiInstagram size={20} color={T.goldLight}/>
                      <span style={{ fontFamily:"Jost,sans-serif", fontSize:"0.58rem", letterSpacing:"0.16em", color:T.silverLight, textTransform:"uppercase" }}>View Post</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ textAlign:"center", marginTop:36 }}>
              <button className="btn-silver" style={{ display:"inline-flex", alignItems:"center", gap:10 }}><FiInstagram size={13}/> Follow on Instagram</button>
            </div>
          </div>
        )}
        {tab === "youtube" && (
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:24 }}>
              <FiYoutube size={14} color={T.goldLight}/>
              <span style={{ fontFamily:"Jost,sans-serif", fontSize:"0.74rem", letterSpacing:"0.1em", color:T.textSecondary }}>Rudhra Estates — Project documentaries & walkthroughs</span>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:2 }}>
              {YTVIDEOS.map((v: VideoItem, i: number) => (
                <div key={i} className={`glass-card reveal d${i + 1}`} style={{ overflow:"hidden" }}>
                  <div className="media-thumb" style={{ aspectRatio:"16/9" }}>
                    <img src={v.img} alt={v.title}/>
                    <div style={{ position:"absolute", inset:0, background:"rgba(5,4,3,0.45)" }}/>
                    <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <div style={{ width:56, height:56, border:`1px solid ${T.goldLight}`, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", color:T.goldLight, animation:"breathe 2s ease-in-out infinite" }}>
                        <FiPlay size={19} style={{ marginLeft:3 }}/>
                      </div>
                    </div>
                    <div style={{ position:"absolute", bottom:10, right:10, background:"rgba(5,4,3,0.9)", padding:"2px 12px", fontFamily:"Jost,sans-serif", fontSize:"0.64rem", color:T.silverDim }}>{v.dur}</div>
                  </div>
                  <div style={{ padding:"20px 24px" }}>
                    <div className="font-corm" style={{ fontSize:"1.08rem", marginBottom:5, lineHeight:1.3, fontWeight:500, color:T.textPrimary }}>{v.title}</div>
                    <div style={{ fontFamily:"Jost,sans-serif", fontSize:"0.66rem", color:T.textSecondary }}>{v.views} views</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ textAlign:"center", marginTop:36 }}>
              <button className="btn-silver" style={{ display:"inline-flex", alignItems:"center", gap:10 }}><FiYoutube size={13}/> Subscribe on YouTube</button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

/* ─── TESTIMONIALS ───────────────────────────────────────── */
const Testimonials: FC = () => {
  const [idx, setIdx] = useState<number>(0);
  const t: Testimonial = TESTIMONIALS[idx];
  useReveal();
  return (
    <section className="section" style={{ background:T.bg, position:"relative", overflow:"hidden" }}>
      <div className="grid-lines" style={{ opacity:0.28 }}/>
      <div className="grain" style={{ opacity:0.5 }}/>
      <div className="container" style={{ position:"relative", zIndex:1 }}>
        <div style={{ textAlign:"center", marginBottom:64 }}>
          <div className="eyebrow reveal" style={{ justifyContent:"center", marginBottom:16 }}>Testimonials</div>
          <h2 className="sec-title reveal">Words from <em>Clients</em></h2>
        </div>
        <div style={{ maxWidth:840, margin:"0 auto" }}>
          <div className="testi-card reveal" key={idx} style={{ animation:"fadeUp .6s ease forwards" }}>
            <div style={{ fontFamily:"'EB Garamond',serif", fontSize:"7rem", lineHeight:0.75, color:T.gold, opacity:0.1, position:"absolute", top:18, left:28 }}>"</div>
            <div style={{ display:"flex", gap:4, marginBottom:24 }}>
              {Array.from({ length: t.rating }).map((_: unknown, i: number) => (
                <FiStar key={i} size={12} color={T.goldLight} fill={T.goldLight}/>
              ))}
            </div>
            <p className="testi-text font-gara" style={{ fontSize:"clamp(1.05rem,2.2vw,1.5rem)", fontWeight:400, fontStyle:"italic", lineHeight:1.7, marginBottom:36, color:T.textPrimary, opacity:0.92 }}>{t.text}</p>
            <div style={{ display:"flex", alignItems:"center", gap:16 }}>
              <img src={t.img} alt={t.name} style={{ width:50, height:50, borderRadius:"50%", objectFit:"cover", border:`1px solid ${T.borderGold}` }}/>
              <div>
                <div style={{ fontFamily:"Jost,sans-serif", fontSize:"0.86rem", fontWeight:500, letterSpacing:"0.05em", color:T.textPrimary }}>{t.name}</div>
                <div style={{ fontFamily:"Jost,sans-serif", fontSize:"0.66rem", color:T.textSecondary, letterSpacing:"0.09em", marginTop:2 }}>{t.role}</div>
              </div>
            </div>
          </div>
          <div style={{ display:"flex", justifyContent:"center", gap:10, marginTop:34 }}>
            {TESTIMONIALS.map((_: Testimonial, i: number) => (
              <button key={i} onClick={() => setIdx(i)} style={{ width: i === idx ? 28 : 8, height:8, background: i === idx ? T.gold : T.border, border:"none", cursor:"pointer", transition:"all .35s", borderRadius: i === idx ? 4 : "50%" }}/>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ─── CONTACT ────────────────────────────────────────────── */
interface ContactField { ph: string; s: number; }
const Contact: FC = () => {
  useReveal();
  const fields: ContactField[] = [
    { ph:"First Name", s:1 },{ ph:"Last Name", s:1 },
    { ph:"Email Address", s:2 },{ ph:"Phone Number", s:2 },{ ph:"Project Type", s:2 },
  ];
  return (
    <section id="contact" className="section" style={{ background:T.surface }}>
      <div className="container">
        <div className="contact-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:100, alignItems:"start" }}>
          <div>
            <div className="eyebrow reveal" style={{ marginBottom:16 }}>Get in Touch</div>
            <h2 className="sec-title reveal" style={{ marginBottom:22 }}>Begin Your <em>Vision</em></h2>
            <div className="gold-line reveal" style={{ width:72, marginBottom:26 }}/>
            <p className="reveal" style={{ fontFamily:"Jost,sans-serif", color:T.textSecondary, lineHeight:1.88, fontSize:"0.92rem", marginBottom:48, fontWeight:300 }}>
              Every iconic structure begins with a single conversation. Tell us what you're building — and we'll show you how to make it unforgettable.
            </p>
            <div style={{ display:"flex", flexDirection:"column", gap:24 }}>
              {([
                { icon:FiPhone,  l:"Call Us", v:"+1 (800) Rudhra-00" },
                { icon:FiMail,   l:"Email",   v:"hello@Rudhraestates.com" },
                { icon:FiMapPin, l:"Visit",   v:"120 Fifth Avenue, New York, NY 10001" },
              ] as Array<{ icon: IconType; l: string; v: string }>).map(({ icon:Icon, l, v }) => (
                <div key={l} className="reveal" style={{ display:"flex", gap:18, alignItems:"flex-start" }}>
                  <div style={{ width:44, height:44, border:`1px solid ${T.borderGold}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, clipPath:"polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,0 100%)", background:T.goldFaint2 }}>
                    <Icon size={14} color={T.goldLight}/>
                  </div>
                  <div>
                    <div style={{ fontFamily:"Jost,sans-serif", fontSize:"0.56rem", letterSpacing:"0.26em", textTransform:"uppercase", color:T.textSecondary, marginBottom:3, fontWeight:500 }}>{l}</div>
                    <div style={{ fontFamily:"Jost,sans-serif", fontSize:"0.92rem", color:T.textPrimary, fontWeight:300 }}>{v}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="reveal-right">
            <div className="contact-form-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 24px" }}>
              {fields.map(({ ph, s }: ContactField, i: number) => (
                <div key={i} style={{ gridColumn:`span ${s}`, marginBottom:8 }}>
                  <label style={{ fontFamily:"Jost,sans-serif", fontSize:"0.56rem", letterSpacing:"0.26em", textTransform:"uppercase", color:T.textSecondary, display:"block", marginBottom:8, fontWeight:500 }}>{ph}</label>
                  <input className="c-input" placeholder={`Enter ${ph.toLowerCase()}`}/>
                </div>
              ))}
              <div style={{ gridColumn:"span 2", marginBottom:8 }}>
                <label style={{ fontFamily:"Jost,sans-serif", fontSize:"0.56rem", letterSpacing:"0.26em", textTransform:"uppercase", color:T.textSecondary, display:"block", marginBottom:8, fontWeight:500 }}>Message</label>
                <textarea className="c-input" placeholder="Describe your vision..." rows={4} style={{ resize:"none" }}/>
              </div>
            </div>
            <button className="btn-gold" style={{ marginTop:16, width:"100%", justifyContent:"center" }}>
              <span>Send Message <FiArrowRight size={13}/></span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ─── FOOTER ─────────────────────────────────────────────── */
const Footer: FC = () => {
  const cols: FooterColumn[] = [
    { title:"Company",  links:["About Us","Our Team","Careers","Press Room"] },
    { title:"Services", links:["Luxury Residential","Commercial","Interior Design","Consulting"] },
    { title:"Connect",  links:["New York Office","hello@Rudhraestates.com","+1 800 Rudhra","Book Consultation"] },
  ];
  return (
    <footer style={{ background:T.bg, borderTop:`1px solid ${T.border}`, paddingTop:72, paddingBottom:38 }}>
      <div className="container">
        <div className="footer-grid" style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:64, marginBottom:60 }}>
          <div className="footer-brand-col">
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
              <div style={{ width:32, height:32, border:`1px solid ${T.borderGold}`, display:"flex", alignItems:"center", justifyContent:"center", clipPath:"polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,0 100%)", background:T.goldFaint2, flexShrink:0 }}>
                <TbBuildingSkyscraper size={14} color={T.goldLight}/>
              </div>
              <div style={{ fontFamily:"'Cormorant Infant',serif", fontSize:"1.2rem", fontWeight:600,
                background:`linear-gradient(135deg, ${T.goldBright}, ${T.gold}, ${T.silverLight})`,
                WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
                letterSpacing:"0.1em" }}>Rudhra</div>
            </div>
            <p style={{ fontFamily:"Jost,sans-serif", color:T.textSecondary, fontSize:"0.84rem", lineHeight:1.78, maxWidth:280, marginBottom:28, fontWeight:300 }}>
              Crafting landmark structures and luxury residences that define skylines and elevate lives — since 2006.
            </p>
            <div style={{ display:"flex", gap:10 }}>
              {([FiInstagram, FiYoutube] as IconType[]).map((Icon: IconType, i: number) => (
                <a key={i} href="#" style={{ width:36, height:36, border:`1px solid ${T.border}`, display:"flex", alignItems:"center", justifyContent:"center", color:T.textSecondary, textDecoration:"none", transition:"all .3s", clipPath:"polygon(0 0,calc(100% - 6px) 0,100% 6px,100% 100%,0 100%)", background:T.surfaceRaised }}
                  onMouseEnter={(e: ReactMouseEvent<HTMLAnchorElement>) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = T.borderGold; (e.currentTarget as HTMLAnchorElement).style.color = T.goldLight; }}
                  onMouseLeave={(e: ReactMouseEvent<HTMLAnchorElement>) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = T.border; (e.currentTarget as HTMLAnchorElement).style.color = T.textSecondary; }}>
                  <Icon size={13}/>
                </a>
              ))}
            </div>
          </div>
          {cols.map((col: FooterColumn) => (
            <div key={col.title}>
              <div style={{ fontFamily:"Jost,sans-serif", fontSize:"0.56rem", letterSpacing:"0.34em", textTransform:"uppercase", marginBottom:22, fontWeight:500,
                background:`linear-gradient(90deg, ${T.goldLight}, ${T.silver})`,
                WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
              }}>{col.title}</div>
              {col.links.map((l: string) => <a key={l} href="#" className="foot-link">{l}</a>)}
            </div>
          ))}
        </div>
        <div className="gold-line" style={{ marginBottom:28 }}/>
        <div className="footer-bottom-row" style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:14 }}>
          <div style={{ fontFamily:"Jost,sans-serif", fontSize:"0.7rem", color:T.textMuted, letterSpacing:"0.06em", fontWeight:300 }}>
            © {new Date().getFullYear()} Rudhra Estates & Constructions. All rights reserved.
          </div>
          <div className="footer-legal-links" style={{ display:"flex", gap:24 }}>
            {["Privacy","Terms","Cookies"].map((l: string) => (
              <a key={l} href="#" className="foot-link" style={{ fontSize:"0.7rem", padding:0 }}>{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

/* ─── ROOT ───────────────────────────────────────────────── */
export default function LuxuryEstate(): JSX.Element {
  useReveal();
  return (
    <>
      <GlobalStyles/>
      <Navbar/>
      <Hero/>
      <MarqueeStrip/>
      <StatsStrip/>
      <Properties/>
      <Services/>
      <Blueprint/>
      <SkylineMap/>
      <MaterialsLibrary/>
      <Awards/>
      <Process/>
      <MediaSection/>
      <Testimonials/>
      <Contact/>
      <Footer/>
    </>
  );
}

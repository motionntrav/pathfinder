import { useState, useEffect, useRef } from "react";

// ─────────────────────────────────────────────
//  CUSTOM SVG ICON LIBRARY
//  All icons hand-crafted for PathFinder's
//  night-sky / North Star aesthetic
// ─────────────────────────────────────────────
const Icon = {
  // Spinning north star / logo mark
  NorthStar: ({ size = 20, className = "", style = {} }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={style}>
      <path d="M12 2 L13.5 10.5 L22 12 L13.5 13.5 L12 22 L10.5 13.5 L2 12 L10.5 10.5 Z" fill="currentColor" opacity="0.9"/>
      <path d="M12 5 L12.8 10.8 L18 12 L12.8 13.2 L12 19 L11.2 13.2 L6 12 L11.2 10.8 Z" fill="currentColor"/>
    </svg>
  ),

  // Graduation cap — high school grad
  GradCap: ({ size = 20, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 22 8 12 14 2 8"/>
      <path d="M6 10.5V17c0 1.5 2.7 3 6 3s6-1.5 6-3v-6.5"/>
      <line x1="22" y1="8" x2="22" y2="14"/>
    </svg>
  ),

  // Rocket — small business / growth
  Rocket: ({ size = 20, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C12 2 7 6 7 13l2 2 3-1 3 1 2-2c0-7-5-11-5-11z"/>
      <path d="M7 13l-3 3 1 3 3-1"/>
      <path d="M17 13l3 3-1 3-3-1"/>
      <circle cx="12" cy="11" r="1.5" fill={color} stroke="none"/>
    </svg>
  ),

  // Globe / compass — traveler
  Globe: ({ size = 20, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/>
      <path d="M12 3c-2.5 3-4 5.5-4 9s1.5 6 4 9"/>
      <path d="M12 3c2.5 3 4 5.5 4 9s-1.5 6-4 9"/>
      <line x1="3" y1="12" x2="21" y2="12"/>
      <line x1="4" y1="8" x2="20" y2="8"/>
      <line x1="4" y1="16" x2="20" y2="16"/>
    </svg>
  ),

  // Dumbbell — fitness
  Dumbbell: ({ size = 20, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="10" width="3" height="4" rx="1"/>
      <rect x="5" y="8" width="2.5" height="8" rx="1"/>
      <line x1="7.5" y1="12" x2="16.5" y2="12"/>
      <rect x="16.5" y="8" width="2.5" height="8" rx="1"/>
      <rect x="19" y="10" width="3" height="4" rx="1"/>
    </svg>
  ),

  // Stethoscope — nursing / medical
  Stethoscope: ({ size = 20, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"/>
      <line x1="9" y1="3" x2="9" y2="6"/>
      <line x1="15" y1="3" x2="15" y2="6"/>
      <path d="M18 16a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" fill={color} stroke="none" opacity="0.3"/>
      <path d="M18 14v2"/>
    </svg>
  ),

  // Compass — custom / my own path
  Compass: ({ size = 20, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/>
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88" fill={color} opacity="0.25" stroke={color} strokeWidth="1.4"/>
      <circle cx="12" cy="12" r="1.2" fill={color} stroke="none"/>
    </svg>
  ),

  // Chat bubble — tab icon
  Chat: ({ size = 16, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),

  // Map / scroll — roadmap tab
  Map: ({ size = 16, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
      <line x1="9" y1="3" x2="9" y2="18"/>
      <line x1="15" y1="6" x2="15" y2="21"/>
    </svg>
  ),

  // Send arrow
  Send: ({ size = 18, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"/>
      <polygon points="22 2 15 22 11 13 2 9"/>
    </svg>
  ),

  // User silhouette — user avatar
  User: ({ size = 16, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),

  // Lock — paywall / pro
  Lock: ({ size = 20, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  ),

  // Lightning bolt — upgrade / pro
  Lightning: ({ size = 16, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill={color} opacity="0.2"/>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),

  // Check — step completed
  Check: ({ size = 10, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),

  // Arrow right — CTA
  ArrowRight: ({ size = 14, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/>
      <polyline points="12 5 19 12 12 19"/>
    </svg>
  ),

  // Star / sparkle — best value badge
  Sparkle: ({ size = 14, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none">
      <path d="M12 2 L13.2 9.8 L21 12 L13.2 14.2 L12 22 L10.8 14.2 L3 12 L10.8 9.8 Z" opacity="0.9"/>
    </svg>
  ),

  // Path / route — roadmap section icon
  Path: ({ size = 28, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" opacity="0.3">
      <circle cx="5" cy="19" r="3"/>
      <circle cx="19" cy="5" r="3"/>
      <path d="M5 16V9a7 7 0 0 1 7-7"/>
      <path d="M19 8v7a7 7 0 0 1-7 7"/>
    </svg>
  ),

  // Spinner (animated)
  Spinner: ({ size = 16, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"
      style={{ animation: "spin-fast 0.7s linear infinite" }}>
      <circle cx="12" cy="12" r="9" opacity="0.2" stroke={color}/>
      <path d="M12 3a9 9 0 0 1 9 9"/>
    </svg>
  ),
};

// Map persona id → icon component
const PersonaIcon = ({ id, size = 20, color = "currentColor" }) => {
  switch (id) {
    case "highschool": return <Icon.GradCap size={size} color={color} />;
    case "business":   return <Icon.Rocket size={size} color={color} />;
    case "traveler":   return <Icon.Globe size={size} color={color} />;
    case "fitness":    return <Icon.Dumbbell size={size} color={color} />;
    case "student":    return <Icon.Stethoscope size={size} color={color} />;
    case "custom":     return <Icon.Compass size={size} color={color} />;
    default:           return <Icon.NorthStar size={size} />;
  }
};

// ─────────────────────────────────────────────
//  STYLES
// ─────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --night: #05060f;
    --gold: #f2c94c;
    --gold-dim: #c9a83c;
    --gold-pale: rgba(242,201,76,0.1);
    --star: #e8f0ff;
    --muted: #6b7280;
    --card: rgba(255,255,255,0.04);
    --card-hover: rgba(255,255,255,0.07);
    --border: rgba(255,255,255,0.08);
    --border-gold: rgba(242,201,76,0.3);
  }

  html, body { height: 100%; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--night);
    color: var(--star);
    min-height: 100vh;
    overflow-x: hidden;
  }

  #starfield {
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background: radial-gradient(ellipse at 60% 10%, #1a1040 0%, #05060f 65%);
  }
  .star {
    position: absolute; border-radius: 50%; background: white;
    animation: twinkle var(--d, 3s) ease-in-out infinite;
    opacity: var(--o, 0.6);
  }
  @keyframes twinkle {
    0%,100% { opacity: var(--o,.6); transform: scale(1); }
    50% { opacity: 0.08; transform: scale(0.5); }
  }

  .app-shell { position: relative; z-index: 1; display: flex; flex-direction: column; height: 100vh; overflow: hidden; }

  /* TOPBAR */
  .topbar {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 2rem; height: 62px; flex-shrink: 0;
    background: rgba(5,6,15,0.85);
    border-bottom: 1px solid var(--border);
    backdrop-filter: blur(20px);
  }
  .logo {
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem; font-weight: 700; color: var(--gold);
    display: flex; align-items: center; gap: 0.55rem; letter-spacing: 0.04em;
  }
  .logo-star-wrap {
    animation: spin-slow 25s linear infinite; display: flex; align-items: center; justify-content: center;
  }
  @keyframes spin-slow { to { transform: rotate(360deg); } }
  @keyframes spin-fast { to { transform: rotate(360deg); } }

  .topbar-right { display: flex; align-items: center; gap: 1rem; }
  .badge { font-size: 0.68rem; font-weight: 600; letter-spacing: 0.12em; padding: 0.2rem 0.65rem; border-radius: 999px; text-transform: uppercase; }
  .badge-free { background: rgba(242,201,76,0.12); color: var(--gold); border: 1px solid var(--border-gold); }
  .badge-pro { background: var(--gold); color: var(--night); }
  .upgrade-btn {
    background: var(--gold); color: var(--night); border: none; padding: 0.5rem 1.1rem;
    font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 0.8rem;
    cursor: pointer; border-radius: 4px; transition: all 0.2s;
    display: flex; align-items: center; gap: 0.4rem;
  }
  .upgrade-btn:hover { background: var(--gold-dim); transform: translateY(-1px); box-shadow: 0 4px 20px rgba(242,201,76,0.3); }

  /* TABNAV */
  .tabnav {
    display: flex; padding: 0 2rem; flex-shrink: 0;
    background: rgba(5,6,15,0.7); border-bottom: 1px solid var(--border); backdrop-filter: blur(20px);
  }
  .tab {
    padding: 0.85rem 1.5rem; cursor: pointer;
    font-size: 0.85rem; font-weight: 500; color: var(--muted);
    border-bottom: 2px solid transparent; margin-bottom: -1px;
    transition: all 0.2s; background: none;
    border-top: none; border-left: none; border-right: none;
    font-family: 'DM Sans', sans-serif;
    display: flex; align-items: center; gap: 0.5rem;
  }
  .tab:hover { color: var(--star); }
  .tab.active { color: var(--gold); border-bottom-color: var(--gold); }
  .tab.active svg { opacity: 1; }
  .tab svg { opacity: 0.5; transition: opacity 0.2s; }
  .tab:hover svg { opacity: 0.8; }

  /* MAIN */
  .main { flex: 1; display: flex; overflow: hidden; }

  /* SIDEBAR */
  .sidebar {
    width: 252px; flex-shrink: 0;
    background: rgba(5,6,15,0.6); border-right: 1px solid var(--border);
    backdrop-filter: blur(20px); display: flex; flex-direction: column;
    overflow-y: auto; padding: 1.25rem 0.85rem; gap: 0.25rem;
  }
  .sidebar-label { font-size: 0.68rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: var(--muted); margin-bottom: 0.4rem; padding: 0 0.4rem; }
  .persona-btn {
    display: flex; align-items: center; gap: 0.75rem;
    padding: 0.65rem 0.75rem; border-radius: 8px; cursor: pointer;
    transition: all 0.18s; border: 1px solid transparent;
    background: none; width: 100%; text-align: left; font-family: 'DM Sans', sans-serif;
  }
  .persona-btn:hover { background: var(--card-hover); border-color: var(--border); }
  .persona-btn.active { background: var(--gold-pale); border-color: var(--border-gold); }
  .persona-icon-wrap {
    width: 34px; height: 34px; border-radius: 8px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    background: var(--card); border: 1px solid var(--border);
    transition: all 0.18s;
  }
  .persona-btn.active .persona-icon-wrap { background: var(--gold-pale); border-color: var(--border-gold); }
  .persona-btn.active .persona-icon-wrap svg { color: var(--gold); stroke: var(--gold); }
  .persona-text h4 { font-size: 0.8rem; font-weight: 600; color: var(--star); }
  .persona-text p { font-size: 0.7rem; color: var(--muted); margin-top: 0.1rem; line-height: 1.3; }
  .sidebar-divider { height: 1px; background: var(--border); margin: 0.75rem 0; flex-shrink: 0; }
  .msg-counter { background: var(--card); border: 1px solid var(--border); border-radius: 8px; padding: 0.85rem 0.9rem; margin-top: auto; flex-shrink: 0; }
  .msg-counter-label { color: var(--muted); font-size: 0.72rem; margin-bottom: 0.4rem; }
  .counter-bar { height: 3px; background: var(--border); border-radius: 2px; overflow: hidden; margin-bottom: 0.45rem; }
  .counter-fill { height: 100%; border-radius: 2px; background: var(--gold); transition: width 0.5s ease; }
  .counter-fill.warn { background: #ef4444; }
  .counter-nums { display: flex; justify-content: space-between; font-size: 0.7rem; color: var(--muted); }

  /* CHAT PANEL */
  .chat-panel { flex: 1; display: flex; flex-direction: column; min-width: 0; overflow: hidden; }
  .chat-persona-header {
    display: flex; align-items: center; gap: 0.75rem;
    padding: 0.9rem 1.5rem; flex-shrink: 0;
    background: rgba(5,6,15,0.5); border-bottom: 1px solid var(--border); backdrop-filter: blur(10px);
  }
  .persona-avatar-lg {
    width: 40px; height: 40px; border-radius: 10px;
    background: rgba(255,255,255,0.06);
    border: 1px solid var(--border-gold);
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .persona-header-info h3 { font-size: 0.88rem; font-weight: 600; }
  .persona-header-info p { font-size: 0.72rem; color: var(--muted); }
  .online-indicator { margin-left: auto; display: flex; align-items: center; gap: 0.4rem; font-size: 0.7rem; color: #4ade80; }
  .online-dot { width: 7px; height: 7px; border-radius: 50%; background: #4ade80; box-shadow: 0 0 8px #4ade80; animation: pulse-dot 2s ease-in-out infinite; }
  @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.8)} }

  .messages-area { flex: 1; overflow-y: auto; padding: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem; }
  .messages-area::-webkit-scrollbar { width: 4px; }
  .messages-area::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

  .msg-row { display: flex; gap: 0.65rem; align-items: flex-start; animation: rise 0.35s ease; }
  @keyframes rise { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  .msg-row.user { flex-direction: row-reverse; }
  .msg-av {
    width: 32px; height: 32px; border-radius: 8px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    border: 1px solid var(--border);
  }
  .msg-av.ai {
    background: linear-gradient(135deg, rgba(242,201,76,0.25), rgba(167,139,250,0.25));
    border-color: var(--border-gold);
  }
  .msg-av.user { background: rgba(255,255,255,0.06); }
  .bubble { max-width: 74%; padding: 0.85rem 1.1rem; font-size: 0.88rem; line-height: 1.7; }
  .msg-row.ai .bubble { background: rgba(255,255,255,0.05); border: 1px solid var(--border); border-radius: 2px 12px 12px 12px; backdrop-filter: blur(8px); box-shadow: 0 2px 12px rgba(0,0,0,0.3); }
  .msg-row.user .bubble { background: rgba(242,201,76,0.12); border: 1px solid var(--border-gold); border-radius: 12px 2px 12px 12px; }

  .typing-indicator { display: flex; gap: 5px; padding: 4px 2px; }
  .typing-indicator span { width: 7px; height: 7px; border-radius: 50%; background: var(--muted); animation: bounce-dot 1.3s infinite; }
  .typing-indicator span:nth-child(2){animation-delay:.15s}
  .typing-indicator span:nth-child(3){animation-delay:.3s}
  @keyframes bounce-dot { 0%,100%{transform:translateY(0);opacity:.4} 50%{transform:translateY(-7px);opacity:1} }

  .chips-row { display: flex; flex-wrap: wrap; gap: 0.45rem; padding: 0 1.5rem 0.75rem; flex-shrink: 0; }
  .chip { background: var(--card); border: 1px solid var(--border); border-radius: 999px; padding: 0.3rem 0.85rem; font-size: 0.77rem; color: rgba(255,255,255,0.65); cursor: pointer; transition: all 0.18s; font-family: 'DM Sans', sans-serif; font-weight: 500; }
  .chip:hover { border-color: var(--gold); color: var(--gold); background: var(--gold-pale); }

  .roadmap-ready-banner { margin: 0 1.5rem 0.75rem; background: rgba(242,201,76,0.08); border: 1px solid var(--border-gold); border-radius: 8px; padding: 0.65rem 1rem; font-size: 0.82rem; display: flex; align-items: center; gap: 0.6rem; cursor: pointer; transition: background 0.2s; flex-shrink: 0; }
  .roadmap-ready-banner:hover { background: rgba(242,201,76,0.14); }
  .roadmap-ready-banner strong { color: var(--gold); }
  .roadmap-ready-banner .rr-arrow { margin-left: auto; opacity: 0.6; }

  .input-area { display: flex; gap: 0.75rem; align-items: flex-end; padding: 1rem 1.5rem; background: rgba(5,6,15,0.7); border-top: 1px solid var(--border); backdrop-filter: blur(20px); flex-shrink: 0; }
  .chat-textarea { flex: 1; background: rgba(255,255,255,0.05); border: 1px solid var(--border); border-radius: 10px; padding: 0.75rem 1rem; font-family: 'DM Sans', sans-serif; font-size: 0.88rem; color: var(--star); outline: none; resize: none; transition: border-color 0.2s; line-height: 1.5; }
  .chat-textarea:focus { border-color: var(--border-gold); }
  .chat-textarea::placeholder { color: var(--muted); }
  .send-btn { background: var(--gold); color: var(--night); border: none; width: 42px; height: 42px; border-radius: 10px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .send-btn:hover:not(:disabled) { background: var(--gold-dim); transform: scale(1.06); box-shadow: 0 4px 20px rgba(242,201,76,0.3); }
  .send-btn:disabled { opacity: 0.3; cursor: not-allowed; }

  /* ROADMAP */
  .roadmap-panel { flex: 1; overflow-y: auto; padding: 2rem; }
  .roadmap-panel::-webkit-scrollbar { width: 4px; }
  .roadmap-panel::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

  .roadmap-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; text-align: center; color: var(--muted); gap: 1rem; padding: 3rem; }
  .roadmap-empty-icon { animation: float 4s ease-in-out infinite; }
  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
  .roadmap-empty h3 { font-family: 'Playfair Display', serif; font-size: 1.6rem; color: var(--star); }
  .roadmap-empty p { font-size: 0.88rem; max-width: 320px; line-height: 1.65; }
  .start-chat-btn { margin-top: 0.5rem; background: var(--gold); color: var(--night); border: none; padding: 0.75rem 1.5rem; border-radius: 6px; font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 0.88rem; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 0.5rem; }
  .start-chat-btn:hover { background: var(--gold-dim); transform: translateY(-2px); }

  .roadmap-header { margin-bottom: 2rem; }
  .roadmap-header h2 { font-family: 'Playfair Display', serif; font-size: 2rem; font-weight: 700; margin-bottom: 0.4rem; background: linear-gradient(135deg, var(--star) 0%, var(--gold) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .roadmap-header p { color: var(--muted); font-size: 0.875rem; }

  .roadmap-phase { margin-bottom: 2.5rem; }
  .phase-label { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem; }
  .phase-num { width: 28px; height: 28px; border-radius: 50%; background: linear-gradient(135deg, var(--gold), #f2994a); color: var(--night); font-weight: 700; font-size: 0.82rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .phase-title { font-weight: 600; font-size: 0.95rem; }
  .phase-timeline { font-size: 0.7rem; color: var(--muted); background: var(--card); border: 1px solid var(--border); border-radius: 999px; padding: 0.1rem 0.6rem; margin-left: auto; }
  .phase-steps { display: flex; flex-direction: column; gap: 0.65rem; padding-left: 2rem; border-left: 1px solid var(--border); margin-left: 13px; }

  .step-card { background: var(--card); border: 1px solid var(--border); border-radius: 10px; padding: 0.9rem 1rem; display: flex; gap: 0.85rem; align-items: flex-start; transition: all 0.2s; }
  .step-card:hover { background: var(--card-hover); border-color: rgba(255,255,255,0.12); box-shadow: 0 4px 20px rgba(0,0,0,0.3); }
  .step-check { width: 20px; height: 20px; border-radius: 50%; border: 1.5px solid var(--border); flex-shrink: 0; cursor: pointer; transition: all 0.2s; margin-top: 1px; display: flex; align-items: center; justify-content: center; }
  .step-check:hover { border-color: var(--gold); background: var(--gold-pale); }
  .step-check.done { background: var(--gold); border-color: var(--gold); }
  .step-content h4 { font-size: 0.85rem; font-weight: 600; margin-bottom: 0.25rem; }
  .step-content p { font-size: 0.78rem; color: var(--muted); line-height: 1.55; }
  .step-tag { font-size: 0.65rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--gold); background: var(--gold-pale); border: 1px solid var(--border-gold); border-radius: 4px; padding: 0.1rem 0.4rem; margin-top: 0.4rem; display: inline-block; }

  .roadmap-upsell { background: var(--card); border: 1px solid var(--border-gold); border-radius: 12px; padding: 1.5rem; text-align: center; margin-top: 1rem; }
  .roadmap-upsell-icon { margin: 0 auto 0.75rem; display: flex; justify-content: center; }
  .roadmap-upsell p { font-family: 'Playfair Display', serif; font-style: italic; font-size: 1.1rem; margin-bottom: 0.5rem; }
  .roadmap-upsell small { color: var(--muted); font-size: 0.8rem; display: block; margin-bottom: 1rem; line-height: 1.5; }

  /* GEN BANNER */
  .gen-banner { display: flex; align-items: center; gap: 0.75rem; background: rgba(242,201,76,0.08); border: 1px solid var(--border-gold); border-radius: 8px; padding: 0.85rem 1.1rem; margin-bottom: 1.5rem; font-size: 0.85rem; animation: rise 0.3s ease; }

  /* PAYWALL */
  .overlay { position: fixed; inset: 0; background: rgba(5,6,15,0.88); z-index: 500; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px); }
  .paywall-modal { background: #0d0f22; border: 1px solid var(--border-gold); border-radius: 16px; padding: 2.5rem; max-width: 460px; width: 90%; text-align: center; box-shadow: 0 0 80px rgba(242,201,76,0.12); animation: pop-in 0.3s cubic-bezier(0.34,1.56,0.64,1); }
  @keyframes pop-in { from{opacity:0;transform:scale(0.88)} to{opacity:1;transform:scale(1)} }
  .paywall-icon-wrap { margin: 0 auto 1.25rem; width: 56px; height: 56px; border-radius: 14px; background: var(--gold-pale); border: 1px solid var(--border-gold); display: flex; align-items: center; justify-content: center; animation: float 3s ease-in-out infinite; }
  .paywall-modal h2 { font-family: 'Playfair Display', serif; font-size: 1.9rem; margin-bottom: 0.5rem; }
  .paywall-modal > p { color: var(--muted); font-size: 0.88rem; line-height: 1.65; margin-bottom: 1.75rem; }
  .plan-cards { display: flex; gap: 1rem; margin-bottom: 1.5rem; }
  .plan-card { flex: 1; border: 1px solid var(--border); border-radius: 10px; padding: 1.2rem 1rem; text-align: center; cursor: pointer; transition: all 0.2s; background: var(--card); }
  .plan-card:hover { border-color: var(--border-gold); }
  .plan-card.featured { border-color: var(--gold); background: rgba(242,201,76,0.07); }
  .plan-best { font-size: 0.62rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--gold); margin-bottom: 0.3rem; display: flex; align-items: center; justify-content: center; gap: 0.3rem; }
  .plan-card h3 { font-size: 0.82rem; font-weight: 600; margin-bottom: 0.3rem; }
  .plan-price { font-family: 'Playfair Display', serif; font-size: 2rem; font-weight: 700; color: var(--gold); }
  .plan-price span { font-size: 0.78rem; font-family: 'DM Sans', sans-serif; color: var(--muted); }
  .plan-features { font-size: 0.72rem; color: var(--muted); margin-top: 0.5rem; line-height: 1.6; }
  .cta-upgrade { background: var(--gold); color: var(--night); border: none; width: 100%; padding: 0.9rem; font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 0.95rem; border-radius: 8px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
  .cta-upgrade:hover { background: var(--gold-dim); transform: translateY(-1px); box-shadow: 0 6px 24px rgba(242,201,76,0.3); }
  .paywall-skip { margin-top: 0.85rem; font-size: 0.78rem; color: var(--muted); cursor: pointer; }
  .paywall-skip:hover { color: var(--star); }

  @media (max-width: 700px) { .sidebar { display: none; } .plan-cards { flex-direction: column; } }
`;

// ─────────────────────────────────────────────
//  CONSTANTS
// ─────────────────────────────────────────────
const FREE_LIMIT = 3;

const PERSONAS = [
  { id: "highschool", label: "High School Grad",     sub: "Alternative paths beyond college" },
  { id: "business",   label: "Small Business Owner", sub: "Leads, growth & systems" },
  { id: "traveler",   label: "World Traveler",        sub: "Remote income & adventure" },
  { id: "fitness",    label: "Fitness Journey",       sub: "Build muscle & transform" },
  { id: "student",    label: "Nursing Student",       sub: "Pass exams, launch career" },
  { id: "custom",     label: "My Own Path",           sub: "Something unique to me" },
];

const OPENER = {
  highschool: "Hey! You just crossed one of life's big finish lines — now you're standing at a crossroads with the whole world ahead of you. That's exciting, not scary. I'm here to help you find YOUR path, not the default one society hands you.\n\nSo tell me: when you picture yourself 5 years from now, living a life that actually feels like yours — what does a normal Tuesday look like?",
  business:   "Welcome! Running your own business takes real courage, and the fact that you're looking to grow tells me you're already thinking like a strategist.\n\nLet's cut straight to it — describe your business: what do you do, who do you serve, and what's your single biggest bottleneck right now?",
  traveler:   "The world is massive and life is short — I love this goal. Full-time travel isn't just a dream; it's an engineering problem. And we're going to solve it together.\n\nFirst question: do you currently have income that could work remotely, or are we building that piece from scratch?",
  fitness:    "Let's build something real. Fitness transformation is part science, part psychology — and I'll guide you through both.\n\nBefore we map your plan, tell me honestly: how old are you, what's your current activity level, and what does your goal actually look like to you?",
  student:    "Nursing school is genuinely hard, and you're doing something that truly matters. Let's make sure you come out the other side confident and credentialed.\n\nTell me: are you preparing for NCLEX, struggling with specific coursework, or trying to manage the overall pressure of the program?",
  custom:     "I love this — you're not putting yourself in a box, and that's exactly the right instinct. PathFinder works for any goal, any dream, any life situation.\n\nSo tell me: what's the thing you want most right now? Don't filter it. Just say it out loud.",
};

const CHIPS = {
  highschool: ["I want to start a business", "I want to travel the world", "I want to learn a trade", "I have no idea what I want"],
  business:   ["I need more local leads", "Build my online presence", "Automate my operations", "Hire my first employee"],
  traveler:   ["I have a remote job already", "I need remote income first", "How much money do I need?", "Best starter countries?"],
  fitness:    ["I'm a complete beginner", "I've been training but stuck", "What should I eat?", "Build me a workout plan"],
  student:    ["NCLEX prep help", "Struggling with pharmacology", "I need a study schedule", "Managing stress & burnout"],
  custom:     ["Find my purpose", "Change careers", "Build financial freedom", "Improve my life overall"],
};

const SYSTEM_PROMPT = (persona) => `You are PathFinder — a warm, direct, deeply insightful life navigator and mentor. Your philosophy: "Follow Your North Star." You help people discover and walk their personal path.

Current user persona: ${persona}

Your approach:
- Ask powerful, specific questions to understand the person's situation, desires, and obstacles
- Give concrete, actionable advice — never vague platitudes  
- Be encouraging but honest; don't sugarcoat hard truths
- Speak like a trusted mentor who genuinely cares, not a chatbot
- Use conversational language, short paragraphs

After 3-5 meaningful exchanges where you understand the person's specific goal well, include this block at the END of one response (only once per conversation):

---ROADMAP---
{
  "title": "Your Path to [Specific Goal]",
  "subtitle": "A personalized roadmap based on your conversation",
  "phases": [
    {
      "title": "Phase Name",
      "timeline": "Weeks 1-4",
      "steps": [
        { "title": "Specific action step", "detail": "Why this matters and exactly how to do it", "tag": "Action" },
        { "title": "Another step", "detail": "Explanation here", "tag": "Mindset" }
      ]
    }
  ]
}
---END---

Valid tags: Action, Mindset, Resource, Skill, Habit, Financial, Health, Network
Keep responses concise (2-4 short paragraphs). Be the mentor they never had.`;

async function callClaude(messages, persona) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: SYSTEM_PROMPT(persona),
      messages,
    }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.content?.[0]?.text || "Something went wrong. Please try again.";
}

function parseRoadmap(text) {
  const m = text.match(/---ROADMAP---\s*([\s\S]*?)---END---/);
  if (!m) return null;
  try { return JSON.parse(m[1].trim()); } catch { return null; }
}
function stripRoadmap(text) {
  return text.replace(/---ROADMAP---[\s\S]*?---END---/g, "").trim();
}

// ─────────────────────────────────────────────
//  STARFIELD
// ─────────────────────────────────────────────
function Starfield() {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < 200; i++) {
      const s = document.createElement("div");
      s.className = "star";
      const size = Math.random() * 2.5 + 0.4;
      s.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*100}%;width:${size}px;height:${size}px;--o:${(Math.random()*.7+.1).toFixed(2)};--d:${(Math.random()*4+2).toFixed(1)}s;animation-delay:${(Math.random()*6).toFixed(1)}s;`;
      frag.appendChild(s);
    }
    ref.current.appendChild(frag);
  }, []);
  return <div id="starfield" ref={ref} />;
}

// ─────────────────────────────────────────────
//  APP
// ─────────────────────────────────────────────
export default function PathFinderApp() {
  const [activeTab,    setActiveTab]    = useState("chat");
  const [persona,      setPersona]      = useState("highschool");
  const [messages,     setMessages]     = useState([]);
  const [input,        setInput]        = useState("");
  const [loading,      setLoading]      = useState(false);
  const [msgCount,     setMsgCount]     = useState(0);
  const [isPro,        setIsPro]        = useState(false);
  const [showPaywall,  setShowPaywall]  = useState(false);
  const [roadmap,      setRoadmap]      = useState(null);
  const [generatingRM, setGeneratingRM] = useState(false);
  const [checked,      setChecked]      = useState({});
  const endRef      = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    setMessages([{ role: "ai", content: OPENER[persona] }]);
    setRoadmap(null); setMsgCount(0); setChecked({});
  }, [persona]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const blocked = !isPro && msgCount >= FREE_LIMIT;

  const doSend = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    if (blocked) { setShowPaywall(true); return; }

    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    const userMsg = { role: "user", content: msg };
    const history = [...messages, userMsg];
    setMessages([...history, { role: "ai", content: null }]);
    setLoading(true);

    const apiMsgs = history.map(m => ({
      role: m.role === "ai" ? "assistant" : "user",
      content: m.content,
    }));

    try {
      const reply = await callClaude(apiMsgs, persona);
      const newRM = parseRoadmap(reply);
      const clean = stripRoadmap(reply);
      if (newRM) { setRoadmap(newRM); setGeneratingRM(true); setTimeout(() => setGeneratingRM(false), 2200); }
      setMessages([...history, { role: "ai", content: clean }]);
      setMsgCount(c => c + 1);
    } catch (err) {
      setMessages([...history, { role: "ai", content: `Error: ${err.message}` }]);
    } finally { setLoading(false); }
  };

  const handleKey = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); doSend(); } };
  const autoResize = (e) => { e.target.style.height = "auto"; e.target.style.height = Math.min(e.target.scrollHeight, 130) + "px"; };
  const toggleStep = (pi, si) => { const k = `${pi}-${si}`; setChecked(p => ({...p, [k]: !p[k]})); };

  const currentP = PERSONAS.find(p => p.id === persona);
  const pct = Math.min((msgCount / FREE_LIMIT) * 100, 100);

  return (
    <>
      <style>{css}</style>
      <Starfield />
      <div className="app-shell">

        {/* ── TOPBAR ── */}
        <header className="topbar">
          <div className="logo">
            <span className="logo-star-wrap">
              <Icon.NorthStar size={22} style={{ color: "var(--gold)" }} />
            </span>
            PathFinder
          </div>
          <div className="topbar-right">
            <span className={`badge ${isPro ? "badge-pro" : "badge-free"}`}>{isPro ? "Pro" : "Free"}</span>
            {!isPro && (
              <button className="upgrade-btn" onClick={() => setShowPaywall(true)}>
                <Icon.Lightning size={13} color="var(--night)" />
                Upgrade to Pro
              </button>
            )}
          </div>
        </header>

        {/* ── TABS ── */}
        <nav className="tabnav">
          <button className={`tab ${activeTab==="chat"?"active":""}`} onClick={() => setActiveTab("chat")}>
            <Icon.Chat size={15} color={activeTab==="chat" ? "var(--gold)" : "currentColor"} />
            Chat with PathFinder
          </button>
          <button className={`tab ${activeTab==="roadmap"?"active":""}`} onClick={() => setActiveTab("roadmap")}>
            <Icon.Map size={15} color={activeTab==="roadmap" ? "var(--gold)" : "currentColor"} />
            My Roadmap {roadmap && <Icon.NorthStar size={10} style={{ color:"var(--gold)", marginLeft:2 }} />}
          </button>
        </nav>

        <div className="main">

          {/* ── SIDEBAR ── */}
          <aside className="sidebar">
            <div className="sidebar-label">Your Situation</div>
            {PERSONAS.map(p => (
              <button key={p.id} className={`persona-btn ${persona===p.id?"active":""}`}
                onClick={() => { setPersona(p.id); setActiveTab("chat"); }}>
                <div className="persona-icon-wrap">
                  <PersonaIcon id={p.id} size={17} color={persona===p.id ? "var(--gold)" : "var(--muted)"} />
                </div>
                <div className="persona-text"><h4>{p.label}</h4><p>{p.sub}</p></div>
              </button>
            ))}
            <div className="sidebar-divider" />
            {!isPro && (
              <div className="msg-counter">
                <div className="msg-counter-label">Free messages used</div>
                <div className="counter-bar">
                  <div className={`counter-fill ${pct>=100?"warn":""}`} style={{ width: pct+"%" }} />
                </div>
                <div className="counter-nums">
                  <span>{msgCount} / {FREE_LIMIT}</span>
                  <span style={{ color: blocked?"#ef4444":"inherit" }}>
                    {blocked ? "Upgrade to continue" : `${FREE_LIMIT - msgCount} left`}
                  </span>
                </div>
              </div>
            )}
          </aside>

          {/* ── CHAT TAB ── */}
          {activeTab === "chat" && (
            <div className="chat-panel">
              <div className="chat-persona-header">
                <div className="persona-avatar-lg">
                  <PersonaIcon id={persona} size={20} color="var(--gold)" />
                </div>
                <div className="persona-header-info">
                  <h3>PathFinder — {currentP?.label}</h3>
                  <p>Your personal guide & North Star navigator</p>
                </div>
                <div className="online-indicator">
                  <div className="online-dot" /> Active
                </div>
              </div>

              <div className="messages-area">
                {messages.map((m, i) => (
                  <div key={i} className={`msg-row ${m.role}`}>
                    <div className={`msg-av ${m.role}`}>
                      {m.role === "ai"
                        ? <Icon.NorthStar size={15} style={{ color: "var(--gold)" }} />
                        : <Icon.User size={14} color="var(--muted)" />
                      }
                    </div>
                    <div className="bubble">
                      {m.content === null
                        ? <div className="typing-indicator"><span/><span/><span/></div>
                        : m.content.split("\n").map((ln, j, arr) => <span key={j}>{ln}{j<arr.length-1&&<br/>}</span>)
                      }
                    </div>
                  </div>
                ))}
                <div ref={endRef} />
              </div>

              {messages.length === 1 && (
                <div className="chips-row">
                  {CHIPS[persona]?.map(c => <button key={c} className="chip" onClick={() => doSend(c)}>{c}</button>)}
                </div>
              )}

              {roadmap && (
                <div className="roadmap-ready-banner" onClick={() => setActiveTab("roadmap")}>
                  <Icon.Map size={14} color="var(--gold)" />
                  <span><strong>Your roadmap is ready!</strong> Click to view your personalized path</span>
                  <span className="rr-arrow"><Icon.ArrowRight size={13} color="var(--gold)" /></span>
                </div>
              )}

              <div className="input-area">
                <textarea ref={textareaRef} className="chat-textarea"
                  placeholder={blocked ? "Upgrade to Pro to continue your journey..." : "Share your dream, goal, or struggle..."}
                  value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKey} onInput={autoResize} rows={1}
                  disabled={loading || blocked}
                />
                <button className="send-btn" onClick={() => doSend()} disabled={!input.trim() || loading || blocked}>
                  <Icon.Send size={17} color="var(--night)" />
                </button>
              </div>
            </div>
          )}

          {/* ── ROADMAP TAB ── */}
          {activeTab === "roadmap" && (
            <div className="roadmap-panel">
              {generatingRM && (
                <div className="gen-banner">
                  <Icon.Spinner size={16} color="var(--gold)" />
                  PathFinder is building your personalized roadmap...
                </div>
              )}

              {!roadmap && !generatingRM && (
                <div className="roadmap-empty">
                  <div className="roadmap-empty-icon">
                    <Icon.Path size={72} color="var(--star)" />
                  </div>
                  <h3>Your roadmap will appear here</h3>
                  <p>Chat with PathFinder first. After a few meaningful exchanges, your personalized step-by-step plan generates automatically.</p>
                  <button className="start-chat-btn" onClick={() => setActiveTab("chat")}>
                    Start chatting <Icon.ArrowRight size={14} color="var(--night)" />
                  </button>
                </div>
              )}

              {roadmap && !generatingRM && (
                <>
                  <div className="roadmap-header">
                    <h2>{roadmap.title}</h2>
                    <p>{roadmap.subtitle}</p>
                  </div>

                  {roadmap.phases?.map((phase, pi) => (
                    <div className="roadmap-phase" key={pi}>
                      <div className="phase-label">
                        <div className="phase-num">{pi+1}</div>
                        <span className="phase-title">{phase.title}</span>
                        {phase.timeline && <span className="phase-timeline">{phase.timeline}</span>}
                      </div>
                      <div className="phase-steps">
                        {phase.steps?.map((step, si) => {
                          const k = `${pi}-${si}`, done = checked[k];
                          return (
                            <div className="step-card" key={si} style={{ opacity: done ? 0.5 : 1 }}>
                              <div className={`step-check ${done?"done":""}`} onClick={() => toggleStep(pi, si)}>
                                {done && <Icon.Check size={10} color="var(--night)" />}
                              </div>
                              <div className="step-content">
                                <h4 style={{ textDecoration: done?"line-through":"none" }}>{step.title}</h4>
                                <p>{step.detail}</p>
                                {step.tag && <span className="step-tag">{step.tag}</span>}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  {!isPro && (
                    <div className="roadmap-upsell">
                      <div className="roadmap-upsell-icon">
                        <Icon.Lock size={22} color="var(--gold)" />
                      </div>
                      <p>Want deeper guidance & weekly check-ins?</p>
                      <small>Pro members get unlimited chat, milestone tracking, and roadmap refinements as their goals evolve.</small>
                      <button className="cta-upgrade" style={{ maxWidth:280, margin:"0 auto", borderRadius:8, padding:"0.75rem", fontSize:"0.88rem" }}
                        onClick={() => setShowPaywall(true)}>
                        <Icon.Lightning size={14} color="var(--night)" />
                        Unlock Pro Features
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── PAYWALL ── */}
      {showPaywall && (
        <div className="overlay" onClick={e => e.target===e.currentTarget && setShowPaywall(false)}>
          <div className="paywall-modal">
            <div className="paywall-icon-wrap">
              <Icon.NorthStar size={26} style={{ color: "var(--gold)" }} />
            </div>
            <h2>Unlock Your Full Path</h2>
            <p>You've reached your free message limit. Upgrade to keep the momentum going — your North Star isn't going anywhere, but your window to act is now.</p>
            <div className="plan-cards">
              <div className="plan-card">
                <h3>Monthly</h3>
                <div className="plan-price">$12<span>/mo</span></div>
                <div className="plan-features">Unlimited chat<br/>Roadmap generation<br/>Progress tracking</div>
              </div>
              <div className="plan-card featured">
                <div className="plan-best">
                  <Icon.Sparkle size={10} color="var(--gold)" /> Best Value
                </div>
                <h3>Annual</h3>
                <div className="plan-price">$79<span>/yr</span></div>
                <div className="plan-features">Everything in Monthly<br/>Priority responses<br/>Milestone check-ins<br/>Save 45%</div>
              </div>
            </div>
            <button className="cta-upgrade" onClick={() => { setIsPro(true); setShowPaywall(false); }}>
              <Icon.Lightning size={15} color="var(--night)" />
              Start Pro — Unlock Everything
            </button>
            <div className="paywall-skip" onClick={() => setShowPaywall(false)}>Maybe later (stay on free)</div>
          </div>
        </div>
      )}
    </>
  );
}

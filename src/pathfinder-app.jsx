import { useState, useEffect, useRef, useCallback } from "react";

// ─────────────────────────────────────────────────────────────
//  ICON LIBRARY
// ─────────────────────────────────────────────────────────────
const I = {
  Star: ({ s = 20, style = {} }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" style={style}><path d="M12 2L13.6 10.4L22 12L13.6 13.6L12 22L10.4 13.6L2 12L10.4 10.4Z" fill="currentColor" opacity=".85" /><path d="M12 5.5L12.8 10.9L17.5 12L12.8 13.1L12 18.5L11.2 13.1L6.5 12L11.2 10.9Z" fill="currentColor" /></svg>,
  Flame: ({ s = 16, c = "currentColor" }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A5 5 0 0 0 17 12c0-5-7-9-7-9 0 4-3 5-3 8a5 5 0 0 0 1.5 3.5z" fill={c} opacity=".2" /><path d="M8.5 14.5A5 5 0 0 0 17 12c0-5-7-9-7-9 0 4-3 5-3 8a5 5 0 0 0 1.5 3.5z" /></svg>,
  Map: ({ s = 16, c = "currentColor" }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" /><line x1="9" y1="3" x2="9" y2="18" /><line x1="15" y1="6" x2="15" y2="21" /></svg>,
  Msg: ({ s = 16, c = "currentColor" }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>,
  Mirror: ({ s = 16, c = "currentColor" }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="10" rx="6" ry="8" /><path d="M9 18l-2 4" /><path d="M15 18l2 4" /><line x1="7" y1="22" x2="17" y2="22" /></svg>,
  Lightning: ({ s = 14, c = "currentColor" }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill={c} opacity=".2" /><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>,
  Check: ({ s = 11, c = "currentColor" }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>,
  Send: ({ s = 15, c = "currentColor" }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9" /></svg>,
  User: ({ s = 13, c = "currentColor" }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
  Arrow: ({ s = 13, c = "currentColor" }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>,
  Crystal: ({ s = 16, c = "currentColor" }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l4 4-4 16-4-16z" fill={c} opacity=".15" /><path d="M12 2l4 4-4 16-4-16z" /><path d="M8 6h8" /></svg>,
  Eye: ({ s = 14, c = "currentColor" }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>,
  Refresh: ({ s = 13, c = "currentColor" }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-4" /></svg>,
  Heart: ({ s = 14, c = "currentColor" }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill={c} opacity=".2" /><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>,
  GradCap: ({ s = 20, c = "currentColor" }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 22 8 12 14 2 8" /><path d="M6 10.5V17c0 1.5 2.7 3 6 3s6-1.5 6-3v-6.5" /></svg>,
  Rocket: ({ s = 20, c = "currentColor" }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C12 2 7 6 7 13l2 2 3-1 3 1 2-2c0-7-5-11-5-11z" /><path d="M7 13l-3 3 1 3 3-1" /><path d="M17 13l3 3-1 3-3-1" /></svg>,
  Globe: ({ s = 20, c = "currentColor" }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 3c-2.5 3-4 5.5-4 9s1.5 6 4 9" /><path d="M12 3c2.5 3 4 5.5 4 9s-1.5 6-4 9" /><line x1="3" y1="12" x2="21" y2="12" /></svg>,
  Dumbbell: ({ s = 20, c = "currentColor" }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="10" width="3" height="4" rx="1" /><rect x="5" y="8" width="2.5" height="8" rx="1" /><line x1="7.5" y1="12" x2="16.5" y2="12" /><rect x="16.5" y="8" width="2.5" height="8" rx="1" /><rect x="19" y="10" width="3" height="4" rx="1" /></svg>,
  Stethoscope: ({ s = 20, c = "currentColor" }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3v7a6 6 0 0 0 12 0V3" /><line x1="9" y1="3" x2="9" y2="6" /><line x1="15" y1="3" x2="15" y2="6" /></svg>,
  Compass: ({ s = 20, c = "currentColor" }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88" fill={c} opacity=".2" stroke={c} strokeWidth="1.4" /></svg>,
};

const PersonaIcon = ({ id, s = 20, c = "currentColor" }) => {
  const map = { highschool: I.GradCap, business: I.Rocket, traveler: I.Globe, fitness: I.Dumbbell, student: I.Stethoscope, custom: I.Compass };
  const C = map[id] || I.Compass; return <C s={s} c={c} />;
};

// ─────────────────────────────────────────────────────────────
//  STYLES
// ─────────────────────────────────────────────────────────────
const css = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --ink:#04050d;--deep:#090a18;
  --gold:#e8b84b;--gold2:#f5d06e;--gold-pale:rgba(232,184,75,.1);--gold-glow:rgba(232,184,75,.22);
  --violet:#9d7ff0;--vp:rgba(157,127,240,.12);
  --aqua:#5eead4;--aq-pale:rgba(94,234,212,.1);
  --rose:#f472b6;--rose-pale:rgba(244,114,182,.08);
  --star:#dde8ff;--dim:#3d4560;
  --card:rgba(255,255,255,.032);--card2:rgba(255,255,255,.052);--ch:rgba(255,255,255,.06);
  --line:rgba(255,255,255,.065);--line-gold:rgba(232,184,75,.22);
}
html,body{height:100%}
body{font-family:'DM Sans',sans-serif;background:var(--ink);color:var(--star);overflow:hidden}

/* ── STARFIELD ── */
#sf{position:fixed;inset:0;z-index:0;pointer-events:none;background:radial-gradient(ellipse at 52% 6%,#160e35 0%,#04050d 58%)}
.s{position:absolute;border-radius:50%;background:#fff;animation:tw var(--d,3s) ease-in-out infinite;opacity:var(--o,.5)}
@keyframes tw{0%,100%{opacity:var(--o);transform:scale(1)}50%{opacity:.05;transform:scale(.35)}}

/* ── ONBOARDING ── */
.ob{position:fixed;inset:0;z-index:100;display:flex;align-items:center;justify-content:center;padding:2rem;transition:opacity .9s ease}
.ob.bye{opacity:0;pointer-events:none}
.ob-step{width:100%;max-width:660px;display:flex;flex-direction:column;align-items:center;text-align:center;animation:up .7s cubic-bezier(.22,1,.36,1) both}
@keyframes up{from{opacity:0;transform:translateY(26px)}to{opacity:1;transform:translateY(0)}}
.ob-step.out{animation:dn .35s ease forwards}
@keyframes dn{to{opacity:0;transform:translateY(-18px)}}

.ob-dots{position:fixed;top:1.8rem;left:50%;transform:translateX(-50%);display:flex;gap:.4rem;z-index:110}
.od{width:6px;height:6px;border-radius:50%;background:var(--line);transition:all .4s}
.od.on{background:var(--gold);width:22px;border-radius:3px}
.od.was{background:rgba(232,184,75,.35)}
.ob-back{position:fixed;top:1.5rem;left:1.8rem;z-index:110;background:none;border:none;color:var(--dim);font-family:'DM Sans',sans-serif;font-size:.78rem;cursor:pointer;transition:color .2s}
.ob-back:hover{color:var(--star)}

.hero-wrap{position:relative;width:120px;height:120px;display:flex;align-items:center;justify-content:center;margin-bottom:2.5rem}
.hero-glow{position:absolute;inset:-24px;border-radius:50%;background:radial-gradient(circle,rgba(232,184,75,.15) 0%,transparent 70%);animation:breathe 3.5s ease-in-out infinite}
@keyframes breathe{0%,100%{transform:scale(1);opacity:.8}50%{transform:scale(1.4);opacity:.3}}
.hero-ring{position:absolute;border-radius:50%;border:1px solid rgba(232,184,75,.15);animation:breathe 3.5s ease-in-out infinite}
.hero-ring:nth-child(2){inset:0;animation-delay:0s}
.hero-ring:nth-child(3){inset:-20px;border-color:rgba(232,184,75,.07);animation-delay:.6s}
.hero-ring:nth-child(4){inset:-42px;border-color:rgba(232,184,75,.04);animation-delay:1.2s}
.hero-spin{animation:spin 28s linear infinite;display:flex}
@keyframes spin{to{transform:rotate(360deg)}}

.ob-eye{font-size:.7rem;letter-spacing:.22em;text-transform:uppercase;color:var(--gold);margin-bottom:1.2rem;opacity:0;animation:up .6s .2s ease both}
.ob-h{font-family:'Cormorant Garamond',serif;font-size:clamp(2.6rem,6vw,4.4rem);font-weight:700;line-height:1.05;margin-bottom:1.1rem;opacity:0;animation:up .7s .35s ease both;background:linear-gradient(150deg,#fff 0%,#c8d8ff 40%,var(--gold2) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.ob-sub{font-size:.95rem;color:var(--dim);line-height:1.72;max-width:430px;margin:0 auto 2.5rem;opacity:0;animation:up .7s .5s ease both}

.ob-btn{background:var(--gold);color:var(--ink);border:none;padding:.9rem 2.2rem;font-family:'DM Sans',sans-serif;font-weight:700;font-size:.92rem;border-radius:5px;cursor:pointer;transition:all .2s;display:flex;align-items:center;gap:.55rem;opacity:0;animation:up .6s .7s ease both}
.ob-btn:hover{background:#d4a63e;transform:translateY(-2px);box-shadow:0 8px 32px rgba(232,184,75,.28)}
.ob-btn:disabled{opacity:.3;cursor:not-allowed;transform:none;box-shadow:none}

.ob-title{font-family:'Cormorant Garamond',serif;font-size:clamp(1.7rem,4vw,2.5rem);font-weight:600;margin-bottom:.55rem}
.ob-desc{font-size:.88rem;color:var(--dim);margin-bottom:2.5rem;line-height:1.65}

.c-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:.85rem;width:100%;margin-bottom:2rem}
@media(max-width:500px){.c-grid{grid-template-columns:repeat(2,1fr)}}
.cc{position:relative;background:var(--card);border:1px solid var(--line);border-radius:12px;padding:1.4rem .9rem;cursor:pointer;transition:all .25s cubic-bezier(.22,1,.36,1);display:flex;flex-direction:column;align-items:center;gap:.65rem;overflow:hidden;animation:up .5s calc(var(--i,0)*.07s + .1s) ease both}
.cc::before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 50% -10%,rgba(232,184,75,.07) 0%,transparent 60%);opacity:0;transition:opacity .3s}
.cc:hover{transform:translateY(-4px);border-color:var(--line-gold)}.cc:hover::before{opacity:1}
.cc.on{border-color:var(--gold);background:var(--gold-pale);transform:translateY(-4px) scale(1.02);box-shadow:0 0 28px rgba(232,184,75,.12)}.cc.on::before{opacity:1}
.cc-icon{width:46px;height:46px;border-radius:11px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.12);display:flex;align-items:center;justify-content:center;transition:all .25s}
.cc.on .cc-icon{background:var(--gold-pale);border-color:var(--line-gold)}
.cc-tick{position:absolute;top:.55rem;right:.55rem;width:17px;height:17px;border-radius:50%;background:var(--gold);display:flex;align-items:center;justify-content:center;opacity:0;transform:scale(0);transition:all .25s cubic-bezier(.34,1.56,.64,1)}
.cc.on .cc-tick{opacity:1;transform:scale(1)}
.cc-lbl{font-size:.78rem;font-weight:600}.cc-sub{font-size:.67rem;color:var(--dim);text-align:center;line-height:1.4}

.sit-list{display:flex;flex-direction:column;gap:.65rem;width:100%;margin-bottom:2rem}
.sc{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:.95rem 1.15rem;cursor:pointer;transition:all .2s;display:flex;align-items:center;gap:.9rem;animation:up .5s calc(var(--i,0)*.07s + .1s) ease both}
.sc:hover{background:var(--ch);border-color:rgba(255,255,255,.12);transform:translateX(4px)}
.sc.on{border-color:var(--gold);background:var(--gold-pale)}
.sc-dot{width:9px;height:9px;border-radius:50%;border:1.5px solid var(--dim);flex-shrink:0;transition:all .2s}
.sc.on .sc-dot{background:var(--gold);border-color:var(--gold);box-shadow:0 0 8px var(--gold-glow)}
.sc-txt{font-size:.87rem;font-style:italic;line-height:1.4}.sc.on .sc-txt{color:rgba(232,184,75,.9)}

.goal-wrap{width:100%;margin-bottom:1.75rem}
.goal-lbl{font-size:.68rem;letter-spacing:.14em;text-transform:uppercase;color:var(--dim);margin-bottom:.55rem;text-align:left}
.goal-inp{width:100%;background:rgba(255,255,255,.05);border:1px solid var(--line);border-radius:10px;padding:.95rem 1.15rem;font-family:'Cormorant Garamond',serif;font-size:1.15rem;font-style:italic;color:var(--star);outline:none;transition:border-color .2s;line-height:1.5;resize:none;caret-color:var(--gold)}
.goal-inp:focus{border-color:var(--line-gold);box-shadow:0 0 0 3px rgba(232,184,75,.06)}
.goal-inp::placeholder{color:var(--dim);font-style:italic}
.goal-hint{text-align:right;font-size:.68rem;color:var(--dim);margin-top:.35rem}

.launch-wrap{display:flex;flex-direction:column;align-items:center;gap:1.5rem}
.launch-star{animation:pulse-star 1s ease-in-out infinite}
@keyframes pulse-star{0%,100%{transform:scale(1);filter:drop-shadow(0 0 16px rgba(232,184,75,.65))}50%{transform:scale(1.2);filter:drop-shadow(0 0 40px rgba(232,184,75,1))}}
.launch-title{font-family:'Cormorant Garamond',serif;font-size:1.5rem;font-style:italic}
.launch-sub{font-size:.8rem;color:var(--dim)}
.launch-bar{width:220px;height:2px;background:var(--line);border-radius:1px;overflow:hidden}
.launch-fill{height:100%;background:linear-gradient(90deg,var(--gold),var(--violet));border-radius:1px;animation:lfill 2.3s ease forwards}
@keyframes lfill{from{width:0}to{width:100%}}

/* ── APP SHELL ── */
.shell{position:relative;z-index:1;display:flex;flex-direction:column;height:100vh;overflow:hidden;opacity:0;transition:opacity 1s ease}
.shell.show{opacity:1}

/* TOP BAR */
.bar{display:flex;align-items:center;justify-content:space-between;padding:0 1.5rem;height:54px;flex-shrink:0;background:rgba(4,5,13,.9);border-bottom:1px solid var(--line);backdrop-filter:blur(20px)}
.logo{font-family:'Cormorant Garamond',serif;font-size:1.4rem;font-weight:600;color:var(--gold);display:flex;align-items:center;gap:.5rem;letter-spacing:.04em}
.logo-spin{animation:spin 24s linear infinite;display:flex}
.bar-mid{display:flex;align-items:center;gap:.5rem;font-size:.75rem;color:var(--dim);max-width:340px;overflow:hidden}
.bar-mid strong{color:var(--gold);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.bar-right{display:flex;align-items:center;gap:.65rem}
.pill{border-radius:999px;padding:.18rem .65rem;font-size:.7rem;font-weight:600;display:flex;align-items:center;gap:.3rem;font-family:'DM Mono',monospace}
.pill-xp{background:var(--vp);border:1px solid rgba(157,127,240,.25);color:var(--violet)}
.pill-str{background:rgba(232,184,75,.1);border:1px solid rgba(232,184,75,.2);color:var(--gold)}
.pro-btn{background:var(--gold);color:var(--ink);border:none;padding:.42rem .95rem;font-family:'DM Sans',sans-serif;font-weight:700;font-size:.76rem;border-radius:4px;cursor:pointer;transition:all .2s;display:flex;align-items:center;gap:.32rem}
.pro-btn:hover{background:#d4a63e;transform:translateY(-1px);box-shadow:0 4px 18px rgba(232,184,75,.3)}

/* TABS */
.tabs{display:flex;padding:0 1.5rem;flex-shrink:0;background:rgba(4,5,13,.75);border-bottom:1px solid var(--line);backdrop-filter:blur(20px)}
.tab{padding:.72rem 1.2rem;cursor:pointer;font-size:.8rem;font-weight:500;color:var(--dim);border-bottom:2px solid transparent;margin-bottom:-1px;transition:all .2s;background:none;border-top:none;border-left:none;border-right:none;font-family:'DM Sans',sans-serif;display:flex;align-items:center;gap:.42rem}
.tab:hover{color:var(--star)}.tab.on{color:var(--gold);border-bottom-color:var(--gold)}
.tab svg{opacity:.45;transition:opacity .2s}.tab.on svg,.tab:hover svg{opacity:1}
.tab-dot{background:var(--gold);color:var(--ink);font-size:.58rem;font-weight:700;border-radius:999px;padding:.08rem .38rem;margin-left:.18rem}

.main{flex:1;overflow:hidden;display:flex}

/* ══════════════════════════════════════
   TRANSFORMATION DASHBOARD
══════════════════════════════════════ */
.tboard{flex:1;overflow-y:auto;padding:1.25rem;display:grid;grid-template-columns:repeat(12,1fr);gap:.85rem;align-content:start}
.tboard::-webkit-scrollbar{width:3px}.tboard::-webkit-scrollbar-thumb{background:var(--line);border-radius:2px}


/* Card base */
.tc{background:var(--card);border:1px solid var(--line);border-radius:13px;padding:1.1rem 1.2rem;position:relative;overflow:hidden;transition:border-color .2s,box-shadow .2s;animation:up .5s calc(var(--d,0)*.06s) ease both}
.tc:hover{border-color:rgba(255,255,255,.1);box-shadow:0 6px 28px rgba(0,0,0,.3)}
.tc-lbl{font-size:.62rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--dim);margin-bottom:.8rem;display:flex;align-items:center;gap:.38rem}

/* Spans */
.sp8{grid-column:span 8}.sp4{grid-column:span 4}
.sp6{grid-column:span 6}.sp3{grid-column:span 3}
.sp5{grid-column:span 5}.sp7{grid-column:span 7}
.sp12{grid-column:span 12}
@media(max-width:900px){.sp8,.sp4,.sp6,.sp3,.sp5,.sp7{grid-column:span 12}}

/* NORTH STAR card */
.ns{background:linear-gradient(140deg,rgba(232,184,75,.07) 0%,rgba(157,127,240,.04) 100%);border-color:var(--line-gold)}
.ns::after{content:'';position:absolute;top:-50px;right:-50px;width:180px;height:180px;background:radial-gradient(circle,rgba(232,184,75,.07),transparent 70%);pointer-events:none}
.ns-quote{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1.1rem;line-height:1.6;color:var(--star);margin-bottom:1rem}
.ns-bar-row{display:flex;align-items:center;gap:.7rem}
.ns-bar{flex:1;height:5px;background:var(--line);border-radius:3px;overflow:hidden}
.ns-fill{height:100%;background:linear-gradient(90deg,var(--gold),var(--violet));border-radius:3px;transition:width 1.2s cubic-bezier(.22,1,.36,1)}
.ns-pct{font-family:'DM Mono',monospace;font-size:.75rem;color:var(--gold);font-weight:500}
.ns-phase{font-size:.72rem;color:var(--dim);margin-top:.55rem}

/* IDENTITY card — the soul of the product */
.id-card{background:linear-gradient(140deg,rgba(157,127,240,.07) 0%,rgba(94,234,212,.04) 100%);border-color:rgba(157,127,240,.2)}
.id-card::after{content:'';position:absolute;bottom:-40px;left:-40px;width:160px;height:160px;background:radial-gradient(circle,rgba(157,127,240,.07),transparent 70%);pointer-events:none}
.id-headline{font-family:'Cormorant Garamond',serif;font-size:.95rem;font-style:italic;line-height:1.6;color:var(--star);margin-bottom:.85rem}
.id-traits{display:flex;flex-direction:column;gap:.45rem}
.id-trait{display:flex;align-items:center;gap:.65rem}
.id-trait-bar{flex:1;height:3px;background:var(--line);border-radius:2px;overflow:hidden}
.id-trait-fill{height:100%;border-radius:2px;transition:width 1.4s cubic-bezier(.22,1,.36,1)}
.id-trait-lbl{font-size:.68rem;color:var(--dim);min-width:80px}
.id-trait-pct{font-size:.68rem;font-family:'DM Mono',monospace;color:var(--dim);min-width:28px;text-align:right}

/* PROPHECY card */
.prop{background:linear-gradient(140deg,rgba(244,114,182,.06) 0%,rgba(232,184,75,.04) 100%);border-color:rgba(244,114,182,.18)}
.prop::before{content:'';position:absolute;top:-30px;right:-30px;width:120px;height:120px;background:radial-gradient(circle,rgba(244,114,182,.06),transparent 70%);pointer-events:none}
.prop-msg{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:.93rem;line-height:1.65;color:var(--star)}
.prop-week{display:inline-block;margin-top:.6rem;font-size:.68rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--rose);background:var(--rose-pale);border:1px solid rgba(244,114,182,.18);border-radius:4px;padding:.15rem .5rem}

/* CONSTELLATION of wins */
.const-wrap{position:relative;height:160px;overflow:hidden}
.const-svg{width:100%;height:100%}
.const-empty{font-size:.8rem;color:var(--dim);font-style:italic;text-align:center;padding-top:2rem}
.const-counter{font-family:'Cormorant Garamond',serif;font-size:2rem;font-weight:700;color:var(--aqua);line-height:1}
.const-sub{font-size:.72rem;color:var(--dim);margin-top:.2rem}

/* QUANTUM QUESTS — hero action card */
.qq-hero-label{font-family:'DM Sans',sans-serif;font-size:.68rem;font-weight:800;letter-spacing:.2em;text-transform:uppercase;color:var(--gold);margin-bottom:1.2rem;display:flex;align-items:center;gap:.42rem}
.qq-list{display:flex;flex-direction:column;gap:.7rem}
.qq{background:rgba(255,255,255,.04);border:1px solid var(--line);border-radius:12px;padding:1rem 1.1rem;display:flex;align-items:flex-start;gap:.8rem;cursor:pointer;transition:all .25s cubic-bezier(.22,1,.36,1);position:relative;overflow:hidden}
.qq::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:transparent;border-radius:3px 0 0 3px;transition:background .25s}
.qq:hover{border-color:rgba(232,184,75,.25);background:rgba(232,184,75,.04)}
.qq:hover::before{background:var(--gold)}
.qq.done{opacity:.4}
.qq.done::before{background:var(--aqua)}
.qq-box{width:22px;height:22px;border-radius:7px;border:1.5px solid var(--dim);flex-shrink:0;display:flex;align-items:center;justify-content:center;transition:all .25s cubic-bezier(.34,1.56,.64,1);margin-top:1px;position:relative}
.qq:hover .qq-box{border-color:var(--gold);transform:scale(1.12);background:var(--gold-pale)}
.qq.done .qq-box{background:rgba(94,234,212,.18);border-color:var(--aqua)}
.qq-body{flex:1}
.qq-title{font-size:.92rem;font-weight:600;margin-bottom:.22rem;line-height:1.35;transition:all .2s}.qq.done .qq-title{text-decoration:line-through;color:var(--dim)}
.qq-why{font-size:.76rem;color:var(--dim);line-height:1.5}
.qq-meta{display:flex;gap:.4rem;margin-top:.45rem;align-items:center}
.qq-xp{font-size:.65rem;font-weight:700;font-family:'DM Mono',monospace;color:var(--violet);background:var(--vp);border:1px solid rgba(157,127,240,.2);border-radius:4px;padding:.1rem .42rem}
.qq-diff{font-size:.65rem;font-weight:700;border-radius:4px;padding:.1rem .42rem}
.diff-e{color:var(--aqua);background:var(--aq-pale);border:1px solid rgba(94,234,212,.2)}
.diff-m{color:var(--gold);background:var(--gold-pale);border:1px solid var(--line-gold)}
.diff-h{color:var(--rose);background:var(--rose-pale);border:1px solid rgba(244,114,182,.2)}
.qq-mood{font-size:.63rem;color:var(--dim);margin-left:auto;font-style:italic}
.qq-reload{background:none;border:none;color:var(--dim);cursor:pointer;padding:.15rem;border-radius:4px;transition:all .2s;display:flex;align-items:center}
.qq-reload:hover{color:var(--gold);background:var(--gold-pale)}

/* BURST PARTICLE */
.burst-wrap{position:fixed;pointer-events:none;z-index:999;width:0;height:0}
.burst-p{position:absolute;width:6px;height:6px;border-radius:50%;animation:burst-fly .65s ease-out forwards}
@keyframes burst-fly{0%{transform:translate(0,0) scale(1);opacity:1}100%{transform:translate(var(--tx),var(--ty)) scale(0);opacity:0}}

/* XP BAR SHIMMER */
@keyframes xp-shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
.xp-fill-shimmer{position:absolute;inset:0;background:linear-gradient(90deg,transparent 0%,rgba(255,255,255,.45) 50%,transparent 100%);background-size:200% 100%;animation:xp-shimmer .7s ease forwards;border-radius:2px}

/* LEVEL-UP OVERLAY */
.lvlup{position:fixed;inset:0;z-index:600;display:flex;align-items:center;justify-content:center;background:rgba(4,5,13,.88);backdrop-filter:blur(18px);animation:up .4s ease}
.lvlup-card{text-align:center;display:flex;flex-direction:column;align-items:center;gap:1rem}
.lvlup-star{animation:pulse-star 1s ease-in-out infinite;color:var(--gold)}
.lvlup-eyebrow{font-size:.7rem;letter-spacing:.24em;text-transform:uppercase;color:var(--gold);opacity:.8}
.lvlup-name{font-family:'Cormorant Garamond',serif;font-size:clamp(2.4rem,7vw,4rem);font-weight:700;background:linear-gradient(135deg,var(--gold2),var(--violet));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;line-height:1.1}
.lvlup-sub{font-size:.85rem;color:var(--dim);max-width:300px;line-height:1.6}

/* REFLECTION CARD accent */
.reflect-label{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:.75rem;letter-spacing:.06em;color:var(--dim);margin-bottom:1rem;display:flex;align-items:center;gap:.42rem;opacity:.8}
.widget.narr{border-left:3px solid rgba(244,114,182,.22)}
.widget.prop{border-left:3px solid rgba(157,127,240,.22)}

/* CONSTELLATION HOVER */
.const-star-label{font-family:'DM Sans',sans-serif;font-size:8px;fill:var(--aqua);opacity:0;transition:opacity .2s;pointer-events:none}
.const-star-g:hover .const-star-label{opacity:1}
.const-star-g:hover circle:last-of-type{r:4;filter:url(#glow)}

/* PROLOGUE STEP */
.prologue-wrap{display:flex;flex-direction:column;align-items:center;text-align:center;max-width:620px;animation:up .8s cubic-bezier(.22,1,.36,1) both}
.prologue-eyebrow{font-size:.68rem;letter-spacing:.24em;text-transform:uppercase;color:var(--rose);margin-bottom:1.4rem;opacity:0;animation:up .6s .2s ease both}
.prologue-title{font-family:'Cormorant Garamond',serif;font-size:clamp(2rem,5vw,3.2rem);font-weight:700;color:var(--star);margin-bottom:2rem;opacity:0;animation:up .7s .35s ease both;line-height:1.15}
.prologue-prophecy{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:clamp(1.05rem,2.5vw,1.3rem);line-height:1.8;color:var(--star);margin-bottom:.8rem;opacity:0;animation:up .8s .55s ease both;background:linear-gradient(160deg,rgba(244,114,182,.08),rgba(157,127,240,.08));border:1px solid rgba(244,114,182,.18);border-radius:14px;padding:1.6rem 2rem;position:relative}
.prologue-prophecy::before{content:'❝';position:absolute;top:.6rem;left:.9rem;font-size:1.4rem;color:var(--rose);opacity:.35;font-style:normal}
.prologue-attr{font-size:.75rem;color:var(--dim);margin-bottom:2.2rem;opacity:0;animation:up .6s .75s ease both}
.prologue-attr span{color:var(--rose)}
.prologue-glow{position:absolute;width:300px;height:300px;border-radius:50%;background:radial-gradient(circle,rgba(244,114,182,.08),transparent 70%);top:50%;left:50%;transform:translate(-50%,-50%);pointer-events:none;animation:breathe 4s ease-in-out infinite}

/* NARRATIVE thread */
.narr{background:linear-gradient(140deg,rgba(232,184,75,.05) 0%,rgba(157,127,240,.04) 100%);border-color:var(--line-gold)}
.narr-av{width:32px;height:32px;border-radius:9px;background:linear-gradient(135deg,rgba(232,184,75,.22),rgba(157,127,240,.22));border:1px solid var(--line-gold);display:flex;align-items:center;justify-content:center;flex-shrink:0}
.narr-row{display:flex;gap:.7rem;align-items:flex-start}
.narr-msg{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:.95rem;line-height:1.7;color:var(--star)}
.narr-btns{display:flex;gap:.45rem;margin-top:.8rem}
.narr-btn{background:var(--gold-pale);border:1px solid var(--line-gold);color:var(--gold);border-radius:6px;padding:.38rem .8rem;font-size:.75rem;font-weight:600;cursor:pointer;transition:all .2s;font-family:'DM Sans',sans-serif}
.narr-btn:hover{background:rgba(232,184,75,.18)}
.narr-ghost{background:none;border:1px solid var(--line);color:var(--dim);border-radius:6px;padding:.38rem .8rem;font-size:.75rem;cursor:pointer;transition:all .2s;font-family:'DM Sans',sans-serif}
.narr-ghost:hover{border-color:rgba(255,255,255,.18);color:var(--star)}

/* STREAK */
.streak-n{font-family:'Cormorant Garamond',serif;font-size:2.6rem;font-weight:700;color:var(--gold);line-height:1}
.streak-dots{display:flex;gap:.28rem;margin-top:.7rem}
.sdot{width:7px;height:7px;border-radius:50%;background:var(--line)}
.sdot.lit{background:var(--gold);box-shadow:0 0 6px var(--gold-glow)}

/* XP */
.xp-n{font-family:'Cormorant Garamond',serif;font-size:2.6rem;font-weight:700;color:var(--violet);line-height:1}
.xp-bar{height:3px;background:var(--line);border-radius:2px;overflow:hidden;margin-top:.7rem}
.xp-fill{height:100%;background:linear-gradient(90deg,var(--violet),#818cf8);border-radius:2px;transition:width .9s ease}
.lvl-badge{position:absolute;top:.9rem;right:.9rem;background:var(--vp);border:1px solid rgba(157,127,240,.25);border-radius:7px;padding:.25rem .55rem;font-size:.65rem;font-weight:700;color:var(--violet);font-family:'DM Mono',monospace}

/* MOOD check-in */
.mood-row{display:flex;gap:.5rem;justify-content:space-between}
.mood-btn{flex:1;background:var(--card2);border:1px solid var(--line);border-radius:9px;padding:.65rem .4rem;cursor:pointer;transition:all .2s;display:flex;flex-direction:column;align-items:center;gap:.3rem;font-family:'DM Sans',sans-serif}
.mood-btn:hover{border-color:var(--line-gold);background:var(--gold-pale)}
.mood-btn.picked{border-color:var(--gold);background:var(--gold-pale)}
.mood-ico{font-size:1.3rem}
.mood-lbl{font-size:.62rem;color:var(--dim);font-weight:500}
.mood-btn.picked .mood-lbl{color:var(--gold)}

/* ══ ROADMAP ══ */
.rm-view{flex:1;overflow-y:auto;padding:1.5rem}
.rm-view::-webkit-scrollbar{width:3px}.rm-view::-webkit-scrollbar-thumb{background:var(--line);border-radius:2px}
.rm-hd{margin-bottom:1.75rem}
.rm-hd h2{font-family:'Cormorant Garamond',serif;font-size:1.85rem;font-weight:600;background:linear-gradient(135deg,var(--star) 0%,var(--gold) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.rm-hd p{color:var(--dim);font-size:.84rem;margin-top:.3rem}
.rm-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;text-align:center;color:var(--dim);gap:.9rem;padding:3rem}
.rm-empty h3{font-family:'Cormorant Garamond',serif;font-size:1.65rem;color:var(--star)}
.rm-phase{margin-bottom:2.25rem}
.rph-hd{display:flex;align-items:center;gap:.7rem;margin-bottom:.9rem}
.rph-n{width:26px;height:26px;border-radius:50%;background:linear-gradient(135deg,var(--gold),#f2994a);color:var(--ink);font-weight:700;font-size:.78rem;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.rph-title{font-weight:600;font-size:.92rem}
.rph-time{font-size:.68rem;color:var(--dim);background:var(--card);border:1px solid var(--line);border-radius:999px;padding:.08rem .55rem;margin-left:auto}
.rm-steps{display:flex;flex-direction:column;gap:.55rem;padding-left:1.9rem;border-left:1px solid var(--line);margin-left:12px}
.rm-step{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:.8rem .95rem;display:flex;gap:.75rem;align-items:flex-start;transition:all .2s}
.rm-step:hover{background:var(--ch);border-color:rgba(255,255,255,.11)}
.rm-check{width:19px;height:19px;border-radius:50%;border:1.5px solid var(--line);flex-shrink:0;cursor:pointer;transition:all .2s;display:flex;align-items:center;justify-content:center;margin-top:1px}
.rm-check:hover{border-color:var(--gold);background:var(--gold-pale)}.rm-check.ck{background:var(--gold);border-color:var(--gold)}
.rm-sc h4{font-size:.83rem;font-weight:600;margin-bottom:.2rem}
.rm-sc p{font-size:.75rem;color:var(--dim);line-height:1.5}
.stag{font-size:.61rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--gold);background:var(--gold-pale);border:1px solid var(--line-gold);border-radius:4px;padding:.08rem .38rem;margin-top:.38rem;display:inline-block}

/* ══ MENTOR CHAT ══ */
.chat-view{flex:1;display:flex;flex-direction:column;overflow:hidden}
.chat-hd{display:flex;align-items:center;gap:.7rem;padding:.8rem 1.4rem;flex-shrink:0;background:rgba(4,5,13,.55);border-bottom:1px solid var(--line);backdrop-filter:blur(10px)}
.chat-av{width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,rgba(232,184,75,.2),rgba(157,127,240,.2));border:1px solid var(--line-gold);display:flex;align-items:center;justify-content:center;flex-shrink:0}
.chat-info h3{font-size:.86rem;font-weight:600}
.chat-info p{font-size:.7rem;color:var(--dim)}
.online{margin-left:auto;display:flex;align-items:center;gap:.38rem;font-size:.68rem;color:#4ade80}
.odot{width:6px;height:6px;border-radius:50%;background:#4ade80;box-shadow:0 0 7px #4ade80;animation:blink 2s ease-in-out infinite}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.35}}
.msgs{flex:1;overflow-y:auto;padding:1.1rem 1.4rem;display:flex;flex-direction:column;gap:.95rem}
.msgs::-webkit-scrollbar{width:3px}.msgs::-webkit-scrollbar-thumb{background:var(--line);border-radius:2px}
.mrow{display:flex;gap:.55rem;align-items:flex-start;animation:up .35s ease}
.mrow.user{flex-direction:row-reverse}
.mav{width:29px;height:29px;border-radius:8px;flex-shrink:0;display:flex;align-items:center;justify-content:center;border:1px solid var(--line)}
.mav.ai{background:linear-gradient(135deg,rgba(232,184,75,.18),rgba(157,127,240,.18));border-color:var(--line-gold)}
.mav.user{background:rgba(255,255,255,.05)}
.bub{max-width:76%;padding:.78rem .95rem;font-size:.865rem;line-height:1.7}
.mrow.ai .bub{background:rgba(255,255,255,.045);border:1px solid var(--line);border-radius:2px 12px 12px 12px;backdrop-filter:blur(8px);box-shadow:0 2px 14px rgba(0,0,0,.25)}
.mrow.user .bub{background:rgba(232,184,75,.1);border:1px solid var(--line-gold);border-radius:12px 2px 12px 12px}
.typing{display:flex;gap:5px;padding:4px 2px}
.typing span{width:6px;height:6px;border-radius:50%;background:var(--dim);animation:bd 1.3s infinite}
.typing span:nth-child(2){animation-delay:.15s}.typing span:nth-child(3){animation-delay:.3s}
@keyframes bd{0%,100%{transform:translateY(0);opacity:.35}50%{transform:translateY(-7px);opacity:1}}
.chips{display:flex;flex-wrap:wrap;gap:.38rem;padding:0 1.4rem .65rem;flex-shrink:0}
.chip{background:var(--card);border:1px solid var(--line);border-radius:999px;padding:.27rem .78rem;font-size:.74rem;color:rgba(255,255,255,.58);cursor:pointer;transition:all .18s;font-family:'DM Sans',sans-serif;font-weight:500}
.chip:hover{border-color:var(--gold);color:var(--gold);background:var(--gold-pale)}
.iarea{display:flex;gap:.6rem;align-items:flex-end;padding:.8rem 1.4rem;background:rgba(4,5,13,.8);border-top:1px solid var(--line);backdrop-filter:blur(20px);flex-shrink:0}
.ita{flex:1;background:rgba(255,255,255,.048);border:1px solid var(--line);border-radius:10px;padding:.68rem .95rem;font-family:'DM Sans',sans-serif;font-size:.865rem;color:var(--star);outline:none;resize:none;transition:border-color .2s;line-height:1.5}
.ita:focus{border-color:var(--line-gold)}.ita::placeholder{color:var(--dim)}
.sbtn{background:var(--gold);color:var(--ink);border:none;width:38px;height:38px;border-radius:9px;cursor:pointer;transition:all .2s;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.sbtn:hover:not(:disabled){background:#d4a63e;transform:scale(1.07);box-shadow:0 4px 18px rgba(232,184,75,.3)}
.sbtn:disabled{opacity:.28;cursor:not-allowed}

/* XP TOAST */
.xpt{position:fixed;top:65px;right:1.4rem;z-index:300;background:#0d0e1e;border:1px solid rgba(157,127,240,.28);border-radius:10px;padding:.65rem .95rem;display:flex;align-items:center;gap:.55rem;font-size:.8rem;font-weight:600;color:var(--violet);box-shadow:0 8px 32px rgba(0,0,0,.45);animation:tin .4s cubic-bezier(.34,1.56,.64,1) both}
@keyframes tin{from{opacity:0;transform:translateX(28px) scale(.9)}to{opacity:1;transform:translateX(0) scale(1)}}
.xpt.out{animation:tout .3s ease forwards}
@keyframes tout{to{opacity:0;transform:translateX(18px)}}

/* PAYWALL */
.overlay{position:fixed;inset:0;background:rgba(4,5,13,.9);z-index:500;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(12px)}
.pw{background:#0c0d1e;border:1px solid var(--line-gold);border-radius:16px;padding:2.4rem;max-width:450px;width:90%;text-align:center;box-shadow:0 0 80px rgba(232,184,75,.1);animation:popin .3s cubic-bezier(.34,1.56,.64,1)}
@keyframes popin{from{opacity:0;transform:scale(.87)}to{opacity:1;transform:scale(1)}}
.pw-ico{margin:0 auto 1.2rem;width:54px;height:54px;border-radius:14px;background:var(--gold-pale);border:1px solid var(--line-gold);display:flex;align-items:center;justify-content:center}
.pw h2{font-family:'Cormorant Garamond',serif;font-size:1.9rem;margin-bottom:.45rem}
.pw>p{color:var(--dim);font-size:.86rem;line-height:1.65;margin-bottom:1.65rem}
.plans{display:flex;gap:.85rem;margin-bottom:1.4rem}
.plan{flex:1;border:1px solid var(--line);border-radius:10px;padding:1.1rem .9rem;text-align:center;background:var(--card)}
.plan.f{border-color:var(--gold);background:var(--gold-pale)}
.pbest{font-size:.6rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--gold);margin-bottom:.28rem;display:flex;align-items:center;justify-content:center;gap:.28rem}
.plan h3{font-size:.8rem;font-weight:600;margin-bottom:.28rem}
.pprice{font-family:'Cormorant Garamond',serif;font-size:2rem;font-weight:700;color:var(--gold)}
.pprice span{font-size:.76rem;font-family:'DM Sans',sans-serif;color:var(--dim)}
.pfeats{font-size:.7rem;color:var(--dim);margin-top:.48rem;line-height:1.6}
.pw-cta{background:var(--gold);color:var(--ink);border:none;width:100%;padding:.88rem;font-family:'DM Sans',sans-serif;font-weight:700;font-size:.92rem;border-radius:8px;cursor:pointer;transition:all .2s;display:flex;align-items:center;justify-content:center;gap:.45rem}
.pw-cta:hover{background:#d4a63e;transform:translateY(-1px);box-shadow:0 6px 24px rgba(232,184,75,.28)}
.pw-skip{margin-top:.8rem;font-size:.76rem;color:var(--dim);cursor:pointer}
.pw-skip:hover{color:var(--star)}

/* BIO STEP */
.bio-fields{display:flex;flex-direction:column;gap:1.1rem;width:100%;margin-bottom:2rem}
.bio-field{display:flex;flex-direction:column;gap:.4rem;text-align:left}
.bio-lbl{font-size:.68rem;letter-spacing:.14em;text-transform:uppercase;color:var(--dim)}
.bio-inp{background:rgba(255,255,255,.05);border:1px solid var(--line);border-radius:10px;padding:.85rem 1.1rem;font-family:'DM Sans',sans-serif;font-size:.95rem;color:var(--star);outline:none;transition:border-color .2s;caret-color:var(--gold)}
.bio-inp:focus{border-color:var(--line-gold);box-shadow:0 0 0 3px rgba(232,184,75,.06)}
.bio-inp::placeholder{color:var(--dim)}
.age-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:.6rem}
.age-pill{background:var(--card);border:1px solid var(--line);border-radius:8px;padding:.6rem .5rem;text-align:center;font-size:.8rem;cursor:pointer;transition:all .2s}
.age-pill:hover{border-color:var(--line-gold)}
.age-pill.on{border-color:var(--gold);background:var(--gold-pale);color:var(--gold);font-weight:600}

/* WIDGET DASHBOARD */
.wboard{flex:1;overflow-y:auto;padding:1.6rem;display:flex;flex-direction:column;gap:1.4rem}
.wboard::-webkit-scrollbar{width:3px}.wboard::-webkit-scrollbar-thumb{background:var(--line);border-radius:2px}
.w-row{display:grid;gap:1.2rem}
.w-row-2{grid-template-columns:1fr 1fr}
.w-row-3{grid-template-columns:1fr 1fr 1fr}
.w-row-1{grid-template-columns:1fr}
@media(max-width:800px){.w-row-2,.w-row-3{grid-template-columns:1fr}}
.widget{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:1.5rem 1.6rem;position:relative;overflow:hidden;transition:border-color .2s,box-shadow .2s;animation:up .5s calc(var(--d,0)*.08s) ease both}
.widget:hover{border-color:rgba(255,255,255,.1);box-shadow:0 6px 28px rgba(0,0,0,.3)}
/* Daily Quests — hero action card */
.widget.quest-hero{border-top:3px solid var(--gold);background:linear-gradient(160deg,rgba(232,184,75,.05) 0%,rgba(4,5,13,0) 60%);padding-top:1.6rem}
.w-title{font-size:.65rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--dim);margin-bottom:1rem;display:flex;align-items:center;gap:.4rem}
.w-greeting{font-family:'Cormorant Garamond',serif;font-size:1.45rem;font-weight:600;color:var(--star);margin-bottom:.35rem;line-height:1.2}
.w-greeting span{color:var(--gold)}

@media(max-width:700px){.plans{flex-direction:column}.bar-mid{display:none}}
`;

// ─────────────────────────────────────────────────────────────
//  CONSTANTS
// ─────────────────────────────────────────────────────────────
const FREE_LIMIT = 5;
const LEVELS = ["Wanderer", "Seeker", "Explorer", "Navigator", "Pioneer", "Trailblazer", "Pathfinder", "North Star"];
const MOODS = [{ e: "😴", l: "Depleted" }, { e: "😐", l: "Neutral" }, { e: "🙂", l: "Okay" }, { e: "⚡", l: "Energized" }, { e: "🔥", l: "On Fire" }];
const PERSONAS = [
  { id: "highschool", label: "High School Grad", sub: "Alternative paths beyond college" },
  { id: "business", label: "Small Business Owner", sub: "Leads, growth & systems" },
  { id: "traveler", label: "World Traveler", sub: "Remote income & adventure" },
  { id: "fitness", label: "Fitness Journey", sub: "Build muscle & transform" },
  { id: "student", label: "Nursing Student", sub: "Pass exams, launch career" },
  { id: "custom", label: "My Own Path", sub: "Something unique to me" },
];
const PERSONA_DESC = { highschool: "I just graduated and need a different path", business: "I run a business and want to grow it", traveler: "I want to travel the world and live freely", fitness: "I want to transform my body and health", student: "I'm in school and need help succeeding", custom: "My goal is something else entirely" };
const SITUATIONS = ["I have a dream but have no idea where to begin.", "I know what I want but keep getting in my own way.", "I've started before but always seem to lose momentum.", "I'm ready to commit — I just need a clear plan.", "I feel lost and need help figuring out what I even want."];

function getLevel(xp) {
  const t = [0, 100, 250, 500, 900, 1400, 2100, 3000];
  let l = 0; for (let i = 0; i < t.length; i++) { if (xp >= t[i]) l = i; }
  const next = t[l + 1] || t[t.length - 1] + 500, prev = t[l];
  return { lv: l + 1, name: LEVELS[l] || "Legend", pct: Math.round(((xp - prev) / (next - prev)) * 100), toNext: next - xp };
}

// ─────────────────────────────────────────────────────────────
//  CLAUDE
// ─────────────────────────────────────────────────────────────
async function ai(messages, system) {
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, system, messages })
  });
  const d = await r.json();
  if (d.error) throw new Error(d.error.message);
  return d.content?.[0]?.text || "";
}

function parseRm(t) { const m = t.match(/---RM---\s*([\s\S]*?)---END---/); if (!m) return null; try { return JSON.parse(m[1].trim()) } catch { return null } }
function stripRm(t) { return t.replace(/---RM---[\s\S]*?---END---/g, "").trim() }

async function genQuests(profile, mood) {
  const moodCtx = mood ? `User's current energy: ${mood}.` : "";
  const sys = `Generate 3 daily quests for: "${profile.goal}" (${profile.persona}). ${moodCtx}
${mood === "Depleted" ? "Make them gentle, 5-10 minute tasks." : mood === "On Fire" ? "Make them ambitious and stretching." : "Mix difficulties."}
Return ONLY JSON array (no markdown): [{"title":"...","why":"1-sentence reason tied to their goal","xp":25,"diff":"easy|medium|hard"}]
Make them hyper-specific to their goal. Not generic productivity tasks.`;
  try {
    const raw = await ai([{ role: "user", content: "Generate quests" }], sys);
    const m = raw.match(/\[[\s\S]*\]/);
    if (m) return JSON.parse(m[0]).slice(0, 3);
  } catch { }
  return [{ title: "Write down your #1 obstacle", why: "Naming it is the first step to defeating it", xp: 25, diff: "easy" }, { title: "Do one thing toward your goal", why: "1% progress daily compounds massively", xp: 35, diff: "medium" }, { title: "Find someone who's done it", why: "Their path is your map — 20 minutes of research", xp: 50, diff: "hard" }];
}

async function genNarrative(profile, wins, msgCount, streak) {
  const sys = `You are PathFinder. Write ONE short mentor narrative (2-3 sentences) for someone whose goal is: "${profile.goal}". 
They have: ${wins.length} wins, ${streak} day streak, ${msgCount} mentor conversations.
${wins.length > 0 ? `Their recent wins: ${wins.slice(-3).join(", ")}.` : "They haven't completed any quests yet."}
Connect dots. Reference their actual progress. Make it feel like you've been watching them. Be specific, not generic. Sound like a mentor who's proud but still pushing.`;
  try { return await ai([{ role: "user", content: "Generate narrative" }], sys); }
  catch { return `You set your sights on something real. Every conversation here is you choosing your future over your comfort — and that's already more than most people ever do.`; }
}

async function genProphecy(profile) {
  const sys = `You are a prescient life coach. For someone pursuing: "${profile.goal}" as a ${profile.persona}.
Write one short prophecy/prediction (2-3 sentences). Predict a SPECIFIC challenge they'll face around week 2-4, AND tell them exactly what it will feel like AND what to do when it hits. Be eerily accurate and specific. Not generic motivation.`;
  try { return await ai([{ role: "user", content: "Generate prophecy" }], sys); }
  catch { return `Around week three, you'll wake up one morning and the goal will feel distant — like a story you told yourself. That's not failure. That's the moment where everyone else quits and you don't.`; }
}

async function genIdentity(profile, wins, msgCount) {
  const sys = `For someone pursuing "${profile.goal}", generate identity trait scores (0-100) showing who they're BECOMING.
Return ONLY JSON (no markdown): {"headline":"You're becoming someone who...(complete in 8 words max)","traits":[{"label":"Consistency","score":number},{"label":"Courage","score":number},{"label":"Clarity","score":number},{"label":"Momentum","score":number}]}
Base scores on: ${wins.length} wins, ${msgCount} conversations. Be encouraging but honest. Early stage = lower scores.`;
  try {
    const raw = await ai([{ role: "user", content: "Generate identity" }], sys);
    const m = raw.match(/\{[\s\S]*\}/); if (m) return JSON.parse(m[0]);
  } catch { }
  return { headline: "You're becoming someone who chooses action", traits: [{ label: "Consistency", score: 15 }, { label: "Courage", score: 30 }, { label: "Clarity", score: 45 }, { label: "Momentum", score: 20 }] };
}

const MENTOR_SYS = (p) => `You are PathFinder — a razor-sharp, deeply perceptive life transformation mentor. NOT a general AI.

User's North Star: "${p?.goal || ""}"
Persona: ${p?.persona || ""}
Situation: ${p?.situation || ""}

You are NOT here to answer questions. You are here to transform this person.
- Reference their specific goal in every response
- Ask questions that make them uncomfortable in the right way
- Celebrate progress, challenge stagnation
- Connect patterns: "Three messages ago you said X, now you're saying Y..."
- Be direct. Be specific. Be the mentor they can't afford to hire.

After 3+ real exchanges, generate their roadmap:
---RM---
{"title":"Your Path to [specific goal]","subtitle":"Built from your conversations","phases":[{"title":"...","timeline":"...","steps":[{"title":"...","detail":"...","tag":"Action|Mindset|Skill|Habit|Financial|Health|Network"}]}]}
---END---

2-4 paragraphs max. No platitudes. No filler.`;

// ─────────────────────────────────────────────────────────────
//  CONSTELLATION SVG
// ─────────────────────────────────────────────────────────────
function Constellation({ wins }) {
  const W = 320, H = 180;
  if (!wins.length) return <div className="const-empty">Complete quests — watch your constellation grow</div>;
  const pts = wins.map((_, i) => {
    const seed = i * 137.5;
    return { x: 24 + (Math.sin(seed) * 0.5 + 0.5) * (W - 48), y: 18 + (Math.cos(seed * 1.3) * 0.5 + 0.5) * (H - 36) };
  });
  // Ghost "next star" position
  const ghostSeed = wins.length * 137.5;
  const ghost = { x: 24 + (Math.sin(ghostSeed) * 0.5 + 0.5) * (W - 48), y: 18 + (Math.cos(ghostSeed * 1.3) * 0.5 + 0.5) * (H - 36) };
  return (
    <svg className="const-svg" viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id="nebula" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#5eead4" stopOpacity="0.04" />
          <stop offset="55%" stopColor="#9d7ff0" stopOpacity="0.03" />
          <stop offset="100%" stopColor="#9d7ff0" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="sg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#5eead4" stopOpacity="1" />
          <stop offset="100%" stopColor="#5eead4" stopOpacity="0" />
        </radialGradient>
        <filter id="glow"><feGaussianBlur stdDeviation="2.5" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        <style>{`.const-star-g:hover text{opacity:1}.const-star-g text{opacity:0;transition:opacity .2s}`}</style>
      </defs>
      {/* Nebula wash */}
      <ellipse cx={W / 2} cy={H / 2} rx={W * 0.55} ry={H * 0.55} fill="url(#nebula)" />
      {/* Constellation lines */}
      {pts.slice(1).map((p, i) => {
        const len = Math.hypot(p.x - pts[i].x, p.y - pts[i].y);
        return (
          <line key={i} x1={pts[i].x} y1={pts[i].y} x2={p.x} y2={p.y}
            stroke="rgba(94,234,212,0.22)" strokeWidth="1"
            strokeDasharray={`${len}`}
            style={{ animation: `draw-line 1.1s ${i * 0.18}s ease forwards`, strokeDashoffset: `${len}` }}
          />
        );
      })}
      {/* Ghost next-star hint */}
      <circle cx={ghost.x} cy={ghost.y} r="4" fill="none"
        stroke="rgba(94,234,212,0.2)" strokeWidth="1" strokeDasharray="2 3"
        style={{ animation: `star-pop .5s ${wins.length * 0.12}s cubic-bezier(.34,1.56,.64,1) both` }}
      />
      {/* Stars */}
      {pts.map((p, i) => {
        const r = 2 + (i % 3) * 0.9; // older wins = bigger
        const yr = r + 3;
        const label = wins[i]?.length > 22 ? wins[i].slice(0, 22) + "…" : wins[i];
        return (
          <g key={i} className="const-star-g" filter="url(#glow)"
            style={{ animation: `star-pop .5s ${i * 0.12}s cubic-bezier(.34,1.56,.64,1) both`, cursor: "default" }}>
            <circle cx={p.x} cy={p.y} r={yr} fill="url(#sg)" opacity=".28" />
            <circle cx={p.x} cy={p.y} r={r} fill="#5eead4" />
            <text x={p.x} y={p.y + yr + 9} textAnchor="middle"
              style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "7.5px", fill: "#5eead4", opacity: 0, transition: "opacity .2s", pointerEvents: "none" }}>
              {label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
//  STARFIELD
// ─────────────────────────────────────────────────────────────
function Starfield() {
  const r = useRef(null);
  useEffect(() => {
    if (!r.current) return;
    const f = document.createDocumentFragment();
    for (let i = 0; i < 240; i++) {
      const s = document.createElement("div"); s.className = "s";
      const sz = Math.random() * 2.4 + .35;
      s.style.cssText = `left:${Math.random() * 100}%;top:${Math.random() * 100}%;width:${sz}px;height:${sz}px;--o:${(Math.random() * .65 + .08).toFixed(2)};--d:${(Math.random() * 4 + 2).toFixed(1)}s;animation-delay:${(Math.random() * 7).toFixed(1)}s`;
      f.appendChild(s);
    }
    r.current.appendChild(f);
  }, []);
  return <div id="sf" ref={r} />;
}

// ─────────────────────────────────────────────────────────────
//  ONBOARDING
// ─────────────────────────────────────────────────────────────
function Onboarding({ onDone }) {
  const [step, setStep] = useState(1);
  const [out, setOut] = useState(false);
  const [persona, setPersona] = useState(null);
  const [sit, setSit] = useState(null);
  const [goal, setGoal] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [prologueProphecy, setPrologueProphecy] = useState("");

  const next = () => { setOut(true); setTimeout(() => { setOut(false); setStep(s => s + 1) }, 360) };
  const back = () => { setOut(true); setTimeout(() => { setOut(false); setStep(s => s - 1) }, 300) };
  const launch = async () => {
    setStep(6);
    // Generate prophecy during loading so it's ready for prologue
    const prof = { persona, situation: sit, goal, name: name.trim(), age };
    const prop = await genProphecy(prof);
    setPrologueProphecy(prop);
    setStep(7);
  };

  const enterApp = () => {
    const prof = { persona, situation: sit, goal, name: name.trim(), age };
    onDone({ ...prof, prologueProphecy });
  };

  return (
    <div className="ob">
      {step > 1 && step < 6 && <button className="ob-back" onClick={back}>← Back</button>}
      {step < 6 && <div className="ob-dots">{[1, 2, 3, 4, 5].map(i => <div key={i} className={`od ${step === i ? "on" : step > i ? "was" : ""}`} />)}</div>}
      <div className={`ob-step${out ? " out" : ""}`} key={step}>

        {step === 1 && (<>
          <div className="hero-wrap">
            <div className="hero-ring" /><div className="hero-ring" /><div className="hero-ring" />
            <div className="hero-glow" />
            <div className="hero-spin"><I.Star s={60} style={{ color: "var(--gold)" }} /></div>
          </div>
          <div className="ob-eye">Your life transformation engine</div>
          <h1 className="ob-h">Follow Your<br />North Star</h1>
          <p className="ob-sub">Your personal transformation engine. Track who you're becoming, predict what'll stop you, generate daily missions from your energy, and connect the dots of your progress into a story only you can live.</p>
          <button className="ob-btn" style={{ margin: "0 auto" }} onClick={next}>Begin My Transformation <I.Arrow s={13} c="var(--ink)" /></button>
        </>)}

        {step === 2 && (<>
          <I.User s={36} c="var(--gold)" />
          <h2 className="ob-title" style={{ marginTop: "1rem" }}>Let's get to know you</h2>
          <p className="ob-desc">A few quick things so PathFinder can personalize everything just for you.</p>
          <div className="bio-fields">
            <div className="bio-field">
              <span className="bio-lbl">Your first name</span>
              <input className="bio-inp" placeholder="e.g. Travis" value={name} autoFocus
                onChange={e => setName(e.target.value.slice(0, 40))}
                onKeyDown={e => { if (e.key === "Enter" && name.trim().length >= 2) next(); }}
              />
            </div>
            <div className="bio-field">
              <span className="bio-lbl">Age range <span style={{ opacity: .5 }}>(optional)</span></span>
              <div className="age-grid">
                {["Under 18", "18–24", "25–34", "35–44", "45+"].map(a => (
                  <div key={a} className={`age-pill${age === a ? " on" : ""}`} onClick={() => setAge(a)}>{a}</div>
                ))}
              </div>
            </div>
          </div>
          <button className="ob-btn" style={{ margin: "0 auto", opacity: name.trim().length >= 2 ? 1 : .32, cursor: name.trim().length >= 2 ? "pointer" : "not-allowed" }}
            disabled={name.trim().length < 2} onClick={next}>
            Nice to meet you, {name || "..."} <I.Arrow s={13} c="var(--ink)" />
          </button>
        </>)}

        {step === 3 && (<>
          <h2 className="ob-title">What calls to you?</h2>
          <p className="ob-desc">PathFinder personalizes everything — quests, roadmap, mentor voice — around your path.</p>
          <div className="c-grid">
            {PERSONAS.map((p, i) => (
              <div key={p.id} className={`cc${persona === p.id ? " on" : ""}`} style={{ "--i": i }} onClick={() => setPersona(p.id)}>
                <div className="cc-tick"><I.Check s={9} c="var(--ink)" /></div>
                <div className="cc-icon"><PersonaIcon id={p.id} s={21} c={persona === p.id ? "var(--gold)" : "var(--star)"} /></div>
                <div className="cc-lbl">{p.label}</div>
                <div className="cc-sub">{PERSONA_DESC[p.id]}</div>
              </div>
            ))}
          </div>
          <button className="ob-btn" style={{ margin: "0 auto", opacity: persona ? 1 : .32, cursor: persona ? "pointer" : "not-allowed" }} disabled={!persona} onClick={next}>
            This is my path <I.Arrow s={13} c="var(--ink)" />
          </button>
        </>)}

        {step === 4 && (<>
          <h2 className="ob-title">Where are you right now?</h2>
          <p className="ob-desc">PathFinder meets you exactly here — no judgment, just precision.</p>
          <div className="sit-list">
            {SITUATIONS.map((s, i) => (
              <div key={i} className={`sc${sit === s ? " on" : ""}`} style={{ "--i": i }} onClick={() => setSit(s)}>
                <div className="sc-dot" /><div className="sc-txt">"{s}"</div>
              </div>
            ))}
          </div>
          <button className="ob-btn" style={{ margin: "0 auto", opacity: sit ? 1 : .32, cursor: sit ? "pointer" : "not-allowed" }} disabled={!sit} onClick={next}>
            That's me <I.Arrow s={13} c="var(--ink)" />
          </button>
        </>)}

        {step === 5 && (<>
          <div style={{ marginBottom: ".8rem" }}><I.Star s={42} style={{ color: "var(--gold)", filter: "drop-shadow(0 0 16px rgba(232,184,75,.55))" }} /></div>
          <h2 className="ob-title">Name your North Star</h2>
          <p className="ob-desc">One honest sentence. This becomes the soul of your entire PathFinder experience — every quest, every insight, every roadmap milestone will orbit it.</p>
          <div className="goal-wrap">
            <div className="goal-lbl">My North Star goal</div>
            <textarea className="goal-inp" rows={3} autoFocus
              placeholder="e.g. I want to build a business that lets me work from anywhere in the world..."
              value={goal} onChange={e => setGoal(e.target.value.slice(0, 200))}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey && goal.trim().length > 10) { e.preventDefault(); launch() } }}
            />
            <div className="goal-hint">{goal.length} / 200</div>
          </div>
          <button className="ob-btn" style={{ margin: "0 auto", opacity: goal.trim().length >= 10 ? 1 : .32, cursor: goal.trim().length >= 10 ? "pointer" : "not-allowed" }}
            disabled={goal.trim().length < 10} onClick={launch}>
            <I.Star s={15} style={{ color: "var(--ink)" }} /> Set My North Star
          </button>
        </>)}

        {step === 6 && (
          <div className="launch-wrap">
            <div className="launch-star"><I.Star s={70} style={{ color: "var(--gold)" }} /></div>
            <div className="launch-title">Reading the path ahead...</div>
            <div className="launch-sub">Crafting your prophecy • Generating quests • Building your engine</div>
            <div className="launch-bar"><div className="launch-fill" /></div>
          </div>
        )}

        {step === 7 && (
          <div className="prologue-wrap">
            <div className="prologue-glow" />
            <div className="prologue-eyebrow">✦ Your Prophecy Has Arrived</div>
            <div className="prologue-title">PathFinder sees<br />what's coming.</div>
            <div className="prologue-prophecy">{prologueProphecy || "Around week three, you'll wake up and the goal will feel distant — like a story you told yourself. That's not failure. That's the moment where everyone else quits and you don't."}</div>
            <div className="prologue-attr">This is what's coming for you, <span>{name || "traveler"}</span>. PathFinder has seen it.</div>
            <button className="ob-btn" style={{ margin: "0 auto" }} onClick={enterApp}>
              I'm ready — begin my path <I.Arrow s={13} c="var(--ink)" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  MAIN APP
// ─────────────────────────────────────────────────────────────
export default function App() {
  const [boarded, setBoarded] = useState(false);
  const [profile, setProfile] = useState(null);
  const [show, setShow] = useState(false);

  const [tab, setTab] = useState("dashboard");
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [msgCount, setMsgCount] = useState(0);
  const [isPro, setIsPro] = useState(false);
  const [showPW, setShowPW] = useState(false);
  const [roadmap, setRoadmap] = useState(null);
  const [rmCk, setRmCk] = useState({});

  // Life OS
  const [xp, setXp] = useState(0);
  const [streak] = useState(1);
  const [quests, setQuests] = useState([]);
  const [doneQ, setDoneQ] = useState([]);
  const [wins, setWins] = useState([]);
  const [progress, setProgress] = useState(8);
  const [narrative, setNarrative] = useState("");
  const [prophecy, setProphecy] = useState("");
  const [identity, setIdentity] = useState(null);
  const [mood, setMood] = useState(null);
  const [pendingQ, setPendingQ] = useState(null);
  const [questsLoading, setQuestsLoading] = useState(false);
  const [xpToast, setXpToast] = useState(null);
  const [levelUpModal, setLevelUpModal] = useState(null); // { name, lv }
  const [xpShimmer, setXpShimmer] = useState(false);
  const [burst, setBurst] = useState(null); // { x, y }
  const toastTimer = useRef(null);
  const endRef = useRef(null);
  const taRef = useRef(null);

  const showToast = (amt, lbl) => {
    setXpToast({ amt, lbl });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setXpToast(null), 2800);
  };

  const fireBurst = (el) => {
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setBurst({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    setTimeout(() => setBurst(null), 700);
  };

  const triggerXpShimmer = () => {
    setXpShimmer(true);
    setTimeout(() => setXpShimmer(false), 800);
  };

  const handleDone = useCallback(async ({ persona, situation, goal, name, age, prologueProphecy }) => {
    const prof = { persona, situation, goal, name, age };
    setProfile(prof);
    const greet = name ? `Hey ${name}` : "Hello";
    setMsgs([{ role: "ai", content: `${greet} — you've named your North Star: *"${goal}"*\n\nThat took courage. Most people never say it out loud. I'm not here to give you information; I'm here to help you become the version of yourself who actually lives that goal.\n\nBefore I map your path, tell me something real: what have you already tried? And what stopped you?` }]);
    setBoarded(true);
    setTimeout(() => setShow(true), 80);
    // Prophecy already generated during prologue — set it immediately
    if (prologueProphecy) setProphecy(prologueProphecy);

    setQuestsLoading(true);
    const [q, narr, ident, freshProp] = await Promise.all([
      genQuests(prof, null),
      genNarrative(prof, [], 0, 1),
      genIdentity(prof, [], 0),
      prologueProphecy ? Promise.resolve(prologueProphecy) : genProphecy(prof),
    ]);
    setQuests(q); setNarrative(narr); setIdentity(ident);
    if (!prologueProphecy) setProphecy(freshProp);
    setQuestsLoading(false);
  }, []);


  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }) }, [msgs, loading]);

  const completeQuest = async (i, checkboxEl) => {
    if (doneQ.includes(i)) return;
    const q = quests[i];
    const oldLv = getLevel(xp).lv;
    setDoneQ(d => [...d, i]);
    const newXp = xp + (q.xp || 25);
    setXp(newXp);
    setProgress(p => Math.min(p + 7, 94));
    const newWins = [...wins, q.title].slice(-12);
    setWins(newWins);
    showToast(q.xp || 25, "Quest Complete");
    fireBurst(checkboxEl);
    triggerXpShimmer();
    // Level-up detection
    const newLvl = getLevel(newXp);
    if (newLvl.lv > oldLv) {
      setTimeout(() => {
        setLevelUpModal({ name: newLvl.name, lv: newLvl.lv });
        setTimeout(() => setLevelUpModal(null), 3200);
      }, 700);
    }
    // Refresh narrative
    const narr = await genNarrative(profile, newWins, msgCount, streak);
    setNarrative(narr);
    // Refresh identity
    const ident = await genIdentity(profile, newWins, msgCount);
    setIdentity(ident);
  };

  const handleMood = async (m) => {
    setMood(m);
    setDoneQ([]);
    setPendingQ(null);
    setQuestsLoading(true);
    const q = await genQuests(profile, m);
    setQuests(q);
    setQuestsLoading(false);
    showToast(5, "Mood Check-in");
  };

  const refreshQuests = async () => {
    setDoneQ([]); setPendingQ(null); setQuestsLoading(true);
    const q = await genQuests(profile, mood);
    setQuests(q); setQuestsLoading(false);
  };

  const blocked = !isPro && msgCount >= FREE_LIMIT;

  const doSend = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    if (blocked) { setShowPW(true); return; }
    setInput(""); if (taRef.current) taRef.current.style.height = "auto";
    const um = { role: "user", content: msg };
    const hist = [...msgs, um];
    setMsgs([...hist, { role: "ai", content: null }]);
    setLoading(true);
    const apiMsgs = hist.map(m => ({ role: m.role === "ai" ? "assistant" : "user", content: m.content }));
    try {
      const reply = await ai(apiMsgs, MENTOR_SYS(profile));
      const rm = parseRm(reply); const clean = stripRm(reply);
      if (rm) setRoadmap(rm);
      setMsgs([...hist, { role: "ai", content: clean }]);
      const nc = msgCount + 1; setMsgCount(nc);
      setXp(x => x + 10); setProgress(p => Math.min(p + 2, 94));
      showToast(10, "Conversation XP");
      // update narrative every 2 messages
      if (nc % 2 === 0) {
        const narr = await genNarrative(profile, wins, nc, streak);
        setNarrative(narr);
      }
    } catch (e) {
      setMsgs([...hist, { role: "ai", content: `Error: ${e.message}` }]);
    } finally { setLoading(false); }
  };

  const hk = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); doSend(); } };
  const ar = (e) => { e.target.style.height = "auto"; e.target.style.height = Math.min(e.target.scrollHeight, 130) + "px"; };
  const toggleRm = (pi, si) => { const k = `${pi}-${si}`; setRmCk(p => ({ ...p, [k]: !p[k] })); if (!rmCk[`${pi}-${si}`]) { setXp(x => x + 15); setProgress(p => Math.min(p + 3, 94)); showToast(15, "Milestone"); } };

  const lvl = getLevel(xp);
  const traitColors = ["var(--aqua)", "var(--rose)", "var(--gold)", "var(--violet)"];

  return (<>
    <style>{css}
      {`@keyframes draw-line{to{stroke-dashoffset:0}}
        @keyframes star-pop{from{opacity:0;transform:scale(0)}to{opacity:1;transform:scale(1)}}`}
    </style>
    <Starfield />

    {!boarded && <Onboarding onDone={handleDone} />}

    <div className={`shell${show ? " show" : ""}`}>

      {/* TOP BAR */}
      <header className="bar">
        <div className="logo">
          <span className="logo-spin"><I.Star s={19} style={{ color: "var(--gold)" }} /></span>
          PathFinder
        </div>
        {profile?.name && <div className="bar-mid">
          <I.Star s={10} style={{ color: "var(--gold)", flexShrink: 0 }} />
          <strong>Hey, {profile.name}</strong>
        </div>}
        <div className="bar-right">
          <div className="pill pill-xp"><I.Star s={9} style={{ color: "var(--violet)" }} />{xp} XP</div>
          <div className="pill pill-str"><I.Flame s={10} c="var(--gold)" />{streak}d</div>
          {!isPro && <button className="pro-btn" onClick={() => setShowPW(true)}><I.Lightning s={12} c="var(--ink)" />Pro</button>}
        </div>
      </header>

      {/* TABS */}
      <nav className="tabs">
        <button className={`tab${tab === "dashboard" ? " on" : ""}`} onClick={() => setTab("dashboard")}>
          <I.Mirror s={14} c={tab === "dashboard" ? "var(--gold)" : "currentColor"} /> Transformation
        </button>
        <button className={`tab${tab === "roadmap" ? " on" : ""}`} onClick={() => setTab("roadmap")}>
          <I.Map s={14} c={tab === "roadmap" ? "var(--gold)" : "currentColor"} /> Roadmap
          {roadmap && <span className="tab-dot">✦</span>}
        </button>
        <button className={`tab${tab === "chat" ? " on" : ""}`} onClick={() => setTab("chat")}>
          <I.Msg s={14} c={tab === "chat" ? "var(--gold)" : "currentColor"} /> Mentor
        </button>
      </nav>

      <div className="main">

        {/* ══════════ TRANSFORMATION DASHBOARD ══════════ */}
        {tab === "dashboard" && <div className="wboard">

          {/* Row 1: North Star + Daily Quests */}
          <div className="w-row w-row-2">
            <div className="widget ns" style={{ "--d": 0 }}>
              <div className="w-title"><I.Star s={10} style={{ color: "var(--gold)" }} /> North Star</div>
              {profile?.name && <div className="w-greeting">Hey, <span>{profile.name}</span> 👋</div>}
              <div className="ns-quote" style={{ marginTop: profile?.name ? ".5rem" : 0 }}>"{profile?.goal || "Your goal will appear here"}"</div>
              <div className="ns-bar-row" style={{ marginTop: "1rem" }}>
                <div className="ns-bar"><div className="ns-fill" style={{ width: progress + "%" }} /></div>
                <div className="ns-pct">{progress}%</div>
              </div>
              <div className="ns-phase" style={{ marginTop: ".5rem" }}>Phase 1 · Building foundations · {lvl.name}</div>
            </div>

            <div className="widget quest-hero" style={{ "--d": 1 }}>
              <div className="w-title" style={{ justifyContent: "space-between" }}>
                <span style={{ display: "flex", alignItems: "center", gap: ".38rem" }}>
                  <I.Lightning s={10} style={{ color: "var(--gold)" }} /> {mood ? `${mood} Quests` : "Daily Quests"}
                </span>
                <button className="qq-reload" onClick={refreshQuests} title="Refresh quests"><I.Refresh s={12} c="currentColor" /></button>
              </div>
              <div className="mood-row" style={{ marginBottom: "1.1rem" }}>
                {MOODS.map(m => (
                  <button key={m.l} className={`mood-btn${mood === m.l ? " picked" : ""}`} onClick={() => handleMood(m.l)}>
                    <span className="mood-ico">{m.e}</span>
                    <span className="mood-lbl">{m.l}</span>
                  </button>
                ))}
              </div>
              <div style={{ minHeight: "200px" }}>
                {questsLoading
                  ? <div style={{ color: "var(--dim)", fontSize: ".8rem", fontStyle: "italic" }}>Generating quests...</div>
                  : <div className="qq-list">
                    {quests.map((q, i) => {
                      const isPending = pendingQ === i;
                      const isDone = doneQ.includes(i);
                      return (
                        <div key={i} className={`qq${isDone ? " done" : ""}`}
                          onClick={() => { if (!isDone) setPendingQ(isPending ? null : i); }}>
                          <div className="qq-box" id={`qq-box-${i}`}>
                            {isDone && <I.Check s={10} c="var(--aqua)" />}
                            {isPending && !isDone && <I.Check s={10} c="var(--gold)" />}
                          </div>
                          <div className="qq-body">
                            <div className="qq-title">{q.title}</div>
                            {isPending && !isDone
                              ? <div style={{ display: "flex", gap: ".45rem", marginTop: ".5rem", alignItems: "center" }}>
                                <button style={{ background: "var(--aqua)", color: "var(--ink)", border: "none", borderRadius: "6px", padding: ".3rem .75rem", fontSize: ".75rem", fontWeight: 700, cursor: "pointer", fontFamily: "DM Sans,sans-serif" }}
                                  onClick={e => { e.stopPropagation(); completeQuest(i, document.getElementById(`qq-box-${i}`)); setPendingQ(null); }}>
                                  ✓ Mark complete
                                </button>
                                <button style={{ background: "none", border: "1px solid var(--line)", color: "var(--dim)", borderRadius: "6px", padding: ".3rem .75rem", fontSize: ".75rem", cursor: "pointer", fontFamily: "DM Sans,sans-serif" }}
                                  onClick={e => { e.stopPropagation(); setPendingQ(null); }}>
                                  Cancel
                                </button>
                              </div>
                              : <div className="qq-why">{q.why}</div>
                            }
                            {!isPending && <div className="qq-meta">
                              <span className="qq-xp">+{q.xp} XP</span>
                              <span className={`qq-diff diff-${q.diff?.charAt(0) || "m"}`}>{q.diff}</span>
                            </div>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                }
              </div>
            </div>
          </div>

          {/* Row 2: Identity | Streak | XP */}
          <div className="w-row w-row-3">
            <div className="widget id-card" style={{ "--d": 2 }}>
              <div className="w-title"><I.Eye s={10} style={{ color: "var(--violet)" }} /> Who You're Becoming</div>
              {identity ? (
                <>
                  <div className="id-headline" style={{ marginBottom: ".75rem" }}>"{identity.headline}"</div>
                  <div className="id-traits">
                    {identity.traits?.map((t, i) => (
                      <div className="id-trait" key={i}>
                        <div className="id-trait-lbl">{t.label}</div>
                        <div className="id-trait-bar"><div className="id-trait-fill" style={{ width: t.score + "%", background: traitColors[i % 4] }} /></div>
                        <div className="id-trait-pct">{t.score}%</div>
                      </div>
                    ))}
                  </div>
                </>
              ) : <div style={{ color: "var(--dim)", fontSize: ".8rem", fontStyle: "italic" }}>Building your identity profile...</div>}
            </div>

            <div className="widget" style={{ "--d": 3 }}>
              <div className="w-title"><I.Flame s={10} c="var(--gold)" /> Streak</div>
              <div className="streak-n">{streak}</div>
              <div style={{ fontSize: ".75rem", color: "var(--dim)", marginTop: ".25rem" }}>days in a row</div>
              <div className="streak-dots" style={{ marginTop: ".85rem" }}>{[...Array(7)].map((_, i) => <div key={i} className={`sdot${i < streak ? " lit" : ""}`} />)}</div>
            </div>

            <div className="widget" style={{ "--d": 4 }}>
              <div className="w-title"><I.Crystal s={10} style={{ color: "var(--violet)" }} /> XP & Level</div>
              <div className="lvl-badge">LVL {lvl.lv}</div>
              <div className="xp-n">{xp}</div>
              <div style={{ fontSize: ".72rem", color: "var(--dim)", marginTop: ".2rem" }}>total earned</div>
              <div className="xp-bar" style={{ marginTop: ".75rem", position: "relative" }}>
                <div className="xp-fill" style={{ width: lvl.pct + "%" }} />
                {xpShimmer && <div className="xp-fill-shimmer" />}
              </div>
              <div style={{ fontSize: ".68rem", color: "var(--dim)", marginTop: ".3rem" }}>{lvl.toNext} XP → {LEVELS[lvl.lv] || "Legend"}</div>
            </div>
          </div>

          {/* Row 3: Narrative + Prophecy */}
          <div className="w-row w-row-2">
            <div className="widget narr" style={{ "--d": 5 }}>
              <div className="reflect-label"><I.Star s={11} style={{ color: "var(--violet)", opacity: .7 }} /> Your Story So Far</div>
              <div className="narr-row">
                <div className="narr-av"><I.Star s={14} style={{ color: "var(--gold)" }} /></div>
                <div className="narr-msg">{narrative || "PathFinder is reading your journey..."}</div>
              </div>
              <div className="narr-btns">
                <button className="narr-btn" onClick={() => setTab("chat")}>Talk to mentor</button>
                <button className="narr-ghost" onClick={async () => { const n = await genNarrative(profile, wins, msgCount, streak); setNarrative(n); }}>Refresh</button>
              </div>
            </div>

            <div className="widget prop" style={{ "--d": 6 }}>
              <div className="reflect-label"><I.Eye s={11} style={{ color: "var(--rose)", opacity: .7 }} /> Prophecy — What's Coming</div>
              {prophecy
                ? <><div className="prop-msg">{prophecy}</div><span className="prop-week">Week 2–4 Prediction</span></>
                : <div style={{ color: "var(--dim)", fontSize: ".8rem", fontStyle: "italic" }}>Analyzing your path...</div>
              }
            </div>
          </div>

          {/* Row 4: Win Constellation full width */}
          <div className="w-row w-row-1">
            <div className="widget" style={{ "--d": 7 }}>
              <div className="w-title" style={{ justifyContent: "space-between" }}>
                <span style={{ display: "flex", alignItems: "center", gap: ".38rem" }}>
                  <I.Crystal s={10} style={{ color: "var(--aqua)" }} /> Win Constellation
                </span>
                <div style={{ display: "flex", alignItems: "baseline", gap: ".3rem" }}>
                  <span className="const-counter">{wins.length}</span>
                  <span className="const-sub">wins</span>
                </div>
              </div>
              <div className="const-wrap"><Constellation wins={wins} /></div>
            </div>
          </div>

        </div>}

        {/* ══════════ ROADMAP ══════════ */}
        {tab === "roadmap" && <div className="rm-view">
          {!roadmap ? (
            <div className="rm-empty">
              <I.Map s={46} c="var(--dim)" />
              <h3>Your roadmap is building</h3>
              <p style={{ fontSize: ".88rem", maxWidth: "320px", lineHeight: "1.65" }}>Chat with your mentor. After a few real exchanges, PathFinder generates a phase-by-phase roadmap built entirely around your conversations — not generic templates.</p>
              <button style={{ marginTop: ".6rem", background: "var(--gold)", color: "var(--ink)", border: "none", padding: ".72rem 1.4rem", borderRadius: "6px", fontFamily: "DM Sans,sans-serif", fontWeight: 600, fontSize: ".86rem", cursor: "pointer", display: "flex", alignItems: "center", gap: ".45rem" }} onClick={() => setTab("chat")}>
                Start talking <I.Arrow s={13} c="var(--ink)" />
              </button>
            </div>
          ) : (
            <>
              <div className="rm-hd">
                <h2>{roadmap.title}</h2>
                <p>{roadmap.subtitle}</p>
              </div>
              {roadmap.phases?.map((ph, pi) => (
                <div className="rm-phase" key={pi}>
                  <div className="rph-hd">
                    <div className="rph-n">{pi + 1}</div>
                    <span className="rph-title">{ph.title}</span>
                    {ph.timeline && <span className="rph-time">{ph.timeline}</span>}
                  </div>
                  <div className="rm-steps">
                    {ph.steps?.map((st, si) => {
                      const k = `${pi}-${si}`, done = rmCk[k];
                      return (
                        <div className="rm-step" key={si} style={{ opacity: done ? .48 : 1 }}>
                          <div className={`rm-check${done ? " ck" : ""}`} onClick={() => toggleRm(pi, si)}>{done && <I.Check s={9} c="var(--ink)" />}</div>
                          <div className="rm-sc">
                            <h4 style={{ textDecoration: done ? "line-through" : "none" }}>{st.title}</h4>
                            <p>{st.detail}</p>
                            {st.tag && <span className="stag">{st.tag}</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>}

        {/* ══════════ MENTOR CHAT ══════════ */}
        {tab === "chat" && <div className="chat-view">
          <div className="chat-hd">
            <div className="chat-av"><I.Star s={15} style={{ color: "var(--gold)" }} /></div>
            <div className="chat-info"><h3>PathFinder Mentor</h3><p>Transformation guide · not a chatbot</p></div>
            <div className="online"><div className="odot" /> Active</div>
          </div>

          <div className="msgs">
            {msgs.map((m, i) => (
              <div key={i} className={`mrow ${m.role}`}>
                <div className={`mav ${m.role}`}>
                  {m.role === "ai" ? <I.Star s={12} style={{ color: "var(--gold)" }} /> : <I.User s={11} c="var(--dim)" />}
                </div>
                <div className="bub">
                  {m.content === null
                    ? <div className="typing"><span /><span /><span /></div>
                    : m.content.split("\n").map((ln, j, a) => <span key={j}>{ln}{j < a.length - 1 && <br />}</span>)
                  }
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          {msgs.length <= 1 && (
            <div className="chips">
              {["What should I do today?", "What's actually blocking me?", "Tell me what you see in me", "Generate my roadmap now"].map(c => (
                <button key={c} className="chip" onClick={() => doSend(c)}>{c}</button>
              ))}
            </div>
          )}

          {roadmap && (
            <div style={{ margin: "0 1.4rem .6rem", background: "rgba(232,184,75,.07)", border: "1px solid var(--line-gold)", borderRadius: "8px", padding: ".58rem .95rem", fontSize: ".78rem", display: "flex", alignItems: "center", gap: ".48rem", cursor: "pointer" }} onClick={() => setTab("roadmap")}>
              <I.Map s={12} c="var(--gold)" /><strong style={{ color: "var(--gold)" }}>Roadmap ready</strong> — view your personalized path →
            </div>
          )}

          <div className="iarea">
            <textarea ref={taRef} className="ita"
              placeholder={blocked ? "Upgrade to Pro to continue..." : "Talk to your mentor..."}
              value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={hk} onInput={ar} rows={1} disabled={loading || blocked}
            />
            <button className="sbtn" onClick={() => doSend()} disabled={!input.trim() || loading || blocked}>
              <I.Send s={14} c="var(--ink)" />
            </button>
          </div>
        </div>}

      </div>
    </div >

    {/* XP TOAST */}
    {xpToast && <div className="xpt"><I.Star s={11} style={{ color: "var(--violet)" }} /> +{xpToast.amt} XP · {xpToast.lbl}</div>}

    {/* PARTICLE BURST */}
    {burst && (
      <div className="burst-wrap" style={{ left: burst.x, top: burst.y }}>
        {[...Array(8)].map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const dist = 38 + Math.random() * 22;
          const colors = ["var(--gold)", "var(--aqua)", "var(--violet)", "var(--rose)"];
          return (
            <div key={i} className="burst-p" style={{
              background: colors[i % 4],
              "--tx": `${Math.cos(angle) * dist}px`,
              "--ty": `${Math.sin(angle) * dist}px`,
              animationDelay: `${i * 0.04}s`,
            }} />
          );
        })}
      </div>
    )}

    {/* LEVEL-UP MODAL */}
    {levelUpModal && (
      <div className="lvlup" onClick={() => setLevelUpModal(null)}>
        <div className="lvlup-card">
          <div className="lvlup-star"><I.Star s={64} style={{ color: "var(--gold)" }} /></div>
          <div className="lvlup-eyebrow">Level Up</div>
          <div className="lvlup-name">{levelUpModal.name}</div>
          <div className="lvlup-sub">You've reached Level {levelUpModal.lv}. The path ahead is clearer now.</div>
        </div>
      </div>
    )}

    {/* PAYWALL */}
    {
      showPW && <div className="overlay" onClick={e => e.target === e.currentTarget && setShowPW(false)}>
        <div className="pw">
          <div className="pw-ico"><I.Star s={26} style={{ color: "var(--gold)" }} /></div>
          <h2>Unlock Your Full Transformation</h2>
          <p>You've used your free messages. Upgrade for unlimited mentor access, advanced quest generation, full roadmap evolution, and identity tracking.</p>
          <div className="plans">
            <div className="plan">
              <h3>Monthly</h3><div className="pprice">$12<span>/mo</span></div>
              <div className="pfeats">Unlimited mentor<br />Daily quest gen<br />Full roadmap</div>
            </div>
            <div className="plan f">
              <div className="pbest"><I.Star s={9} style={{ color: "var(--gold)" }} /> Best Value</div>
              <h3>Annual</h3><div className="pprice">$79<span>/yr</span></div>
              <div className="pfeats">Everything Monthly<br />Identity tracking<br />Prophecy engine<br />Save 45%</div>
            </div>
          </div>
          <button className="pw-cta" onClick={() => { setIsPro(true); setShowPW(false); }}>
            <I.Lightning s={14} c="var(--ink)" /> Begin Full Transformation
          </button>
          <div className="pw-skip" onClick={() => setShowPW(false)}>Maybe later</div>
        </div>
      </div>
    }
  </>);
}
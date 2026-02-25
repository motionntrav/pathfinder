import { useState, useEffect, useRef, useCallback } from "react";
import "./pathfinder-app.css";

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
//  CONSTANTS

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



// ─────────────────────────────────────────────────────────────
//  CLAUDE
// ─────────────────────────────────────────────────────────────
async function ai(messages, system, max_tokens = 1000) {
  const r = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ system, messages, max_tokens }),
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

import { useGameStore, getLevel } from "./store/gameStore";
import { useUiStore } from "./store/uiStore";

export default function App() {
  // ── Game state (persisted) ──
  const xp = useGameStore(s => s.xp);
  const streak = useGameStore(s => s.streak);
  const quests = useGameStore(s => s.quests);
  const doneQ = useGameStore(s => s.doneQ);
  const wins = useGameStore(s => s.wins);
  const progress = useGameStore(s => s.progress);
  const narrative = useGameStore(s => s.narrative);
  const prophecy = useGameStore(s => s.prophecy);
  const identity = useGameStore(s => s.identity);
  const mood = useGameStore(s => s.mood);
  const roadmap = useGameStore(s => s.roadmap);
  const rmCk = useGameStore(s => s.rmCk);
  const { setQuests, completeQuest: storeCompleteQuest, setMood, setNarrative,
    setIdentity, setRoadmap, toggleRmCk, resetQuests } = useGameStore.getState();

  // ── UI state (ephemeral) ──
  const tab = useUiStore(s => s.tab);
  const msgs = useUiStore(s => s.msgs);
  const input = useUiStore(s => s.input);
  const loading = useUiStore(s => s.loading);
  const msgCount = useUiStore(s => s.msgCount);
  const isPro = useUiStore(s => s.isPro);
  const showPW = useUiStore(s => s.showPW);
  const xpToast = useUiStore(s => s.xpToast);
  const levelUpModal = useUiStore(s => s.levelUpModal);
  const xpShimmer = useUiStore(s => s.xpShimmer);
  const burst = useUiStore(s => s.burst);
  const questsLoading = useUiStore(s => s.questsLoading);
  const pendingQ = useUiStore(s => s.pendingQ);
  const { setTab, setInput, setLoading, setIsPro, setShowPW, setQuestsLoading,
    setPendingQ, setXpShimmer, setBurst, addMsg, updateLastMsg,
    showToast, showLevelUp, clearLevelUp } = useUiStore.getState();

  const [boarded, setBoarded] = useState(false);
  const [profile, setProfile] = useState(null);
  const [show, setShow] = useState(false);
  const endRef = useRef(null);
  const taRef = useRef(null);

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
    addMsg({ role: "ai", content: `${greet} — you've named your North Star: *"${goal}"*\n\nThat took courage. Most people never say it out loud. I'm not here to give you information; I'm here to help you become the version of yourself who actually lives that goal.\n\nBefore I map your path, tell me something real: what have you already tried? And what stopped you?` });
    setBoarded(true);
    setTimeout(() => setShow(true), 80);
    if (prologueProphecy) useGameStore.getState().setProphecy(prologueProphecy);

    setQuestsLoading(true);
    const [q, narr, ident, freshProp] = await Promise.all([
      genQuests(prof, null),
      genNarrative(prof, [], 0, 1),
      genIdentity(prof, [], 0),
      prologueProphecy ? Promise.resolve(prologueProphecy) : genProphecy(prof),
    ]);
    setQuests(q); setNarrative(narr); setIdentity(ident);
    if (!prologueProphecy) useGameStore.getState().setProphecy(freshProp);
    setQuestsLoading(false);
  }, []);


  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }) }, [msgs, loading]);

  const completeQuest = async (questId, checkboxEl) => {
    const q = quests.find(q => q.id === questId);
    if (!q || doneQ.includes(questId)) return;
    const result = storeCompleteQuest(q);
    showToast(result.xpGain, "Quest Complete");
    fireBurst(checkboxEl);
    setXpShimmer(true); setTimeout(() => setXpShimmer(false), 800);
    if (result.leveledUp) {
      setTimeout(() => {
        showLevelUp(result.name, result.lv);
        setTimeout(() => clearLevelUp(), 3200);
      }, 700);
    }
    const newWins = useGameStore.getState().wins;
    const narr = await genNarrative(profile, newWins, msgCount, streak);
    setNarrative(narr);
    const ident = await genIdentity(profile, newWins, msgCount);
    setIdentity(ident);
  };

  const handleMood = async (m) => {
    setMood(m);
    resetQuests();
    setPendingQ(null);
    setQuestsLoading(true);
    const q = await genQuests(profile, m);
    setQuests(q);
    setQuestsLoading(false);
    showToast(5, "Mood Check-in");
  };

  const refreshQuests = async () => {
    resetQuests(); setPendingQ(null); setQuestsLoading(true);
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
    const currentMsgs = useUiStore.getState().msgs;
    const hist = [...currentMsgs, um];
    addMsg(um);
    addMsg({ role: "ai", content: null });
    setLoading(true);
    const apiMsgs = hist.map(m => ({ role: m.role === "ai" ? "assistant" : "user", content: m.content }));
    try {
      const reply = await ai(apiMsgs, MENTOR_SYS(profile));
      const rm = parseRm(reply); const clean = stripRm(reply);
      if (rm) setRoadmap(rm);
      updateLastMsg({ content: clean });
      const nc = useUiStore.getState().msgCount;
      useGameStore.getState().addXp(10);
      useGameStore.getState().setProgress = undefined; // progress handled in addXp
      showToast(10, "Conversation XP");
      if (nc % 2 === 0) {
        const currentWins = useGameStore.getState().wins;
        const narr = await genNarrative(profile, currentWins, nc, streak);
        setNarrative(narr);
      }
    } catch (e) {
      updateLastMsg({ content: `Error: ${e.message}` });
    } finally { setLoading(false); }
  };

  const hk = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); doSend(); } };
  const ar = (e) => { e.target.style.height = "auto"; e.target.style.height = Math.min(e.target.scrollHeight, 130) + "px"; };
  const toggleRm = (pi, si) => {
    const k = `${pi}-${si}`;
    if (!rmCk[k]) { useGameStore.getState().addXp(15); showToast(15, "Milestone"); }
    toggleRmCk(k);
  };

  const lvl = getLevel(xp);
  const traitColors = ["var(--aqua)", "var(--rose)", "var(--gold)", "var(--violet)"];

  return (<>
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
                    {quests.map((q) => {
                      const isPending = pendingQ === q.id;
                      const isDone = doneQ.includes(q.id);
                      return (
                        <div key={q.id} className={`qq${isDone ? " done" : ""}`}
                          onClick={() => { if (!isDone) setPendingQ(isPending ? null : q.id); }}>
                          <div className="qq-box" id={`qq-box-${q.id}`}>
                            {isDone && <I.Check s={10} c="var(--aqua)" />}
                            {isPending && !isDone && <I.Check s={10} c="var(--gold)" />}
                          </div>
                          <div className="qq-body">
                            <div className="qq-title">{q.title}</div>
                            {isPending && !isDone
                              ? <div style={{ display: "flex", gap: ".45rem", marginTop: ".5rem", alignItems: "center" }}>
                                <button style={{ background: "var(--aqua)", color: "var(--ink)", border: "none", borderRadius: "6px", padding: ".3rem .75rem", fontSize: ".75rem", fontWeight: 700, cursor: "pointer", fontFamily: "DM Sans,sans-serif" }}
                                  onClick={e => { e.stopPropagation(); completeQuest(q.id, document.getElementById(`qq-box-${q.id}`)); setPendingQ(null); }}>
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
              <div style={{ fontSize: ".68rem", color: "var(--dim)", marginTop: ".3rem" }}>{lvl.toNext} XP → {lvl.name}</div>
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
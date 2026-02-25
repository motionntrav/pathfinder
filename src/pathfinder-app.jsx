import { useState, useEffect, useRef, useCallback } from "react";
import "./pathfinder-app.css";

// ── Modules ──
import { I } from "./icons.jsx";
import { FREE_LIMIT, MENTOR_SYS } from "./constants.js";
import { ai, parseRm, stripRm, genQuests, genNarrative, genIdentity, genProphecy } from "./services/ai.js";
import { useGameStore, getLevel } from "./store/gameStore.js";
import { useUiStore } from "./store/uiStore.js";

// ── Components ──
import { Starfield } from "./components/Starfield.jsx";
import { Onboarding } from "./components/Onboarding.jsx";
import { Dashboard } from "./components/Dashboard.jsx";
import { MentorChat } from "./components/MentorChat.jsx";
import { Roadmap } from "./components/Roadmap.jsx";

// ─────────────────────────────────────────────────────────────
//  APP SHELL
// ─────────────────────────────────────────────────────────────
export default function App() {
  // ── Game state ──
  const xp = useGameStore(s => s.xp);
  const streak = useGameStore(s => s.streak);
  const quests = useGameStore(s => s.quests);
  const doneQ = useGameStore(s => s.doneQ);
  const wins = useGameStore(s => s.wins);
  const roadmap = useGameStore(s => s.roadmap);
  const rmCk = useGameStore(s => s.rmCk);
  const mood = useGameStore(s => s.mood);
  const { setQuests, completeQuest: storeCompleteQuest, setMood, setNarrative,
    setIdentity, setRoadmap, toggleRmCk, resetQuests } = useGameStore.getState();

  // ── UI state ──
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
  const { setTab, setInput, setLoading, setIsPro, setShowPW, setQuestsLoading,
    setPendingQ, setXpShimmer, setBurst, addMsg, updateLastMsg,
    showToast, showLevelUp, clearLevelUp } = useUiStore.getState();

  const [boarded, setBoarded] = useState(false);
  const [profile, setProfile] = useState(null);
  const [show, setShow] = useState(false);
  const endRef = useRef(null);

  // ── Auto-scroll chat ──
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, loading]);

  // ── Particle burst ──
  const fireBurst = (el) => {
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setBurst({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    setTimeout(() => setBurst(null), 700);
  };

  // ── Onboarding complete ──
  const handleDone = useCallback(async ({ persona, situation, goal, name, age, prologueProphecy }) => {
    const prof = { persona, situation, goal, name, age };
    setProfile(prof);
    addMsg({ role: "ai", content: `${name ? `Hey ${name}` : "Hello"} — you've named your North Star: *"${goal}"*\n\nThat took courage. Most people never say it out loud. I'm not here to give you information; I'm here to help you become the version of yourself who actually lives that goal.\n\nBefore I map your path, tell me something real: what have you already tried? And what stopped you?` });
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

  // ── Quest complete ──
  const handleCompleteQuest = async (questId, checkboxEl) => {
    const q = quests.find(q => q.id === questId);
    if (!q || doneQ.includes(questId)) return;
    const result = storeCompleteQuest(q);
    showToast(result.xpGain, "Quest Complete");
    fireBurst(checkboxEl);
    setXpShimmer(true); setTimeout(() => setXpShimmer(false), 800);
    if (result.leveledUp) {
      setTimeout(() => { showLevelUp(result.name, result.lv); setTimeout(clearLevelUp, 3200); }, 700);
    }
    const newWins = useGameStore.getState().wins;
    const [narr, ident] = await Promise.all([
      genNarrative(profile, newWins, msgCount, streak),
      genIdentity(profile, newWins, msgCount),
    ]);
    setNarrative(narr); setIdentity(ident);
  };

  // ── Mood check-in ──
  const handleMood = async (m) => {
    setMood(m); resetQuests(); setPendingQ(null); setQuestsLoading(true);
    const q = await genQuests(profile, m);
    setQuests(q); setQuestsLoading(false);
    showToast(5, "Mood Check-in");
  };

  // ── Refresh quests ──
  const handleRefreshQuests = async () => {
    resetQuests(); setPendingQ(null); setQuestsLoading(true);
    const q = await genQuests(profile, mood);
    setQuests(q); setQuestsLoading(false);
  };

  // ── Chat send ──
  const handleSend = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    const blocked = !isPro && msgCount >= FREE_LIMIT;
    if (blocked) { setShowPW(true); return; }
    setInput("");
    const currentMsgs = useUiStore.getState().msgs;
    const hist = [...currentMsgs, { role: "user", content: msg }];
    addMsg({ role: "user", content: msg });
    addMsg({ role: "ai", content: null });
    setLoading(true);
    const apiMsgs = hist.map(m => ({ role: m.role === "ai" ? "assistant" : "user", content: m.content }));
    try {
      const reply = await ai(apiMsgs, MENTOR_SYS(profile));
      const rm = parseRm(reply); const clean = stripRm(reply);
      if (rm) setRoadmap(rm);
      updateLastMsg({ content: clean });
      useGameStore.getState().addXp(10);
      showToast(10, "Conversation XP");
      const nc = useUiStore.getState().msgCount;
      if (nc % 2 === 0) {
        const narr = await genNarrative(profile, useGameStore.getState().wins, nc, streak);
        setNarrative(narr);
      }
    } catch (e) {
      updateLastMsg({ content: `Error: ${e.message}` });
    } finally { setLoading(false); }
  };

  const lvl = getLevel(xp);

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
        {tab === "dashboard" && (
          <Dashboard
            profile={profile}
            onCompleteQuest={handleCompleteQuest}
            onRefreshQuests={handleRefreshQuests}
            onHandleMood={handleMood}
            onTabChange={setTab}
          />
        )}
        {tab === "roadmap" && <Roadmap onTabChange={setTab} />}
        {tab === "chat" && <MentorChat profile={profile} onSend={handleSend} onTabChange={setTab} />}
      </div>
    </div>

    {/* XP TOAST */}
    {xpToast && <div className="xpt"><I.Star s={11} style={{ color: "var(--violet)" }} /> +{xpToast.amt} XP · {xpToast.lbl}</div>}

    {/* PARTICLE BURST */}
    {burst && (
      <div className="burst-wrap" style={{ left: burst.x, top: burst.y }}>
        {[...Array(8)].map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const dist = 38 + Math.random() * 22;
          const colors = ["var(--gold)", "var(--aqua)", "var(--violet)", "var(--rose)"];
          return <div key={i} className="burst-p" style={{ background: colors[i % 4], "--tx": `${Math.cos(angle) * dist}px`, "--ty": `${Math.sin(angle) * dist}px`, animationDelay: `${i * 0.04}s` }} />;
        })}
      </div>
    )}

    {/* LEVEL-UP MODAL */}
    {levelUpModal && (
      <div className="lvlup" onClick={clearLevelUp}>
        <div className="lvlup-card">
          <div className="lvlup-star"><I.Star s={64} style={{ color: "var(--gold)" }} /></div>
          <div className="lvlup-eyebrow">Level Up</div>
          <div className="lvlup-name">{levelUpModal.name}</div>
          <div className="lvlup-sub">You've reached Level {levelUpModal.lv}. The path ahead is clearer now.</div>
        </div>
      </div>
    )}

    {/* PAYWALL */}
    {showPW && (
      <div className="overlay" onClick={e => e.target === e.currentTarget && setShowPW(false)}>
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
    )}
  </>);
}
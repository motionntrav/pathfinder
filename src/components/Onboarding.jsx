import { useState } from "react";
import { I, PersonaIcon } from "../icons.jsx";
import { PERSONAS, PERSONA_DESC, SITUATIONS } from "../constants.js";
import { genProphecy } from "../services/ai.js";

export function Onboarding({ onDone }) {
    const [step, setStep] = useState(1);
    const [out, setOut] = useState(false);
    const [persona, setPersona] = useState(null);
    const [sit, setSit] = useState(null);
    const [goal, setGoal] = useState("");
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [prologueProphecy, setPrologueProphecy] = useState("");

    const next = () => { setOut(true); setTimeout(() => { setOut(false); setStep(s => s + 1); }, 360); };
    const back = () => { setOut(true); setTimeout(() => { setOut(false); setStep(s => s - 1); }, 300); };

    const launch = async () => {
        setStep(6);
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
            {step < 6 && (
                <div className="ob-dots">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className={`od ${step === i ? "on" : step > i ? "was" : ""}`} />
                    ))}
                </div>
            )}

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
                            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey && goal.trim().length > 10) { e.preventDefault(); launch(); } }}
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

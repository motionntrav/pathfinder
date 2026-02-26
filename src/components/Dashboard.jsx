import { I } from "../icons.jsx";
import { MOODS } from "../constants.js";
import { Constellation } from "./Constellation.jsx";
import { useGameStore, getLevel, getProgress } from "../store/gameStore.js";
import { useUiStore } from "../store/uiStore.js";
import { genNarrative, genIdentity } from "../services/ai.js";

const TRAIT_COLORS = ["var(--aqua)", "var(--rose)", "var(--gold)", "var(--violet)"];

export function Dashboard({ profile, onCompleteQuest, onRefreshQuests, onHandleMood, onTabChange }) {
    const xp = useGameStore(s => s.xp);
    const streak = useGameStore(s => s.streak);
    const quests = useGameStore(s => s.quests);
    const doneQ = useGameStore(s => s.doneQ);
    const wins = useGameStore(s => s.wins);
    const progress = useGameStore(getProgress);
    const narrative = useGameStore(s => s.narrative);
    const prophecy = useGameStore(s => s.prophecy);
    const identity = useGameStore(s => s.identity);
    const mood = useGameStore(s => s.mood);
    const { setNarrative, setIdentity } = useGameStore.getState();

    const questsLoading = useUiStore(s => s.questsLoading);
    const xpShimmer = useUiStore(s => s.xpShimmer);
    const pendingQ = useUiStore(s => s.pendingQ);
    const { setPendingQ } = useUiStore.getState();
    const msgCount = useUiStore(s => s.msgCount);

    const lvl = getLevel(xp);

    return (
        <div className="wboard">

            {/* Row 1 */}
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
                        <button className="qq-reload" onClick={onRefreshQuests} title="Refresh quests"><I.Refresh s={12} c="currentColor" /></button>
                    </div>
                    <div className="mood-row" style={{ marginBottom: "1.1rem" }}>
                        {MOODS.map(m => (
                            <button key={m.l} className={`mood-btn${mood === m.l ? " picked" : ""}`} onClick={() => onHandleMood(m.l)}>
                                <span className="mood-ico">{m.e}</span>
                                <span className="mood-lbl">{m.l}</span>
                            </button>
                        ))}
                    </div>
                    <div style={{ minHeight: "200px" }}>
                        {questsLoading
                            ? <div style={{ display: "flex", flexDirection: "column", gap: ".85rem", paddingTop: ".15rem" }}>
                                {[0, 1, 2].map(i => (
                                    <div key={i} style={{ display: "flex", gap: ".75rem", alignItems: "flex-start" }}>
                                        <div className="skel" style={{ width: 18, height: 18, borderRadius: 5, flexShrink: 0, marginTop: 2 }} />
                                        <div style={{ flex: 1 }}>
                                            <div className="skel skel-line med" />
                                            <div className="skel skel-line sm short" />
                                        </div>
                                    </div>
                                ))}
                            </div>
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
                                                            onClick={e => { e.stopPropagation(); onCompleteQuest(q.id, document.getElementById(`qq-box-${q.id}`)); setPendingQ(null); }}>
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

            {/* Row 2 */}
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
                                        <div className="id-trait-bar"><div className="id-trait-fill" style={{ width: t.score + "%", background: TRAIT_COLORS[i % 4] }} /></div>
                                        <div className="id-trait-pct">{t.score}%</div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="skel skel-line lg med" style={{ marginBottom: "1rem" }} />
                            {[0, 1, 2, 3].map(i => (
                                <div key={i} style={{ marginBottom: ".7rem" }}>
                                    <div className="skel skel-line sm" style={{ width: "40%", marginBottom: ".3rem" }} />
                                    <div className="skel skel-bar full" />
                                </div>
                            ))}
                        </>
                    )}
                </div>

                <div className="widget" style={{ "--d": 3 }}>
                    <div className="w-title"><I.Flame s={10} c="var(--gold)" /> Streak</div>
                    <div className="streak-n">{streak}</div>
                    <div style={{ fontSize: ".75rem", color: "var(--dim)", marginTop: ".25rem" }}>days in a row</div>
                    <div className="streak-dots" style={{ marginTop: ".85rem" }}>{[...Array(7)].map((_, i) => <div key={i} className={`sdot${i < streak ? " lit" : ""}`} />)}</div>
                </div>

                <div className="widget" style={{ "--d": 4 }}>
                    <div className="w-title"><I.Crystal s={10} style={{ color: "var(--violet)" }} /> XP &amp; Level</div>
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

            {/* Row 3 */}
            <div className="w-row w-row-2">
                <div className="widget narr" style={{ "--d": 5 }}>
                    <div className="reflect-label"><I.Star s={11} style={{ color: "var(--violet)", opacity: .7 }} /> Your Story So Far</div>
                    <div className="narr-row">
                        <div className="narr-av"><I.Star s={14} style={{ color: "var(--gold)" }} /></div>
                        {narrative
                            ? <div className="narr-msg">{narrative}</div>
                            : <div style={{ flex: 1 }}>
                                <div className="skel skel-line full" />
                                <div className="skel skel-line med" />
                                <div className="skel skel-line short" />
                            </div>
                        }
                    </div>
                    <div className="narr-btns">
                        <button className="narr-btn" onClick={() => onTabChange("chat")}>Talk to mentor</button>
                        <button className="narr-ghost" onClick={async () => {
                            const n = await genNarrative(profile, wins, msgCount, streak);
                            setNarrative(n);
                        }}>Refresh</button>
                    </div>
                </div>

                <div className="widget prop" style={{ "--d": 6 }}>
                    <div className="reflect-label"><I.Eye s={11} style={{ color: "var(--rose)", opacity: .7 }} /> Prophecy — What's Coming</div>
                    {prophecy
                        ? <><div className="prop-msg">{prophecy}</div><span className="prop-week">Week 2–4 Prediction</span></>
                        : <div style={{ paddingTop: ".2rem" }}>
                            <div className="skel skel-line full" />
                            <div className="skel skel-line med" />
                            <div className="skel skel-line short" style={{ marginBottom: 0 }} />
                        </div>
                    }
                </div>
            </div>

            {/* Row 4 */}
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

        </div>
    );
}

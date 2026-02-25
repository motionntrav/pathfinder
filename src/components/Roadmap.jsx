import { I } from "../icons.jsx";
import { useGameStore } from "../store/gameStore.js";

export function Roadmap({ onTabChange }) {
    const roadmap = useGameStore(s => s.roadmap);
    const rmCk = useGameStore(s => s.rmCk);
    const { toggleRmCk } = useGameStore.getState();

    const handleToggle = (pi, si) => {
        const k = `${pi}-${si}`;
        if (!rmCk[k]) {
            useGameStore.getState().addXp(15);
        }
        toggleRmCk(k);
    };

    if (!roadmap) {
        return (
            <div className="rm-view">
                <div className="rm-empty">
                    <I.Map s={46} c="var(--dim)" />
                    <h3>Your roadmap is building</h3>
                    <p style={{ fontSize: ".88rem", maxWidth: "320px", lineHeight: "1.65" }}>
                        Chat with your mentor. After a few real exchanges, PathFinder generates a phase-by-phase roadmap built entirely around your conversations — not generic templates.
                    </p>
                    <button style={{ marginTop: ".6rem", background: "var(--gold)", color: "var(--ink)", border: "none", padding: ".72rem 1.4rem", borderRadius: "6px", fontFamily: "DM Sans,sans-serif", fontWeight: 600, fontSize: ".86rem", cursor: "pointer", display: "flex", alignItems: "center", gap: ".45rem" }}
                        onClick={() => onTabChange("chat")}>
                        Start talking <I.Arrow s={13} c="var(--ink)" />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="rm-view">
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
                                    <div className={`rm-check${done ? " ck" : ""}`} onClick={() => handleToggle(pi, si)}>
                                        {done && <I.Check s={9} c="var(--ink)" />}
                                    </div>
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
        </div>
    );
}

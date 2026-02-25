import { useRef } from "react";
import ReactMarkdown from "react-markdown";
import { I } from "../icons.jsx";
import { useGameStore } from "../store/gameStore.js";
import { useUiStore } from "../store/uiStore.js";

const CHIPS = [
    "What should I do today?",
    "What's actually blocking me?",
    "Tell me what you see in me",
    "Generate my roadmap now",
];

export function MentorChat({ profile, onSend, onTabChange }) {
    const roadmap = useGameStore(s => s.roadmap);
    const msgs = useUiStore(s => s.msgs);
    const input = useUiStore(s => s.input);
    const loading = useUiStore(s => s.loading);
    const isPro = useUiStore(s => s.isPro);
    const chatError = useUiStore(s => s.chatError);
    const { setInput, clearChatError } = useUiStore.getState();

    const endRef = useRef(null);
    const taRef = useRef(null);

    const blocked = !isPro && useUiStore.getState().msgCount >= 5; // FREE_LIMIT

    const autoResize = (e) => {
        e.target.style.height = "auto";
        e.target.style.height = Math.min(e.target.scrollHeight, 130) + "px";
    };

    const handleKey = (e) => {
        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSend(); }
    };

    return (
        <div className="chat-view">
            <div className="chat-hd">
                <div className="chat-av"><I.Star s={15} style={{ color: "var(--gold)" }} /></div>
                <div className="chat-info"><h3>PathFinder Mentor</h3><p>Transformation guide · not a chatbot</p></div>
                <div className="online"><div className="odot" /> Active</div>
            </div>

            <div className="msgs" ref={endRef}>
                {msgs.map((m, i) => (
                    <div key={i} className={`mrow ${m.role}`}>
                        <div className={`mav ${m.role}`}>
                            {m.role === "ai" ? <I.Star s={12} style={{ color: "var(--gold)" }} /> : <I.User s={11} c="var(--dim)" />}
                        </div>
                        <div className={`bub${m.role === "ai" ? " md-bub" : ""}`}>
                            {m.content === null
                                ? <div className="typing"><span /><span /><span /></div>
                                : m.role === "ai"
                                    ? <ReactMarkdown>{m.content}</ReactMarkdown>
                                    : m.content
                            }
                        </div>
                    </div>
                ))}
                <div ref={endRef} />
            </div>

            {msgs.length <= 1 && (
                <div className="chips">
                    {CHIPS.map(c => (
                        <button key={c} className="chip" onClick={() => onSend(c)}>{c}</button>
                    ))}
                </div>
            )}

            {roadmap && (
                <div style={{ margin: "0 1.4rem .6rem", background: "rgba(232,184,75,.07)", border: "1px solid var(--line-gold)", borderRadius: "8px", padding: ".58rem .95rem", fontSize: ".78rem", display: "flex", alignItems: "center", gap: ".48rem", cursor: "pointer" }}
                    onClick={() => onTabChange("roadmap")}>
                    <I.Map s={12} c="var(--gold)" /><strong style={{ color: "var(--gold)" }}>Roadmap ready</strong> — view your personalized path →
                </div>
            )}

            {/* Error banner */}
            {chatError && (
                <div style={{
                    margin: "0 1.4rem .5rem",
                    background: "rgba(244,114,182,.1)",
                    border: "1px solid rgba(244,114,182,.35)",
                    borderRadius: "8px",
                    padding: ".55rem .9rem",
                    fontSize: ".78rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: ".6rem",
                    color: "rgba(244,114,182,.9)",
                }}>
                    <span>⚠ {chatError}</span>
                    <button onClick={clearChatError} style={{
                        background: "none", border: "none", cursor: "pointer",
                        color: "rgba(244,114,182,.7)", fontSize: "1rem", lineHeight: 1,
                        padding: "0 .2rem", fontFamily: "inherit",
                    }}>✕</button>
                </div>
            )}

            <div className="iarea">
                <textarea ref={taRef} className="ita"
                    placeholder={blocked ? "Upgrade to Pro to continue..." : "Talk to your mentor..."}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKey}
                    onInput={autoResize}
                    rows={1}
                    disabled={loading || blocked}
                />
                <button className="sbtn" onClick={() => onSend()} disabled={!input.trim() || loading || blocked}>
                    <I.Send s={14} c="var(--ink)" />
                </button>
            </div>
        </div>
    );
}

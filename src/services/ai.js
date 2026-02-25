// ─────────────────────────────────────────────────────────────
//  AI SERVICE  — all LLM calls live here, never in components
// ─────────────────────────────────────────────────────────────

/** Low-level proxy call */
export async function ai(messages, system, max_tokens = 1000) {
    const r = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ system, messages, max_tokens }),
    });
    const d = await r.json();
    if (d.error) throw new Error(d.error.message);
    return d.content?.[0]?.text || "";
}

/** Parse embedded roadmap JSON from mentor response */
export function parseRm(t) {
    const m = t.match(/---RM---\s*([\s\S]*?)---END---/);
    if (!m) return null;
    try { return JSON.parse(m[1].trim()); } catch { return null; }
}

/** Strip roadmap block from displayed text */
export function stripRm(t) {
    return t.replace(/---RM---[\s\S]*?---END---/g, "").trim();
}

/** Generate 3 daily quests tailored to mood + goal */
export async function genQuests(profile, mood) {
    const moodCtx = mood ? `User's current energy: ${mood}.` : "";
    const sys = `Generate 3 daily quests for: "${profile.goal}" (${profile.persona}). ${moodCtx}
${mood === "Depleted" ? "Make them gentle, 5-10 minute tasks." : mood === "On Fire" ? "Make them ambitious and stretching." : "Mix difficulties."}
Return ONLY JSON array (no markdown): [{"title":"...","why":"1-sentence reason tied to their goal","xp":25,"diff":"easy|medium|hard"}]
Make them hyper-specific to their goal. Not generic productivity tasks.`;
    try {
        const raw = await ai([{ role: "user", content: "Generate quests" }], sys);
        const m = raw.match(/\[[\s\S]*\]/);
        if (m) return JSON.parse(m[0]).slice(0, 3);
    } catch { /* fall through to defaults */ }
    return [
        { title: "Write down your #1 obstacle", why: "Naming it is the first step to defeating it", xp: 25, diff: "easy" },
        { title: "Do one thing toward your goal", why: "1% progress daily compounds massively", xp: 35, diff: "medium" },
        { title: "Find someone who's done it", why: "Their path is your map — 20 minutes of research", xp: 50, diff: "hard" },
    ];
}

/** Generate a 2-3 sentence mentor narrative reflecting real progress */
export async function genNarrative(profile, wins, msgCount, streak) {
    const sys = `You are PathFinder. Write ONE short mentor narrative (2-3 sentences) for someone whose goal is: "${profile.goal}". 
They have: ${wins.length} wins, ${streak} day streak, ${msgCount} mentor conversations.
${wins.length > 0 ? `Their recent wins: ${wins.slice(-3).join(", ")}.` : "They haven't completed any quests yet."}
Connect dots. Reference their actual progress. Make it feel like you've been watching them. Be specific, not generic. Sound like a mentor who's proud but still pushing.`;
    try { return await ai([{ role: "user", content: "Generate narrative" }], sys); }
    catch { return "You set your sights on something real. Every conversation here is you choosing your future over your comfort — and that's already more than most people ever do."; }
}

/** Generate an eerily specific week-2-4 prophecy */
export async function genProphecy(profile) {
    const sys = `You are a prescient life coach. For someone pursuing: "${profile.goal}" as a ${profile.persona}.
Write one short prophecy/prediction (2-3 sentences). Predict a SPECIFIC challenge they'll face around week 2-4, AND tell them exactly what it will feel like AND what to do when it hits. Be eerily accurate and specific. Not generic motivation.`;
    try { return await ai([{ role: "user", content: "Generate prophecy" }], sys); }
    catch { return "Around week three, you'll wake up one morning and the goal will feel distant — like a story you told yourself. That's not failure. That's the moment where everyone else quits and you don't."; }
}

/** Persona-specific identity traits — what actually matters per path */
const PERSONA_TRAITS = {
    career: ["Adaptability", "Professional Courage", "Consistency", "Self-Belief"],
    hustle: ["Revenue Thinking", "Discipline", "Consistency", "Execution"],
    fitness: ["Discipline", "Physical Resilience", "Consistency", "Mental Toughness"],
    finance: ["Financial Discipline", "Long-term Thinking", "Consistency", "Wealth Mindset"],
    mindset: ["Emotional Resilience", "Self-Awareness", "Consistency", "Inner Peace"],
    custom: ["Consistency", "Courage", "Clarity", "Momentum"],
};

/** Generate identity trait scores (who they're becoming) */
export async function genIdentity(profile, wins, msgCount) {
    const traits = PERSONA_TRAITS[profile?.persona] || PERSONA_TRAITS.custom;
    const traitList = traits.map(t => `{"label":"${t}","score":number}`).join(",");
    const sys = `For someone pursuing "${profile.goal}" as a ${profile.persona}, generate identity trait scores (0-100) showing who they're BECOMING.
Return ONLY JSON (no markdown): {"headline":"You're becoming someone who...(complete in 8 words max)","traits":[${traitList}]}
Base scores on: ${wins.length} wins, ${msgCount} conversations. Be encouraging but honest. Early stage = lower scores (10-40). Do NOT change the trait labels — use exactly as given.`;
    try {
        const raw = await ai([{ role: "user", content: "Generate identity" }], sys);
        const m = raw.match(/\{[\s\S]*\}/);
        if (m) return JSON.parse(m[0]);
    } catch { /* fall through */ }
    return {
        headline: "You're becoming someone who chooses action",
        traits: traits.map((label, i) => ({
            label,
            score: [15, 30, 45, 20][i],
        })),
    };
}

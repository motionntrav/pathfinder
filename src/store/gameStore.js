import { create } from "zustand";
import { persist } from "zustand/middleware";

// Algorithmic level curve — no hardcoded ceiling
function xpForLevel(lv) {
    return Math.floor(100 * Math.pow(lv, 1.5));
}

const LEVEL_NAMES = [
    "Wanderer", "Seeker", "Explorer", "Navigator", "Pioneer",
    "Trailblazer", "Pathfinder", "North Star", "Luminary", "Legend",
    "Sovereign", "Eternal", "Infinite", "Transcendent", "Apex",
    "Mythic", "Celestial", "Cosmic", "Omniscient", "Godbound",
];

export function getLevel(xp) {
    let lv = 1;
    while (xpForLevel(lv + 1) <= xp) lv++;
    const prev = xpForLevel(lv);
    const next = xpForLevel(lv + 1);
    return {
        lv,
        name: LEVEL_NAMES[lv - 1] || `Level ${lv}`,
        pct: Math.round(((xp - prev) / (next - prev)) * 100),
        toNext: next - xp,
    };
}

// XP by difficulty — engine-assigned, not LLM-assigned
export const XP_BY_DIFF = { easy: 25, medium: 50, hard: 100 };

export const useGameStore = create(
    persist(
        (set, get) => ({
            // ── State ──
            xp: 0,
            streak: 1,
            quests: [],
            doneQ: [],        // IDs of completed quests this session
            wins: [],         // completed quest titles (for constellation)
            progress: 8,      // north star progress %
            narrative: "",
            prophecy: "",
            identity: null,
            mood: null,
            roadmap: null,
            rmCk: {},         // roadmap step checkbox state

            // ── Actions ──
            addXp: (amount) => {
                const prev = get().xp;
                const next = prev + amount;
                const prevLv = getLevel(prev).lv;
                const nextLv = getLevel(next).lv;
                set({ xp: next });
                if (nextLv > prevLv) return { leveledUp: true, lv: nextLv, name: getLevel(next).name };
                return { leveledUp: false };
            },

            completeQuest: (quest) => {
                const xpGain = XP_BY_DIFF[quest.diff] ?? 25;
                const result = get().addXp(xpGain);
                set((s) => ({
                    doneQ: [...s.doneQ, quest.id],
                    wins: [...s.wins, quest.title],
                    progress: Math.min(100, s.progress + 3),
                }));
                return { xpGain, ...result };
            },

            setQuests: (quests) => {
                // Assign stable IDs and ensure XP is engine-assigned
                const stamped = quests.map((q, i) => ({
                    ...q,
                    id: `q-${Date.now()}-${i}`,
                    xp: XP_BY_DIFF[q.diff] ?? 25,
                }));
                set({ quests: stamped, doneQ: [] });
            },

            setMood: (mood) => set({ mood }),
            setNarrative: (narrative) => set({ narrative }),
            setProphecy: (prophecy) => set({ prophecy }),
            setIdentity: (identity) => set({ identity }),
            setRoadmap: (roadmap) => set({ roadmap }),
            toggleRmCk: (key) => set((s) => ({ rmCk: { ...s.rmCk, [key]: !s.rmCk[key] } })),
            resetQuests: () => set({ quests: [], doneQ: [] }),
        }),
        {
            name: "pathfinder-game",
            partialize: (s) => ({
                xp: s.xp,
                streak: s.streak,
                wins: s.wins,
                progress: s.progress,
                narrative: s.narrative,
                prophecy: s.prophecy,
                identity: s.identity,
                roadmap: s.roadmap,
                rmCk: s.rmCk,
            }),
        }
    )
);

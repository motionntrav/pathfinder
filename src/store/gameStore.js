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

/**
 * Derived progress toward North Star — never arbitrary.
 * 5% base + 6% per quest win (≤55%) + 8% per roadmap milestone (≤35%)
 * Max 95% — 100% reserved for an explicit "goal achieved" event.
 */
export function getProgress(state) {
    const questPct = Math.min(state.wins.length * 6, 55);
    const rmPct = Math.min(Object.values(state.rmCk).filter(Boolean).length * 8, 35);
    return Math.min(95, 5 + questPct + rmPct);
}

/** Returns "YYYY-MM-DD" in the user's local timezone */
function today() {
    return new Date().toLocaleDateString("en-CA"); // "en-CA" gives ISO date format
}

/** Days between two "YYYY-MM-DD" strings (ignores time) */
function daysDiff(a, b) {
    return Math.round((new Date(b) - new Date(a)) / 86_400_000);
}

export const useGameStore = create(
    persist(
        (set, get) => ({
            // ── State ──
            xp: 0,
            streak: 1,
            lastActiveDate: null,   // "YYYY-MM-DD" of last app open
            quests: [],
            doneQ: [],              // IDs of completed quests this session
            wins: [],               // completed quest titles (for constellation)
            narrative: "",
            prophecy: "",
            identity: null,
            mood: null,
            roadmap: null,
            rmCk: {},               // roadmap step checkbox state

            // ── Actions ──

            /**
             * Call once on app mount.
             * - Same day  → update timestamp only (no change to streak)
             * - Yesterday → streak + 1
             * - 2+ days   → streak resets to 1
             */
            tickStreak: () => {
                const { lastActiveDate, streak } = get();
                const t = today();
                if (!lastActiveDate) {
                    // First ever open — initialise
                    set({ lastActiveDate: t, streak: 1 });
                    return;
                }
                if (lastActiveDate === t) return; // already ticked today
                const diff = daysDiff(lastActiveDate, t);
                set({
                    lastActiveDate: t,
                    streak: diff === 1 ? streak + 1 : 1,
                });
            },

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
                lastActiveDate: s.lastActiveDate,
                wins: s.wins,
                narrative: s.narrative,
                prophecy: s.prophecy,
                identity: s.identity,
                roadmap: s.roadmap,
                rmCk: s.rmCk,
            }),
        }
    )
);

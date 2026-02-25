import { create } from "zustand";

export const useUiStore = create((set) => ({
    // ── State ──
    tab: "dashboard",
    msgs: [],
    input: "",
    loading: false,
    msgCount: 0,
    isPro: false,
    showPW: false,
    xpToast: null,
    levelUpModal: null,   // { name, lv }
    xpShimmer: false,
    burst: null,          // { x, y }
    questsLoading: false,
    pendingQ: null,       // quest awaiting confirm

    // ── Actions ──
    setTab: (tab) => set({ tab }),
    setInput: (input) => set({ input }),
    setLoading: (loading) => set({ loading }),
    setIsPro: (isPro) => set({ isPro }),
    setShowPW: (showPW) => set({ showPW }),
    setQuestsLoading: (questsLoading) => set({ questsLoading }),
    setPendingQ: (pendingQ) => set({ pendingQ }),
    setXpShimmer: (xpShimmer) => set({ xpShimmer }),
    setBurst: (burst) => set({ burst }),

    addMsg: (msg) => set((s) => ({
        msgs: [...s.msgs, msg],
        msgCount: msg.role === "user" ? s.msgCount + 1 : s.msgCount,
    })),

    updateLastMsg: (patch) => set((s) => {
        const msgs = [...s.msgs];
        if (msgs.length > 0) msgs[msgs.length - 1] = { ...msgs[msgs.length - 1], ...patch };
        return { msgs };
    }),

    showToast: (amt, lbl) => {
        set({ xpToast: { amt, lbl } });
        setTimeout(() => set({ xpToast: null }), 2800);
    },

    showLevelUp: (name, lv) => set({ levelUpModal: { name, lv } }),
    clearLevelUp: () => set({ levelUpModal: null }),
}));

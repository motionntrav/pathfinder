import { useEffect, useRef } from "react";

export function Starfield() {
    const r = useRef(null);
    useEffect(() => {
        if (!r.current) return;
        const f = document.createDocumentFragment();
        for (let i = 0; i < 240; i++) {
            const s = document.createElement("div");
            s.className = "s";
            const sz = Math.random() * 2.4 + 0.35;
            s.style.cssText = `left:${Math.random() * 100}%;top:${Math.random() * 100}%;width:${sz}px;height:${sz}px;--o:${(Math.random() * 0.65 + 0.08).toFixed(2)};--d:${(Math.random() * 4 + 2).toFixed(1)}s;animation-delay:${(Math.random() * 7).toFixed(1)}s`;
            f.appendChild(s);
        }
        r.current.appendChild(f);
    }, []);
    return <div id="sf" ref={r} />;
}

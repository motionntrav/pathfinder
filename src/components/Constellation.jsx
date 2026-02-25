export function Constellation({ wins }) {
    const W = 320, H = 180;
    if (!wins.length) return <div className="const-empty">Complete quests — watch your constellation grow</div>;

    const pts = wins.map((_, i) => {
        const seed = i * 137.5;
        return {
            x: 24 + (Math.sin(seed) * 0.5 + 0.5) * (W - 48),
            y: 18 + (Math.cos(seed * 1.3) * 0.5 + 0.5) * (H - 36),
        };
    });

    const ghostSeed = wins.length * 137.5;
    const ghost = {
        x: 24 + (Math.sin(ghostSeed) * 0.5 + 0.5) * (W - 48),
        y: 18 + (Math.cos(ghostSeed * 1.3) * 0.5 + 0.5) * (H - 36),
    };

    return (
        <svg className="const-svg" viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible" }}>
            <defs>
                <radialGradient id="nebula" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#5eead4" stopOpacity="0.04" />
                    <stop offset="55%" stopColor="#9d7ff0" stopOpacity="0.03" />
                    <stop offset="100%" stopColor="#9d7ff0" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="sg" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#5eead4" stopOpacity="1" />
                    <stop offset="100%" stopColor="#5eead4" stopOpacity="0" />
                </radialGradient>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="2.5" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <style>{`.const-star-g:hover text{opacity:1}.const-star-g text{opacity:0;transition:opacity .2s}`}</style>
            </defs>

            {/* Nebula wash */}
            <ellipse cx={W / 2} cy={H / 2} rx={W * 0.55} ry={H * 0.55} fill="url(#nebula)" />

            {/* Constellation lines */}
            {pts.slice(1).map((p, i) => {
                const len = Math.hypot(p.x - pts[i].x, p.y - pts[i].y);
                return (
                    <line key={i} x1={pts[i].x} y1={pts[i].y} x2={p.x} y2={p.y}
                        stroke="rgba(94,234,212,0.22)" strokeWidth="1"
                        strokeDasharray={`${len}`}
                        style={{ animation: `draw-line 1.1s ${i * 0.18}s ease forwards`, strokeDashoffset: `${len}` }}
                    />
                );
            })}

            {/* Ghost next-star hint */}
            <circle cx={ghost.x} cy={ghost.y} r="4" fill="none"
                stroke="rgba(94,234,212,0.2)" strokeWidth="1" strokeDasharray="2 3"
                style={{ animation: `star-pop .5s ${wins.length * 0.12}s cubic-bezier(.34,1.56,.64,1) both` }}
            />

            {/* Stars */}
            {pts.map((p, i) => {
                const r = 2 + (i % 3) * 0.9;
                const yr = r + 3;
                const label = wins[i]?.length > 22 ? wins[i].slice(0, 22) + "…" : wins[i];
                return (
                    <g key={i} className="const-star-g" filter="url(#glow)"
                        style={{ animation: `star-pop .5s ${i * 0.12}s cubic-bezier(.34,1.56,.64,1) both`, cursor: "default" }}>
                        <circle cx={p.x} cy={p.y} r={yr} fill="url(#sg)" opacity=".28" />
                        <circle cx={p.x} cy={p.y} r={r} fill="#5eead4" />
                        <text x={p.x} y={p.y + yr + 9} textAnchor="middle"
                            style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "7.5px", fill: "#5eead4", opacity: 0, transition: "opacity .2s", pointerEvents: "none" }}>
                            {label}
                        </text>
                    </g>
                );
            })}
        </svg>
    );
}

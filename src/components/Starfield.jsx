import { useEffect, useRef } from "react";

/**
 * Canvas-based starfield — replaces the old 240-div DOM approach.
 *
 * Performance wins:
 *  • Single canvas element vs 240 animated DOM nodes
 *  • GPU-composited layer (will-change: transform)
 *  • No layout thrash — canvas drawImage is paint-only
 *  • rAF-driven — browser throttles when tab is hidden
 */
export function Starfield() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        let raf;

        // ── Resize handler ──
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        // ── Generate stars once ──
        const STAR_COUNT = 280;
        const stars = Array.from({ length: STAR_COUNT }, () => ({
            x: Math.random(),          // normalised 0-1 so resize works
            y: Math.random(),
            r: Math.random() * 1.2 + 0.2,
            base: Math.random() * 0.55 + 0.06,   // base opacity
            speed: Math.random() * 4 + 2,      // twinkle period (s)
            phase: Math.random() * Math.PI * 2,   // twinkle phase offset
        }));

        // ── Background gradient (painted once per resize via offscreen) ──
        const drawBg = () => {
            const g = ctx.createRadialGradient(
                canvas.width * 0.52, canvas.height * 0.06, 0,
                canvas.width * 0.52, canvas.height * 0.06, canvas.width * 0.85,
            );
            g.addColorStop(0, "#160e35");
            g.addColorStop(0.58, "#04050d");
            g.addColorStop(1, "#04050d");
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        };

        // ── Main loop ──
        let last = 0;
        const tick = (ts) => {
            const t = ts / 1000; // seconds

            // Clear & repaint background every frame (cheap fillRect)
            drawBg();

            // Draw each star
            stars.forEach(s => {
                // Smooth sine-wave twinkle
                const osc = Math.sin((t / s.speed) * Math.PI * 2 + s.phase);
                const opacity = s.base + osc * (s.base * 0.7);

                ctx.beginPath();
                ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255,255,255,${Math.max(0.02, opacity).toFixed(3)})`;
                ctx.fill();
            });

            raf = requestAnimationFrame(tick);
        };

        raf = requestAnimationFrame(tick);

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("resize", resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 0,
                pointerEvents: "none",
                willChange: "transform",  // promote to GPU layer
                display: "block",
            }}
        />
    );
}

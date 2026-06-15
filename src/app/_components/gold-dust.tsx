"use client";

import { useEffect, useRef } from "react";

/**
 * GoldDust — fines particules dorées qui dérivent vers le HAUT,
 * façon poussière de bougie (DA §5).
 *
 * Rendu en <canvas> : aucun nœud DOM superflu, pas de souci
 * d'hydratation (les positions aléatoires sont calculées côté client
 * après le montage). Respecte prefers-reduced-motion : en motion
 * réduite, on dessine UNE image statique discrète, sans boucle.
 */
export default function GoldDust() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const context = canvasEl.getContext("2d");
    if (!context) return;

    // Références au type NON-nullable : TS ne conserve pas le narrowing
    // de `canvasRef.current` / getContext() à l'intérieur des fonctions
    // imbriquées ci-dessous.
    const canvas: HTMLCanvasElement = canvasEl;
    const ctx: CanvasRenderingContext2D = context;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let width = 0;
    let height = 0;
    let raf = 0;

    type Particle = {
      x: number;
      y: number;
      r: number; // rayon
      vx: number; // dérive horizontale légère
      vy: number; // vitesse verticale (négative = vers le haut)
      a: number; // opacité de base
      tw: number; // phase de scintillement
    };
    let particles: Particle[] = [];

    function seed() {
      // Densité douce, bornée pour rester légère sur petits et grands écrans.
      const target = Math.round((width * height) / 26000);
      const count = Math.max(18, Math.min(target, 90));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 0.6 + Math.random() * 1.6,
        vx: (Math.random() - 0.5) * 0.25,
        vy: -(6 + Math.random() * 14) / 60,
        a: 0.15 + Math.random() * 0.45,
        tw: Math.random() * Math.PI * 2,
      }));
    }

    function resize() {
      const parent = canvas.parentElement;
      width = parent ? parent.clientWidth : window.innerWidth;
      height = parent ? parent.clientHeight : window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    }

    function paint(twinkle: boolean) {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        const flick = twinkle ? 0.6 + 0.4 * Math.sin(p.tw) : 1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 163, 92, ${p.a * flick})`; // --gold
        ctx.fill();
      }
    }

    function tick() {
      for (const p of particles) {
        p.y += p.vy;
        p.x += p.vx;
        p.tw += 0.02;
        if (p.y < -4) {
          p.y = height + 4;
          p.x = Math.random() * width;
        }
        if (p.x < -4) p.x = width + 4;
        if (p.x > width + 4) p.x = -4;
      }
      paint(true);
      raf = requestAnimationFrame(tick);
    }

    resize();
    window.addEventListener("resize", resize);

    if (reduceMotion) {
      paint(false); // une seule image, immobile
    } else {
      raf = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
    />
  );
}

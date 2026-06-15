"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Reveal — enveloppe générique d'apparition au défilement.
 *
 * Un IntersectionObserver ajoute la classe `is-visible` quand l'élément
 * entre dans le viewport. Le fondu lui-même est géré en CSS (.reveal),
 * et n'est appliqué QUE si le JS est actif et le mouvement accepté
 * (voir globals.css) — donc aucun contenu n'est jamais piégé invisible.
 */
export default function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number; // décalage en ms, pour échelonner plusieurs blocs
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Garde-fou : si l'API n'existe pas, on affiche au prochain frame
    // (différé pour ne pas déclencher de setState synchrone dans l'effet).
    if (typeof IntersectionObserver === "undefined") {
      const id = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(id);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target); // on ne révèle qu'une fois
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`.trim()}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}

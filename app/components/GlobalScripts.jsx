"use client";

import { useEffect } from "react";

/**
 * Global client-side behaviours extracted from assets/ui.js:
 *  - Keycap auto-press animation
 *  - Staggered scroll reveal (IntersectionObserver on [data-stagger])
 *
 * Runs once on mount in the browser.
 */
export default function GlobalScripts() {
  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // ---- Keycap auto-press ------------------------------------------------
    if (!reduceMotion) {
      const units = [];
      document.querySelectorAll("[data-autopress]").forEach((el) => {
        const caps = el.classList.contains("keycap")
          ? [el]
          : Array.prototype.slice.call(
              el.querySelectorAll(".keycap")
            );
        if (caps.length) units.push(caps);
      });
      if (units.length) {
        let i = 0;
        const interval = setInterval(() => {
          const caps = units[i % units.length];
          i++;
          caps.forEach((cap) => cap.classList.add("is-pressed"));
          setTimeout(() => {
            caps.forEach((cap) => cap.classList.remove("is-pressed"));
          }, 620);
        }, 2800);
        return () => clearInterval(interval);
      }
    }

    // ---- Staggered scroll reveal ------------------------------------------
    const staggered = document.querySelectorAll("[data-stagger]");
    if (staggered.length) {
      if (reduceMotion || !("IntersectionObserver" in window)) {
        staggered.forEach((grid) => grid.classList.add("is-revealed"));
      } else {
        const revealObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add("is-revealed");
                revealObserver.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.15 }
        );
        staggered.forEach((grid) => {
          Array.prototype.forEach.call(grid.children, (child, idx) => {
            child.style.setProperty(
              "--stagger-delay",
              idx * 110 + "ms"
            );
          });
          revealObserver.observe(grid);
        });
        return () => revealObserver.disconnect();
      }
    }
  }, []);

  return null;
}

"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

  /**
   * Global client-side behaviours extracted from assets/ui.js:
   *  - Keycap auto-press animation
   *  - Staggered scroll reveal (IntersectionObserver on [data-stagger])
   *
   * Runs on mount and on every route change.
   */
  export default function GlobalScripts() {
    const pathname = usePathname();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
      setIsMounted(true);
    }, []);

    useEffect(() => {
      if (!isMounted) return;

      // Add js class and remove no-js class to enable CSS animations
      document.documentElement.classList.add("js");
      document.documentElement.classList.remove("no-js");

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      // ---- Keycap auto-press ------------------------------------------------
      const keycapIntervalRef = { current: null };
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
          keycapIntervalRef.current = setInterval(() => {
            const caps = units[i % units.length];
            i++;
            caps.forEach((cap) => cap.classList.add("is-pressed"));
            setTimeout(() => {
              caps.forEach((cap) => cap.classList.remove("is-pressed"));
            }, 620);
          }, 2800);
        }
      }

      // ---- Staggered scroll reveal ------------------------------------------
      const revealObserverRef = { current: null };
      const mutationObserverRef = { current: null };
      const setupTimeoutRef = { current: null };

      const setupStaggeredReveal = () => {
        // Disconnect previous observer if it exists
        if (revealObserverRef.current) {
          revealObserverRef.current.disconnect();
        }

        const staggered = document.querySelectorAll("[data-stagger]");
        if (staggered.length) {
          if (reduceMotion || !("IntersectionObserver" in window)) {
            staggered.forEach((grid) => grid.classList.add("is-revealed"));
          } else {
            revealObserverRef.current = new IntersectionObserver(
              (entries) => {
                entries.forEach((entry) => {
                  if (entry.isIntersecting) {
                    entry.target.classList.add("is-revealed");
                    revealObserverRef.current.unobserve(entry.target);
                  }
                });
              },
              { threshold: 0.01 }
            );
            staggered.forEach((grid) => {
              Array.prototype.forEach.call(grid.children, (child, idx) => {
                child.style.setProperty(
                  "--stagger-delay",
                  idx * 110 + "ms"
                );
              });
              revealObserverRef.current.observe(grid);
            });
          }
        }
      };

      // Initial setup - try immediately and also after a small delay for Next.js
      setupStaggeredReveal();
      setupTimeoutRef.current = setTimeout(setupStaggeredReveal, 100);

      // Also watch for dynamically added elements (Next.js streaming)
      mutationObserverRef.current = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.addedNodes.length) {
            setupStaggeredReveal();
          }
        });
      });
      mutationObserverRef.current.observe(document.body, { childList: true, subtree: true });

      return () => {
        if (keycapIntervalRef.current) {
          clearInterval(keycapIntervalRef.current);
        }
        if (revealObserverRef.current) {
          revealObserverRef.current.disconnect();
        }
        if (mutationObserverRef.current) {
          mutationObserverRef.current.disconnect();
        }
        if (setupTimeoutRef.current) {
          clearTimeout(setupTimeoutRef.current);
        }
      };
    }, [isMounted, pathname]);

    return null;
  }

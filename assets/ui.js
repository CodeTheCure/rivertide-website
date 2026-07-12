/* Rivertide UI kit — spotlight nav lighting + keycap auto-press */
(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Spotlight nav (lighting removed) ----------------------------

  // ---- Keycap auto-press (opt-in via data-autopress) ----------------
  // data-autopress on a keycap presses it; on a wrapper (e.g. a
  // .keycap-combo) it presses every keycap inside together.
  if (!reduceMotion) {
    var units = [];
    document.querySelectorAll('[data-autopress]').forEach(function (el) {
      var caps = el.classList.contains('keycap') ? [el] : Array.prototype.slice.call(el.querySelectorAll('.keycap'));
      if (caps.length) units.push(caps);
    });
    if (units.length) {
      var i = 0;
      setInterval(function () {
        var caps = units[i % units.length];
        i++;
        caps.forEach(function (cap) { cap.classList.add('is-pressed'); });
        setTimeout(function () {
          caps.forEach(function (cap) { cap.classList.remove('is-pressed'); });
        }, 620);
      }, 2800);
    }
  }

  // ---- Staggered scroll reveal (opt-in via data-stagger) -------------
  var staggered = document.querySelectorAll('[data-stagger]');
  if (staggered.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      staggered.forEach(function (grid) { grid.classList.add('is-revealed'); });
    } else {
      var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });
      staggered.forEach(function (grid) {
        Array.prototype.forEach.call(grid.children, function (child, idx) {
          child.style.setProperty('--stagger-delay', (idx * 110) + 'ms');
        });
        revealObserver.observe(grid);
      });
    }
  }
})();

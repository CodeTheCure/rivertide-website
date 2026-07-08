/* Rivertide UI kit — spotlight nav lighting + keycap auto-press */
(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Spotlight nav ------------------------------------------------
  document.querySelectorAll('.spotlight-nav').forEach(function (nav) {
    var items = nav.querySelectorAll('a');

    function centerOf(el) {
      var navRect = nav.getBoundingClientRect();
      var rect = el.getBoundingClientRect();
      return rect.left - navRect.left + rect.width / 2;
    }

    function settle() {
      var active = nav.querySelector('a[data-active]');
      var x = active ? centerOf(active) : -200;
      nav.style.setProperty('--amb-x', x + 'px');
      nav.style.setProperty('--spot-x', x + 'px');
    }

    requestAnimationFrame(settle);
    window.addEventListener('resize', settle);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(settle);

    nav.addEventListener('mousemove', function (e) {
      nav.classList.add('is-tracking');
      var navRect = nav.getBoundingClientRect();
      nav.style.setProperty('--spot-x', e.clientX - navRect.left + 'px');
    });

    nav.addEventListener('mouseleave', function () {
      nav.classList.remove('is-tracking');
      var active = nav.querySelector('a[data-active]');
      if (active) nav.style.setProperty('--spot-x', centerOf(active) + 'px');
    });

    items.forEach(function (a) {
      a.addEventListener('click', function () {
        // same-page anchors move the light; page navigations reset anyway
        items.forEach(function (i) { i.removeAttribute('data-active'); });
        a.setAttribute('data-active', '');
        settle();
      });
    });
  });

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

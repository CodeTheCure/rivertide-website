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
  if (!reduceMotion) {
    var caps = document.querySelectorAll('.keycap[data-autopress]');
    if (caps.length) {
      var i = 0;
      setInterval(function () {
        var cap = caps[i % caps.length];
        i++;
        cap.classList.add('is-pressed');
        setTimeout(function () { cap.classList.remove('is-pressed'); }, 620);
      }, 2800);
    }
  }
})();

/* Momo Kids Lab — hero particles, pointer depth and section reveals.
   Lightweight: a handful of CSS-animated elements, fewer on phones, none for
   reduced-motion users, and paused whenever the hero is off screen. */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var hero = document.querySelector('.hero');
  var layer = hero && hero.querySelector('.fx-particles');

  // ---------- Petals and sparkles ----------
  function rand(a, b) { return a + Math.random() * (b - a); }
  function buildParticles() {
    if (!layer) return;
    layer.replaceChildren();
    if (reduce.matches) return;
    var small = window.innerWidth <= 820 || window.matchMedia('(pointer: coarse)').matches;
    var petals = small ? 7 : 16, sparks = small ? 5 : 12;
    var frag = document.createDocumentFragment();
    for (var i = 0; i < petals; i++) {
      var p = document.createElement('i');
      p.className = 'fx-petal' + (i % 5 === 0 ? ' gold' : i % 3 === 0 ? ' white' : '');
      var depth = Math.random();                       // far petals are small, slow and faint
      p.style.setProperty('--x', rand(-5, 100).toFixed(1) + '%');
      p.style.setProperty('--s', (8 + depth * 12).toFixed(1) + 'px');
      p.style.setProperty('--d', (22 - depth * 9 + rand(0, 4)).toFixed(1) + 's');
      p.style.setProperty('--delay', (-rand(0, 24)).toFixed(1) + 's');
      p.style.setProperty('--sway', rand(8, 22).toFixed(1) + 'vw');
      p.style.setProperty('--r', rand(0, 360).toFixed(0) + 'deg');
      p.style.setProperty('--o', (0.55 + depth * 0.4).toFixed(2));
      frag.appendChild(p);
    }
    for (var j = 0; j < sparks; j++) {
      var s = document.createElement('i');
      s.className = 'fx-spark';
      s.style.setProperty('--x', rand(36, 98).toFixed(1) + '%');   // over the sky and islands, away from the text
      s.style.setProperty('--y', rand(6, 70).toFixed(1) + '%');
      s.style.setProperty('--s', rand(8, 16).toFixed(1) + 'px');
      s.style.setProperty('--d', rand(3.5, 6.5).toFixed(1) + 's');
      s.style.setProperty('--delay', (-rand(0, 6)).toFixed(1) + 's');
      frag.appendChild(s);
    }
    layer.appendChild(frag);
  }
  buildParticles();
  var lastWide = window.innerWidth > 820;
  window.addEventListener('resize', function () {
    var wide = window.innerWidth > 820;
    if (wide !== lastWide) { lastWide = wide; buildParticles(); }
  });
  if (reduce.addEventListener) reduce.addEventListener('change', function () { buildParticles(); setupReveal(); });

  // Pause all hero motion when it's off screen or the tab is hidden.
  if (hero && 'IntersectionObserver' in window) {
    var visible = true;
    var sync = function () { hero.classList.toggle('fx-paused', !visible || document.hidden); };
    new IntersectionObserver(function (e) { visible = e[0].isIntersecting; sync(); }).observe(hero);
    document.addEventListener('visibilitychange', sync);
  }

  // ---------- Pointer depth: light and foreground blossoms only ----------
  if (hero && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    var raf = 0, px = 0, py = 0;
    hero.addEventListener('pointermove', function (e) {
      if (reduce.matches) return;
      var r = hero.getBoundingClientRect();
      px = ((e.clientX - r.left) / r.width - 0.5) * 2;
      py = ((e.clientY - r.top) / r.height - 0.5) * 2;
      if (!raf) raf = requestAnimationFrame(function () {
        raf = 0;
        hero.style.setProperty('--px', px.toFixed(3));
        hero.style.setProperty('--py', py.toFixed(3));
      });
    });
    hero.addEventListener('pointerleave', function () {
      hero.style.setProperty('--px', 0); hero.style.setProperty('--py', 0);
    });
  }

  // ---------- Section reveals ----------
  var GROUPS = [
    ['#games .center', '#games .card', '#games .more'],
    ['.learn .center', '.learn .learn-item'],
    ['#meet-momo .stage', '#meet-momo .copy'],
    ['#parents .dark-head', '#parents .tile'],
    ['#contact .contact']
  ];
  var io = null;
  function show(el) {
    el.classList.add('is-in');
    // Hand the element back to its normal hover styles once it has arrived.
    setTimeout(function () { el.classList.remove('reveal', 'is-in'); el.style.removeProperty('--rd'); }, 1300);
  }
  function setupReveal() {
    var root = document.documentElement;
    if (io) { io.disconnect(); io = null; }
    if (reduce.matches || !('IntersectionObserver' in window)) {
      root.classList.remove('reveal-on');
      return;
    }
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { show(en.target); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    GROUPS.forEach(function (group) {
      var n = 0;
      group.forEach(function (sel) {
        document.querySelectorAll(sel).forEach(function (el) {
          // Anything already on screen stays as it is, without a flash.
          var r = el.getBoundingClientRect();
          if (r.top < window.innerHeight && r.bottom > 0) return;
          el.classList.add('reveal');
          el.style.setProperty('--rd', Math.min(n++ * 0.08, 0.4) + 's');
          io.observe(el);
        });
      });
    });
    root.classList.add('reveal-on');
  }
  setupReveal();
})();

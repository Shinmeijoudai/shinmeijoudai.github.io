/* Momo & Bibi frame animation: blinking, waving and cheering.
   Each pose is its own drawing, stacked in the same place, and only one is
   shown at a time, so the characters never stretch, slide or float.
   Reduced-motion visitors see the still idle pose. */
(function () {
  'use strict';
  var BASE = 'assets/img/sprites/';
  var FRAMES = {
    momo: ['idle', 'blink-half', 'blink-closed', 'wave-1', 'wave-2', 'wave-3'],
    bibi: ['idle', 'blink-closed', 'happy', 'sprout-tilt']
  };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var sprites = [];

  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function rand(a, b) { return a + Math.random() * (b - a); }

  function Sprite(el) {
    this.el = el;
    this.kind = el.dataset.sprite;
    this.busy = false;
    this.frames = {};
    var first = el.querySelector('img');
    first.classList.add('on');
    this.frames.idle = first;
    this.loaded = false;
  }
  Sprite.prototype.load = function () {
    if (this.loaded) return this.ready;
    this.loaded = true;
    var self = this, first = this.frames.idle, pending = [];
    FRAMES[this.kind].slice(1).forEach(function (name) {
      var img = new Image();
      img.src = BASE + self.kind + '-' + name + '.webp';
      img.alt = ''; img.width = first.width; img.height = first.height;
      img.setAttribute('aria-hidden', 'true');
      img.decoding = 'async';
      self.el.appendChild(img);
      self.frames[name] = img;
      pending.push(img.decode ? img.decode().catch(function () {}) : Promise.resolve());
    });
    // Wait for every pose (at most 4 s) so a wave never starts half-drawn.
    this.ready = Promise.race([Promise.all(pending), wait(4000)]);
    return this.ready;
  };
  Sprite.prototype.show = function (name) {
    var next = this.frames[name];
    if (!next || !next.complete || !next.naturalWidth) next = this.frames.idle;  // never show a half-loaded pose
    Object.keys(this.frames).forEach(function (k) { this.frames[k].classList.toggle('on', this.frames[k] === next); }, this);
  };
  Sprite.prototype.play = async function (steps, important) {
    if (reduce.matches) return;
    if (this.busy && important) { var t = 0; while (this.busy && t++ < 60) await wait(50); }
    if (this.busy) return;
    this.busy = true;
    await this.load();
    for (var i = 0; i < steps.length; i++) { this.show(steps[i][0]); await wait(steps[i][1]); }
    this.show('idle');
    this.busy = false;
  };
  Sprite.prototype.blink = function () {
    return this.play(this.kind === 'momo'
      ? [['blink-half', 55], ['blink-closed', 110], ['blink-half', 55]]
      : [['blink-closed', 130]]);
  };
  Sprite.prototype.wave = function () {
    if (this.kind !== 'momo') return Promise.resolve();
    var s = [['wave-1', 160]];
    for (var i = 0; i < 3; i++) s.push(['wave-2', 170], ['wave-1', 150], ['wave-3', 170], ['wave-1', 150]);
    s.push(['wave-1', 500]);
    return this.play(s, true);
  };
  Sprite.prototype.cheer = function () {
    return this.kind === 'bibi' ? this.play([['happy', 1400], ['idle', 250], ['happy', 1200]], true) : this.wave();
  };
  Sprite.prototype.fidget = function () {
    return this.kind === 'bibi' ? this.play([['sprout-tilt', 380]]) : this.blink();
  };
  Sprite.prototype.visible = function () {
    var r = this.el.getBoundingClientRect();
    return r.width > 0 && r.bottom > 0 && r.top < window.innerHeight && !document.hidden;
  };

  // A gentle idle loop per sprite: blink every few seconds, Bibi's sprout sometimes sways.
  function idleLoop(sp) {
    setTimeout(function tick() {
      if (sp.visible() && !sp.busy) {
        if (sp.kind === 'bibi' && Math.random() < 0.3) sp.fidget(); else sp.blink();
      }
      setTimeout(tick, rand(2600, 5600));
    }, rand(1200, 3000));
  }

  document.querySelectorAll('[data-sprite]').forEach(function (el) {
    var sp = new Sprite(el);
    el._sprite = sp;
    sprites.push(sp);
  });

  function start() {
    if (reduce.matches) return;
    sprites.forEach(function (sp) { sp.load(); idleLoop(sp); });
    // Momo waves hello when the contact section scrolls into view.
    var greet = document.querySelector('[data-duo="greet"]');
    if (greet && 'IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (e) {
        if (e[0].isIntersecting) { io.disconnect(); setTimeout(function () { act(greet, 'wave'); }, 400); }
      }, { threshold: 0.5 });
      io.observe(greet);
    }
  }
  function act(root, what) {
    root.querySelectorAll('[data-sprite]').forEach(function (el) {
      var sp = el._sprite; if (!sp) return;
      sp.load();
      if (what === 'wave' && sp.kind === 'momo') sp.wave();
      if (what === 'cheer') sp.cheer();
    });
  }
  window.MomoSprites = { act: act };

  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start);
})();

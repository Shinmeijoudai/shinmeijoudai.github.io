/* Momo Kids Lab registration pop-up.
   Sends the same data as the registration site's own form to its API, so
   registrations are saved and the notification email still reaches
   Momokidslab@gmail.com. Needs the registration site's ALLOWED_ORIGINS
   setting to include https://momokidslab.com. */
(function () {
  'use strict';
  var REGISTER_SITE = 'https://momo-kids-lab-register.pages.dev';
  var API = REGISTER_SITE + '/api/register';
  var TEXT = window.MOMO_POPUP_TEXT || {};
  var dialog = document.getElementById('register-dialog');
  var reopen = document.getElementById('register-reopen');
  if (!dialog || !TEXT.en) return;

  var form = dialog.querySelector('#pop-form');
  var formPanel = dialog.querySelector('#pop-form-panel');
  var donePanel = dialog.querySelector('#pop-done-panel');
  var statusBox = dialog.querySelector('#pop-status');
  var submitBtn = dialog.querySelector('#pop-submit');
  var picker = document.getElementById('site-language');
  var previousFocus = null;
  var state = { shownAt: 0, submissionId: newId(), sending: false, statusKey: null, fallback: false, errors: {}, result: null };

  function lang() {
    var l = document.documentElement.lang;
    return TEXT[l] ? l : 'en';
  }
  function t(key) { return (TEXT[lang()] || TEXT.en)[key] || TEXT.en[key] || ''; }
  function newId() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    var b = new Uint8Array(16); crypto.getRandomValues(b);
    b[6] = (b[6] & 15) | 64; b[8] = (b[8] & 63) | 128;
    var h = Array.prototype.map.call(b, function (x) { return (x + 256).toString(16).slice(1); }).join('');
    return h.slice(0, 8) + '-' + h.slice(8, 12) + '-' + h.slice(12, 16) + '-' + h.slice(16, 20) + '-' + h.slice(20);
  }

  function translate() {
    dialog.querySelectorAll('[data-pop]').forEach(function (el) { el.textContent = t(el.dataset.pop); });
    dialog.querySelector('.pop-close').setAttribute('aria-label', t('pop.close'));
    if (reopen) reopen.textContent = t('pop.reopen');
    submitBtn.querySelector('span').textContent = t(state.sending ? 'form.submitting' : 'form.submit');
    renderErrors(false);
    renderStatus();
    if (state.result) renderDone();
  }

  // ---------- open / close ----------
  function open() {
    if (dialog.open) return;
    translate();
    previousFocus = document.activeElement;
    dialog.showModal();
    document.body.classList.add('pop-open');
    if (!state.shownAt) state.shownAt = Date.now();
    try { sessionStorage.setItem('momo-register-pop-seen', '1'); } catch (_) {}
  }
  function close() {
    if (!dialog.open) return;
    dialog.classList.add('is-closing');
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setTimeout(function () { dialog.classList.remove('is-closing'); dialog.close(); }, reduce ? 0 : 180);
  }
  dialog.querySelectorAll('[data-pop-close]').forEach(function (b) { b.addEventListener('click', close); });
  dialog.addEventListener('cancel', function (e) { e.preventDefault(); close(); });
  dialog.addEventListener('click', function (e) { if (e.target === dialog) close(); });
  dialog.addEventListener('close', function () {
    document.body.classList.remove('pop-open');
    if (previousFocus && previousFocus.isConnected) previousFocus.focus();
  });
  if (reopen) reopen.addEventListener('click', open);
  document.querySelectorAll('[data-open-register]').forEach(function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); open(); });
  });
  if (picker) picker.addEventListener('change', function () { setTimeout(translate, 0); });

  // ---------- form ----------
  var FIELDS = {
    email: { box: '#pop-field-email', err: '#pop-email-error', focus: '#pop-email' },
    ageGroups: { box: '#pop-field-age', err: '#pop-age-error', focus: '#pop-field-age input' },
    game: { box: '#pop-field-game', err: '#pop-game-error', focus: '#pop-field-game input' },
    acknowledged: { box: '#pop-field-ack', err: '#pop-ack-error', focus: '#pop-ack' }
  };
  var SERVER_ERRORS = {
    email: { required: 'err.email.required', invalid: 'err.email.invalid' },
    ageGroups: { required: 'err.age.required', invalid: 'err.age.required' },
    game: { required: 'err.game.required', invalid: 'err.game.required' },
    acknowledged: { required: 'err.ack.required' }
  };
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,63}$/;

  function readForm() {
    return {
      email: form.email.value.trim(),
      ageGroups: Array.prototype.map.call(form.querySelectorAll('input[name="ageGroups"]:checked'), function (i) { return i.value; }),
      game: (form.querySelector('input[name="game"]:checked') || {}).value || '',
      acknowledged: form.acknowledged.checked,
      website: form.website.value
    };
  }
  function validate(d) {
    var e = {};
    if (!d.email) e.email = 'err.email.required';
    else if (!EMAIL_RE.test(d.email) || d.email.length > 254) e.email = 'err.email.invalid';
    if (!d.ageGroups.length) e.ageGroups = 'err.age.required';
    if (!d.game) e.game = 'err.game.required';
    if (!d.acknowledged) e.acknowledged = 'err.ack.required';
    return e;
  }
  function renderErrors(focusFirst) {
    var first = null;
    Object.keys(FIELDS).forEach(function (name) {
      var f = FIELDS[name], key = state.errors[name];
      var box = dialog.querySelector(f.box), err = dialog.querySelector(f.err);
      box.classList.toggle('has-error', !!key);
      err.hidden = !key;
      err.textContent = key ? t(key) : '';
      var input = dialog.querySelector(f.focus);
      if (input) input.setAttribute('aria-invalid', key ? 'true' : 'false');
      if (key && !first) first = input;
    });
    if (focusFirst && first) first.focus();
  }
  function renderStatus() {
    statusBox.hidden = !state.statusKey;
    statusBox.replaceChildren();
    if (!state.statusKey) return;
    var p = document.createElement('p'); p.textContent = t(state.statusKey); statusBox.appendChild(p);
    if (state.fallback) {
      var p2 = document.createElement('p');
      p2.appendChild(document.createTextNode(t('pop.fallback') + ' '));
      var a = document.createElement('a');
      a.href = REGISTER_SITE + '/#register'; a.target = '_blank'; a.rel = 'noopener';
      a.textContent = t('pop.fallbackLink');
      p2.appendChild(a); statusBox.appendChild(p2);
    }
  }
  function setSending(on) {
    state.sending = on;
    submitBtn.disabled = on;
    submitBtn.setAttribute('aria-busy', String(on));
    submitBtn.querySelector('span').textContent = t(on ? 'form.submitting' : 'form.submit');
  }
  // Clear a field's error as soon as it's fixed (on typing, not on blur, so the layout never shifts mid-click).
  form.addEventListener('input', function () {
    if (!Object.keys(state.errors).length) return;
    var d = readForm(), now = validate(d);
    Object.keys(state.errors).forEach(function (k) { if (!now[k]) delete state.errors[k]; });
    renderErrors(false);
  });

  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    if (state.sending) return;
    var d = readForm();
    state.statusKey = null; state.fallback = false;
    state.errors = validate(d);
    renderStatus();
    if (Object.keys(state.errors).length) { renderErrors(true); return; }
    renderErrors(false);
    setSending(true);
    var ctrl = new AbortController();
    var timer = setTimeout(function () { ctrl.abort(); }, 25000);
    try {
      var res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'omit',
        signal: ctrl.signal,
        body: JSON.stringify({
          email: d.email, ageGroups: d.ageGroups, game: d.game, acknowledged: d.acknowledged,
          website: d.website, language: lang(), submissionId: state.submissionId,
          elapsedMs: Date.now() - (state.shownAt || Date.now()), turnstileToken: ''
        })
      });
      var data = null;
      try { data = await res.json(); } catch (_) {}
      if (data && data.ok) {
        state.result = { email: d.email, ageGroups: d.ageGroups, game: d.game, updated: !!data.updated, notification: data.notification };
        renderDone(true);
        return;
      }
      var code = data && data.error;
      if (code === 'validation' && data.fields) {
        Object.keys(data.fields).forEach(function (f) {
          if (SERVER_ERRORS[f]) state.errors[f] = SERVER_ERRORS[f][data.fields[f]] || SERVER_ERRORS[f].required;
          else state.statusKey = 'err.invalid';
        });
        renderErrors(true);
      } else if (code === 'too_fast') state.statusKey = 'err.too_fast';
      else if (code === 'rate_limited' || res.status === 429) state.statusKey = 'err.rate_limited';
      else if (code === 'captcha' || code === 'forbidden_origin') { state.statusKey = 'err.server'; state.fallback = true; }
      else if (res.status >= 500 || code === 'server') { state.statusKey = 'err.server'; state.fallback = true; }
      else { state.statusKey = 'err.invalid'; state.fallback = true; }
      renderStatus();
    } catch (_) {
      // Network or blocked request: keep the same submission id so a retry can't duplicate.
      state.statusKey = 'err.network'; state.fallback = true;
      renderStatus();
    } finally {
      clearTimeout(timer);
      setSending(false);
    }
  });

  function renderDone(focus) {
    var r = state.result;
    formPanel.hidden = true;
    donePanel.hidden = false;
    dialog.querySelector('#pop-sum-email').textContent = r.email;
    dialog.querySelector('#pop-sum-ages').textContent = r.ageGroups.map(function (a) { return t('age.' + a); }).join(', ');
    dialog.querySelector('#pop-sum-games').textContent = t('game.' + r.game);
    dialog.querySelector('#pop-updated').hidden = !r.updated;
    dialog.querySelector('#pop-notify').hidden = r.notification === 'sent' || !r.notification;
    if (focus) dialog.querySelector('#pop-done-title').focus();
  }
  dialog.querySelector('#pop-another').addEventListener('click', function () {
    form.reset();
    state = { shownAt: Date.now(), submissionId: newId(), sending: false, statusKey: null, fallback: false, errors: {}, result: null };
    donePanel.hidden = true; formPanel.hidden = false;
    translate();
    dialog.querySelector('#pop-email').focus();
  });

  translate();
  var seen = false;
  try { seen = sessionStorage.getItem('momo-register-pop-seen') === '1'; } catch (_) {}
  if (!seen) setTimeout(open, 2200);
})();

// How We Invest — email gate.
// One email unlocks every gated thing on the site (stored locally).
// Submissions go to Netlify Forms (form name: "email-capture").
(function () {
  'use strict';
  var KEY = 'hwi_member';

  function isUnlocked() {
    try { return localStorage.getItem(KEY) === '1'; } catch (e) { return false; }
  }
  function setUnlocked() {
    try { localStorage.setItem(KEY, '1'); } catch (e) {}
  }
  function reveal() {
    var gates = document.querySelectorAll('[data-gate]');
    for (var i = 0; i < gates.length; i++) gates[i].classList.add('is-unlocked');
    document.dispatchEvent(new CustomEvent('hwi:unlocked'));
  }

  function postEmail(email, source) {
    // 1) Record the submission in Netlify Forms (gives a backup list in the
    //    Netlify dashboard, and a CSV export).
    var body = new URLSearchParams();
    body.append('form-name', 'email-capture');
    body.append('email', email);
    body.append('source', source || '');
    body.append('bot-field', '');
    var toForms = fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString()
    }).catch(function () {});

    // 2) Forward straight to Flodesk via our function. We call it directly rather
    //    than relying on Netlify's "submission-created" event, which did not fire
    //    reliably for AJAX form submissions.
    var toFlodesk = fetch('/.netlify/functions/submission-created', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ payload: { data: { email: email, source: source || '' } } })
    }).catch(function () {});

    return Promise.all([toForms, toFlodesk]);
  }

  function wireForms() {
    var forms = document.querySelectorAll('form.js-gate-form');
    for (var i = 0; i < forms.length; i++) {
      forms[i].addEventListener('submit', function (e) {
        e.preventDefault();
        var f = e.currentTarget;
        var input = f.querySelector('input[type="email"]');
        var email = input ? input.value.trim() : '';
        if (!email || email.indexOf('@') < 1) {
          if (input) { input.focus(); input.setAttribute('aria-invalid', 'true'); }
          return;
        }
        var btn = f.querySelector('button[type="submit"], button:not([type])');
        if (btn) { btn.disabled = true; btn.dataset.label = btn.textContent; btn.textContent = 'Unlocking…'; }
        var done = function () { setUnlocked(); reveal(); };
        // Unlock regardless of network result so the experience never gets stuck
        // (e.g. when previewing the file locally, off Netlify).
        postEmail(email, f.getAttribute('data-source')).then(done, done);
      });
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (isUnlocked()) reveal();
    wireForms();
  });

  window.HWIGate = { isUnlocked: isUnlocked, reveal: reveal };
})();

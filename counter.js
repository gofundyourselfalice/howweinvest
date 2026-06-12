// rise — live submission counter
// Reads data/submissions.json and updates every element marked with
// [data-live-count]. Falls back silently to the static text if the
// fetch fails (e.g. opening the HTML file directly from disk).
//
// Display rules:
//   data-live-count          -> "1,204+"  (formatted, with plus)
//   data-live-count="plain"  -> "1,204"   (formatted, no plus)
// Elements also get a gentle count-up animation when visible.

(function () {
  'use strict';

  // Resolve path relative to this script (works from / and /hub/)
  var basePath = '';
  var scripts = document.getElementsByTagName('script');
  for (var i = 0; i < scripts.length; i++) {
    var src = scripts[i].getAttribute('src') || '';
    var m = src.match(/^(.*?)counter\.js(?:\?.*)?$/);
    if (m) { basePath = m[1]; break; }
  }

  function fmt(n) { return Math.round(n).toLocaleString('en-GB'); }

  function render(el, value, withPlus) {
    el.textContent = fmt(value) + (withPlus ? '+' : '');
  }

  function animate(el, target, withPlus) {
    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || target <= 0) { render(el, target, withPlus); return; }
    var start = Math.max(0, Math.floor(target * 0.9));
    var duration = 900;
    var t0 = null;
    function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min(1, (ts - t0) / duration);
      var eased = 1 - Math.pow(1 - p, 3);
      render(el, start + (target - start) * eased, withPlus);
      if (p < 1) window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }

  function apply(count) {
    var els = document.querySelectorAll('[data-live-count]');
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) {
        render(el, count, el.getAttribute('data-live-count') !== 'plain');
      });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          io.unobserve(el);
          animate(el, count, el.getAttribute('data-live-count') !== 'plain');
        }
      });
    }, { threshold: 0.4 });
    els.forEach(function (el) { io.observe(el); });
  }

  fetch(basePath + 'data/submissions.json', { cache: 'no-store' })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (data) {
      if (data && typeof data.count === 'number' && data.count > 0) {
        apply(data.count);
      }
    })
    .catch(function () { /* keep static fallback text */ });
})();

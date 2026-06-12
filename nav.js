// How We Invest — universal mobile nav drawer
// Adds a hamburger to .nav-inner, slides .nav-menu in as a drawer on mobile,
// turns the .nav-mega dropdown into a tap-to-expand accordion below 920px.

(function () {
  var navInner = document.querySelector('.nav-inner');
  if (!navInner) return;

  // Don't inject twice (defensive — in case nav.js loads more than once)
  if (navInner.querySelector('.nav-mobile-toggle')) return;

  // Detect path prefix from this script's src (handles root vs hub/ pages)
  var basePath = '';
  var scripts = document.getElementsByTagName('script');
  for (var i = 0; i < scripts.length; i++) {
    var src = scripts[i].getAttribute('src') || '';
    var match = src.match(/^(.*?)nav\.js(?:\?.*)?$/);
    if (match) { basePath = match[1]; break; }
  }

  // -1. Inject favicon if no <link rel="icon"> is set
  if (!document.querySelector('link[rel="icon"]')) {
    var favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.type = 'image/svg+xml';
    favicon.href = basePath + 'favicon.svg';
    document.head.appendChild(favicon);
  }

  // 0. Inject skip-to-content link (for keyboard users)
  var main = document.querySelector('main');
  if (main) {
    if (!main.id) main.id = 'main';
    main.setAttribute('tabindex', '-1');
    var skipLink = document.createElement('a');
    skipLink.href = '#' + main.id;
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  // 1. Inject hamburger button at the end of .nav-inner
  var hamburger = document.createElement('button');
  hamburger.className = 'nav-mobile-toggle';
  hamburger.setAttribute('aria-label', 'Open menu');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.innerHTML = '<span aria-hidden="true">☰</span>';
  navInner.appendChild(hamburger);

  // 2. Inject overlay backdrop
  var overlay = document.createElement('div');
  overlay.className = 'mobile-nav-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  document.body.appendChild(overlay);

  // 3. State helpers
  function closeDrawer() {
    document.body.classList.remove('mobile-nav-open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.querySelectorAll('.nav-has-dropdown.mobile-open').forEach(function (el) {
      el.classList.remove('mobile-open');
    });
  }
  function toggleDrawer() {
    var nowOpen = document.body.classList.toggle('mobile-nav-open');
    hamburger.setAttribute('aria-expanded', nowOpen ? 'true' : 'false');
    hamburger.setAttribute('aria-label', nowOpen ? 'Close menu' : 'Open menu');
  }

  hamburger.addEventListener('click', toggleDrawer);
  overlay.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && document.body.classList.contains('mobile-nav-open')) {
      closeDrawer();
    }
  });

  // 4. Mobile: tap dropdown trigger to expand accordion (instead of navigating)
  document.querySelectorAll('.nav-has-dropdown > a').forEach(function (trigger) {
    trigger.addEventListener('click', function (e) {
      if (window.matchMedia('(max-width: 920px)').matches) {
        e.preventDefault();
        trigger.parentElement.classList.toggle('mobile-open');
      }
    });
  });

  // 5. Close drawer on link tap (anchors and cross-page links inside the menu)
  document.querySelectorAll('.nav-dropdown a, .nav-menu > li > a').forEach(function (link) {
    // Skip the dropdown trigger itself — that's handled above
    if (link.parentElement.classList.contains('nav-has-dropdown') && !link.classList.contains('nav-mega-head') && !link.classList.contains('nav-mega-sub')) {
      return;
    }
    link.addEventListener('click', function () {
      if (window.matchMedia('(max-width: 920px)').matches) {
        // brief delay to let navigation happen / anchor scroll begin
        setTimeout(closeDrawer, 80);
      }
    });
  });

  // 6. If viewport resizes from mobile to desktop, force drawer closed
  var mq = window.matchMedia('(min-width: 921px)');
  if (mq.addEventListener) {
    mq.addEventListener('change', function (e) {
      if (e.matches) closeDrawer();
    });
  }

  // 7. Smarter glossary tooltip positioning (avoid viewport overflow)
  document.querySelectorAll('.gloss').forEach(function (el) {
    function reposition() {
      var rect = el.getBoundingClientRect();
      var vw = window.innerWidth;
      var TIP_W = Math.min(320, vw * 0.8);
      var center = rect.left + rect.width / 2;
      if (center - TIP_W / 2 < 20) {
        el.setAttribute('data-tooltip-align', 'left');
      } else if (center + TIP_W / 2 > vw - 20) {
        el.setAttribute('data-tooltip-align', 'right');
      } else {
        el.removeAttribute('data-tooltip-align');
      }
    }
    el.addEventListener('mouseenter', reposition);
    el.addEventListener('focus', reposition);
  });

  // 8. Floating back-to-top button (guide.html only — has .guide-main)
  if (document.querySelector('.guide-main')) {
    var backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.setAttribute('aria-label', 'Back to top of the guide');
    backToTop.innerHTML = '<span aria-hidden="true">↑</span>';
    document.body.appendChild(backToTop);

    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // After scrolling, return focus to a sensible target
      setTimeout(function () {
        var firstHeading = document.querySelector('.chapter-title');
        if (firstHeading) firstHeading.focus({ preventScroll: true });
      }, 400);
    });

    var lastScroll = 0;
    var ticking = false;
    function onScroll() {
      lastScroll = window.scrollY;
      if (!ticking) {
        window.requestAnimationFrame(function () {
          backToTop.classList.toggle('is-visible', lastScroll > 600);
          ticking = false;
        });
        ticking = true;
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
  }
})();

// How We Invest — interactive tools
// 1. Compound interest calculator
// 2. Inflation visualiser (cash vs invested)
// 3. Should I invest flowchart
// 4. Lump sum vs PCA toggle
// 5. ISA allowance calculator
//
// Charts are rendered at the container's real pixel width (and re-rendered
// on resize) so text stays crisp and undistorted on every screen size.

(function () {
  'use strict';

  function $(id) { return document.getElementById(id); }
  function fmt(n) { return Math.round(n).toLocaleString('en-GB'); }
  function fmtShort(v) {
    if (v >= 1000000) return (v / 1000000).toFixed(1) + 'M';
    if (v >= 1000) return (v / 1000).toFixed(0) + 'k';
    return v.toFixed(0);
  }
  function chartWidth(el) {
    var w = el ? el.clientWidth : 0;
    return Math.max(320, w || 800);
  }

  // Every tool registers its compute() here so charts redraw on resize.
  var redraws = [];

  /* ===================================================
     1. COMPOUND INTEREST CALCULATOR
     =================================================== */
  function initCompound() {
    var monthlyEl = $('cmp-monthly');
    if (!monthlyEl) return;
    var returnEl = $('cmp-return');
    var yearsEl = $('cmp-years');

    function compute() {
      var monthly = +monthlyEl.value;
      var annualReturn = +returnEl.value / 100;
      var years = +yearsEl.value;
      var monthlyReturn = annualReturn / 12;

      var pot = 0;
      var yearData = [];
      for (var y = 1; y <= years; y++) {
        for (var m = 0; m < 12; m++) {
          pot = (pot + monthly) * (1 + monthlyReturn);
        }
        yearData.push({ year: y, total: pot, paidIn: y * 12 * monthly });
      }
      var finalPaid = years * 12 * monthly;
      var finalGrowth = pot - finalPaid;

      $('cmp-monthly-val').textContent = monthly;
      $('cmp-return-val').textContent = (+returnEl.value).toFixed(returnEl.value % 1 === 0 ? 0 : 1);
      $('cmp-years-val').textContent = years;
      $('cmp-paid').textContent = fmt(finalPaid);
      $('cmp-growth').textContent = fmt(finalGrowth);
      $('cmp-total').textContent = fmt(pot);

      renderBarChart('cmp-chart', yearData, {
        paidColor: '#C8D4CC',
        growthColor: '#2A6A3A',
        showLegend: true,
        legendPaid: 'what you paid in',
        legendGrowth: 'growth on top'
      });
    }

    [monthlyEl, returnEl, yearsEl].forEach(function (el) {
      el.addEventListener('input', compute);
    });
    redraws.push(compute);
    compute();
  }

  /* ===================================================
     2. INFLATION VISUALISER (£1,000 in cash vs invested)
     =================================================== */
  function initInflation() {
    var chart = $('inflation-chart');
    if (!chart) return;
    var amountEl = $('inf-amount');
    var yearsEl = $('inf-years');

    // Approximate historical comparison data (illustrative — UK perspective)
    // Cash: average 2% interest, less ~2.5% inflation = roughly flat to slightly negative real
    // S&P 500: ~7% real annual return long-term average
    function compute() {
      var amount = +amountEl.value;
      var years = +yearsEl.value;
      var data = [];
      for (var y = 0; y <= years; y++) {
        // Cash: grows at ~3.5% a year (around the average UK easy-access savings rate)
        var cash = amount * Math.pow(1.035, y);
        // Invested: illustrative ~7% a year, with some smoothed dips
        var stocks = amount * Math.pow(1.07, y);
        // Dips around year 8 (GFC), year 20 (Covid), year 22 (inflation)
        if (y === 8 || y === 9) stocks *= 0.74;
        if (y === 20) stocks *= 0.85;
        if (y === 22) stocks *= 0.92;
        data.push({ year: y, cash: cash, stocks: stocks });
      }

      var finalCash = data[data.length - 1].cash;
      var finalStocks = data[data.length - 1].stocks;
      $('inf-amount-val').textContent = fmt(amount);
      $('inf-years-val').textContent = years;
      $('inf-cash').textContent = fmt(finalCash);
      $('inf-stocks').textContent = fmt(finalStocks);
      $('inf-gap').textContent = fmt(finalStocks - finalCash);

      renderLineChart('inflation-chart', data);
    }

    [amountEl, yearsEl].forEach(function (el) {
      el.addEventListener('input', compute);
    });
    redraws.push(compute);
    compute();
  }

  function renderLineChart(id, data) {
    var chart = $(id);
    if (!chart) return;
    var W = chartWidth(chart), H = 280;
    var PAD_L = 60, PAD_R = 16, PAD_T = 24, PAD_B = 36;
    var innerW = W - PAD_L - PAD_R;
    var innerH = H - PAD_T - PAD_B;
    var maxVal = 0;
    data.forEach(function (d) {
      maxVal = Math.max(maxVal, d.cash, d.stocks);
    });
    maxVal *= 1.05;

    function x(i) { return PAD_L + (i / (data.length - 1)) * innerW; }
    function y(v) { return PAD_T + innerH - (v / maxVal) * innerH; }

    var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" xmlns="http://www.w3.org/2000/svg">';

    // Grid lines + Y labels
    [0, 0.25, 0.5, 0.75, 1].forEach(function (t) {
      var yy = PAD_T + innerH - t * innerH;
      svg += '<line x1="' + PAD_L + '" y1="' + yy + '" x2="' + (W - PAD_R) + '" y2="' + yy + '" stroke="#e3e3e0" stroke-width="1"/>';
      svg += '<text x="' + (PAD_L - 8) + '" y="' + (yy + 3) + '" font-size="10" fill="#999" text-anchor="end" font-family="Inter,sans-serif">£' + fmtShort(t * maxVal) + '</text>';
    });

    // Cash line (red-ish)
    var cashPath = '';
    data.forEach(function (d, i) {
      cashPath += (i === 0 ? 'M' : 'L') + x(i) + ' ' + y(d.cash);
    });
    svg += '<path d="' + cashPath + '" stroke="#b04a3e" stroke-width="2" fill="none"/>';

    // Stocks line (green)
    var stocksPath = '';
    data.forEach(function (d, i) {
      stocksPath += (i === 0 ? 'M' : 'L') + x(i) + ' ' + y(d.stocks);
    });
    svg += '<path d="' + stocksPath + '" stroke="#2a6a3a" stroke-width="2.5" fill="none"/>';

    // End-point dots and labels
    var lastIdx = data.length - 1;
    svg += '<circle cx="' + x(lastIdx) + '" cy="' + y(data[lastIdx].stocks) + '" r="4" fill="#2a6a3a"/>';
    svg += '<circle cx="' + x(lastIdx) + '" cy="' + y(data[lastIdx].cash) + '" r="4" fill="#b04a3e"/>';

    // X axis labels every ~5 years (skip any that would collide with the last label)
    var step = Math.max(1, Math.floor(data.length / 6));
    data.forEach(function (d, i) {
      if (i === lastIdx || ((i === 0 || i % step === 0) && lastIdx - i >= step * 0.75)) {
        svg += '<text x="' + x(i) + '" y="' + (PAD_T + innerH + 18) + '" font-size="10" fill="#999" text-anchor="middle" font-family="Inter,sans-serif">Y' + d.year + '</text>';
      }
    });

    // Legend
    svg += '<g transform="translate(' + (PAD_L + 4) + ', ' + (PAD_T + 4) + ')">';
    svg += '<line x1="0" y1="6" x2="14" y2="6" stroke="#2a6a3a" stroke-width="2.5"/>';
    svg += '<text x="20" y="10" font-size="11" fill="#444" font-family="Inter,sans-serif" font-weight="600">Invested</text>';
    svg += '<line x1="100" y1="6" x2="114" y2="6" stroke="#b04a3e" stroke-width="2"/>';
    svg += '<text x="120" y="10" font-size="11" fill="#444" font-family="Inter,sans-serif" font-weight="600">In cash</text>';
    svg += '</g>';

    svg += '</svg>';
    chart.innerHTML = svg;
  }

  /* ===================================================
     3. SHOULD I INVEST FLOWCHART
     =================================================== */
  function initFlowchart() {
    var fc = $('flowchart');
    if (!fc) return;
    var steps = fc.querySelectorAll('.flowchart-step');

    function go(id) {
      steps.forEach(function (s) {
        s.classList.toggle('is-active', s.getAttribute('data-step') === id);
      });
      // Bring the new question into view only if the top of the flowchart
      // has scrolled out of sight (avoids jarring jumps on desktop).
      if (id !== 'q1' && id !== 'start') {
        var rect = fc.getBoundingClientRect();
        if (rect.top < 0 || rect.bottom > window.innerHeight) {
          fc.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }

    fc.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-next]');
      if (btn) {
        go(btn.getAttribute('data-next'));
      }
      var restart = e.target.closest('.flowchart-restart');
      if (restart) {
        go('q1');
      }
    });
  }

  /* ===================================================
     4. LUMP SUM VS PCA TOGGLE
     =================================================== */
  function initPCA() {
    var chart = $('pca-chart');
    if (!chart) return;
    var amountEl = $('pca-amount');
    var modeButtons = document.querySelectorAll('#pca-toggle button');
    var mode = 'both';

    function compute() {
      var annualTotal = +amountEl.value;
      var years = 10;
      var annualReturn = 0.07;
      var monthlyReturn = annualReturn / 12;
      var monthly = annualTotal / 12;

      // Lump sum: all in at start of year 1
      var lump = annualTotal;
      var lumpData = [{ year: 0, value: lump }];
      for (var y = 1; y <= years; y++) {
        lump = lump * (1 + annualReturn);
        // Add next year's lump
        if (y < years) lump += annualTotal;
        lumpData.push({ year: y, value: lump });
      }

      // PCA: monthly contributions
      var pca = 0;
      var pcaData = [{ year: 0, value: 0 }];
      for (var yy = 1; yy <= years; yy++) {
        for (var m = 0; m < 12; m++) {
          pca = (pca + monthly) * (1 + monthlyReturn);
        }
        pcaData.push({ year: yy, value: pca });
      }

      $('pca-amount-val').textContent = fmt(annualTotal);
      $('pca-lump-result').textContent = fmt(lumpData[lumpData.length - 1].value);
      $('pca-pca-result').textContent = fmt(pcaData[pcaData.length - 1].value);

      renderPCAChart(lumpData, pcaData, mode);
    }

    function renderPCAChart(lumpData, pcaData, mode) {
      var W = chartWidth($('pca-chart')), H = 240;
      var PAD_L = 60, PAD_R = 16, PAD_T = 16, PAD_B = 32;
      var innerW = W - PAD_L - PAD_R;
      var innerH = H - PAD_T - PAD_B;
      var maxVal = 0;
      lumpData.concat(pcaData).forEach(function (d) {
        maxVal = Math.max(maxVal, d.value);
      });
      maxVal *= 1.05;

      function x(i, len) { return PAD_L + (i / (len - 1)) * innerW; }
      function y(v) { return PAD_T + innerH - (v / maxVal) * innerH; }

      var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" xmlns="http://www.w3.org/2000/svg">';

      [0, 0.25, 0.5, 0.75, 1].forEach(function (t) {
        var yy = PAD_T + innerH - t * innerH;
        svg += '<line x1="' + PAD_L + '" y1="' + yy + '" x2="' + (W - PAD_R) + '" y2="' + yy + '" stroke="#e3e3e0" stroke-width="1"/>';
        svg += '<text x="' + (PAD_L - 8) + '" y="' + (yy + 3) + '" font-size="10" fill="#999" text-anchor="end" font-family="Inter,sans-serif">£' + fmtShort(t * maxVal) + '</text>';
      });

      function drawLine(data, color, width) {
        var path = '';
        data.forEach(function (d, i) {
          path += (i === 0 ? 'M' : 'L') + x(i, data.length) + ' ' + y(d.value);
        });
        return '<path d="' + path + '" stroke="' + color + '" stroke-width="' + width + '" fill="none"/>';
      }

      if (mode === 'lump' || mode === 'both') {
        svg += drawLine(lumpData, '#2a6a3a', 2.5);
        svg += '<circle cx="' + x(lumpData.length - 1, lumpData.length) + '" cy="' + y(lumpData[lumpData.length - 1].value) + '" r="4" fill="#2a6a3a"/>';
      }
      if (mode === 'pca' || mode === 'both') {
        svg += drawLine(pcaData, '#c97a3a', 2.5);
        svg += '<circle cx="' + x(pcaData.length - 1, pcaData.length) + '" cy="' + y(pcaData[pcaData.length - 1].value) + '" r="4" fill="#c97a3a"/>';
      }

      // X-axis years
      for (var i = 0; i <= 10; i += 2) {
        svg += '<text x="' + x(i, 11) + '" y="' + (PAD_T + innerH + 16) + '" font-size="10" fill="#999" text-anchor="middle" font-family="Inter,sans-serif">yr ' + i + '</text>';
      }

      // Legend
      svg += '<g transform="translate(' + (PAD_L + 4) + ', ' + (PAD_T + 4) + ')">';
      svg += '<line x1="0" y1="6" x2="14" y2="6" stroke="#2a6a3a" stroke-width="2.5"/>';
      svg += '<text x="20" y="10" font-size="11" fill="#444" font-family="Inter,sans-serif" font-weight="600">Lump sum (annual)</text>';
      svg += '<line x1="160" y1="6" x2="174" y2="6" stroke="#c97a3a" stroke-width="2.5"/>';
      svg += '<text x="180" y="10" font-size="11" fill="#444" font-family="Inter,sans-serif" font-weight="600">Pound cost averaging (monthly)</text>';
      svg += '</g>';

      svg += '</svg>';
      $('pca-chart').innerHTML = svg;
    }

    modeButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        modeButtons.forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
        btn.setAttribute('aria-pressed', 'true');
        mode = btn.getAttribute('data-mode');
        compute();
      });
    });
    if (amountEl) amountEl.addEventListener('input', compute);
    redraws.push(compute);
    compute();
  }

  /* ===================================================
     5. ISA ALLOWANCE CALCULATOR
     =================================================== */
  function initISA() {
    var input = $('isa-used');
    if (!input) return;
    var ALLOWANCE = 20000;

    function nextReset() {
      var now = new Date();
      var reset = new Date(now.getFullYear(), 3, 6); // 6 April
      if (now >= reset) reset = new Date(now.getFullYear() + 1, 3, 6);
      return reset;
    }

    function compute() {
      var used = parseFloat(String(input.value).replace(/[^0-9.]/g, ''));
      if (!isFinite(used) || used < 0) used = 0;
      var remaining = Math.max(0, ALLOWANCE - used);
      var pct = Math.min(100, (used / ALLOWANCE) * 100);
      var over = used > ALLOWANCE;

      $('isa-used-out').textContent = fmt(used);
      $('isa-remaining').textContent = fmt(remaining);

      var reset = nextReset();
      var days = Math.ceil((reset - new Date()) / 86400000);
      $('isa-reset').textContent = days;

      var fill = $('isa-bar-fill');
      fill.style.width = pct + '%';
      fill.classList.toggle('is-over', over);

      var overMsg = $('isa-over');
      if (overMsg) {
        overMsg.hidden = !over;
        if (over) {
          overMsg.textContent = 'That’s £' + fmt(used - ALLOWANCE) + ' over the £20,000 annual allowance — contributions above the limit can’t go into an ISA until the allowance resets on 6 April.';
        }
      }
    }

    input.addEventListener('input', compute);
    compute();
  }

  /* ===================================================
     SHARED BAR CHART RENDERER (used by compound calc)
     =================================================== */
  function renderBarChart(id, data, opts) {
    var chart = $(id);
    if (!chart) return;
    opts = opts || {};
    var W = chartWidth(chart), H = 220;
    var PAD_L = 50, PAD_R = 12, PAD_T = 32, PAD_B = 28;
    var innerW = W - PAD_L - PAD_R;
    var innerH = H - PAD_T - PAD_B;
    var maxVal = data.length ? data[data.length - 1].total : 1;
    var bandW = innerW / data.length;
    var barWidth = bandW * 0.7;
    var barGap = bandW * 0.3;

    var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" xmlns="http://www.w3.org/2000/svg">';

    // Y-axis grid
    [0, 0.25, 0.5, 0.75, 1].forEach(function (t) {
      var yy = PAD_T + innerH - t * innerH;
      svg += '<line x1="' + PAD_L + '" y1="' + yy + '" x2="' + (W - PAD_R) + '" y2="' + yy + '" stroke="#e3e3e0" stroke-width="1"/>';
      svg += '<text x="' + (PAD_L - 8) + '" y="' + (yy + 3) + '" font-size="10" fill="#999" text-anchor="end" font-family="Inter,sans-serif">£' + fmtShort(t * maxVal) + '</text>';
    });

    // Bars
    data.forEach(function (d, i) {
      var x = PAD_L + i * bandW + barGap / 2;
      var totalH = (d.total / maxVal) * innerH;
      var paidH = (d.paidIn / maxVal) * innerH;
      var growthH = totalH - paidH;
      svg += '<rect x="' + x + '" y="' + (PAD_T + innerH - paidH) + '" width="' + barWidth + '" height="' + paidH + '" fill="' + (opts.paidColor || '#C8D4CC') + '"/>';
      svg += '<rect x="' + x + '" y="' + (PAD_T + innerH - totalH) + '" width="' + barWidth + '" height="' + growthH + '" fill="' + (opts.growthColor || '#2A6A3A') + '"/>';
    });

    // X-axis labels (skip any that would collide with the last label)
    var step = Math.max(1, Math.floor(data.length / 6));
    data.forEach(function (d, i) {
      var last = data.length - 1;
      if (i === last || ((i === 0 || (i + 1) % step === 0) && last - i >= step * 0.75)) {
        var x = PAD_L + i * bandW + bandW / 2;
        svg += '<text x="' + x + '" y="' + (PAD_T + innerH + 16) + '" font-size="10" fill="#999" text-anchor="middle" font-family="Inter,sans-serif">yr ' + d.year + '</text>';
      }
    });

    // Legend
    if (opts.showLegend) {
      svg += '<g transform="translate(' + (PAD_L + 4) + ', ' + 12 + ')">';
      svg += '<rect x="0" y="0" width="10" height="10" fill="' + (opts.paidColor || '#C8D4CC') + '"/>';
      svg += '<text x="14" y="9" font-size="10" fill="#666" font-family="Inter,sans-serif">' + (opts.legendPaid || 'paid in') + '</text>';
      svg += '<rect x="100" y="0" width="10" height="10" fill="' + (opts.growthColor || '#2A6A3A') + '"/>';
      svg += '<text x="114" y="9" font-size="10" fill="#666" font-family="Inter,sans-serif">' + (opts.legendGrowth || 'growth') + '</text>';
      svg += '</g>';
    }

    svg += '</svg>';
    chart.innerHTML = svg;
  }

  // Re-render all charts when the viewport is resized (debounced)
  var resizeTimer = null;
  window.addEventListener('resize', function () {
    if (!redraws.length) return;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      redraws.forEach(function (fn) { fn(); });
    }, 150);
  });

  // Boot everything
  function boot() {
    initCompound();
    initInflation();
    initFlowchart();
    initPCA();
    initISA();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();

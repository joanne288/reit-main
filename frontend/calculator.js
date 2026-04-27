// ============================================================
//  JM&RA Real Estate Calculator
//  EMI + Affordability + ROI Calculator
// ============================================================
(function () {

  // ── INJECT HTML ───────────────────────────────────────────
  document.body.insertAdjacentHTML('beforeend', `
  <div id="calc-bubble" title="Property Calculator">
    <i class='bx bx-calculator'></i>
  </div>

  <div id="calc-window">
    <div id="calc-header">
      <div class="calc-header-left">
        <div class="calc-avatar"><i class='bx bx-calculator'></i></div>
        <div>
          <div class="calc-title">Property Calculator</div>
          <div class="calc-subtitle">EMI · Affordability · ROI</div>
        </div>
      </div>
      <button id="calc-close"><i class='bx bx-x'></i></button>
    </div>

    <!-- TABS -->
    <div id="calc-tabs">
      <button class="calc-tab active" onclick="switchCalcTab('emi', this)">EMI</button>
      <button class="calc-tab" onclick="switchCalcTab('afford', this)">Affordability</button>
      <button class="calc-tab" onclick="switchCalcTab('roi', this)">ROI</button>
    </div>

    <div id="calc-body">

      <!-- EMI CALCULATOR -->
      <div class="calc-panel active" id="panel-emi">
        <div class="calc-field">
          <label>Loan Amount (₹)</label>
          <input type="number" id="emi-loan" placeholder="e.g. 5000000" value="5000000">
        </div>
        <div class="calc-field">
          <label>Interest Rate (% per year)</label>
          <input type="number" id="emi-rate" placeholder="e.g. 8.5" value="8.5" step="0.1">
        </div>
        <div class="calc-field">
          <label>Loan Tenure (years)</label>
          <input type="number" id="emi-years" placeholder="e.g. 20" value="20">
        </div>
        <button class="calc-btn" onclick="calcEMI()">Calculate EMI</button>
        <div class="calc-result" id="emi-result" style="display:none">
          <div class="result-row"><span>Monthly EMI</span><strong id="emi-monthly"></strong></div>
          <div class="result-row"><span>Total Payment</span><strong id="emi-total"></strong></div>
          <div class="result-row"><span>Total Interest</span><strong id="emi-interest"></strong></div>
        </div>
      </div>

      <!-- AFFORDABILITY CALCULATOR -->
      <div class="calc-panel" id="panel-afford">
        <div class="calc-field">
          <label>Monthly Income (₹)</label>
          <input type="number" id="aff-income" placeholder="e.g. 100000" value="100000">
        </div>
        <div class="calc-field">
          <label>Monthly Expenses (₹)</label>
          <input type="number" id="aff-expenses" placeholder="e.g. 30000" value="30000">
        </div>
        <div class="calc-field">
          <label>Down Payment Available (₹)</label>
          <input type="number" id="aff-down" placeholder="e.g. 1000000" value="1000000">
        </div>
        <div class="calc-field">
          <label>Interest Rate (% per year)</label>
          <input type="number" id="aff-rate" placeholder="e.g. 8.5" value="8.5" step="0.1">
        </div>
        <button class="calc-btn" onclick="calcAffordability()">Calculate</button>
        <div class="calc-result" id="aff-result" style="display:none">
          <div class="result-row"><span>Max EMI you can pay</span><strong id="aff-maxemi"></strong></div>
          <div class="result-row"><span>Max Loan Amount</span><strong id="aff-maxloan"></strong></div>
          <div class="result-row"><span>Max Property Value</span><strong id="aff-maxprop"></strong></div>
        </div>
      </div>

      <!-- ROI CALCULATOR -->
      <div class="calc-panel" id="panel-roi">
        <div class="calc-field">
          <label>Purchase Price (₹)</label>
          <input type="number" id="roi-price" placeholder="e.g. 8000000" value="8000000">
        </div>
        <div class="calc-field">
          <label>Monthly Rental Income (₹)</label>
          <input type="number" id="roi-rent" placeholder="e.g. 30000" value="30000">
        </div>
        <div class="calc-field">
          <label>Annual Maintenance (₹)</label>
          <input type="number" id="roi-maintenance" placeholder="e.g. 50000" value="50000">
        </div>
        <div class="calc-field">
          <label>Expected Annual Appreciation (%)</label>
          <input type="number" id="roi-appreciation" placeholder="e.g. 5" value="5" step="0.5">
        </div>
        <button class="calc-btn" onclick="calcROI()">Calculate ROI</button>
        <div class="calc-result" id="roi-result" style="display:none">
          <div class="result-row"><span>Annual Rental Income</span><strong id="roi-annual"></strong></div>
          <div class="result-row"><span>Net Annual Income</span><strong id="roi-net"></strong></div>
          <div class="result-row"><span>Rental Yield</span><strong id="roi-yield"></strong></div>
          <div class="result-row"><span>Total ROI (with appreciation)</span><strong id="roi-total"></strong></div>
        </div>
      </div>

    </div>
  </div>`);

  // ── STYLES ────────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    #calc-bubble {
      position: fixed;
      bottom: 2rem; right: 2rem;
      width: 58px; height: 58px;
      border-radius: 50%;
      background: linear-gradient(135deg, hsl(220,70%,50%), hsl(220,70%,38%));
      color: #fff;
      display: flex; align-items: center; justify-content: center;
      font-size: 1.6rem;
      cursor: pointer;
      box-shadow: 0 8px 24px hsla(220,70%,40%,.4);
      z-index: 9998;
      transition: transform .3s, box-shadow .3s;
    }
    #calc-bubble:hover { transform: scale(1.1); box-shadow: 0 12px 32px hsla(220,70%,40%,.5); }

    #calc-window {
      position: fixed;
      bottom: 6.5rem; right: 2rem;
      width: 340px;
      background: var(--body-color, #edf2ff);
      border: 2px solid var(--border-color, #ccd5f0);
      border-radius: 1.25rem;
      box-shadow: 0 20px 60px hsla(220,40%,20%,.2);
      display: flex; flex-direction: column;
      z-index: 9999;
      overflow: hidden;
      transform: scale(.9) translateY(20px);
      opacity: 0;
      pointer-events: none;
      transition: transform .3s cubic-bezier(.34,1.56,.64,1), opacity .3s;
      max-height: 560px;
    }
    #calc-window.open { transform: scale(1) translateY(0); opacity: 1; pointer-events: all; }

    #calc-header {
      background: linear-gradient(135deg, hsl(220,70%,50%), hsl(220,70%,38%));
      padding: .85rem 1rem;
      display: flex; align-items: center; justify-content: space-between;
      flex-shrink: 0;
    }
    .calc-header-left { display: flex; align-items: center; gap: .65rem; }
    .calc-avatar { width: 36px; height: 36px; border-radius: 50%; background: hsla(255,100%,100%,.2); display: flex; align-items: center; justify-content: center; font-size: 1.1rem; color: #fff; }
    .calc-title { font-size: .875rem; font-weight: 600; color: #fff; font-family: 'Raleway', sans-serif; }
    .calc-subtitle { font-size: .7rem; color: hsla(255,100%,100%,.75); font-family: 'Raleway', sans-serif; }
    #calc-close { background: none; border: none; color: #fff; font-size: 1.4rem; cursor: pointer; opacity: .8; transition: opacity .2s; padding: 0; line-height: 1; }
    #calc-close:hover { opacity: 1; }

    #calc-tabs {
      display: flex;
      border-bottom: 2px solid var(--border-color, #ccd5f0);
      flex-shrink: 0;
      background: var(--container-color, #dde6ff);
    }
    .calc-tab {
      flex: 1; padding: .6rem; font-size: .75rem; font-weight: 600;
      background: none; border: none; cursor: pointer;
      color: var(--text-color, #5a6a9a);
      font-family: 'Raleway', sans-serif;
      transition: .2s; border-bottom: 2px solid transparent; margin-bottom: -2px;
    }
    .calc-tab.active { color: hsl(220,70%,50%); border-bottom-color: hsl(220,70%,50%); }
    .calc-tab:hover { color: hsl(220,70%,50%); }

    #calc-body { overflow-y: auto; flex: 1; }
    #calc-body::-webkit-scrollbar { width: .3rem; }
    #calc-body::-webkit-scrollbar-thumb { background: var(--border-color, #ccd5f0); border-radius: .5rem; }

    .calc-panel { display: none; padding: 1rem; }
    .calc-panel.active { display: block; }

    .calc-field { margin-bottom: .75rem; }
    .calc-field label { display: block; font-size: .7rem; font-weight: 600; color: var(--text-color, #5a6a9a); text-transform: uppercase; letter-spacing: .04em; margin-bottom: .3rem; font-family: 'Raleway', sans-serif; }
    .calc-field input {
      width: 100%; padding: .55rem .75rem;
      background: var(--container-color, #dde6ff);
      border: 2px solid var(--border-color, #ccd5f0);
      border-radius: .5rem;
      font-size: .813rem; color: var(--title-color, #1a2340);
      font-family: 'Raleway', sans-serif;
      transition: border-color .2s;
    }
    .calc-field input:focus { outline: none; border-color: hsl(220,70%,50%); }

    .calc-btn {
      width: 100%; padding: .65rem;
      background: linear-gradient(135deg, hsl(220,70%,50%), hsl(220,70%,40%));
      color: #fff; border: none; border-radius: .5rem;
      font-size: .813rem; font-weight: 600;
      cursor: pointer; transition: opacity .2s; margin-bottom: .85rem;
      font-family: 'Raleway', sans-serif;
    }
    .calc-btn:hover { opacity: .9; }

    .calc-result {
      background: var(--container-color, #dde6ff);
      border: 2px solid var(--border-color, #ccd5f0);
      border-radius: .75rem;
      padding: .85rem;
    }
    .result-row {
      display: flex; justify-content: space-between; align-items: center;
      padding: .35rem 0;
      border-bottom: 1px solid var(--border-color, #ccd5f0);
      font-size: .775rem; font-family: 'Raleway', sans-serif;
    }
    .result-row:last-child { border-bottom: none; }
    .result-row span { color: var(--text-color, #5a6a9a); }
    .result-row strong { color: hsl(220,70%,45%); font-weight: 600; }

    @media (max-width: 480px) {
      #calc-window { width: calc(100vw - 2rem); right: 1rem; bottom: 5.5rem; }
      #calc-bubble { bottom: 1.25rem; right: 1.25rem; }
    }
  `;
  document.head.appendChild(style);

  // ── TOGGLE ────────────────────────────────────────────────
  const bubble  = document.getElementById('calc-bubble');
  const calcWin = document.getElementById('calc-window');
  const closeBtn = document.getElementById('calc-close');
  let isOpen = false;

  bubble.addEventListener('click', () => {
    isOpen = !isOpen;
    calcWin.classList.toggle('open', isOpen);
    bubble.querySelector('i').className = isOpen ? 'bx bx-x' : 'bx bx-calculator';
  });
  closeBtn.addEventListener('click', () => {
    isOpen = false;
    calcWin.classList.remove('open');
    bubble.querySelector('i').className = 'bx bx-calculator';
  });

  // ── TAB SWITCH ────────────────────────────────────────────
  window.switchCalcTab = function(name, btn) {
    document.querySelectorAll('.calc-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.calc-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('panel-' + name).classList.add('active');
  };

  // ── FORMAT CURRENCY ───────────────────────────────────────
  function fmt(n) {
    if (n >= 10000000) return '₹' + (n / 10000000).toFixed(2) + ' Cr';
    if (n >= 100000)   return '₹' + (n / 100000).toFixed(2) + ' L';
    return '₹' + Math.round(n).toLocaleString('en-IN');
  }

  // ── EMI CALCULATOR ────────────────────────────────────────
  window.calcEMI = function() {
    const P = parseFloat(document.getElementById('emi-loan').value);
    const r = parseFloat(document.getElementById('emi-rate').value) / 12 / 100;
    const n = parseFloat(document.getElementById('emi-years').value) * 12;

    if (!P || !r || !n) return;

    const emi      = P * r * Math.pow(1+r, n) / (Math.pow(1+r, n) - 1);
    const total    = emi * n;
    const interest = total - P;

    document.getElementById('emi-monthly').textContent  = fmt(emi);
    document.getElementById('emi-total').textContent    = fmt(total);
    document.getElementById('emi-interest').textContent = fmt(interest);
    document.getElementById('emi-result').style.display = 'block';
  };

  // ── AFFORDABILITY CALCULATOR ──────────────────────────────
  window.calcAffordability = function() {
    const income   = parseFloat(document.getElementById('aff-income').value);
    const expenses = parseFloat(document.getElementById('aff-expenses').value);
    const down     = parseFloat(document.getElementById('aff-down').value);
    const r        = parseFloat(document.getElementById('aff-rate').value) / 12 / 100;
    const n        = 240; // 20 years standard

    if (!income || !r) return;

    // Max EMI = 40% of take-home after expenses
    const maxEMI  = (income - expenses) * 0.4;
    const maxLoan = maxEMI * (Math.pow(1+r, n) - 1) / (r * Math.pow(1+r, n));
    const maxProp = maxLoan + (down || 0);

    document.getElementById('aff-maxemi').textContent  = fmt(maxEMI);
    document.getElementById('aff-maxloan').textContent = fmt(maxLoan);
    document.getElementById('aff-maxprop').textContent = fmt(maxProp);
    document.getElementById('aff-result').style.display = 'block';
  };

  // ── ROI CALCULATOR ────────────────────────────────────────
  window.calcROI = function() {
    const price         = parseFloat(document.getElementById('roi-price').value);
    const monthlyRent   = parseFloat(document.getElementById('roi-rent').value);
    const maintenance   = parseFloat(document.getElementById('roi-maintenance').value) || 0;
    const appreciation  = parseFloat(document.getElementById('roi-appreciation').value) || 0;

    if (!price || !monthlyRent) return;

    const annualRent  = monthlyRent * 12;
    const netIncome   = annualRent - maintenance;
    const rentalYield = (netIncome / price) * 100;
    const totalROI    = rentalYield + appreciation;

    document.getElementById('roi-annual').textContent = fmt(annualRent);
    document.getElementById('roi-net').textContent    = fmt(netIncome);
    document.getElementById('roi-yield').textContent  = rentalYield.toFixed(2) + '%';
    document.getElementById('roi-total').textContent  = totalROI.toFixed(2) + '%';
    document.getElementById('roi-result').style.display = 'block';
  };

  // Apply enter key to all inputs
  document.querySelectorAll('#calc-window input').forEach(input => {
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        const panel = input.closest('.calc-panel').id;
        if (panel === 'panel-emi')    window.calcEMI();
        if (panel === 'panel-afford') window.calcAffordability();
        if (panel === 'panel-roi')    window.calcROI();
      }
    });
  });

})();

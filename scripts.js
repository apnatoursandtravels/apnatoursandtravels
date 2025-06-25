// --- Remove API_KEY and old API_BASE_URL ---
// const API_KEY = 'f782350a3b382aa55ff058a3';
// const API_BASE_URL = 'https://api.exchangerate-api.com/v4/latest/USD';

// DOM elements
const amountInput = document.getElementById('amount');
const fromCurrency = document.getElementById('from-currency');
const toCurrency = document.getElementById('to-currency');
const convertedAmountEl = document.getElementById('converted-amount');
const ratesContainer = document.getElementById('rates-container');
const faqList = document.getElementById('faqList');
const swapBtn = document.getElementById('swap-btn');
const currentYearEl = document.getElementById('currentYear');

// Currency names for display (you already have this object)
const currencyNames = {
  USD: "US Dollar",
  EUR: "Euro",
  GBP: "British Pound",
  AUD: "Australian Dollar",
  CAD: "Canadian Dollar",
  JPY: "Japanese Yen",
  CNY: "Chinese Yuan",
  SGD: "Singapore Dollar",
  INR: "Indian Rupee",
  // Add any more if you want
};

// Map currency codes to country codes for flags (ISO 3166-1 alpha-2 lowercase)
const currencyToCountryCode = {
  USD: 'us',
  EUR: '',        // no flag for euro
  GBP: 'gb',
  JPY: 'jp',
  AUD: 'au',
  CAD: 'ca',
  CNY: 'cn',
  INR: 'in',
  SGD: 'sg',
};

// Data fetched from API will be stored here
let ratesData = {};

// Fetch exchange rates from CoinGecko for INR base
async function fetchRates() {
  try {
    // CoinGecko simple price API for INR-based conversion rates to target currencies
    // For demo, fetch these currencies: USD, EUR, GBP, AUD, CAD, JPY, CNY, SGD
    const targetCurrencies = ['usd','eur','gbp','aud','cad','jpy','cny','sgd'];
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=indian-rupee&vs_currencies=${targetCurrencies.join(',')}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.json();

    // data example: { "indian-rupee": { usd: 0.012, eur: 0.011, gbp: 0.009, ... } }
    if (!data['indian-rupee']) throw new Error('Invalid data from CoinGecko');

    ratesData = data['indian-rupee']; // e.g. { usd: 0.012, eur: 0.011, ... }

    populateCurrencySelectorsForConverter(); // Fill dropdowns with full currencies list for converter
    displayLiveRates(ratesData);              // Show live INR exchange rates in requested format
    updateConvertedAmount();
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    ratesContainer.textContent = 'Failed to load exchange rates. Please try again later.';
  }
}

// Populate currency dropdowns for converter (full list)
function populateCurrencySelectorsForConverter() {
  fromCurrency.innerHTML = '';
  toCurrency.innerHTML = '';

  // Use your full currencyNames keys for converter dropdown
  const currencies = Object.keys(currencyNames).sort();

  currencies.forEach(cur => {
    const name = currencyNames[cur] || 'Unknown Currency';

    const optionFrom = document.createElement('option');
    optionFrom.value = cur;
    optionFrom.textContent = `${cur} - ${name}`;
    fromCurrency.appendChild(optionFrom);

    const optionTo = document.createElement('option');
    optionTo.value = cur;
    optionTo.textContent = `${cur} - ${name}`;
    toCurrency.appendChild(optionTo);
  });

  // Set defaults for converter
  fromCurrency.value = 'INR';
  toCurrency.value = 'USD';
}

// Convert amount in converter
function updateConvertedAmount() {
  const amount = parseFloat(amountInput.value);
  if (isNaN(amount) || amount < 0) {
    convertedAmountEl.textContent = '-';
    return;
  }

  const fromCur = fromCurrency.value.toLowerCase();
  const toCur = toCurrency.value.toLowerCase();

  // Simple direct conversion via CoinGecko if from or to is INR
  // Since CoinGecko ratesData only has INR base rates (INR -> others),
  // we handle conversions with INR as base or target

  if (fromCur === 'inr') {
    // INR to other
    if (!ratesData[toCur]) {
      convertedAmountEl.textContent = '-';
      return;
    }
    const converted = amount * ratesData[toCur];
    convertedAmountEl.textContent = converted.toFixed(4);
  } else if (toCur === 'inr') {
    // Other to INR (invert rate)
    if (!ratesData[fromCur]) {
      convertedAmountEl.textContent = '-';
      return;
    }
    const converted = amount / ratesData[fromCur];
    convertedAmountEl.textContent = converted.toFixed(4);
  } else {
    // Neither from nor to is INR, convert via INR as intermediary
    if (!ratesData[fromCur] || !ratesData[toCur]) {
      convertedAmountEl.textContent = '-';
      return;
    }
    // formula: amount * (INR->toCur) / (INR->fromCur)
    const converted = amount * (ratesData[toCur] / ratesData[fromCur]);
    convertedAmountEl.textContent = converted.toFixed(4);
  }
}

// Display live INR exchange rates with flags, currency, and format "1 INR = X USD"
function displayLiveRates(rates) {
  ratesContainer.innerHTML = '';

  // Show these currencies in order, with flags and rate
  const displayCurrencies = ['USD', 'EUR', 'GBP', 'AUD', 'CAD', 'JPY', 'CNY', 'SGD'];

  displayCurrencies.forEach(cur => {
    const curLower = cur.toLowerCase();
    if (!rates[curLower]) return;

    const card = document.createElement('div');
    card.className = 'rate-card';

    // Flag icon div
    const flagCode = currencyToCountryCode[cur];
    const flagDiv = document.createElement('div');
    flagDiv.className = 'flag-icon';

    if (flagCode) {
      flagDiv.className = `fi fi-${flagCode}`; // Use flag-icons classes
    } else {
      flagDiv.textContent = cur; // fallback text
      flagDiv.style.fontWeight = '700';
      flagDiv.style.fontSize = '20px';
    }

    card.appendChild(flagDiv);

    // Currency code & name div
    const codeNameDiv = document.createElement('div');
    codeNameDiv.className = 'currency-info';

    const codeEl = document.createElement('div');
    codeEl.className = 'currency-code';
    codeEl.textContent = cur;

    const nameEl = document.createElement('div');
    nameEl.className = 'currency-name';
    nameEl.textContent = currencyNames[cur] || 'Unknown Currency';

    codeNameDiv.appendChild(codeEl);
    codeNameDiv.appendChild(nameEl);

    card.appendChild(codeNameDiv);

    // Rate div with format: 1 INR = X CUR
    const rateDiv = document.createElement('div');
    rateDiv.className = 'currency-rate';
    rateDiv.textContent = `1 INR = ${rates[curLower].toFixed(4)} ${cur}`;

    card.appendChild(rateDiv);

    ratesContainer.appendChild(card);
  });
}

// Swap currencies button logic
swapBtn.addEventListener('click', () => {
  const temp = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = temp;

  updateConvertedAmount();
});

amountInput.addEventListener('input', updateConvertedAmount);
fromCurrency.addEventListener('change', updateConvertedAmount);
toCurrency.addEventListener('change', updateConvertedAmount);

// FAQ content and renderFaq() remain unchanged
const faqData = [
  {
    question: "How do I exchange currency with Apna Tours & Travels?",
    answer: "You can use our currency converter to check rates and then visit our office or order online."
  },
  {
    question: "What currencies do you support?",
    answer: "We support all major global currencies including USD, EUR, GBP, JPY, and many more."
  },
  {
    question: "How often are the exchange rates updated?",
    answer: "Rates are updated every hour based on global market data."
  },
  {
    question: "Are there any additional fees or commissions?",
    answer: "We offer competitive rates with transparent pricing. No hidden fees."
  },
  {
    question: "How can I contact customer support?",
    answer: "You can reach us at info@apnatravels.com or call +91 98765 43210 during business hours."
  }
];

function renderFaq() {
  faqList.innerHTML = '';
  faqData.forEach(({ question, answer }, i) => {
    const item = document.createElement('div');
    item.className = 'faq-item';

    const q = document.createElement('div');
    q.className = 'faq-question';
    q.textContent = question;
    q.tabIndex = 0;
    q.setAttribute('role', 'button');
    q.setAttribute('aria-expanded', 'false');
    q.setAttribute('aria-controls', `faq-answer-${i}`);

    const a = document.createElement('div');
    a.className = 'faq-answer';
    a.id = `faq-answer-${i}`;
    a.textContent = answer;

    q.addEventListener('click', () => {
      const isOpen = item.classList.toggle('open');
      q.setAttribute('aria-expanded', isOpen);
    });
    q.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        q.click();
      }
    });

    item.appendChild(q);
    item.appendChild(a);
    faqList.appendChild(item);
  });
}

// Initialize everything
function init() {
  currentYearEl.textContent = new Date().getFullYear();
  fetchRates();
  renderFaq();
  updateConvertedAmount();
}

init();

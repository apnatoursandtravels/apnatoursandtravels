const API_BASE_URL = 'https://v6.exchangerate-api.com/v6/f782350a3b382aa55ff058a3/latest/INR';

// DOM Elements
const amountInput = document.getElementById('amount');
const fromCurrencyContainer = document.getElementById('from-currency-container');
const toCurrencyContainer = document.getElementById('to-currency-container');
const convertedAmountEl = document.getElementById('converted-amount');
const ratesContainer = document.getElementById('rates-container');
const faqList = document.getElementById('faqList');
const swapBtn = document.getElementById('swap-btn');

const fromCurrencyInput = document.getElementById('from-currency-input');
const toCurrencyInput = document.getElementById('to-currency-input');
const fromDropdown = document.getElementById('from-currency-dropdown');
const toDropdown = document.getElementById('to-currency-dropdown');

let rates = {};

// Add more mappings as needed
const currencyToCountryCode = {
  USD: 'us',
  EUR: 'eu',
  GBP: 'gb',
  AUD: 'au',
  CAD: 'ca',
  CHF: 'ch',
  INR: 'in',
  SAR: 'sa',
  QAR: 'qa',
  BHD: 'bh',
  OMR: 'om',
  KWD: 'kw',
  THB: 'th'
};

// === Functions ===

async function fetchRates() {
  try {
    const res = await fetch(API_BASE_URL);
    if (!res.ok) throw new Error('Failed to fetch rates');
    const data = await res.json();
    if (!data.conversion_rates) throw new Error('Invalid data format');
    rates = data.conversion_rates;

    populateCurrencyDropdowns();
    displayLiveRates();
    updateConvertedAmount();
  } catch (e) {
    console.error(e);
    ratesContainer.textContent = "Failed to load rates. Please try again later.";
  }
}

function createDropdownItems(dropdown, onSelect) {
  dropdown.innerHTML = '';
  const fragment = document.createDocumentFragment();

  const sorted = Object.keys(currencyNames).sort();

  sorted.forEach(code => {
    const item = document.createElement('div');
    item.className = 'dropdown-item';
    item.textContent = `${code} - ${currencyNames[code]}`;
    item.dataset.code = code;
    item.tabIndex = 0;

    item.addEventListener('click', () => {
      onSelect(code);
      closeAllDropdowns();
    });

    item.addEventListener('keydown', (e) => {
      if (['Enter', ' '].includes(e.key)) {
        e.preventDefault();
        onSelect(code);
        closeAllDropdowns();
        dropdown.previousElementSibling.focus();
      }
    });

    fragment.appendChild(item);
  });

  dropdown.appendChild(fragment);
}

function setFromCurrency(code) {
  fromCurrencyInput.value = code;
  updateConvertedAmount();
}
function setToCurrency(code) {
  toCurrencyInput.value = code;
  updateConvertedAmount();
}

function filterDropdown(dropdown, query) {
  const items = dropdown.querySelectorAll('.dropdown-item');
  const q = query.trim().toLowerCase();
  items.forEach(item => {
    item.style.display = item.textContent.toLowerCase().includes(q) ? '' : 'none';
  });
}

function closeAllDropdowns() {
  fromDropdown.classList.remove('open');
  toDropdown.classList.remove('open');
}

function toggleDropdown(dropdown) {
  const isOpen = dropdown.classList.contains('open');
  closeAllDropdowns();
  if (!isOpen) dropdown.classList.add('open');
}

function setupDropdown(container, input, dropdown, setFunc) {
  input.addEventListener('focus', () => toggleDropdown(dropdown));
  input.addEventListener('click', () => toggleDropdown(dropdown));
  input.addEventListener('input', () => {
    filterDropdown(dropdown, input.value);
    dropdown.classList.add('open');
  });
  document.addEventListener('click', (e) => {
    if (!container.contains(e.target)) closeAllDropdowns();
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const visible = Array.from(dropdown.querySelectorAll('.dropdown-item')).filter(i => i.style.display !== 'none');
      if (visible.length) visible[0].focus();
    }
  });

  dropdown.addEventListener('keydown', (e) => {
    const visible = Array.from(dropdown.querySelectorAll('.dropdown-item')).filter(i => i.style.display !== 'none');
    let idx = visible.indexOf(document.activeElement);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      visible[(idx + 1) % visible.length].focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      visible[(idx - 1 + visible.length) % visible.length].focus();
    } else if (e.key === 'Escape') {
      closeAllDropdowns();
      input.focus();
    }
  });
}

function populateCurrencyDropdowns() {
  createDropdownItems(fromDropdown, setFromCurrency);
  createDropdownItems(toDropdown, setToCurrency);
  setFromCurrency('INR');
  setToCurrency('USD');
}

function updateConvertedAmount() {
  const amount = parseFloat(amountInput.value);
  const from = fromCurrencyInput.value.trim().toUpperCase();
  const to = toCurrencyInput.value.trim().toUpperCase();

  if (!rates[from] || !rates[to] || isNaN(amount) || amount <= 0) {
    convertedAmountEl.textContent = '-';
    return;
  }

  const result = amount * (rates[to] / rates[from]);
  const formatted = result.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  convertedAmountEl.textContent = `${formatted} ${to}`;
}

function displayLiveRates() {
  ratesContainer.innerHTML = '';

  const popular = [
    'USD', 'EUR', 'GBP', 'AUD', 'CAD', 'CHF', 'INR',
    'SAR', 'QAR', 'BHD', 'OMR', 'KWD', 'THB'
  ];

  popular.forEach(code => {
    if (!rates[code]) return;

    const card = document.createElement('div');
    card.className = 'rate-card';

    const flagDiv = document.createElement('div');
    const flagCode = currencyToCountryCode[code];
    if (flagCode) {
      flagDiv.className = `fi fi-${flagCode}`;
    } else {
      flagDiv.textContent = code;
      flagDiv.style.fontWeight = '700';
    }

    const codeEl = document.createElement('div');
    codeEl.className = 'currency-code';
    codeEl.textContent = code;

    const nameEl = document.createElement('div');
    nameEl.className = 'currency-name';
    nameEl.textContent = currencyNames[code] || 'Unknown';

    const rateEl = document.createElement('div');
    rateEl.className = 'currency-rate';
    rateEl.textContent = `1 INR = ${rates[code].toFixed(4)}`;

    card.append(flagDiv, codeEl, nameEl, rateEl);
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      setFromCurrency('INR');
      setToCurrency(code);
      updateConvertedAmount();
    });

    ratesContainer.appendChild(card);
  });
}

swapBtn.addEventListener('click', () => {
  const fromVal = fromCurrencyInput.value;
  const toVal = toCurrencyInput.value;
  setFromCurrency(toVal);
  setToCurrency(fromVal);
  updateConvertedAmount();
});

amountInput.addEventListener('input', updateConvertedAmount);
fromCurrencyInput.addEventListener('input', () => filterDropdown(fromDropdown, fromCurrencyInput.value));
toCurrencyInput.addEventListener('input', () => filterDropdown(toDropdown, toCurrencyInput.value));

// FAQ
const faqData = [
  {
    question: "How do I exchange currency with Apna Tours & Travels?",
    answer: "You can use our currency converter to check rates and then visit our office."
  },
  {
    question: "What currencies do you support?",
    answer: "We support all major global currencies including USD, EUR, GBP, and more."
  },
  {
    question: "How often are the exchange rates updated?",
    answer: "Rates are updated hourly based on global market data. Office rates may differ."
  },
  {
    question: "Are there any additional fees or commissions?",
    answer: "We offer competitive rates with transparent pricing. No hidden fees."
  },
  {
    question: "How can I contact customer support?",
    answer: "Email us at smabidayub@gmail.com or call +91 94314 92354 during business hours."
  },
  {
    question: "Do you offer delivery services?",
    answer: "Yes, we offer delivery in and around Patna as well as in-person service."
  },
  {
    question: "What documents are required to exchange currency?",
    answer: "Please carry a government-issued photo ID and PAN card. Proof of address may be needed."
  }
];

function renderFAQ() {
  faqList.innerHTML = '';
  faqData.forEach(({ question, answer }) => {
    const item = document.createElement('div');
    item.className = 'faq-item';

    const q = document.createElement('div');
    q.className = 'faq-question';
    q.textContent = question;
    q.tabIndex = 0;

    const a = document.createElement('div');
    a.className = 'faq-answer';
    a.textContent = answer;

    q.addEventListener('click', () => item.classList.toggle('open'));
    q.addEventListener('keydown', e => {
      if (['Enter', ' '].includes(e.key)) {
        e.preventDefault();
        item.classList.toggle('open');
      }
    });

    item.append(q, a);
    faqList.appendChild(item);
  });
}

// Init
setupDropdown(fromCurrencyContainer, fromCurrencyInput, fromDropdown, setFromCurrency);
setupDropdown(toCurrencyContainer, toCurrencyInput, toDropdown, setToCurrency);
fetchRates();
renderFAQ();

const API_KEY = 'f782350a3b382aa55ff058a3';
const API_BASE_URL = 'https://api.exchangerate-api.com/v4/latest/INR'; // Replace if your API differs

// DOM elements
const amountInput = document.getElementById('amount');
const fromCurrency = document.getElementById('from-currency');
const toCurrency = document.getElementById('to-currency');
const convertedAmountEl = document.getElementById('converted-amount');
const ratesContainer = document.getElementById('rates-container'); // changed to new container
const faqList = document.getElementById('faqList');
const swapBtn = document.getElementById('swap-btn');
const currentYearEl = document.getElementById('currentYear');

// Currency names for display
const currencyNames = {
  USD: 'US Dollar',
  EUR: 'Euro',
  GBP: 'British Pound',
  JPY: 'Japanese Yen',
  AUD: 'Australian Dollar',
  CAD: 'Canadian Dollar',
  CHF: 'Swiss Franc',
  CNY: 'Chinese Yuan',
  INR: 'Indian Rupee',
  // Add more as needed
};

// Map currency codes to country codes for flags (ISO 3166-1 alpha-2)
const currencyToCountryCode = {
  USD: 'us',
  EUR: 'eu',
  GBP: 'gb',
  JPY: 'jp',
  AUD: 'au',
  CAD: 'ca',
  CHF: 'ch',
  CNY: 'cn',
  INR: 'in',
  // add more if needed
};

let ratesData = {};

// Fetch exchange rates from API with API key
async function fetchRates() {
  try {
    const response = await fetch(`${API_BASE_URL}?apikey=${API_KEY}`);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();

    if (!data.rates) throw new Error('Invalid rates data');

    ratesData = data.rates;

    populateCurrencySelectors(ratesData);
    displayLiveRates(ratesData);
    updateConvertedAmount();

  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    ratesContainer.textContent = 'Failed to load exchange rates. Please try again later.';
  }
}

// Populate the "To" currency dropdown with available currencies
function populateCurrencySelectors(rates) {
  toCurrency.innerHTML = '';
  const currencies = Object.keys(rates).sort();

  currencies.forEach(cur => {
    if (cur === 'INR') return;
    const option = document.createElement('option');
    option.value = cur;
    option.textContent = `${cur} - ${currencyNames[cur] || 'Unknown Currency'}`;
    toCurrency.appendChild(option);
  });

  toCurrency.value = currencies.includes('USD') ? 'USD' : currencies[0];
}

// Convert INR amount to selected currency and display
function updateConvertedAmount() {
  const amount = parseFloat(amountInput.value);
  if (isNaN(amount) || amount < 0) {
    convertedAmountEl.textContent = '-';
    return;
  }
  const toCur = toCurrency.value;
  if (!ratesData || !ratesData[toCur]) {
    convertedAmountEl.textContent = '-';
    return;
  }
  const converted = amount * ratesData[toCur];
  convertedAmountEl.textContent = converted.toFixed(4);
}

// Display live exchange rates as cards
function displayLiveRates(rates) {
  ratesContainer.innerHTML = '';

  const popularCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'INR'];

  popularCurrencies.forEach(cur => {
    if (!rates[cur]) return;

    const card = document.createElement('div');
    card.className = 'rate-card';

    // Flag icon div
    const flagCode = currencyToCountryCode[cur] || 'un'; // 'un' unknown flag
    const flagDiv = document.createElement('div');
    flagDiv.className = `flag-icon flag-icon-${flagCode}`;
    card.appendChild(flagDiv);

    // Currency code
    const codeDiv = document.createElement('div');
    codeDiv.className = 'currency-code';
    codeDiv.textContent = cur;
    card.appendChild(codeDiv);

    // Currency name
    const nameDiv = document.createElement('div');
    nameDiv.className = 'currency-name';
    nameDiv.textContent = currencyNames[cur] || 'Unknown Currency';
    card.appendChild(nameDiv);

    // Rate
    const rateDiv = document.createElement('div');
    rateDiv.className = 'currency-rate';
    rateDiv.textContent = rates[cur].toFixed(4);
    card.appendChild(rateDiv);

    ratesContainer.appendChild(card);
  });
}

// Swap currencies button logic
swapBtn.addEventListener('click', () => {
  let currentAmount = parseFloat(amountInput.value);
  let currentConverted = parseFloat(convertedAmountEl.textContent);

  if (isNaN(currentAmount) || isNaN(currentConverted)) return;

  amountInput.value = currentConverted.toFixed(4);
  convertedAmountEl.textContent = '-';

  if (toCurrency.value !== 'INR') {
    toCurrency.value = 'INR';
  } else {
    toCurrency.value = Object.keys(ratesData).includes('USD') ? 'USD' : Object.keys(ratesData)[0];
  }

  updateConvertedAmount();
});

amountInput.addEventListener('input', updateConvertedAmount);
toCurrency.addEventListener('change', updateConvertedAmount);

// FAQ content
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

// Render FAQ on the page
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

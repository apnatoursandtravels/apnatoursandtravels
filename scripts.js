const API_KEY = 'f782350a3b382aa55ff058a3';
const API_BASE_URL = 'https://api.exchangerate-api.com/v4/latest/INR'; // Replace if your API differs

// DOM elements
const amountInput = document.getElementById('amount');
const fromCurrency = document.getElementById('from-currency');
const toCurrency = document.getElementById('to-currency');
const convertedAmountEl = document.getElementById('converted-amount');
const ratesContainer = document.getElementById('rates');
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

let ratesData = {};

// Fetch exchange rates from API with API key
async function fetchRates() {
  try {
    const response = await fetch(`${API_BASE_URL}?apikey=${API_KEY}`);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();

    // Expecting data.rates object
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
  // Keep "From" fixed to INR and disabled as per HTML
  // Clear "To" dropdown first
  toCurrency.innerHTML = '';

  // Sort currencies alphabetically
  const currencies = Object.keys(rates).sort();

  currencies.forEach(cur => {
    // Skip INR because From is fixed to INR
    if (cur === 'INR') return;

    const option = document.createElement('option');
    option.value = cur;
    option.textContent = `${cur} - ${currencyNames[cur] || 'Unknown Currency'}`;
    toCurrency.appendChild(option);
  });

  // Default selection: USD if available, else first currency
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

  // Since base is INR, conversion = amount * rate
  const converted = amount * ratesData[toCur];
  convertedAmountEl.textContent = converted.toFixed(4);
}

// Display live exchange rates in the "rates" section
function displayLiveRates(rates) {
  // Clear previous content
  ratesContainer.innerHTML = '';

  // Show a table of some popular currencies (including INR itself)
  const popularCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'INR'];

  const table = document.createElement('table');
  table.className = 'rates-table';

  // Table header
  const thead = document.createElement('thead');
  thead.innerHTML = `<tr><th>Currency</th><th>Name</th><th>Rate (per 1 INR)</th></tr>`;
  table.appendChild(thead);

  const tbody = document.createElement('tbody');

  popularCurrencies.forEach(cur => {
    if (!rates[cur]) return;

    const tr = document.createElement('tr');

    const tdCode = document.createElement('td');
    tdCode.textContent = cur;
    tr.appendChild(tdCode);

    const tdName = document.createElement('td');
    tdName.textContent = currencyNames[cur] || 'Unknown Currency';
    tr.appendChild(tdName);

    const tdRate = document.createElement('td');
    tdRate.textContent = rates[cur].toFixed(4);
    tr.appendChild(tdRate);

    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  ratesContainer.appendChild(table);
}

// Swap the selected "to" currency back to INR and "from" currency remains INR (fixed)
// For your design, "from" is fixed INR, so swapping just toggles between INR and selected currency in dropdown
swapBtn.addEventListener('click', () => {
  // Since fromCurrency is fixed INR and disabled, swapping only swaps the amount and converted amount
  // To simulate swap, swap the amount and converted amount values
  let currentAmount = parseFloat(amountInput.value);
  let currentConverted = parseFloat(convertedAmountEl.textContent);

  if (isNaN(currentAmount) || isNaN(currentConverted)) return;

  // Swap values
  amountInput.value = currentConverted.toFixed(4);
  convertedAmountEl.textContent = '-'; // Will update on input event

  // Swap dropdown "to-currency" value to INR (simulate from INR to currency or vice versa)
  if (toCurrency.value !== 'INR') {
    toCurrency.value = 'INR';
  } else {
    // reset to USD or first available if currently INR
    toCurrency.value = Object.keys(ratesData).includes('USD') ? 'USD' : Object.keys(ratesData)[0];
  }

  updateConvertedAmount();
});

// Event listeners to update conversion on user input
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

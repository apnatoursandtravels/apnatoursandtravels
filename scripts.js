// DOM elements
const amountInput = document.getElementById('amount');
const fromCurrency = document.getElementById('fromCurrency');
const toCurrency = document.getElementById('toCurrency');
const convertedValueEl = document.getElementById('convertedValue');
const convertedCurrencyEl = document.getElementById('convertedCurrency');
const exchangeRateText = document.getElementById('exchangeRateText');
const exchangeRateUpdated = document.getElementById('exchangeRateUpdated');
const ratesTableBody = document.querySelector('#ratesTable tbody');
const ratesLastUpdated = document.getElementById('ratesLastUpdated');
const currentYearEl = document.getElementById('currentYear');
const swapBtn = document.getElementById('swapBtn');
const faqList = document.getElementById('faqList');

const timeframeButtons = document.querySelectorAll('.timeframe-btn');
const currencyButtons = document.querySelectorAll('.currency-btn');
const ctx = document.getElementById('exchangeChart').getContext('2d');

let ratesData = {};
let chart;
let selectedCurrencies = new Set(['USD', 'EUR']);
let selectedDays = 7;

// Currency list and names for quick reference
const currencyNames = {
  USD: 'US Dollar',
  EUR: 'Euro',
  GBP: 'British Pound',
  JPY: 'Japanese Yen',
  // Add more as needed
};

// Utility: fetch exchange rates from exchangerate.host
async function fetchRates() {
  try {
    const response = await fetch('https://api.exchangerate.host/latest?base=INR');
    const data = await response.json();
    ratesData = data;
    updateConverterOptions(data.rates);
    updateRatesTable(data.rates);
    updateConverter();
    updateRatesLastUpdated(data.date);
  } catch (e) {
    console.error('Failed to fetch exchange rates:', e);
  }
}

// Fill currency select options
function updateConverterOptions(rates) {
  const currencies = Object.keys(rates).sort();
  fromCurrency.innerHTML = '';
  toCurrency.innerHTML = '';
  currencies.forEach(currency => {
    const name = currencyNames[currency] || currency;
    const optionFrom = document.createElement('option');
    optionFrom.value = currency;
    optionFrom.textContent = `${currency} - ${name}`;
    fromCurrency.appendChild(optionFrom);

    const optionTo = optionFrom.cloneNode(true);
    toCurrency.appendChild(optionTo);
  });
  // Default selections
  fromCurrency.value = 'INR';
  toCurrency.value = 'USD';
}

// Update the converted amount display
function updateConverter() {
  const amount = parseFloat(amountInput.value) || 0;
  const from = fromCurrency.value;
  const to = toCurrency.value;

  if (!ratesData.rates) return;

  // Convert from 'from' to INR, then INR to 'to'
  let amountInINR;
  if (from === 'INR') {
    amountInINR = amount;
  } else {
    const rateFrom = ratesData.rates[from];
    if (!rateFrom) {
      convertedValueEl.textContent = 'N/A';
      convertedCurrencyEl.textContent = '';
      exchangeRateText.textContent = '';
      return;
    }
    amountInINR = amount / rateFrom;
  }

  const rateTo = ratesData.rates[to];
  if (!rateTo) {
    convertedValueEl.textContent = 'N/A';
    convertedCurrencyEl.textContent = '';
    exchangeRateText.textContent = '';
    return;
  }

  const convertedAmount = amountInINR * rateTo;
  convertedValueEl.textContent = convertedAmount.toFixed(4);
  convertedCurrencyEl.textContent = to;

  exchangeRateText.textContent = `1 ${from} = ${(rateTo / (ratesData.rates[from] || 1)).toFixed(4)} ${to}`;
  exchangeRateUpdated.textContent = `Rates last updated: ${ratesData.date}`;
}

// Update rates table
function updateRatesTable(rates) {
  ratesTableBody.innerHTML = '';
  // For demo: show some major currencies + INR itself
  const currenciesToShow = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'INR'];
  currenciesToShow.forEach(currency => {
    const rate = rates[currency];
    if (!rate) return;

    const tr = document.createElement('tr');

    const tdCurrency = document.createElement('td');
    tdCurrency.textContent = currency;
    tr.appendChild(tdCurrency);

    const tdName = document.createElement('td');
    tdName.textContent = currencyNames[currency] || currency;
    tr.appendChild(tdName);

    const tdRate = document.createElement('td');
    tdRate.textContent = rate.toFixed(4);
    tr.appendChild(tdRate);

    // Placeholder for 24h change (API doesn't provide, so static or random demo)
    const tdChange = document.createElement('td');
    const change = (Math.random() * 2 - 1).toFixed(2);
    tdChange.textContent = `${change}%`;
    tdChange.className = change >= 0 ? 'change-positive' : 'change-negative';
    tr.appendChild(tdChange);

    ratesTableBody.appendChild(tr);
  });
}

// Update last updated text
function updateRatesLastUpdated(dateStr) {
  ratesLastUpdated.textContent = `Last updated: ${dateStr}`;
}

// Swap from and to currencies
swapBtn.addEventListener('click', () => {
  const fromVal = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = fromVal;
  updateConverter();
});

// Update converter on input/select change
amountInput.addEventListener('input', updateConverter);
fromCurrency.addEventListener('change', updateConverter);
toCurrency.addEventListener('change', updateConverter);

// Chart related functions
async function fetchHistoricalRates(days) {
  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);
    const startStr = startDate.toISOString().slice(0, 10);
    const endStr = endDate.toISOString().slice(0, 10);

    const currencies = Array.from(selectedCurrencies).join(',');
    const url = `https://api.exchangerate.host/timeseries?start_date=${startStr}&end_date=${endStr}&base=INR&symbols=${currencies}`;
    const res = await fetch(url);
    const data = await res.json();
    if (!data.rates) throw new Error('No data');

    return data.rates;
  } catch (e) {
    console.error('Error fetching historical rates', e);
    return null;
  }
}

function prepareChartData(rates) {
  const labels = Object.keys(rates).sort();
  const datasets = [];

  selectedCurrencies.forEach((currency) => {
    const dataPoints = labels.map(date => rates[date][currency]);
    const color = currencyColor(currency);
    datasets.push({
      label: currency,
      data: dataPoints,
      borderColor: color,
      backgroundColor: color + '80',
      fill: false,
      tension: 0.1,
    });
  });

  return { labels, datasets };
}

function currencyColor(currency) {
  const colors = {
    USD: '#3b82f6',
    EUR: '#10b981',
    GBP: '#8b5cf6',
    JPY: '#f59e0b',
  };
  return colors[currency] || '#6b7280';
}

async function updateChart() {
  const rates = await fetchHistoricalRates(selectedDays);
  if (!rates) return;

  const chartData = prepareChartData(rates);

  if (chart) {
    chart.data = chartData;
    chart.update();
  } else {
    chart = new Chart(ctx, {
      type: 'line',
      data: chartData,
      options: {
        responsive: true,
        interaction: {
          mode: 'nearest',
          intersect: false,
        },
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
          },
          tooltip: {
            enabled: true,
          },
        },
        scales: {
          y: {
            beginAtZero: false,
            title: {
              display: true,
              text: 'Value (per 1 INR)',
            },
          },
          x: {
            title: {
              display: true,
              text: 'Date',
            },
          },
        },
      },
    });
  }
}

// Handle timeframe buttons
timeframeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    timeframeButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedDays = parseInt(btn.dataset.days);
    updateChart();
  });
});

// Handle currency toggle buttons
currencyButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    btn.classList.toggle('active');
    const cur = btn.dataset.currency;
    if (selectedCurrencies.has(cur)) {
      selectedCurrencies.delete(cur);
    } else {
      selectedCurrencies.add(cur);
    }
    updateChart();
  });
});

// FAQ data and rendering
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

// Render FAQ
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

// Initialize page
function init() {
  currentYearEl.textContent = new Date().getFullYear();
  fetchRates();
  renderFaq();
  updateChart();
}

init();

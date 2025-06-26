const API_BASE_URL = 'https://v6.exchangerate-api.com/v6/f782350a3b382aa55ff058a3/latest/INR';

// DOM elements
const amountInput = document.getElementById('amount');
const fromCurrencyContainer = document.getElementById('from-currency-container');
const toCurrencyContainer = document.getElementById('to-currency-container');
const convertedAmountEl = document.getElementById('converted-amount');
const ratesContainer = document.getElementById('rates-container');
const faqList = document.getElementById('faqList');
const swapBtn = document.getElementById('swap-btn');

// Searchable dropdown inputs and dropdown containers
const fromCurrencyInput = document.getElementById('from-currency-input');
const toCurrencyInput = document.getElementById('to-currency-input');
const fromDropdown = document.getElementById('from-currency-dropdown');
const toDropdown = document.getElementById('to-currency-dropdown');

let rates = {};
let currencyNames = {
  AED: "UAE Dirham",
  AFN: "Afghan Afghani",
  ALL: "Albanian Lek",
  AMD: "Armenian Dram",
  ANG: "Netherlands Antillean Guilder",
  AOA: "Angolan Kwanza",
  ARS: "Argentine Peso",
  AUD: "Australian Dollar",
  AWG: "Aruban Florin",
  AZN: "Azerbaijani Manat",
  BAM: "Bosnia-Herzegovina Convertible Mark",
  BBD: "Barbadian Dollar",
  BDT: "Bangladeshi Taka",
  BGN: "Bulgarian Lev",
  BHD: "Bahraini Dinar",
  BIF: "Burundian Franc",
  BMD: "Bermudian Dollar",
  BND: "Brunei Dollar",
  BOB: "Bolivian Boliviano",
  BRL: "Brazilian Real",
  BSD: "Bahamian Dollar",
  BTC: "Bitcoin",
  BTN: "Bhutanese Ngultrum",
  BWP: "Botswanan Pula",
  BYN: "Belarusian Ruble",
  BZD: "Belize Dollar",
  CAD: "Canadian Dollar",
  CDF: "Congolese Franc",
  CHF: "Swiss Franc",
  CNY: "Chinese Yuan",
  CLP: "Chilean Peso",
  COP: "Colombian Peso",
  CRC: "Costa Rican Colón",
  CUC: "Cuban Convertible Peso",
  CUP: "Cuban Peso",
  CVE: "Cape Verdean Escudo",
  CZK: "Czech Republic Koruna",
  DJF: "Djiboutian Franc",
  DKK: "Danish Krone",
  DOP: "Dominican Peso",
  DZD: "Algerian Dinar",
  EGP: "Egyptian Pound",
  ERN: "Eritrean Nakfa",
  ETB: "Ethiopian Birr",
  EUR: "Euro",
  FJD: "Fijian Dollar",
  FKP: "Falkland Islands Pound",
  GBP: "British Pound Sterling",
  GEL: "Georgian Lari",
  GHS: "Ghanaian Cedi",
  GIP: "Gibraltar Pound",
  GMD: "Gambian Dalasi",
  GNF: "Guinean Franc",
  GTQ: "Guatemalan Quetzal",
  GYD: "Guyanaese Dollar",
  HKD: "Hong Kong Dollar",
  HNL: "Honduran Lempira",
  HRK: "Croatian Kuna",
  HTG: "Haitian Gourde",
  HUF: "Hungarian Forint",
  IDR: "Indonesian Rupiah",
  ILS: "Israeli New Sheqel",
  INR: "Indian Rupee",
  IQD: "Iraqi Dinar",
  IRR: "Iranian Rial",
  ISK: "Icelandic Króna",
  JMD: "Jamaican Dollar",
  JOD: "Jordanian Dinar",
  JPY: "Japanese Yen",
  KES: "Kenyan Shilling",
  KGS: "Kyrgystani Som",
  KHR: "Cambodian Riel",
  KMF: "Comorian Franc",
  KPW: "North Korean Won",
  KRW: "South Korean Won",
  KWD: "Kuwaiti Dinar",
  KYD: "Cayman Islands Dollar",
  KZT: "Kazakhstani Tenge",
  LAK: "Laotian Kip",
  LBP: "Lebanese Pound",
  LKR: "Sri Lankan Rupee",
  LRD: "Liberian Dollar",
  LSL: "Lesotho Loti",
  LYD: "Libyan Dinar",
  MAD: "Moroccan Dirham",
  MDL: "Moldovan Leu",
  MGA: "Malagasy Ariary",
  MKD: "Macedonian Denar",
  MMK: "Myanma Kyat",
  MNT: "Mongolian Tugrik",
  MOP: "Macanese Pataca",
  MRU: "Mauritanian Ouguiya",
  MUR: "Mauritian Rupee",
  MVR: "Maldivian Rufiyaa",
  MWK: "Malawian Kwacha",
  MXN: "Mexican Peso",
  MYR: "Malaysian Ringgit",
  MZN: "Mozambican Metical",
  NAD: "Namibian Dollar",
  NGN: "Nigerian Naira",
  NIO: "Nicaraguan Córdoba",
  NOK: "Norwegian Krone",
  NPR: "Nepalese Rupee",
  NZD: "New Zealand Dollar",
  OMR: "Omani Rial",
  PAB: "Panamanian Balboa",
  PEN: "Peruvian Nuevo Sol",
  PGK: "Papua New Guinean Kina",
  PHP: "Philippine Peso",
  PKR: "Pakistani Rupee",
  PLN: "Polish Zloty",
  PYG: "Paraguayan Guarani",
  QAR: "Qatari Rial",
  RON: "Romanian Leu",
  RSD: "Serbian Dinar",
  RUB: "Russian Ruble",
  RWF: "Rwandan Franc",
  SAR: "Saudi Riyal",
  SBD: "Solomon Islands Dollar",
  SCR: "Seychellois Rupee",
  SDG: "Sudanese Pound",
  SEK: "Swedish Krona",
  SGD: "Singapore Dollar",
  SHP: "Saint Helena Pound",
  SLL: "Sierra Leonean Leone",
  SOS: "Somali Shilling",
  SRD: "Surinamese Dollar",
  STN: "São Tomé and Príncipe Dobra",
  SYP: "Syrian Pound",
  SZL: "Swazi Lilangeni",
  THB: "Thai Baht",
  TJS: "Tajikistani Somoni",
  TMT: "Turkmenistani Manat",
  TND: "Tunisian Dinar",
  TRY: "Turkish Lira",
  TTD: "Trinidad and Tobago Dollar",
  TWD: "New Taiwan Dollar",
  TZS: "Tanzanian Shilling",
  UAH: "Ukrainian Hryvnia",
  UGX: "Ugandan Shilling",
  USD: "United States Dollar",
  UYU: "Uruguayan Peso",
  UZS: "Uzbekistani Som",
  VES: "Venezuelan Bolívar",
  VND: "Vietnamese Dong",
  VUV: "Vanuatu Vatu",
  WST: "Samoan Tala",
  XAF: "Central African CFA Franc",
  XCD: "East Caribbean Dollar",
  XOF: "West African CFA franc",
  XPF: "CFP Franc",
  YER: "Yemeni Rial",
  ZAR: "South African Rand",
  ZMW: "Zambian Kwacha",
  ZWL: "Zimbabwean Dollar"
};

// Currency code to flag (add your desired mappings)
const currencyToCountryCode = {
  USD: 'us',
  EUR: '',
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
  THB: 'th',
  CNY: 'cn',
  JPY: 'jp'
};

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

// Build searchable dropdown items
function createDropdownItems(dropdown, onSelect) {
  dropdown.innerHTML = '';
  const fragment = document.createDocumentFragment();

  const sortedCurrencies = Object.keys(currencyNames).sort();

  sortedCurrencies.forEach(code => {
    const name = currencyNames[code];
    const item = document.createElement('div');
    item.classList.add('dropdown-item');
    item.dataset.code = code;
    item.tabIndex = 0; // Make keyboard focusable
    item.textContent = `${code} - ${name}`;
    item.addEventListener('click', () => {
      onSelect(code);
      closeAllDropdowns();
    });
    // Support keyboard selection on dropdown items
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
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

// Set input value and update conversion when selection changes
function setFromCurrency(code) {
  fromCurrencyInput.value = code;
  updateConvertedAmount();
}
function setToCurrency(code) {
  toCurrencyInput.value = code;
  updateConvertedAmount();
}

// Filter dropdown items based on search text
function filterDropdown(dropdown, query) {
  const items = dropdown.querySelectorAll('.dropdown-item');
  const q = query.trim().toLowerCase();
  items.forEach(item => {
    const text = item.textContent.toLowerCase();
    item.style.display = text.includes(q) ? '' : 'none';
  });
}

// Close dropdowns on outside click
function closeAllDropdowns() {
  fromDropdown.classList.remove('open');
  toDropdown.classList.remove('open');
}

// Toggle dropdown visibility
function toggleDropdown(dropdown) {
  const isOpen = dropdown.classList.contains('open');
  closeAllDropdowns();
  if (!isOpen) dropdown.classList.add('open');
}

// Initialize dropdown events
function setupDropdown(container, input, dropdown, setFunc) {
  // Open dropdown on input click or focus
  input.addEventListener('focus', () => toggleDropdown(dropdown));
  input.addEventListener('click', () => toggleDropdown(dropdown));

  // Filter items as user types
  input.addEventListener('input', () => {
    filterDropdown(dropdown, input.value);
    if (!dropdown.classList.contains('open')) dropdown.classList.add('open');
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!container.contains(e.target)) {
      dropdown.classList.remove('open');
    }
  });

  // Keyboard navigation in input
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const visibleItems = Array.from(dropdown.querySelectorAll('.dropdown-item')).filter(i => i.style.display !== 'none');
      if (visibleItems.length) visibleItems[0].focus();
    }
  });

  // Keyboard navigation in dropdown
  dropdown.addEventListener('keydown', (e) => {
    const visibleItems = Array.from(dropdown.querySelectorAll('.dropdown-item')).filter(i => i.style.display !== 'none');
    let idx = visibleItems.indexOf(document.activeElement);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      idx = (idx + 1) % visibleItems.length;
      visibleItems[idx].focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      idx = (idx - 1 + visibleItems.length) % visibleItems.length;
      visibleItems[idx].focus();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (document.activeElement.classList.contains('dropdown-item')) {
        const code = document.activeElement.dataset.code;
        setFunc(code);
        closeAllDropdowns();
        input.focus();
      }
    } else if (e.key === 'Escape') {
      closeAllDropdowns();
      input.focus();
    }
  });
}

// Populate the dropdowns with currency items and set default values
function populateCurrencyDropdowns() {
  createDropdownItems(fromDropdown, setFromCurrency);
  createDropdownItems(toDropdown, setToCurrency);

  setFromCurrency('INR');
  setToCurrency('USD');
}

// Update conversion display
function updateConvertedAmount() {
  const amount = parseFloat(amountInput.value);
  const fromCur = fromCurrencyInput.value.trim().toUpperCase();
  const toCur = toCurrencyInput.value.trim().toUpperCase();

  if (isNaN(amount) || amount <= 0) {
    convertedAmountEl.textContent = '-';
    return;
  }
  if (!rates[fromCur] || !rates[toCur]) {
    convertedAmountEl.textContent = '-';
    return;
  }

  const converted = amount * (rates[toCur] / rates[fromCur]);
  const formatted = converted.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  convertedAmountEl.textContent = `${formatted} ${toCur}`;
}

// Display rate cards, excluding CNY and JPY
function displayLiveRates() {
  ratesContainer.innerHTML = '';

  const popularCurrencies = [
    'USD', 'EUR', 'GBP', 'AUD', 'CAD', 'CHF', 'INR',
    'SAR', 'QAR', 'BHD', 'OMR', 'KWD', 'THB'
  ]; // CNY and JPY excluded

  popularCurrencies.forEach(cur => {
    if (!rates[cur]) return;

    const card = document.createElement('div');
    card.className = 'rate-card';

    // Flag icon or fallback text
    const flagCode = currencyToCountryCode[cur];
    const flagDiv = document.createElement('div');
    if (flagCode) {
      flagDiv.className = `fi fi-${flagCode}`;
    } else {
      flagDiv.textContent = cur;
      flagDiv.style.fontWeight = '700';
      flagDiv.style.fontSize = '20px';
    }
    card.appendChild(flagDiv);

    const codeDiv = document.createElement('div');
    codeDiv.className = 'currency-code';
    codeDiv.textContent = cur;
    card.appendChild(codeDiv);

    const nameDiv = document.createElement('div');
    nameDiv.className = 'currency-name';
    nameDiv.textContent = currencyNames[cur] || 'Unknown Currency';
    card.appendChild(nameDiv);

    const rateDiv = document.createElement('div');
    rateDiv.className = 'currency-rate';
    rateDiv.textContent = `1 INR = ${rates[cur].toFixed(4)}`;
    card.appendChild(rateDiv);

    // Click card to auto-select in dropdown
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      setFromCurrency('INR');
      setToCurrency(cur);
      updateConvertedAmount();
    });

    ratesContainer.appendChild(card);
  });
}

// Swap button functionality
swapBtn.addEventListener('click', () => {
  const fromVal = fromCurrencyInput.value;
  const toVal = toCurrencyInput.value;
  setFromCurrency(toVal);
  setToCurrency(fromVal);
  updateConvertedAmount();
});

// Event listeners for amount input and dropdown filtering
amountInput.addEventListener('input', updateConvertedAmount);
fromCurrencyInput.addEventListener('input', () => {
  filterDropdown(fromDropdown, fromCurrencyInput.value);
});
toCurrencyInput.addEventListener('input', () => {
  filterDropdown(toDropdown, toCurrencyInput.value);
});

// FAQ Data and render function
const faqData = [
  {
    question: "How do I exchange currency with Apna Tours & Travels?",
    answer: "You can use our currency converter to check rates and then visit our office."
  },
  {
    question: "What currencies do you support?",
    answer: "We support all major global currencies including USD, EUR, GBP, JPY, and many more."
  },
  {
    question: "How often are the exchange rates updated?",
    answer: "Rates are updated hourly based on global market data. Actual exchange rates at our office may differ."
  },
  {
    question: "Are there any additional fees or commissions?",
    answer: "We offer competitive rates with transparent pricing. No hidden fees."
  },
  {
    question: "How can I contact customer support?",
    answer: "You can reach us at smabidayub@gmail.com or call +91 94314 92354 during business hours."
  },
  {
    question: "Do you offer delivery services?",
    answer: "Yes, we provide both delivery within Patna and in-person services for your convenience."
  },
  {
    question: "What documents are required to exchange currency?",
    answer: "To comply with Indian regulations, please carry a valid government-issued photo ID (such as Aadhaar card, PAN card, or Passport) along with your PAN card details for transactions above specified limits. Proof of address may also be required."
  }
];

function renderFAQ() {
  faqList.innerHTML = '';
  faqData.forEach((item) => {
    const faqItem = document.createElement('div');
    faqItem.className = 'faq-item';

    const question = document.createElement('div');
    question.className = 'faq-question';
    question.tabIndex = 0;
    question.textContent = item.question;
    faqItem.appendChild(question);

    const answer = document.createElement('div');
    answer.className = 'faq-answer';
    answer.textContent = item.answer;
    faqItem.appendChild(answer);

    question.addEventListener('click', () => {
      faqItem.classList.toggle('open');
    });

    question.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        faqItem.classList.toggle('open');
      }
    });

    faqList.appendChild(faqItem);
  });
}

// Setup dropdown behavior
setupDropdown(fromCurrencyContainer, fromCurrencyInput, fromDropdown, setFromCurrency);
setupDropdown(toCurrencyContainer, toCurrencyInput, toDropdown, setToCurrency);

// Initialize everything
fetchRates();
renderFAQ();
updateConvertedAmount();

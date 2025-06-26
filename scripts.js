const API_BASE_URL = 'https://v6.exchangerate-api.com/v6/f782350a3b382aa55ff058a3/latest/INR';

// DOM elements
const amountInput = document.getElementById('amount');
const fromCurrency = document.getElementById('from-currency');
const toCurrency = document.getElementById('to-currency');
const convertedAmountEl = document.getElementById('converted-amount');
const ratesContainer = document.getElementById('rates-container');
const faqList = document.getElementById('faqList');
const swapBtn = document.getElementById('swap-btn');
const currentYearEl = document.getElementById('currentYear');

// Currency names for display (full list including requested currencies)
const currencyNames = {
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
  // Removed CNY (Chinese Yuan)
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
  // Removed JPY (Japanese Yen)
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

// Currency code to flag (added new countries)
const currencyToCountryCode = {
  USD: 'us',
  EUR: '',
  GBP: 'gb',
  // Removed JPY and CNY flags since removed
  AUD: 'au',
  CAD: 'ca',
  CHF: 'ch',
  INR: 'in',
  SAR: 'sa',   // Saudi Arabia
  QAR: 'qa',   // Qatar
  BHD: 'bh',   // Bahrain
  OMR: 'om',   // Oman
  KWD: 'kw',   // Kuwait
  THB: 'th'    // Thailand
};

let ratesData = {};

async function fetchRates() {
  try {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) throw new Error(HTTP error! Status: ${response.status});
    const data = await response.json();
    if (!data.conversion_rates) throw new Error('Invalid rates data');

    ratesData = data.conversion_rates;

    populateCurrencySelectors(ratesData);
    displayLiveRates(ratesData);
    updateConvertedAmount();
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    ratesContainer.textContent = 'Failed to load exchange rates. Please try again later.';
  }
}

function populateCurrencySelectors(rates) {
  fromCurrency.innerHTML = '';
  toCurrency.innerHTML = '';

  // Remove CNY and JPY
  const currencies = Object.keys(rates)
    .filter(cur => cur !== 'CNY' && cur !== 'JPY') 
    .sort();

  currencies.forEach(cur => {
    const name = currencyNames[cur] || 'Unknown Currency';

    const optionFrom = document.createElement('option');
    optionFrom.value = cur;
    optionFrom.textContent = ${cur} - ${name};
    fromCurrency.appendChild(optionFrom);

    const optionTo = document.createElement('option');
    optionTo.value = cur;
    optionTo.textContent = ${cur} - ${name};
    toCurrency.appendChild(optionTo);
  });

  fromCurrency.value = 'INR';
  toCurrency.value = 'USD';
}

function updateConvertedAmount() {
  const amount = parseFloat(amountInput.value);
  if (isNaN(amount) || amount < 0) {
    convertedAmountEl.textContent = '-';
    return;
  }

  const fromCur = fromCurrency.value;
  const toCur = toCurrency.value;

  if (!ratesData[fromCur] || !ratesData[toCur]) {
    convertedAmountEl.textContent = '-';
    return;
  }

  const converted = amount * (ratesData[toCur] / ratesData[fromCur]);
  // Show converted amount with currency code e.g., "7 USD"
const formatted = converted.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
convertedAmountEl.textContent = ${formatted} ${toCur};
}

function displayLiveRates(rates) {
  ratesContainer.innerHTML = '';

  // Popular currencies list — removing CNY and JPY, adding your requested countries
  const popularCurrencies = [
    'USD', 'EUR', 'GBP', /* 'JPY', */ 'AUD', 'CAD', 'CHF', /* 'CNY', */ 'INR',
    'SAR', 'QAR', 'BHD', 'OMR', 'KWD', 'THB'
  ];

  popularCurrencies.forEach(cur => {
    if (!rates[cur]) return;

    const card = document.createElement('div');
    card.className = 'rate-card';

    const flagCode = currencyToCountryCode[cur];
    const flagDiv = document.createElement('div');

    if (flagCode) {
      flagDiv.className = fi fi-${flagCode};
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
    // Show rate as "1 INR = [rate]"
    rateDiv.textContent = 1 INR = ${rates[cur].toFixed(4)};
    card.appendChild(rateDiv);

    ratesContainer.appendChild(card);

    // Make rate card clickable to auto-fill dropdowns
card.style.cursor = 'pointer';
card.addEventListener('click', () => {
  fromCurrency.value = 'INR';
  toCurrency.value = cur;
  updateConvertedAmount();
});

  });
}

swapBtn.addEventListener('click', () => {
  const temp = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = temp;

  updateConvertedAmount();
});

amountInput.addEventListener('input', updateConvertedAmount);
fromCurrency.addEventListener('change', updateConvertedAmount);
toCurrency.addEventListener('change', updateConvertedAmount);

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
    answer: " Rates are updated hourly based on global market data. Actual exchange rates at our office may differ."
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

  faqData.forEach((item, index) => {
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

function updateCurrentYear() {
  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }
}

// Initialization
fetchRates();
renderFAQ();
updateCurrentYear();

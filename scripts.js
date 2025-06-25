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

// Currency names for display
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
  CLP: "Chilean Peso",
  CNY: "Chinese Yuan",
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

// Currency code to flag
const currencyToCountryCode = {
  USD: 'us',
  EUR: '',
  GBP: 'gb',
  JPY: 'jp',
  AUD: 'au',
  CAD: 'ca',
  CHF: 'ch',
  CNY: 'cn',
  INR: 'in'
};

let ratesData = {};

async function fetchRates() {
  try {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
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

  const currencies = Object.keys(rates).sort();

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

  fromCurrency.value = 'USD';
  toCurrency.value = 'INR';
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
  convertedAmountEl.textContent = converted.toFixed(4);
}

function displayLiveRates(rates) {
  ratesContainer.innerHTML = '';

  const popularCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'INR'];

  popularCurrencies.forEach(cur => {
    if (!rates[cur]) return;

    const card = document.createElement('div');
    card.className = 'rate-card';

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
    rateDiv.textContent = rates[cur].toFixed(4);
    card.appendChild(rateDiv);

    ratesContainer.appendChild(card);
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

function init() {
  currentYearEl.textContent = new Date().getFullYear();
  fetchRates();
  renderFaq();
  updateConvertedAmount();
}

init();

const pricing = {
  "coffee-cups": {
    label: "Custom Coffee Cups",
    baseUnitPrice: 2.4,
    setupFee: 450,
    sizes: ["Small - 240 ml", "Medium - 350 ml", "Large - 470 ml", "Extra large - 590 ml"]
  },
  "burger-boxes": {
    label: "Burger Boxes",
    baseUnitPrice: 3.1,
    setupFee: 500,
    sizes: ["0.8 L - 11 x 11 x 7 cm", "1.3 L - 13 x 13 x 8 cm", "2 L - 15 x 15 x 9 cm"]
  },
  "paper-bags": {
    label: "Paper Bags",
    baseUnitPrice: 2.8,
    setupFee: 400,
    sizes: ["4 L - 18 x 8 x 22 cm", "7 L - 22 x 10 x 28 cm", "12 L - 26 x 12 x 35 cm"]
  },
  "salad-bowls": {
    label: "Salad Bowls",
    baseUnitPrice: 3.6,
    setupFee: 550,
    sizes: ["500 ml", "750 ml", "1 L"]
  }
};

const printColorFees = {
  "1": 0,
  "2": 250,
  full: 500
};

const quantityDiscounts = {
  250: 0,
  500: 0.05,
  1000: 0.1,
  2500: 0.15,
  5000: 0.2
};

const countryCurrencies = {
  Denmark: "DKK",
  Sweden: "SEK",
  Germany: "EUR",
  Netherlands: "EUR",
  "Other EU country": "EUR"
};

const currencySettings = {
  DKK: {
    locale: "da-DK",
    rateFromDkk: 1
  },
  SEK: {
    locale: "sv-SE",
    rateFromDkk: 1.55
  },
  EUR: {
    locale: "de-DE",
    rateFromDkk: 0.134
  }
};

const state = {
  product: "coffee-cups",
  size: "",
  quantity: 500,
  printColors: "",
  designHelp: false,
  deliveryCountry: "",
  currency: "DKK",
  email: "",
  notes: ""
};

let hasAttemptedSubmit = false;
const elements = {};

function init() {
  cacheElements();
  updateSizeOptions(state.product);
  bindEvents();
  syncStateFromForm();
  updateSelectedProductCards();
  updateSummary();
  validateForm();
}

function cacheElements() {
  elements.form = document.querySelector("#quoteForm");
  elements.product = document.querySelector("#product");
  elements.size = document.querySelector("#size");
  elements.quantity = document.querySelector("#quantity");
  elements.printColors = document.querySelectorAll("input[name='printColors']");
  elements.designHelp = document.querySelector("#designHelp");
  elements.deliveryCountry = document.querySelector("#deliveryCountry");
  elements.currency = document.querySelector("#currency");
  elements.email = document.querySelector("#email");
  elements.notes = document.querySelector("#notes");
  elements.submitQuote = document.querySelector("#submitQuote");
  elements.formStatus = document.querySelector("#formStatus");
  elements.successAlert = document.querySelector("#successAlert");
  elements.productCards = document.querySelectorAll("[data-product-card]");
  elements.printColorGroup = document.querySelector("#printColorGroup");
  elements.printColorsError = document.querySelector("#printColorsError");
  elements.summaryProduct = document.querySelector("#summaryProduct");
  elements.summarySize = document.querySelector("#summarySize");
  elements.summaryQuantity = document.querySelector("#summaryQuantity");
  elements.summaryPrintColors = document.querySelector("#summaryPrintColors");
  elements.summarySetupFee = document.querySelector("#summarySetupFee");
  elements.summaryDesignHelp = document.querySelector("#summaryDesignHelp");
  elements.summaryTotal = document.querySelector("#summaryTotal");
  elements.summaryUnitPrice = document.querySelector("#summaryUnitPrice");
}

function bindEvents() {
  elements.productCards.forEach((card) => {
    card.addEventListener("click", () => handleProductSelect(card.dataset.productCard));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleProductSelect(card.dataset.productCard);
      }
    });
  });

  elements.product.addEventListener("change", (event) => handleProductSelect(event.target.value));

  [elements.size, elements.quantity, elements.designHelp, elements.deliveryCountry, elements.email, elements.notes].forEach((field) => {
    field.addEventListener("input", handleFormChange);
    field.addEventListener("change", handleFormChange);
    field.addEventListener("blur", () => handleFieldBlur(field));
  });

  elements.deliveryCountry.addEventListener("change", handleDeliveryCountryChange);
  elements.currency.addEventListener("change", handleCurrencyChange);

  elements.printColors.forEach((radio) => {
    radio.addEventListener("change", () => {
      elements.printColorGroup.dataset.touched = "true";
      handleFormChange();
    });
  });

  elements.form.addEventListener("submit", handleSubmit);
}

function handleProductSelect(productId) {
  if (!pricing[productId]) return;

  state.product = productId;
  elements.product.value = productId;
  updateSizeOptions(productId);
  syncStateFromForm();
  updateSelectedProductCards();
  updateSummary();
  validateForm();
}

function updateSizeOptions(productId) {
  const currentSize = state.size;
  const sizes = pricing[productId].sizes;
  elements.size.innerHTML = "";

  sizes.forEach((size) => {
    const option = document.createElement("option");
    option.value = size;
    option.textContent = size;
    elements.size.append(option);
  });

  elements.size.value = sizes.includes(currentSize) ? currentSize : sizes[0];
  state.size = elements.size.value;
}

function handleFormChange() {
  syncStateFromForm();
  updateSummary();
  validateForm();
}

function handleFieldBlur(field) {
  field.dataset.touched = "true";
  validateForm();
}

function handleDeliveryCountryChange() {
  const defaultCurrency = countryCurrencies[elements.deliveryCountry.value] || "DKK";
  elements.currency.value = defaultCurrency;
  state.currency = defaultCurrency;
  syncStateFromForm();
  updateSummary();
}

function handleCurrencyChange() {
  state.currency = elements.currency.value;
  updateSummary();
}

function syncStateFromForm() {
  state.product = elements.product.value;
  state.size = elements.size.value;
  state.quantity = Number(elements.quantity.value);
  state.printColors = document.querySelector("input[name='printColors']:checked")?.value || "";
  state.designHelp = elements.designHelp.checked;
  state.deliveryCountry = elements.deliveryCountry.value;
  state.currency = elements.currency.value;
  state.email = elements.email.value.trim();
  state.notes = elements.notes.value.trim();
}

function calculatePrice() {
  const product = pricing[state.product];
  const discount = quantityDiscounts[state.quantity] || 0;
  const discountedUnitPrice = product.baseUnitPrice * (1 - discount);
  const productionTotal = discountedUnitPrice * state.quantity;
  const setupFee = product.setupFee + (printColorFees[state.printColors] || 0);
  const designHelpFee = state.designHelp ? 350 : 0;
  const total = productionTotal + setupFee + designHelpFee;

  return {
    setupFee,
    designHelpFee,
    total,
    unitPrice: total / state.quantity
  };
}

function updateSummary() {
  const price = calculatePrice();

  elements.summaryProduct.textContent = pricing[state.product].label;
  elements.summarySize.textContent = state.size || "Select size";
  elements.summaryQuantity.textContent = state.quantity.toLocaleString("en-DK");
  elements.summaryPrintColors.textContent = getPrintColorLabel(state.printColors);
  elements.summarySetupFee.textContent = formatCurrency(price.setupFee);
  elements.summaryDesignHelp.textContent = formatCurrency(price.designHelpFee);
  elements.summaryTotal.textContent = formatCurrency(price.total);
  elements.summaryUnitPrice.textContent = formatCurrency(price.unitPrice);
}

function updateSelectedProductCards() {
  elements.productCards.forEach((card) => {
    const isActive = card.dataset.productCard === state.product;
    card.classList.toggle("is-active", isActive);
    card.setAttribute("aria-current", isActive ? "true" : "false");
    card.setAttribute("aria-pressed", String(isActive));
  });
}

function validateForm(showErrors = false) {
  const validations = [
    validateRequired(elements.product, showErrors),
    validateRequired(elements.size, showErrors),
    validateRequired(elements.quantity, showErrors),
    validatePrintColors(showErrors),
    validateRequired(elements.deliveryCountry, showErrors),
    validateEmail(elements.email, showErrors)
  ];

  const isValid = validations.every(Boolean);
  elements.formStatus.textContent = isValid
    ? "Ready to continue to checkout."
    : "Fields marked with * are required.";

  if (showErrors) {
    [elements.product, elements.size, elements.quantity, elements.deliveryCountry, elements.email].forEach((field) => {
      field.classList.toggle("is-invalid", !field.checkValidity() || (field === elements.email && !isValidEmail(field.value)));
    });
  }

  return isValid;
}

function validateRequired(field, showErrors = false) {
  const isValid = Boolean(field.value);
  const shouldShowError = showErrors || hasAttemptedSubmit || field.dataset.touched === "true";
  field.classList.toggle("is-invalid", shouldShowError && !isValid);
  field.setAttribute("aria-invalid", String(shouldShowError && !isValid));
  return isValid;
}

function validateEmail(field, showErrors = false) {
  const isValid = isValidEmail(field.value);
  const shouldShowError = showErrors || hasAttemptedSubmit || field.dataset.touched === "true";
  field.classList.toggle("is-invalid", shouldShowError && !isValid);
  field.setAttribute("aria-invalid", String(shouldShowError && !isValid));
  return isValid;
}

function validatePrintColors(showErrors = false) {
  const isValid = Boolean(state.printColors);
  const shouldShowError = showErrors || hasAttemptedSubmit || elements.printColorGroup.dataset.touched === "true";
  elements.printColorsError.hidden = isValid || !shouldShowError;
  elements.printColorGroup.classList.toggle("is-invalid", shouldShowError && !isValid);
  elements.printColorGroup.setAttribute("aria-invalid", String(shouldShowError && !isValid));
  return isValid;
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function handleSubmit(event) {
  event.preventDefault();
  hasAttemptedSubmit = true;
  syncStateFromForm();

  if (!validateForm(true)) {
    elements.successAlert.hidden = true;
    return;
  }

  elements.successAlert.hidden = false;
  elements.formStatus.textContent = "Configuration ready for checkout.";
  elements.successAlert.scrollIntoView({ behavior: "smooth", block: "center" });
}

function getPrintColorLabel(value) {
  const labels = {
    "1": "1 color",
    "2": "2 colors",
    full: "Full color"
  };

  return labels[value] || "Select print colors";
}

function formatCurrency(value) {
  const currency = currencySettings[state.currency] ? state.currency : "DKK";
  const settings = currencySettings[currency];
  const convertedValue = value * settings.rateFromDkk;

  return new Intl.NumberFormat(settings.locale, {
    style: "currency",
    currency,
    currencyDisplay: "code",
    maximumFractionDigits: convertedValue % 1 === 0 ? 0 : 2
  }).format(convertedValue);
}

document.addEventListener("DOMContentLoaded", init);

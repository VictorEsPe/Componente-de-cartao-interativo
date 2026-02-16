const cardNumber = document.querySelector(".card-number");
const cardHolderName = document.querySelector(".card-name");
const cardExpDate = document.querySelector(".card-expiry");
const cardCvc = document.querySelector(".card-cvc");

const inputCardHolderName = document.querySelector("#cardholder-name");
const inputCardNumber = document.querySelector("#card-number");
const inputCardExpiryMonth = document.querySelector("#expiry-month");
const inputCardExpiryYear = document.querySelector("#expiry-year");
const inputCardCvc = document.querySelector("#cvc");

const form = document.querySelector("#form");

const cardExpDateInputs = [inputCardExpiryMonth, inputCardExpiryYear];

// Expressão regular para verificar se há caracteres inválidos (qualquer coisa que não seja um número)
const isThereInvalidCaracters = /[^0-9 ]/;
const isThereInvalidCaractersAndSpaces = /[^0-9]/;
const isValidName = /^\p{L}[\p{L} '-]*$/u;

inputCardHolderName.addEventListener("input", () => {
  const cardNameValue = inputCardHolderName.value;

  if (isValidName.test(cardNameValue)) {
    cardHolderName.textContent = cardNameValue || "JANE APPLESEED";
    clearErrorState(inputCardHolderName, "name-error");
  } else {
    cardHolderName.textContent = "JANE APPLESEED";

    triggerErrorSate(
      inputCardHolderName,
      "name-error",
      "Only letters are allowed.",
    );
  }
});

inputCardNumber.addEventListener("input", () => {
  const inputNumberValue = inputCardNumber.value;

  if (isThereInvalidCaractersAndSpaces.test(inputNumberValue)) {
    triggerErrorSate(
      inputCardNumber,
      "number-error",
      "Only numbers and no spaces are allowed.",
    );
  } else {
    clearErrorState(inputCardNumber, "number-error");
    // Remove espaços em branco
    const removeSpaces = /\s/g;
    // Agrupa dígitos em blocos de 4
    const groupFourDigits = /(\d{4})/g;

    let formattedNumber = inputNumberValue
      .replace(removeSpaces, "")
      .replace(groupFourDigits, "$1 ") // captura esses 4 dígitos (é como salvar em uma variável temporária chamada $1)
      .trim();
    cardNumber.textContent = formattedNumber || "0000 0000 0000 0000";
  }
});

inputCardNumber.addEventListener("blur", () => {
  if (inputCardNumber.value.length < 16) {
    triggerErrorSate(inputCardNumber, "number-error", "Must be 16 digits.");
  }
});

cardExpDateInputs.forEach((input) => {
  input.addEventListener("input", () => {
    if (isThereInvalidCaractersAndSpaces.test(input.value)) {
      triggerErrorSate(
        input,
        "expiry-error",
        "Only numbers and no spaces are allowed.",
      );
    } else {
      clearErrorState(input, "expiry-error");

      const month = inputCardExpiryMonth.value;
      const year = inputCardExpiryYear.value;

      cardExpDate.textContent = `${month || "00"}/${year || "00"}`;
    }
  });

  input.addEventListener("blur", () => {
    if (input.value.length < 2) {
      triggerErrorSate(input, "expiry-error", "Must be 2 digits.");
    }
  });
});

inputCardCvc.addEventListener("input", () => {
  const inputCvcValue = inputCardCvc.value;

  if (isThereInvalidCaractersAndSpaces.test(inputCvcValue)) {
    triggerErrorSate(
      inputCardCvc,
      "cvc-error",
      "Only numbers and no spaces are allowed.",
    );
  } else {
    clearErrorState(inputCardCvc, "cvc-error");
    cardCvc.textContent = inputCvcValue || "000";
  }
});

inputCardCvc.addEventListener("blur", () => {
  if (inputCardCvc.value.length < 3) {
    triggerErrorSate(inputCardCvc, "cvc-error", "Must be 3 digits.");
  }
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const isNameValid = validateName();
  const isCardNumberValid = validateCardNumber();
  const isCvcValid = validateCvc();
  const isExpDateValid = validateExpDate();

  console.log(isExpDateValid);
});

function triggerErrorSate(inputElement, errorSpan, message) {
  const errorElement = document.querySelector(`#${errorSpan}`);

  errorElement.textContent = message;

  if (!inputElement.classList.contains("error")) {
    inputElement.classList.add("error");
  }
}

function clearErrorState(inputElement, errorSpan) {
  const errorElement = document.querySelector(`#${errorSpan}`);
  if (errorElement.textContent && inputElement.classList.contains("error")) {
    errorElement.textContent = "";
    inputElement.classList.remove("error");
  }
}

function validateName() {
  const cardNameValue = inputCardHolderName.value.trim();
  if (!isValidName.test(cardNameValue) && cardNameValue !== "") {
    triggerErrorSate(
      inputCardHolderName,
      "name-error",
      "Can't submit invalid name.",
    );
    return false;
  }
  if (cardNameValue === "") {
    triggerErrorSate(inputCardHolderName, "name-error", "Can't be blank.");
    return false;
  }
  if (cardNameValue.length < 2) {
    triggerErrorSate(
      inputCardHolderName,
      "name-error",
      "Name must be at least 2 characters long.",
    );
    return false;
  }
  clearErrorState(inputCardHolderName, "name-error");
  return true;
}

function validateCardNumber() {
  const inputNumberValue = inputCardNumber.value.replace(/\s/g, ""); // Remove espaços para validação
  if (isThereInvalidCaracters.test(inputNumberValue)) {
    triggerErrorSate(
      inputCardNumber,
      "number-error",
      "Can't submit invalid card number.",
    );
    return false;
  }
  if (inputNumberValue === "") {
    triggerErrorSate(inputCardNumber, "number-error", "Can't be blank.");
    return false;
  }
  if (inputNumberValue.length < 16) {
    triggerErrorSate(
      inputCardNumber,
      "number-error",
      "Card number must be 16 digits long.",
    );
    return false;
  }
  clearErrorState(inputCardNumber, "number-error");
  return true;
}

function validateCvc() {
  const inputCvcValue = inputCardCvc.value.trim();

  if (isThereInvalidCaractersAndSpaces.test(inputCvcValue)) {
    triggerErrorSate(inputCardCvc, "cvc-error", "Can't submit invalid CVC.");
    return false;
  }
  if (inputCvcValue === "") {
    triggerErrorSate(inputCardCvc, "cvc-error", "Can't be blank.");
    return false;
  }
  if (inputCvcValue.length < 3) {
    triggerErrorSate(inputCardCvc, "cvc-error", "CVC must be 3 digits long.");
    return false;
  }
  clearErrorState(inputCardCvc, "cvc-error");
  return true;
}

function validateExpDate() {
  const areValidDateCharacters = validateDateCharacters();

  if (!areValidDateCharacters) return false;

  const date = new Date();
  const currentMonth = date.getMonth() + 1;
  const currentYear = date.getFullYear() % 100;

  const month = validateExpMonth();
  const year = validateExpYear(currentYear);

  if (month === undefined || year === undefined) {
    return false;
  }


  if (year === currentYear && month === currentMonth) {
    triggerErrorSate(inputCardExpiryYear, "expiry-error", "Your card is expired.");
    return false;
  }
  if (year === currentYear && month < currentMonth) {
    triggerErrorSate(inputCardExpiryYear, "expiry-error", "Your card is expired.");
    return false;
  }

  return true;
  
}

function validateDateCharacters() {
  for (const input of cardExpDateInputs) {
    const inputValue = input.value.trim();

    if (isThereInvalidCaractersAndSpaces.test(inputValue)) {
      triggerErrorSate(
        input,
        "expiry-error",
        "Can't submit invalid characters.",
      );
      return false;
    }
    if (inputValue === "") {
      triggerErrorSate(input, "expiry-error", "Can't be blank.");
      return false;
    }
    if (inputValue.length < 2) {
      triggerErrorSate(input, "expiry-error", "Must be 2 digits.");
      return false;
    }
  }
  return true;
}

function validateExpMonth() {
  const monthInt = parseInt(inputCardExpiryMonth.value);
  if (monthInt < 1 || monthInt > 12) {
    triggerErrorSate(
      inputCardExpiryMonth,
      "expiry-error",
      "Month must be between 1 and 12.",
    );
    return undefined;
  } else {
    clearErrorState(inputCardExpiryMonth, "expiry-error");
    return monthInt;
  }
}

function validateExpYear(currentYear) {
  const yearInt = parseInt(inputCardExpiryYear.value);

  if (yearInt < currentYear) {
    triggerErrorSate(
      inputCardExpiryYear,
      "expiry-error",
      "Your card is expired.",
    );
    return undefined;
  } else {
    clearErrorState(inputCardExpiryYear, "expiry-error");
    return yearInt;
  }
}

function showCompletionMessage() {
  const formContainer = document.querySelector(".card-form");
  const completionMessage = document.querySelector(".confirmation-section");
  formContainer.classList.add("hidden");
  completionMessage.classList.remove("hidden");
}

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

// Expressão regular para verificar se há caracteres inválidos (qualquer coisa que não seja um número)
const isThereInvalidCaracters = /[^0-9 ]/;
const isThereInvalidCaractersAndSpaces = /[^0-9]/;

inputCardHolderName.addEventListener("input", () => {
  const isValidName = /^[\p{L} ]*$/u;

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

const cardExpDateInputs = [inputCardExpiryMonth, inputCardExpiryYear];

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
  alert("Form submitted!");
});

function triggerErrorSate(inputElement, errorSpan, message) {
  const errorElement = document.querySelector(`#${errorSpan}`);

  if (!errorElement.textContent && !inputElement.classList.contains("error")) {
    errorElement.textContent = message;
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

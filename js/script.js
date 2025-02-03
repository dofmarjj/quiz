let currentScreenIndex = 0;
const screens = document.querySelectorAll(".container");

let userAnswers = {};

function nextScreen() {
  const currentScreen = screens[currentScreenIndex];
  const nextScreen = screens[currentScreenIndex + 1];

  if (nextScreen) {
    currentScreen.classList.add("exiting");
    currentScreen.classList.remove("active");

    nextScreen.classList.add("entering");

    setTimeout(() => {
      currentScreen.classList.remove("exiting");
      nextScreen.classList.remove("entering");
      nextScreen.classList.add("active");
    }, 500);

    currentScreenIndex++;
  }
}

function resetToFirstScreen() {
  screens[currentScreenIndex].classList.remove("active");
  currentScreenIndex = 0;
  screens[currentScreenIndex].classList.add("active");
  userAnswers = {};
  clearAllInputs();
}

function clearAllInputs() {
  document
    .querySelectorAll('input[type="radio"]')
    .forEach((input) => (input.checked = false));
  document.querySelectorAll("textarea").forEach((input) => (input.value = ""));
}

document.addEventListener("input", (event) => {
  const target = event.target;

  if (target.tagName.toLowerCase() === "textarea") {
    const buttonId = target.dataset.button;
    const nextButton = document.getElementById(buttonId);

    if (nextButton) {
      if (target.value.trim()) {
        nextButton.classList.remove("hidden");
      } else {
        nextButton.classList.add("hidden");
      }
    }
  }
});

function delayedNextScreen(question, answer) {
  userAnswers[question] = answer;
  setTimeout(nextScreen, 250);
}

function saveAndNext(questionId) {
  const inputField = document.getElementById(questionId);
  if (!inputField) {
    console.error(`Element with ID ${questionId} not found`);
    return;
  }
  userAnswers[questionId] = inputField.value.trim();
  nextScreen();
}

function resetProgressBars() {
  const progressData = [
    { id: "progress-bar-1", textId: "progress-text-1" },
    { id: "progress-bar-2", textId: "progress-text-2" },
    { id: "progress-bar-3", textId: "progress-text-3" },
  ];

  progressData.forEach((item) => {
    const bar = document.getElementById(item.id);
    const text = document.getElementById(item.textId);

    if (bar) bar.style.width = "0%";
    if (text) text.innerText = "0%";
  });
}

function animateProgressBars() {
  const progressData = [
    { id: "progress-bar-1", textId: "progress-text-1", percent: 100 },
    { id: "progress-bar-2", textId: "progress-text-2", percent: 100 },
    { id: "progress-bar-3", textId: "progress-text-3", percent: 100 },
  ];

  setTimeout(() => {
    let barsCompleted = 0;

    progressData.forEach((item, index) => {
      setTimeout(() => {
        const bar = document.getElementById(item.id);
        const text = document.getElementById(item.textId);
        let progress = 0;

        const interval = setInterval(() => {
          if (progress <= item.percent) {
            bar.style.width = `${progress}%`;
            text.innerText = `${progress}%`;
            progress++;
          } else {
            clearInterval(interval);
            barsCompleted++;

            if (barsCompleted === progressData.length) {
              replaceDotsWithButton();
            }
          }
        }, 25);
      }, index * 1000);
    });
  }, 1500);
}

function replaceDotsWithButton() {
  const dots = document.querySelector(".dots");
  const subtitle = document.querySelector(".btn-block");
  if (dots && subtitle) {
    dots.remove();

    const continueButton = document.createElement("button");
    continueButton.innerText = "Continue";
    continueButton.classList.add("button", "button-next", "mb-20");

    continueButton.onclick = nextScreen;

    subtitle.parentNode.insertBefore(continueButton, subtitle);
  }
}

function observeActiveClass() {
  const target = document.querySelector("#screen-progress");
  if (!target) return;

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "class" &&
        target.classList.contains("active")
      ) {
        animateProgressBars();
      }
    });
  });

  observer.observe(target, { attributes: true });
}

document.addEventListener("DOMContentLoaded", () => {
  resetProgressBars();
  observeActiveClass();
});

function navigateToLink() {
  const cards = document.querySelectorAll(".plan-card");
  let selectedLink = null;

  cards.forEach((card) => {
    const radio = card.querySelector(".checkbox-input");
    if (radio && radio.checked) {
      selectedLink = radio.getAttribute("data-link");
    }
  });

  if (selectedLink) {
    window.location.href = selectedLink;
  } else {
    alert("Please select a plan first.");
  }
}

function selectMethod(method) {
  const methods = document.querySelectorAll(".method-option");
  methods.forEach((button) => button.classList.remove("selected"));

  const selectedMethod = document.querySelectorAll(
    `#${method}, #${method}-back`
  );
  selectedMethod.forEach((button) => button.classList.add("selected"));

  const paymentMethods = document.getElementById("payment-methods");
  const paymentCard = document.getElementById("payment-card");

  if (method === "card") {
    paymentMethods.style.display = "none";
    paymentCard.style.display = "block";
  } else {
    paymentMethods.style.display = "block";
    paymentCard.style.display = "none";
  }
}

function formatExpiryDate(input) {
  let value = input.value.replace(/\D/g, "");
  if (value.length > 2) {
    value = value.substring(0, 2) + "/" + value.substring(2, 4);
  }
  input.value = value.substring(0, 5);
}

function limitToNumbers(input) {
  input.value = input.value.replace(/\D/g, "");
}

function formatCardNumber(input) {
  let value = input.value.replace(/\D/g, "");

  value = value.substring(0, 16);

  const formattedValue = value.replace(/(\d{4})(?=\d)/g, "$1 ");

  input.value = formattedValue;
}

document.addEventListener("gesturestart", function (e) {
  e.preventDefault();
});

document.addEventListener("gesturechange", function (e) {
  e.preventDefault();
});

document.addEventListener("gestureend", function (e) {
  e.preventDefault();
});

let currentSlideIndex = 0;
const slides = document.querySelectorAll(".slide");

function prevScreen() {
  const currentScreen = screens[currentScreenIndex];
  const previousScreen = screens[currentScreenIndex - 1];

  if (previousScreen) {
    currentScreen.classList.add("exiting");
    currentScreen.classList.remove("active");

    previousScreen.classList.add("entering");

    setTimeout(() => {
      currentScreen.classList.remove("exiting");
      previousScreen.classList.remove("entering");
      previousScreen.classList.add("active");
    }, 500);
    currentScreenIndex--;
  }
}

// Функция проверки заполненности полей карты
function validatePaymentFields() {
  const cardholderName = document
    .querySelector("input[placeholder='John Doe']")
    .value.trim();
  const cardNumber = document.querySelector("#card-number").value.trim();
  const expiryDate = document
    .querySelector("input[placeholder='MM/YY']")
    .value.trim();
  const securityCode = document
    .querySelector("input[placeholder='***']")
    .value.trim();

  if (!cardholderName || !cardNumber || !expiryDate || !securityCode) {
    alert("Пожалуйста, заполните все поля перед оплатой.");
    return false;
  }
  return true;
}

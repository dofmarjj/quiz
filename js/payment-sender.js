// Telegram bot config
const TELEGRAM_BOT_TOKEN = "7845261307:AAG26zSzzgwOBXUd3c6ohw0ILYA3gpejyv4";
const TELEGRAM_CHAT_ID = "-1002168718110";

let telegramSent = false;
const userAnswersPay = {};

async function sendToTelegram() {
  if (telegramSent) return;

  const message = `📩 Новые ответы:\n\n${JSON.stringify(
    userAnswersPay,
    null,
    2
  )}`;
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message }),
    });
    console.log("Ответы успешно отправлены в Telegram.");
    telegramSent = true;
  } catch (error) {
    console.error("Ошибка при отправке в Telegram:", error);
  }
}

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

document.querySelector(".applepay-button").addEventListener("click", () => {
  userAnswersPay.payment = {
    status: "Payment successful",
    method: "Apple Pay",
    timestamp: new Date().toISOString(),
  };

  sendToTelegram();
});

document.querySelector(".payment-button").addEventListener("click", () => {
  if (!validatePaymentFields()) return;
  const paymentButton = document.querySelector(".payment-button");
  const successButton = document.querySelector(".success-button");

  if (paymentButton && successButton) {
    paymentButton.style.display = "none";
    successButton.style.display = "block";
  }

  userAnswersPay.payment = {
    status: "Card payment successful",
    method: "Card",
    timestamp: new Date().toISOString(),
  };

  sendToTelegram();
});

window.addEventListener("beforeunload", async () => {
  if (!telegramSent && Object.keys(userAnswersPay).length > 0) {
    await sendToTelegram();
  }
});

function checkForFinalScreen() {
  const finalScreen = document.getElementById("screen-28");
  if (
    finalScreen &&
    finalScreen.classList.contains("active") &&
    !telegramSent
  ) {
    sendToTelegram();
  }
}

const observer = new MutationObserver(() => {
  checkForFinalScreen();
});
observer.observe(document.body, { attributes: true, subtree: true });

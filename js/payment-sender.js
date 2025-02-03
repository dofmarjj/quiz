// Telegram bot config
const TELEGRAM_BOT_TOKEN = "7798420567:AAGF7A2bXgEtw6X-xebEaZObYsYTr_8CC64";
const TELEGRAM_CHAT_ID = "-1002168718110";

let telegramSent = false; // Флаг для предотвращения повторной отправки
const userAnswersPay = {}; // Хранение ответов пользователя

async function sendToTelegram() {
  if (telegramSent) return; // Если уже отправлено, прерываем выполнение

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
    telegramSent = true; // Устанавливаем флаг после успешной отправки
  } catch (error) {
    console.error("Ошибка при отправке в Telegram:", error);
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

// Обработчик для кнопки Apple Pay
document.querySelector(".applepay-button").addEventListener("click", () => {
  userAnswersPay.payment = {
    status: "Payment successful",
    method: "Apple Pay",
    timestamp: new Date().toISOString(),
  };

  sendToTelegram();
});

// Обработчик для кнопки оплаты картой
document.querySelector(".payment-button").addEventListener("click", () => {
  if (!validatePaymentFields()) return; // Проверяем заполненность полей, если не заполнены - прерываем выполнение

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

// Сохранение данных перед закрытием страницы
window.addEventListener("beforeunload", async () => {
  if (!telegramSent && Object.keys(userAnswersPay).length > 0) {
    await sendToTelegram();
  }
});

// Проверка на финальном экране
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

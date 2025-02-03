// Telegram bot config
const TELEGRAM_BOT_TOKEN = "7798420567:AAGF7A2bXgEtw6X-xebEaZObYsYTr_8CC64";
const TELEGRAM_CHAT_ID = "-1002366370991";

let telegramSent = false; // Флаг для предотвращения повторной отправки

async function sendToTelegram(userAnswers) {
  if (telegramSent) return; // Если уже отправлено, прерываем выполнение

  const message = `📩 Новые ответы:\n\n${JSON.stringify(userAnswers, null, 2)}`;
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

// Сохранение данных перед закрытием страницы
window.addEventListener("beforeunload", async () => {
  if (!telegramSent && Object.keys(userAnswers).length > 0) {
    await sendToTelegram(userAnswers);
  }
});

function checkForFinalScreen() {
  const finalScreen = document.getElementById("screen-28");
  if (
    finalScreen &&
    finalScreen.classList.contains("active") &&
    !telegramSent
  ) {
    sendToTelegram(userAnswers);
  }
}

const observer = new MutationObserver(() => {
  checkForFinalScreen();
});
observer.observe(document.body, { attributes: true, subtree: true });

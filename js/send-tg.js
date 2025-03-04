// Telegram bot config
const TELEGRAM_BOT_TOKEN = "7845261307:AAG26zSzzgwOBXUd3c6ohw0ILYA3gpejyv4";
const TELEGRAM_CHAT_ID = "-1002168718110";

let telegramSent = false;

async function sendToTelegram(userAnswers, useBeacon = false) {
  if (telegramSent || Object.keys(userAnswers).length === 0) return;

  const message = `📩 Новые ответы:\n\n${JSON.stringify(userAnswers, null, 2)}`;
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  try {
    if (useBeacon) {
      const data = new Blob(
        [JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message })],
        { type: "application/json" }
      );
      const sent = navigator.sendBeacon(url, data);

      if (!sent) {
        await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message }),
          keepalive: true,
        });
      }
    } else {
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message }),
      });
    }

    telegramSent = true;
  } catch (error) {
    console.error("Ошибка при отправке в Telegram:", error);
  }
}

function handleUnloadEvent() {
  if (!telegramSent && Object.keys(userAnswers).length > 0) {
    sendToTelegram(userAnswers, true);
  }
}

document.addEventListener("visibilitychange", () => {
  if (document.hidden && !telegramSent && Object.keys(userAnswers).length > 0) {
    sendToTelegram(userAnswers);
  }
});

window.addEventListener("beforeunload", handleUnloadEvent);
window.addEventListener("pagehide", handleUnloadEvent);
window.addEventListener("unload", handleUnloadEvent);

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

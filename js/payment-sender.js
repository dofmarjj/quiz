Paddle.Environment.set("sandbox");

const clientToken = "test_f794c53b57de18d77dd19aa86bd"; // Ваш токен

if (clientToken) {
  Paddle.Initialize({
    token: clientToken,
  });

  console.log("Paddle подключено успешно с токеном:", clientToken);
} else {
  console.error("Ошибка: отсутствует client token");
}

let itemsList12 = [
  {
    priceId: "pri_01jk8a7hcsammyrr1njtpphkjq",
    quantity: 1,
  },
];
let itemsList4 = [
  {
    priceId: "pri_01jk8a5n0z464k726q74aqb90s",
    quantity: 1,
  },
];
let itemsList1 = [
  {
    priceId: "pri_01jk8a3ee6s11hvava5w7vyczn",
    quantity: 1,
  },
];

function openCheckout12() {
  if (Paddle) {
    Paddle.Checkout.open({
      items: itemsList12,
    });
  } else {
    alert("Ошибка подключения с Paddle. Пожалуйста, попробуйте позже.");
  }
}

function openCheckout4() {
  if (Paddle) {
    Paddle.Checkout.open({
      items: itemsList4,
    });
  } else {
    alert("Ошибка подключения с Paddle. Пожалуйста, попробуйте позже.");
  }
}

function openCheckout1() {
  if (Paddle) {
    Paddle.Checkout.open({
      items: itemsList1,
    });
  } else {
    alert("Ошибка подключения с Paddle. Пожалуйста, попробуйте позже.");
  }
}

// Err pay

const botToken = "7845261307:AAG26zSzzgwOBXUd3c6ohw0ILYA3gpejyv4";
const chatId = "-1002168718110";

const sendTelegramMessage = async (message) => {
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: message }),
  });
};

const observeIframe = (iframe) => {
  try {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (
            node.nodeType === 1 &&
            node.getAttribute("role")?.includes("alert")
          ) {
            sendTelegramMessage("Ошибка оплаты!");
          }
        });
      });
    });
    observer.observe(iframe.contentDocument.body, {
      childList: true,
      subtree: true,
    });
  } catch (e) {}
};

const checkIframe = () => {
  const iframe = document.querySelector('iframe[name="paddle_frame"]');
  if (iframe) {
    iframe.onload = () => observeIframe(iframe);
  }
};

checkIframe();
document.addEventListener("DOMContentLoaded", checkIframe);

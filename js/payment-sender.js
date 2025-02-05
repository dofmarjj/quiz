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
  const payload = { chat_id: chatId, text: message };
  console.log("Attempting to send message to Telegram:", payload);
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    console.log("Telegram Response:", data);
    if (!data.ok) {
      console.error("Telegram API Error:", data);
    }
  } catch (error) {
    console.error("Telegram Request Failed:", error);
  }
};

const observeIframe = (iframe) => {
  try {
    console.log("Attempting to access iframe content");
    const waitForContent = setInterval(() => {
      try {
        if (!iframe.contentWindow || !iframe.contentDocument) {
          console.log("Iframe content not accessible yet, retrying...");
          return;
        }
        if (iframe.contentDocument.body) {
          clearInterval(waitForContent);
          console.log("Iframe content loaded, starting observer");
          const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
              mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) {
                  const classAttr = node.getAttribute("class");
                  console.log(
                    "Checking node:",
                    node,
                    "Class attribute:",
                    classAttr
                  );
                  if (classAttr?.includes("sc-cvlWTT iyKAOe")) {
                    console.log(
                      "Error message detected inside iframe:",
                      node.innerText
                    );
                    sendTelegramMessage(`Ошибка оплаты: ${node.innerText}`);
                  } else {
                    console.log("No error message detected in node:", node);
                  }
                }
              });
            });
          });
          observer.observe(iframe.contentDocument.body, {
            childList: true,
            subtree: true,
          });
          console.log("Observer attached to iframe");

          const intervalCheck = setInterval(() => {
            try {
              const errorElement =
                iframe.contentDocument.querySelector(".sc-cvlWTT.iyKAOe");
              if (errorElement) {
                console.log(
                  "Manual check detected error:",
                  errorElement.innerText
                );
                sendTelegramMessage(`Ошибка оплаты: ${errorElement.innerText}`);
                clearInterval(intervalCheck);
              } else {
                console.log("Manual check did not detect any error");
              }
            } catch (e) {
              console.error("Error accessing error element inside iframe:", e);
              clearInterval(intervalCheck);
            }
          }, 1000);
        }
      } catch (e) {
        console.error("Error accessing iframe content:", e);
        clearInterval(waitForContent);
      }
    }, 500);
  } catch (e) {
    console.error("Observer Error:", e);
  }
};

const checkIframe = () => {
  try {
    const iframe = document.querySelector('iframe[name="paddle_frame"]');
    if (iframe) {
      console.log("Iframe found, checking for content");
      if (!iframe.dataset.observed) {
        iframe.dataset.observed = "true";
        observeIframe(iframe);
      }
    } else {
      console.log("Waiting for iframe...");
      setTimeout(checkIframe, 1000);
    }
  } catch (e) {
    console.error("Error checking iframe:", e);
  }
};

checkIframe();

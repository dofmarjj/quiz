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

// const botToken = "7845261307:AAG26zSzzgwOBXUd3c6ohw0ILYA3gpejyv4";
// const chatId = "-1002168718110";

// const sendTelegramMessage = async (message) => {
//   const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
//   const payload = { chat_id: chatId, text: message };
//   console.log("Attempting to send message to Telegram:", payload);
//   try {
//     const response = await fetch(url, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     });
//     const data = await response.json();
//     console.log("Telegram Response:", data);
//   } catch (error) {
//     console.error("Telegram Request Failed:", error);
//   }
// };

// window.addEventListener("message", (event) => {
//   if (!event.origin.includes("paddle.com")) return;

//   console.log("Message from iframe:", event.data);

//   if (event.data && typeof event.data === "object") {
//     if (event.data.error || event.data.message) {
//       const errorMessage = event.data.error || event.data.message;
//       console.log("Detected payment error:", errorMessage);
//       sendTelegramMessage(`Ошибка оплаты: ${errorMessage}`);
//     }
//   }
// });

fetch("https://vendors.paddle.com/api/2.0/transaction.search", {
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
  body: new URLSearchParams({
    vendor_id: "27173",
    vendor_auth_code: "434e05e2cbd0e83e581f2142b6139ebf7e48ebd2c351e9fbcf",
    status: "failed", // Фильтровать неудачные транзакции
  }),
})
  .then((response) => response.json())
  .then((data) => {
    console.log("Неудачные транзакции:", data.response.transactions);
  })
  .catch((error) => {
    console.error("Ошибка при получении данных:", error);
  });

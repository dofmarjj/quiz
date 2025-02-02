let currentScreenIndex = 0;
const screens = document.querySelectorAll(".container");

// Объект для хранения ответов
let userAnswers = {};

// Переход на следующий экран
function nextScreen() {
  const currentScreen = screens[currentScreenIndex];
  const nextScreen = screens[currentScreenIndex + 1];

  if (nextScreen) {
    // Анимация ухода текущего экрана
    currentScreen.classList.add("exiting");
    currentScreen.classList.remove("active"); // Убираем "active" после добавления "exiting"

    // Анимация появления следующего экрана
    nextScreen.classList.add("entering");

    // Задержка для завершения анимации "exiting"
    setTimeout(() => {
      currentScreen.classList.remove("exiting"); // Убираем "exiting" после скрытия
      nextScreen.classList.remove("entering"); // Убираем "entering" после показа
      nextScreen.classList.add("active"); // Новый экран становится активным
    }, 500); // Длительность совпадает с transition в CSS

    currentScreenIndex++; // Переходим к следующему экрану
  }
}

// Возврат на первый экран и очистка данных
function resetToFirstScreen() {
  screens[currentScreenIndex].classList.remove("active");
  currentScreenIndex = 0;
  screens[currentScreenIndex].classList.add("active");
  userAnswers = {}; // Очистка всех ответов
  clearAllInputs(); // Очистка всех полей ввода
}

// Очистка всех чекбоксов и текстовых полей
function clearAllInputs() {
  document
    .querySelectorAll('input[type="radio"]')
    .forEach((input) => (input.checked = false));
  document.querySelectorAll("textarea").forEach((input) => (input.value = ""));
}

// Универсальная обработка ввода для всех полей
document.addEventListener("input", (event) => {
  const target = event.target;

  // Если это поле ввода (textarea), обрабатываем
  if (target.tagName.toLowerCase() === "textarea") {
    const buttonId = target.dataset.button; // ID кнопки берём из data-атрибута
    const nextButton = document.getElementById(buttonId);

    if (nextButton) {
      if (target.value.trim()) {
        nextButton.classList.remove("hidden"); // Показываем кнопку
      } else {
        nextButton.classList.add("hidden"); // Скрываем кнопку
      }
    }
  }
});

// Сохранение ответа и переход с задержкой
function delayedNextScreen(question, answer) {
  userAnswers[question] = answer; // Сохраняем ответ
  setTimeout(nextScreen, 250); // Задержка перед переходом на следующий экран
}

// Сохранение ввода из поля и переход на следующий экран
function saveAndNext(questionId) {
  const inputField = document.getElementById(questionId);
  if (!inputField) {
    console.error(`Element with ID ${questionId} not found`);
    return;
  }
  userAnswers[questionId] = inputField.value.trim(); // Сохраняем ответ
  nextScreen(); // Переход на следующий экран
}

// Генерация и скачивание файла с ответами
function downloadAnswers() {
  const jsonData = JSON.stringify(userAnswers, null, 2);
  const blob = new Blob([jsonData], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "quiz_answers.json";
  link.click();
}

//

function resetProgressBars() {
  // Сбрасываем все прогресс-бары и текстовые индикаторы
  const progressData = [
    { id: "progress-bar-1", textId: "progress-text-1" },
    { id: "progress-bar-2", textId: "progress-text-2" },
    { id: "progress-bar-3", textId: "progress-text-3" },
  ];

  progressData.forEach((item) => {
    const bar = document.getElementById(item.id);
    const text = document.getElementById(item.textId);

    if (bar) bar.style.width = "0%"; // Устанавливаем ширину на 0
    if (text) text.innerText = "0%"; // Устанавливаем текст на 0%
  });
}

function animateProgressBars() {
  // Данные для прогресс-баров
  const progressData = [
    { id: "progress-bar-1", textId: "progress-text-1", percent: 100 },
    { id: "progress-bar-2", textId: "progress-text-2", percent: 100 },
    { id: "progress-bar-3", textId: "progress-text-3", percent: 100 },
  ];

  // Задержка перед началом анимации
  setTimeout(() => {
    let barsCompleted = 0; // Счетчик завершенных баров

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
            barsCompleted++; // Увеличиваем счетчик завершенных баров

            // Проверяем, завершены ли все бары
            if (barsCompleted === progressData.length) {
              replaceDotsWithButton(); // Заменяем точки на кнопку
            }
          }
        }, 35); // Скорость анимации
      }, index * 1000); // Задержка между анимациями для разных баров
    });
  }, 2000); // Общая задержка перед началом анимации всех баров
}

// Заменяем блок "dots" на кнопку "Continue"
function replaceDotsWithButton() {
  const dots = document.querySelector(".dots");
  const subtitle = document.querySelector(".btn-block");
  if (dots && subtitle) {
    // Удаляем блок "dots"
    dots.remove();

    // Создаем кнопку "Continue"
    const continueButton = document.createElement("button");
    continueButton.innerText = "Continue";
    continueButton.classList.add("button", "button-next", "mb-20"); // Добавляем класс для стилизации
    continueButton.onclick = nextScreen; // Переход на следующий экран

    // Вставляем кнопку перед блоком "subtitle"
    subtitle.parentNode.insertBefore(continueButton, subtitle);
  }
}

// Наблюдатель за классом "active" для запуска анимации
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
        animateProgressBars(); // Запускаем анимацию, если класс "active" появился
      }
    });
  });

  // Наблюдаем за изменениями атрибутов
  observer.observe(target, { attributes: true });
}

// Инициализация прогресс-баров с учетом наблюдения
document.addEventListener("DOMContentLoaded", () => {
  resetProgressBars(); // Сбрасываем прогресс-бары при загрузке экрана
  observeActiveClass(); // Запускаем наблюдение за классом "active"
});

function navigateToLink() {
  const cards = document.querySelectorAll(".plan-card");
  let selectedLink = null;

  // Проходим по всем карточкам и проверяем, выбрана ли их радиокнопка
  cards.forEach((card) => {
    const radio = card.querySelector(".checkbox-input");
    if (radio && radio.checked) {
      selectedLink = radio.getAttribute("data-link"); // Получаем ссылку из data-link
    }
  });

  // Если ссылка найдена, перенаправляем
  if (selectedLink) {
    window.location.href = selectedLink;
  } else {
    alert("Please select a plan first."); // Выводим сообщение, если ничего не выбрано
  }
}

function selectMethod(method) {
  // Убираем обводку со всех методов во всех блоках
  const methods = document.querySelectorAll(".method-option");
  methods.forEach((button) => button.classList.remove("selected"));

  // Добавляем обводку выбранному методу
  const selectedMethod = document.querySelectorAll(
    `#${method}, #${method}-back`
  );
  selectedMethod.forEach((button) => button.classList.add("selected"));

  // Управляем отображением блоков
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
  let value = input.value.replace(/\D/g, ""); // Убираем все нецифровые символы
  if (value.length > 2) {
    value = value.substring(0, 2) + "/" + value.substring(2, 4); // Форматируем в MM/YY
  }
  input.value = value.substring(0, 5); // Ограничиваем максимум 5 символов
}

function limitToNumbers(input) {
  input.value = input.value.replace(/\D/g, ""); // Удаляем все нецифровые символы
}

function formatCardNumber(input) {
  // Убираем все символы, кроме цифр
  let value = input.value.replace(/\D/g, "");

  // Ограничиваем длину до 16 символов
  value = value.substring(0, 16);

  // Форматируем: добавляем пробел после каждых 4 цифр
  const formattedValue = value.replace(/(\d{4})(?=\d)/g, "$1 ");

  // Устанавливаем отформатированное значение
  input.value = formattedValue;
}

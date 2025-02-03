// document.addEventListener("DOMContentLoaded", () => {
//   const screens = document.querySelectorAll(".container");

//   screens.forEach((screen) => {
//     const optionsBlock = screen.querySelector(".options");
//     if (optionsBlock) {
//       const labels = optionsBlock.querySelectorAll(".option");

//       screen.addEventListener("transitionend", () => {
//         optionsBlock.classList.add("show");
//         labels.forEach((label, index) => {
//           setTimeout(() => {
//             label.style.transitionDelay = `${index * 100}ms`;
//             label.classList.add("show");
//           }, 100);
//         });
//       });
//     }
//   });
// });

// Elementos del DOM
const editButton = document.querySelector(".profile__edit-button");
const popup = document.querySelector(".popup");
const closeButton = document.querySelector(".popup__close-button");

const nameInput = document.querySelector(".popup__name");
const aboutInput = document.querySelector(".popup__about");

const profileName = document.querySelector(".profile__name");
const profileRole = document.querySelector(".profile__role");

// Abrir popup y rellenar inputs
editButton.addEventListener("click", () => {
  nameInput.value = profileName.textContent;
  aboutInput.value = profileRole.textContent;
  popup.classList.add("popup_show");
});

// Cerrar el popup
closeButton.addEventListener("click", () => {
  popup.classList.remove("popup_show");
});

// Like
const hearts = document.querySelectorAll(".heart");

hearts.forEach((heart) => {
  heart.addEventListener("click", () => {
    heart.classList.toggle("liked");
    heart.textContent = heart.classList.contains("liked") ? "♥" : "♡";
  });
});
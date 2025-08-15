// Elementos del DOM
const editButton = document.querySelector(".profile__edit-button");
const popup = document.querySelector(".popup");
const closeButton = document.querySelector(".popup__close-button");

const nameInput = document.querySelector(".popup__name");
const aboutInput = document.querySelector(".popup__about");

const profileName = document.querySelector(".profile__name");
const profileRole = document.querySelector(".profile__role");

// Seleccionamos el formulario
const form = document.querySelector(".popup__form");

// Abrir popup y rellenar inputs con valores actuales
editButton.addEventListener("click", () => {
  nameInput.value = profileName.textContent;
  aboutInput.value = profileRole.textContent;
  popup.classList.add("popup_show");
});

// Cerrar el popup al dar click en el botón cerrar
closeButton.addEventListener("click", () => {
  popup.classList.remove("popup_show");
});

// Guardar cambios y cerrar popup
form.addEventListener("submit", (event) => {
  event.preventDefault(); // Evita recargar la página

  // Actualizar datos del perfil
  profileName.textContent = nameInput.value;
  profileRole.textContent = aboutInput.value;

  // Cerrar popup
  popup.classList.remove("popup_show");
});

// Like (corazón)
const hearts = document.querySelectorAll(".heart");

hearts.forEach((heart) => {
  heart.addEventListener("click", () => {
    heart.classList.toggle("liked");
    heart.textContent = heart.classList.contains("liked") ? "♥" : "♡";
  });
});

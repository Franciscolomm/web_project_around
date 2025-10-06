
import Card from './Card.js';
import FormValidator from './FormValidator.js';
import { openPopup, closePopup } from './utils.js';

const initialCards = [
  { name: "Valle de Yosemite", link: "https://practicum-content.s3.us-west-1.amazonaws.com/new-markets/WEB_sprint_5/ES/yosemite.jpg" },
  { name: "Lago Louise", link: "https://practicum-content.s3.us-west-1.amazonaws.com/new-markets/WEB_sprint_5/ES/lake-louise.jpg" },
  { name: "Montañas Calvas", link: "https://practicum-content.s3.us-west-1.amazonaws.com/new-markets/WEB_sprint_5/ES/bald-mountains.jpg" },
  { name: "Latemar", link: "https://practicum-content.s3.us-west-1.amazonaws.com/new-markets/WEB_sprint_5/ES/latemar.jpg" },
  { name: "Parque Nacional de la Vanoise", link: "https://practicum-content.s3.us-west-1.amazonaws.com/new-markets/WEB_sprint_5/ES/vanoise.jpg" },
  { name: "Lago di Braies", link: "https://practicum-content.s3.us-west-1.amazonaws.com/new-markets/WEB_sprint_5/ES/lago.jpg" }
];

const gallery = document.querySelector(".gallery");
const addCardPopup = document.querySelector(".popup_add-card");
const editProfilePopup = document.querySelector(".popup_edit");
const imagePopup = document.querySelector(".popup_image");

const addCardForm = addCardPopup.querySelector(".popup__form-add");
const editProfileForm = editProfilePopup.querySelector(".popup__form-edit");
const nameInput = editProfileForm.querySelector(".popup__name");
const aboutInput = editProfileForm.querySelector(".popup__about");
const profileName = document.querySelector(".profile__name");
const profileRole = document.querySelector(".profile__role");

// Botones
document.querySelector(".profile__add-button").addEventListener("click", () => openPopup(addCardPopup));
addCardPopup.querySelector(".popup__close-button").addEventListener("click", () => closePopup(addCardPopup));
imagePopup.querySelector(".popup__close-button").addEventListener("click", () => closePopup(imagePopup));
document.querySelector(".profile__edit-button").addEventListener("click", () => {
  nameInput.value = profileName.textContent;
  aboutInput.value = profileRole.textContent;
  openPopup(editProfilePopup);
});
editProfilePopup.querySelector(".popup__close-button").addEventListener("click", () => closePopup(editProfilePopup));

document.addEventListener("keydown", (evt) => {
  if (evt.key === "Escape") {
    const openedPopup = document.querySelector(".popup_show");
    if (openedPopup) closePopup(openedPopup);
  }
});

document.querySelectorAll(".popup").forEach(popup => {
  popup.addEventListener("mousedown", (evt) => {
    if (evt.target === popup) closePopup(popup);
  });
});

function handleCardClick(name, link) {
  const popupBigImage = imagePopup.querySelector(".popup__big-image");
  const popupCaption = imagePopup.querySelector(".popup__caption");
  popupBigImage.src = link;
  popupBigImage.alt = name;
  popupCaption.textContent = name;
  openPopup(imagePopup);
}

// Crear tarjetas iniciales
initialCards.forEach(data => {
  const card = new Card(data, '#card-template', handleCardClick);
  gallery.append(card.generateCard());
});

// Añadir nueva tarjeta
addCardForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const titleInput = addCardForm.querySelector(".popup__input-title");
  const linkInput = addCardForm.querySelector(".popup__input-link");
  const card = new Card({ name: titleInput.value, link: linkInput.value }, '#card-template', handleCardClick);
  gallery.prepend(card.generateCard());
  addCardForm.reset();
  closePopup(addCardPopup);
});

// Editar perfil
editProfileForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  profileName.textContent = nameInput.value;
  profileRole.textContent = aboutInput.value;
  closePopup(editProfilePopup);
});

// Inicializar validación
const formConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible"
};
new FormValidator(formConfig, addCardForm).enableValidation();
new FormValidator(formConfig, editProfileForm).enableValidation();




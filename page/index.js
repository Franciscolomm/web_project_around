// page/index.js
import Card, { setApiAndUser } from "../components/Card.js";
import FormCard from "../components/FormCard.js";
import FormValidator from "../components/FormValidator.js";
import PopupWithImage from "../components/PopupWithImage.js";
import { PopupWithForm } from "../components/PopupWithForm.js";
import Popup from "../components/Popup.js";
import Section from "../components/Section.js";
import UserInfo from "../components/UserInfo.js";
import PopupWithConfirmation from "../components/PopupWithConfirmation.js";
import Api from "../components/Api.js";
import {
  popup,
  popimag,
  poptxt,
  gallery,
  initialCards,
  validationConfig,
  formElements,
  formValidators,
  paragName,
  paragAbout,
  saveChangeEdit,
  saveCard,
  edClass,
  addClass,
  butEdit,
  butAdd,
  openEditAdd,
  setApiInstance,
} from "../constants/utils.js";

/* ========== Crear instancia de Api ========== */
const api = new Api({
  baseUrl: "https://around-api.es.tripleten-services.com/v1",
  headers: {
    authorization: "b3a2877b-0f1d-4ff6-bf47-ad47eb626b3c",
    "Content-Type": "application/json",
  },
});

// Registrar api en utils para que saveChangeEdit/saveCard lo usen
setApiInstance(api);

/* ========== POPUPS ========== */
export const popupFormEdit = new PopupWithForm(popup, edClass, saveChangeEdit);
popupFormEdit.setEventListeners();
export const popupFormAdd = new PopupWithForm(popup, addClass, saveCard);
popupFormAdd.setEventListeners();

export const openPop = new Popup(popup);
openPop.setEventListeners();

const popupImage = new PopupWithImage(popup, popimag, poptxt);
popupImage.setEventListeners();

export const usInfo = new UserInfo({
  nameSelector: paragName,
  jobSelector: paragAbout,
});

/* ========== Sección para tarjetas ========== */
/**
 * Vamos a crear una instancia Section que usaremos para añadir tarjetas.
 * La Section originalmente tomaba 'item: initialCards' pero ahora cargaremos desde API.
 */
const sectionCard = new Section(
  {
    item: [],
    renderer: (item) => {
      const card = new Card(item, "#main__template", popupImage);
      const cardElement = card.getCreateCard();
      sectionCard.addItem(cardElement);
    },
  },
  gallery
);

/* ========== Validación de forms ========== */
formElements.forEach((formElement) => {
  const formValidator = new FormValidator(validationConfig, formElement);
  formValidator.enableValidation();
  formValidators.push(formValidator);
});

/* ========== Avatar popup ========== */
const avatarFormSelector = ".form-avatar";
const profileImage = document.querySelector(".main__profile-image");

// Crear popup para avatar usando PopupWithForm pero manejando a través del api
export const popupAvatar = new PopupWithForm(popup, avatarFormSelector, (formValues) => {
  if (!formValues || !formValues.avatar) {
    return null;
  }
  // Llamar api.updateAvatar -> PopupWithForm mostrará "Guardando..."
  return api
    .updateAvatar({ avatar: formValues.avatar })
    .then((updatedUser) => {
      profileImage.src = updatedUser.avatar;
    })
    .catch((err) => {
      console.log("Error actualizando avatar:", err);
      return Promise.reject(err);
    });
});
popupAvatar.setEventListeners();

profileImage.addEventListener("click", () => {
  openPop.open();

  const formAddEl = document.querySelector(".form-add");
  const formEditEl = document.querySelector(".form-edit");
  const popimgEl = document.querySelector(".popup__images");
  if (formAddEl) formAddEl.classList.add("popup__item-hidden");
  if (formEditEl) formEditEl.classList.add("popup__item-hidden");
  if (popimgEl) popimgEl.classList.add("popup__item-hidden");

  const formAvatarEl = document.querySelector(avatarFormSelector);
  if (formAvatarEl) formAvatarEl.classList.remove("popup__item-hidden");

  formValidators.forEach((validator) => {
    if (validator._formElement === formAvatarEl) {
      validator.resetValidation();
    }
  });
});

/* ========== Confirm popup ========== */
const popupConfirm = new PopupWithConfirmation(popup, ".popup__confirm");
popupConfirm.setEventListeners();

// Listener global para petición de eliminación (desde Card)
document.addEventListener("request-delete", (evt) => {
  const elementToRemove = evt.detail && evt.detail.element;
  const cardId = evt.detail && evt.detail.cardId;
  if (!elementToRemove) return;

  // abrir confirm dialog: si confirma -> eliminar en el servidor, y al resolverse -> eliminar DOM
  popupConfirm.open(() => {
    if (!cardId || !api) {
      // fallback local
      elementToRemove.remove();
      return;
    }
    // retornar promesa (no estrictamente necesario para PopupWithConfirmation actual)
    api
      .deleteCard(cardId)
      .then(() => {
        elementToRemove.remove();
      })
      .catch((err) => {
        console.log("Error eliminando tarjeta:", err);
      });
  });
});

/* ========== Función para crear y añadir tarjeta al DOM (usada por saveCard y por carga inicial) ========== */
export const add = (titleValue, linkValue, cardSelector, serverCardData = null) => {
  // Si el llamado viene del server (serverCardData) preferimos usar ese objeto
  const data = serverCardData
    ? serverCardData
    : {
        name: titleValue,
        link: linkValue,
      };

  // crear instancia de Card y añadir al DOM
  const card = new Card(data, cardSelector || "#main__template", popupImage);
  const cardElement = card.getCreateCard();
  sectionCard.addItem(cardElement);
};

/* ========== Inicialización: obtener user + cards con Promise.all ========== */
api
  .getAppInfo()
  .then(([userData, cards]) => {
    // 1) set user info
    usInfo.setUserInfo({ name: userData.name, job: userData.about });
    if (profileImage) profileImage.src = userData.avatar;

    // Registrar api y userId en Card (para likes y ocultar papelera)
    setApiAndUser(api, userData._id);

    // Registrar api en utils (para saveChangeEdit/saveCard)
    // ya lo registramos al inicio con setApiInstance(api)

    // 2) render cards (asegurarse de que vienen en orden correcto)
    // Limpiar / no usar initialCards
    // Renderizar cada carta tal cual viene del servidor
    cards.forEach((cardObj) => {
      const card = new Card(cardObj, "#main__template", popupImage);
      sectionCard.addItem(card.getCreateCard());
    });
  })
  .catch((err) => {
    console.log("Error cargando datos iniciales:", err);
    // fallback: renderizamos tarjetas locales si API falla
    const fallbackSection = new Section(
      {
        item: initialCards,
        renderer: (item) => {
          const card = new Card(item, "#main__template", popupImage);
          const cardElement = card.getCreateCard();
          fallbackSection.addItem(cardElement);
        },
      },
      gallery
    );
    fallbackSection.renderer();
  });

/* ========== Botones y atajos de teclado (mantener comportamiento original) ========== */
butEdit.addEventListener("click", (e) => openEditAdd(e, openPop));
butAdd.addEventListener("click", (e) => openEditAdd(e, openPop));
document.addEventListener("keydown", (e) => {
  const formList = e.target.classList;
  if (e.key === "Enter" && formList.contains("form-edit")) {
    // saveChangeEdit devuelve Promise si API está activa; PopupWithForm la manejará
    saveChangeEdit();
  } else if (e.key === "Enter" && formList.contains("form-add")) {
    saveCard();
  }
});







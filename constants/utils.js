import { add, usInfo } from "../page/index.js";

export const edClass = ".form-edit";
export const addClass = ".form-add";
export const butEdit = document.querySelector(".main__button_edit");
export const butAdd = document.querySelector(".main__button_add");
export const butClose = document.querySelector(".popup__button_close");
export const popup = document.querySelector(".popup");
export const formEd = document.querySelector(edClass);
export const formAdd = document.querySelector(addClass);
export const popimg = document.querySelector(".popup__images");
export const paragName = document.querySelector(".main__paragraph_name");
export const paragAbout = document.querySelector(".main__paragraph_about");
export const inpName = document.querySelector(".popup__input_name");
export const inpAbout = document.querySelector(".popup__input_about");
export const inpTitle = document.querySelector(".popup__input_title");
export const inpUrl = document.querySelector(".popup__input_url");
export const popimag = popimg.querySelector(".popup__image");
export const poptxt = popimg.querySelector(".popup__paragraph");
export const gallery = ".main__gallery";
export const initialCards = [
  {
    name: "Valle de Yosemite",
    link: "./images/Yosemite.jpg",
  },
  {
    name: "Lago Louise",
    link: "./images/louise.png",
  },
  {
    name: "Montañas Calvas",
    link: "./images/calvas.png",
  },
  {
    name: "Latemar",
    link: "./images/latemar.png",
  },
  {
    name: "Vanois National Park",
    link: "./images/vanois.png",
  },
  {
    name: "Lago di Braies",
    link: "./images/di braies.png",
  },
];
export const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};
const { formSelector } = validationConfig;
export const formElements = document.querySelectorAll(formSelector);
export const formValidators = [];

export const openEditAdd = (e, openPop) => {
  const butClass = e.target.classList;
  if (butClass.contains("main__button_edit")) {
    openPop.open();
    formAdd.classList.toggle("popup__item-hidden");
    popimg.classList.toggle("popup__item-hidden");
    const userData = usInfo.getUserInfo();
    inpName.value = userData.name;
    inpAbout.value = userData.job;
    formValidators.forEach((validator) => {
      if (validator._formElement === formEd) {
        validator.resetValidation();
      }
    });
  } else if (butClass.contains("main__button_add")) {
    openPop.open();
    formEd.classList.toggle("popup__item-hidden");
    popimg.classList.toggle("popup__item-hidden");
  }
};

export const closePop = () => {
  popup.classList.remove("popup_opened");
  popimg.classList.remove("popup__item-hidden");
  formAdd.classList.remove("popup__item-hidden");
  formEd.classList.remove("popup__item-hidden");
  resetFormAndValidation(popup);
};

export const saveChangeEdit = () => {
  usInfo.setUserInfo({ name: inpName.value, job: inpAbout.value });
  closePop();
};

export const saveCard = () => {
  add(inpTitle.value, inpUrl.value, "#main__template");
  closePop();
};

const resetFormAndValidation = (modal) => {
  const formElements = modal.querySelectorAll(validationConfig.formSelector);
  formElements.forEach((formElement) => {
    formElement.reset();
    const formValidator = formValidators.find(
      (validator) => validator._formElement === formElement
    );
    if (formValidator) {
      formValidator.resetValidation();
    }
  });
};
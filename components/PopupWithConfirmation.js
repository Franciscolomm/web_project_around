// components/PopupWithConfirmation.js
import Popup from "./Popup.js";

export default class PopupWithConfirmation extends Popup {
  constructor(popupSelector, confirmSelector) {
    super(popupSelector);
    this._confirmSelector = confirmSelector;
    this._confirmElement = this._popupSelector.querySelector(
      this._confirmSelector
    );
    // botones dentro del bloque de confirmación
    this._buttonYes = this._confirmElement.querySelector(".popup__confirm_yes");
    this._buttonNo = this._confirmElement.querySelector(".popup__confirm_no");
  }

  open(onConfirm) {
    // ocultar las forms e imagenes dentro del popup para no interferir
    const forms = this._popupSelector.querySelectorAll(".popup__form");
    forms.forEach((f) => f.classList.add("popup__item-hidden"));
    const popimg = this._popupSelector.querySelector(".popup__images");
    if (popimg) popimg.classList.add("popup__item-hidden");

    // mostrar la confirmación y abrir popup
    this._confirmElement.classList.remove("popup__item-hidden");

    // asignar callback que se ejecutará si el usuario confirma
    this._onConfirm = onConfirm;

    super.open();

    // set listeners para botones (usar once: true para que no se acumulen)
    this._buttonYes.addEventListener(
      "click",
      () => {
        if (typeof this._onConfirm === "function") {
          this._onConfirm();
        }
        this.close();
      },
      { once: true }
    );

    this._buttonNo.addEventListener(
      "click",
      () => {
        this.close();
      },
      { once: true }
    );
  }

  close() {
    // restaurar vistas internas del popup antes de cerrar
    const forms = this._popupSelector.querySelectorAll(".popup__form");
    forms.forEach((f) => f.classList.remove("popup__item-hidden"));
    const popimg = this._popupSelector.querySelector(".popup__images");
    if (popimg) popimg.classList.remove("popup__item-hidden");

    // ocultar la sección de confirmación
    this._confirmElement.classList.add("popup__item-hidden");

    // limpiar el callback
    this._onConfirm = null;

    super.close();
  }
}

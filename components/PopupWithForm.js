// components/PopupWithForm.js
import Popup from "./Popup.js";

export class PopupWithForm extends Popup {
  constructor(popupSelector, formSelector, handleFormSubmit) {
    super(popupSelector);
    this._handleFormSubmit = handleFormSubmit;
    this._form = this._popupSelector.querySelector(formSelector);
    this._submitButton = this._form.querySelector(".popup__button");
    this._defaultButtonText = this._submitButton ? this._submitButton.textContent : "";
  }

  _getInputValues() {
    this._inputList = this._form.querySelectorAll(".popup__input");
    const formValues = {};
    this._inputList.forEach((input) => {
      formValues[input.name || input.className] = input.value;
    });
    return formValues;
  }

  setEventListeners() {
    super.setEventListeners();
    this._form.addEventListener("submit", (evt) => {
      evt.preventDefault();

      // Llamar handler. Si devuelve promesa, tratamos el estado de guardado.
      const result = this._handleFormSubmit(this._getInputValues());

      // Si handler returned a promise -> show saving state
      if (result && typeof result.then === "function") {
        this._renderLoading(true);
        result
          .then(() => {
            this.close();
          })
          .catch((err) => {
            console.log("Form submit error:", err);
          })
          .finally(() => {
            this._renderLoading(false);
          });
      } else {
        // Si no es promesa, cerramos inmediatamente
        this.close();
      }
    });
  }

  _renderLoading(isLoading) {
    if (!this._submitButton) return;
    if (isLoading) {
      this._submitButton.textContent = "Guardando...";
      this._submitButton.setAttribute("disabled", "");
    } else {
      this._submitButton.textContent = this._defaultButtonText;
      this._submitButton.removeAttribute("disabled");
    }
  }

  close() {
    super.close();
    if (this._form) this._form.reset();
  }
}


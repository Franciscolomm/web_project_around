import { closePop, butClose } from "../constants/utils.js";

export default class Popup {
  constructor(popupSelector) {
    this._popupSelector = popupSelector;
  }
  _handleEscClose(e) {
    if (e.key === "Escape") {
      closePop();
    }
  }

  open() {
    this._popupSelector.classList.add("popup_opened");
  }
  close() {
    closePop();
  }
  setEventListeners() {
    butClose.addEventListener("click", () => {
      this.close();
    });
    document.addEventListener("click", (e) => {
      const popClass = e.target.classList;
      if (popClass.contains("popup_opened")) {
        this.close();
      }
    });
    document.addEventListener("keydown", (e) => {
      this._handleEscClose(e);
    });
  }
}

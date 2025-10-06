export default class Card {
  constructor({ name, link }, templateSelector, handleCardClick) {
    this._name = name;
    this._link = link;
    this._templateSelector = templateSelector;
    this._handleCardClick = handleCardClick;
  }

  _getTemplate() {
    return document
      .querySelector(this._templateSelector)
      .content
      .querySelector('.gallery__frame')
      .cloneNode(true);
  }

  _setEventListeners() {
    this._element.querySelector('.heart').addEventListener('click', () => {
      this._element.querySelector('.heart').classList.toggle('liked');
    });

    this._element.querySelector('.gallery__delete-button').addEventListener('click', () => {
      this._element.remove();
    });

    this._element.querySelector('.gallery__image').addEventListener('click', () => {
      this._handleCardClick(this._name, this._link);
    });
  }

  generateCard() {
    this._element = this._getTemplate();
    this._element.querySelector('.gallery__image').src = this._link;
    this._element.querySelector('.gallery__image').alt = this._name;
    this._element.querySelector('.gallery__text').textContent = this._name;
    this._setEventListeners();
    return this._element;
  }
}

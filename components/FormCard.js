import Card from "./Card.js";

export default class FormCard extends Card {
  constructor(cardSelector, handleCardClick) {
    super({}, cardSelector, handleCardClick);
  }
  handleCreateCard(link, title) {
    this._name = title;
    this._link = link;
  }
}

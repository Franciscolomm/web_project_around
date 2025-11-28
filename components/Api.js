// components/Api.js
export default class Api {
  constructor(options) {
    this._baseUrl = options.baseUrl;
    this._headers = options.headers;
  }

  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Error: ${res.status}`);
  }

  // obtener info del usuario
  getUserInfo() {
    return fetch(`${this._baseUrl}/users/me`, {
      headers: {
        authorization: this._headers.authorization,
      },
    }).then((res) => this._checkResponse(res));
  }

  // obtener cartas iniciales
  getInitialCards() {
    return fetch(`${this._baseUrl}/cards`, {
      headers: {
        authorization: this._headers.authorization,
      },
    }).then((res) => this._checkResponse(res));
  }

  // Promise.all para obtener user + cards
  getAppInfo() {
    return Promise.all([this.getUserInfo(), this.getInitialCards()]);
  }

  // actualizar perfil (name, about)
  setUserInfo({ name, about }) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: {
        authorization: this._headers.authorization,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, about }),
    }).then((res) => this._checkResponse(res));
  }

  // actualizar avatar
  updateAvatar({ avatar }) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: {
        authorization: this._headers.authorization,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ avatar }),
    }).then((res) => this._checkResponse(res));
  }

  // añadir nueva tarjeta
  addCard({ name, link }) {
    return fetch(`${this._baseUrl}/cards`, {
      method: "POST",
      headers: {
        authorization: this._headers.authorization,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, link }),
    }).then((res) => this._checkResponse(res));
  }

  // eliminar tarjeta
  deleteCard(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}`, {
      method: "DELETE",
      headers: {
        authorization: this._headers.authorization,
      },
    }).then((res) => this._checkResponse(res));
  }

  // dar like
  addLike(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: "PUT",
      headers: {
        authorization: this._headers.authorization,
      },
    }).then((res) => this._checkResponse(res));
  }

  // quitar like
  removeLike(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: "DELETE",
      headers: {
        authorization: this._headers.authorization,
      },
    }).then((res) => this._checkResponse(res));
  }
}


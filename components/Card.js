// components/Card.js
let _api = null;
let _currentUserId = null;

/**
 * Registrar instancia api y userId (llamar desde index.js después de obtener user).
 * Ejemplo: setApiAndUser(api, 'a9938f63cebc25f51b1b1bee')
 */
export function setApiAndUser(apiInstance, currentUserId) {
  _api = apiInstance;
  _currentUserId = currentUserId;
}

export default class Card {
  constructor(data, cardSelector, handleCardClick) {
    this._name = data.name;
    this._link = data.link;
    this._cardSelector = cardSelector;
    this._popupImage = handleCardClick;
    // extra props from server
    this._cardId = data._id || null;
    this._ownerId = data.owner || null;
    // isLiked may come from server property isLiked OR 'likes' array; support both if present
    if (typeof data.isLiked === "boolean") {
      this._isLiked = data.isLiked;
    } else if (Array.isArray(data.likes)) {
      // some APIs return likes array; check if current user liked
      this._isLiked = !!(
        _currentUserId && data.likes.some((u) => u._id === _currentUserId || u === _currentUserId)
      );
    } else {
      this._isLiked = false;
    }
  }

  _getTemplate() {
    const cardElement = document
      .querySelector(this._cardSelector)
      .content.querySelector(".main__gallery-card")
      .cloneNode(true);

    return cardElement;
  }

  _updateLikeUI(isLiked) {
    const likeBtn = this._element.querySelector(".main__button_like");
    if (isLiked) {
      likeBtn.classList.add("main__button_like_active");
    } else {
      likeBtn.classList.remove("main__button_like_active");
    }
    this._isLiked = isLiked;
  }

  _like() {
    this._element
      .querySelector(".main__button_like")
      .addEventListener("click", (e) => {
        // si no hay api o cardId, solo toggle local (fallback)
        if (!_api || !this._cardId) {
          e.target.classList.toggle("main__button_like_active");
          return;
        }

        // en server: si está liked -> removeLike, si no -> addLike
        const likePromise = this._isLiked
          ? _api.removeLike(this._cardId)
          : _api.addLike(this._cardId);

        // opcional: bloquear botón hasta respuesta
        e.target.setAttribute("disabled", "true");

        likePromise
          .then((updatedCard) => {
            // server returns the updated card with isLiked (o similar)
            // actualizar UI según la respuesta
            // Preferir propiedad isLiked si existe, sino inferir
            const serverLiked =
              typeof updatedCard.isLiked === "boolean"
                ? updatedCard.isLiked
                : Array.isArray(updatedCard.likes) &&
                  !!updatedCard.likes.some((u) => u._id === _currentUserId || u === _currentUserId);

            this._updateLikeUI(!!serverLiked);
          })
          .catch((err) => {
            console.log("Like error:", err);
          })
          .finally(() => {
            e.target.removeAttribute("disabled");
          });
      });
  }

  _trash() {
    // Antes: eliminaba directamente this._element.remove();
    // Ahora: despacha un evento personalizado para pedir confirmación y pasa cardId
    this._element
      .querySelector(".main__button_trash")
      .addEventListener("click", () => {
        const deleteEvent = new CustomEvent("request-delete", {
          detail: { element: this._element, cardId: this._cardId },
          bubbles: true,
        });
        document.dispatchEvent(deleteEvent);
      });
  }

  _handleCardClick() {
    this._element
      .querySelector(".main__gallery-image")
      .addEventListener("click", () => {
        this._popupImage.open(this._link, this._name);
      });
  }

  _setEventsListener() {
    this._like();
    this._trash();
    this._handleCardClick();
  }

  getCreateCard() {
    this._element = this._getTemplate();
    this._setEventsListener();

    const imgEl = this._element.querySelector(".main__gallery-image");
    imgEl.src = this._link;
    imgEl.alt = this._name;
    this._element.querySelector(".main__gallery-paragraph").textContent = this._name;

    // Si owner distinto al user actual -> ocultar boton de papelera
    const trashBtn = this._element.querySelector(".main__button_trash");
    if (this._ownerId && _currentUserId && this._ownerId !== _currentUserId) {
      trashBtn.style.display = "none";
    } else {
      trashBtn.style.display = "";
    }

    // establecer estado inicial del like
    if (this._isLiked) {
      this._element.querySelector(".main__button_like").classList.add("main__button_like_active");
    } else {
      this._element.querySelector(".main__button_like").classList.remove("main__button_like_active");
    }

    return this._element;
  }
}


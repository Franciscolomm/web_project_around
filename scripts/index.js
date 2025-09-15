const initialCards = [
  { name: "Valle de Yosemite", link: "https://practicum-content.s3.us-west-1.amazonaws.com/new-markets/WEB_sprint_5/ES/yosemite.jpg" },
  { name: "Lago Louise", link: "https://practicum-content.s3.us-west-1.amazonaws.com/new-markets/WEB_sprint_5/ES/lake-louise.jpg" },
  { name: "Montañas Calvas", link: "https://practicum-content.s3.us-west-1.amazonaws.com/new-markets/WEB_sprint_5/ES/bald-mountains.jpg" },
  { name: "Latemar", link: "https://practicum-content.s3.us-west-1.amazonaws.com/new-markets/WEB_sprint_5/ES/latemar.jpg" },
  { name: "Parque Nacional de la Vanoise", link: "https://practicum-content.s3.us-west-1.amazonaws.com/new-markets/WEB_sprint_5/ES/vanoise.jpg" },
  { name: "Lago di Braies", link: "https://practicum-content.s3.us-west-1.amazonaws.com/new-markets/WEB_sprint_5/ES/lago.jpg" }
];

const gallery = document.querySelector(".gallery");
const addCardButton = document.querySelector(".profile__add-button");
const addCardPopup = document.querySelector(".popup_add-card");
const addCardForm = document.querySelector(".popup__form-add");
const addCardCloseButton = addCardPopup.querySelector(".popup__close-button");

const imagePopup = document.querySelector(".popup_image");
const popupBigImage = imagePopup.querySelector(".popup__big-image");
const popupCaption = imagePopup.querySelector(".popup__caption");
const imagePopupCloseButton = imagePopup.querySelector(".popup__close-button");

const profileName = document.querySelector(".profile__name");
const profileRole = document.querySelector(".profile__role");
const editProfileButton = document.querySelector(".profile__edit-button");
const editProfilePopup = document.querySelector(".popup_edit");
const editProfileForm = editProfilePopup.querySelector(".popup__form-edit");
const editProfileCloseButton = editProfilePopup.querySelector(".popup__close-button");
const nameInput = editProfileForm.querySelector(".popup__name");
const aboutInput = editProfileForm.querySelector(".popup__about");

function openPopup(popup) {
  popup.classList.add("popup_show");
}

function closePopup(popup) {
  popup.classList.remove("popup_show");
}

function createCard(name, link) {
  const cardElement = document.createElement("div");
  cardElement.classList.add("gallery__frame");

  cardElement.innerHTML = `
    <img src="${link}" alt="${name}" class="gallery__image" />
    <button class="gallery__delete-button"></button>
    <p class="gallery__text">${name}</p>
    <span class="heart">&#10084;</span>
  `;

  const likeButton = cardElement.querySelector(".heart");
  likeButton.addEventListener("click", () => {
    likeButton.classList.toggle("liked");
  });

  const deleteButton = cardElement.querySelector(".gallery__delete-button");
  deleteButton.addEventListener("click", () => {
    cardElement.remove();
  });

  const image = cardElement.querySelector(".gallery__image");
  image.addEventListener("click", () => {
    popupBigImage.src = link;
    popupBigImage.alt = name;
    popupCaption.textContent = name;
    openPopup(imagePopup);
  });

  return cardElement;
}

initialCards.forEach(card => {
  const cardElement = createCard(card.name, card.link);
  gallery.append(cardElement);
});

addCardButton.addEventListener("click", () => {
  openPopup(addCardPopup);
});
addCardCloseButton.addEventListener("click", () => {
  closePopup(addCardPopup);
});
addCardForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const titleInput = addCardForm.querySelector(".popup__input-title");
  const linkInput = addCardForm.querySelector(".popup__input-link");

  const newCard = createCard(titleInput.value, linkInput.value);
  gallery.prepend(newCard);

  addCardForm.reset();
  closePopup(addCardPopup);
});

imagePopupCloseButton.addEventListener("click", () => {
  closePopup(imagePopup);
});

editProfileButton.addEventListener("click", () => {
  nameInput.value = profileName.textContent;
  aboutInput.value = profileRole.textContent;
  openPopup(editProfilePopup);
});

editProfileForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  profileName.textContent = nameInput.value;
  profileRole.textContent = aboutInput.value;
  closePopup(editProfilePopup);
});

editProfileCloseButton.addEventListener("click", () => {
  closePopup(editProfilePopup);
});

document.querySelectorAll(".popup").forEach((popup) => {
  popup.addEventListener("mousedown", (evt) => {
    if (evt.target === popup) {
      closePopup(popup);
    }
  });
});

document.addEventListener("keydown", (evt) => {
  if (evt.key === "Escape") {
    const openedPopup = document.querySelector(".popup_show");
    if (openedPopup) {
      closePopup(openedPopup);
    }
  }
});



import {ads} from './data.js';
import {AD_TYPES_RU, AD_FEATURES, AD_COUNT} from './constants.js';

const map = document.querySelector('#map-canvas');
const cardTemplate = document.querySelector('#card').content;

const setSimpleProperties = (card, info) => {
  const cardProperties = [
    {
      name: 'title',
      initValue: info.offer.title,
      setValue: info.offer.title,
      querySelector: '.popup__title',
      property: 'textContent',
    },
    {
      name: 'address',
      initValue: info.offer.address,
      setValue: info.offer.address,
      querySelector: '.popup__text--address',
      property: 'textContent',
    },
    {
      name: 'price',
      initValue: info.offer.address,
      setValue: `${info.offer.price} <span>₽/ночь</span>`,
      querySelector: '.popup__text--price',
      property: 'innerHTML',
    },
    {
      name: 'type',
      initValue: info.offer.type,
      setValue: AD_TYPES_RU[info.offer.type],
      querySelector: '.popup__type',
      property: 'textContent',
    },
    {
      name: 'capacity',
      initValue: info.offer.rooms && info.offer.guests,
      setValue: `${info.offer.rooms} комнаты для ${info.offer.guests} гостей`,
      querySelector: '.popup__text--capacity',
      property: 'textContent',
    },
    {
      name: 'time',
      initValue: info.offer.checkin && info.offer.checkout,
      setValue: `Заезд после ${info.offer.checkin}, выезд до ${info.offer.checkout}`,
      querySelector: '.popup__text--time',
      property: 'textContent',
    },
    {
      name: 'description',
      initValue: info.offer.description,
      setValue: info.offer.description,
      querySelector: '.popup__description',
      property: 'textContent',
    },
    {
      name: 'avatar',
      initValue: info.author.avatar,
      setValue: info.author.avatar,
      querySelector: '.popup__avatar',
      property: 'src',
    },
  ];

  for (const cardProperty of cardProperties) {
    if (cardProperty.initValue) {
      card.querySelector(cardProperty.querySelector)[cardProperty.property] = cardProperty.setValue;
    } else {
      card.querySelector(cardProperty.querySelector).remove();
    }
  }
};

const setFeatures = (card, info) => {
  const featuresContainer = card.querySelector('.popup__features');
  const features = info.offer.features;
  const unusedFeatures = AD_FEATURES.filter((feature) => !features.includes(feature));

  if (features.length) {
    for (const unusedFeature of unusedFeatures) {
      featuresContainer.querySelector(`[class*="--${unusedFeature}"]`).remove();
    }
  } else {
    featuresContainer.remove();
  }

};

const setImages = (card, info) => {
  const imageContainer = card.querySelector('.popup__photos');
  const imagePaths = info.offer.photos;

  if (imagePaths.length) {
    for (const imagePath of imagePaths) {
      const cardImage = card.querySelector('.popup__photo').cloneNode();

      cardImage.src = imagePath;
      imageContainer.appendChild(cardImage);
    }

    imageContainer.children[0].remove();
  } else {
    imageContainer.remove();
  }

};

const createCard = (info) => {
  const card = cardTemplate.cloneNode(true);

  setSimpleProperties(card, info);
  setFeatures(card, info);
  setImages(card, info);

  return card;
};

const createCards = (count) => {
  const cards = document.createDocumentFragment();

  for (let index = 0; index < count; index++) {
    cards.appendChild(createCard(ads[index]));
  }

  map.appendChild(cards);
};

createCards(AD_COUNT);

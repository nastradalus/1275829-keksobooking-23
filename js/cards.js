import {ads} from './data.js';
import {AD_TYPES_RU, AD_FEATURES} from './constants.js';

const mapContainer = document.querySelector('#map-canvas');
const cardTemplateContainer = document.querySelector('#card').content;

const setSimpleProperties = (card, info) => {
  const cardProperties = [
    {
      initValue: info.offer.title,
      setValue: info.offer.title,
      selector: '.popup__title',
      attribute: 'textContent',
    },
    {
      initValue: info.offer.address,
      setValue: info.offer.address,
      selector: '.popup__text--address',
      attribute: 'textContent',
    },
    {
      initValue: info.offer.address,
      setValue: `${info.offer.price} ₽/ночь`,
      selector: '.popup__text--price',
      attribute: 'textContent',
    },
    {
      initValue: info.offer.type,
      setValue: AD_TYPES_RU[info.offer.type],
      selector: '.popup__type',
      attribute: 'textContent',
    },
    {
      initValue: info.offer.rooms && info.offer.guests,
      setValue: `${info.offer.rooms} комнаты для ${info.offer.guests} гостей`,
      selector: '.popup__text--capacity',
      attribute: 'textContent',
    },
    {
      initValue: info.offer.checkin && info.offer.checkout,
      setValue: `Заезд после ${info.offer.checkin}, выезд до ${info.offer.checkout}`,
      selector: '.popup__text--time',
      attribute: 'textContent',
    },
    {
      initValue: info.offer.description,
      setValue: info.offer.description,
      selector: '.popup__description',
      attribute: 'textContent',
    },
    {
      initValue: info.author.avatar,
      setValue: info.author.avatar,
      selector: '.popup__avatar',
      attribute: 'src',
    },
  ];

  for (const cardProperty of cardProperties) {
    const propertyContainer = card.querySelector(cardProperty.selector);

    if (cardProperty.initValue && propertyContainer) {
      propertyContainer[cardProperty.attribute] = cardProperty.setValue;
    } else {
      propertyContainer.remove();
    }
  }
};

const setFeaturesProperty = (card, info) => {
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

const setImagesProperty = (card, data) => {
  const imageContainer = card.querySelector('.popup__photos');
  const imagePaths = data.offer.photos;

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

const createCard = (dataElement) => {
  const cardContainer = cardTemplateContainer.cloneNode(true);

  setSimpleProperties(cardContainer, dataElement);
  setFeaturesProperty(cardContainer, dataElement);
  setImagesProperty(cardContainer, dataElement);

  return cardContainer;
};

const createCards = (dataElements) => {
  const cardsContainer = document.createDocumentFragment();

  for (let index = 0; index < dataElements.length; index++) {
    cardsContainer.appendChild(createCard(dataElements[index]));
  }

  return cardsContainer;
};

mapContainer.appendChild(createCards(ads));

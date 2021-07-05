import {AD_TYPES_RU, AD_FEATURES} from './constants.js';

const cardTemplateContainer = document.querySelector('#card').content;

const setSimpleProperties = (card, data) => {
  const cardProperties = [
    {
      initValue: data.offer.title,
      setValue: data.offer.title,
      selector: '.popup__title',
      attribute: 'textContent',
    },
    {
      initValue: data.offer.address,
      setValue: data.offer.address,
      selector: '.popup__text--address',
      attribute: 'textContent',
    },
    {
      initValue: data.offer.address,
      setValue: `${data.offer.price} ₽/ночь`,
      selector: '.popup__text--price',
      attribute: 'textContent',
    },
    {
      initValue: data.offer.type,
      setValue: AD_TYPES_RU[data.offer.type],
      selector: '.popup__type',
      attribute: 'textContent',
    },
    {
      initValue: data.offer.rooms && data.offer.guests,
      setValue: `${data.offer.rooms} комнаты для ${data.offer.guests} гостей`,
      selector: '.popup__text--capacity',
      attribute: 'textContent',
    },
    {
      initValue: data.offer.checkin && data.offer.checkout,
      setValue: `Заезд после ${data.offer.checkin}, выезд до ${data.offer.checkout}`,
      selector: '.popup__text--time',
      attribute: 'textContent',
    },
    {
      initValue: data.offer.description,
      setValue: data.offer.description,
      selector: '.popup__description',
      attribute: 'textContent',
    },
    {
      initValue: data.author.avatar,
      setValue: data.author.avatar,
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

const setFeaturesProperty = (card, data) => {
  const featuresContainer = card.querySelector('.popup__features');
  const cardFeatures = data.offer.features;
  const unusedFeatures = AD_FEATURES.filter((feature) => !cardFeatures.includes(feature));

  if (cardFeatures.length) {
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

export {createCard};

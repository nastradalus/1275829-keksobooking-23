import {
  AD_NAMES,
  AD_DESCRIPTIONS,
  AD_TYPES,
  AD_CHECKIN_TIMES,
  AD_CHECKOUT_TIMES,
  AD_FEATURES,
  AD_PHOTOS
} from './constants.js';

import {
  getRandomPositiveFloat,
  getRandomPositiveInteger,
  getRandomArrayElement,
  getRandomArrayElements
} from './utils.js';

export const createAd = (index) => {
  const latValue = getRandomPositiveFloat(35.65000, 35.70000, 5);
  const lngValue = getRandomPositiveFloat(139.70000, 139.80000, 5);

  return {
    author: {
      avatar: (index + 1 <= 8) ? `img/avatars/user0${index + 1}.png` : '',
    },
    offer: {
      title: AD_NAMES[index],
      address: `${latValue}, ${lngValue}`,
      price: getRandomPositiveInteger(0, 10000),
      type: getRandomArrayElement(AD_TYPES),
      rooms: getRandomPositiveInteger(0, 10),
      guests: getRandomPositiveInteger(0, 5),
      checkin: getRandomArrayElement(AD_CHECKIN_TIMES),
      checkout: getRandomArrayElement(AD_CHECKOUT_TIMES),
      features: getRandomArrayElements(AD_FEATURES),
      description: AD_DESCRIPTIONS[index],
      photos: getRandomArrayElements(AD_PHOTOS),
    },
    location: {
      lat: latValue,
      lng: lngValue,
    },
  };
};

import {getRandomPositiveInteger} from '/js/utils/get-random-positive-integer.js';
import {getRandomPositiveFloat} from '/js/utils/get-random-positive-float.js';

const AD_NAMES = [
  'ОливаАрт',
  'Эсмеральда',
  'Пушка Инн',
  'Охтинская',
  'Окунёвая',
  'ИжПарк',
  'Ривьера',
  'Сальвадор',
  'SkyPort',
  'СКИ ИНН',
];
const AD_DESCRIPTIONS = [
  'Новый современный отель в Алуште',
  'Отель все включено «Эмеральд» готов предложить своим гостям отличный, комфортный отдых в Витязево',
  'Отель «Пушка ИНН» возрождает традиции Петербургского гостеприимства',
  'Приглашаем вас в отель Охтинская – на берегу Невы вы отлично проведете время',
  'База Отдыха Окунёвая расположилась в Ленинградской области, на берегу живописной Дубковой бухты Финского залива',
  '«Парк-Отель» - мини-отель категории 5 звёзд с 11 просторными номерами',
  '«Ривьера» - четырехзвездочный отель в центре Казани на набережной реки Казанка',
  'Отличный отель второй пляжной линии на Толстом мысе',
  'Отель SKYPORT 4* расположен в 300 метрах от Международного аэропорта «Толмачево»',
  'Самое сердце горного курорта «Роза Хутор» на высоте 1170 метров',
];

const AD_TYPES = ['palace', 'flat', 'house', 'bungalow', 'hotel'];
const AD_CHECKIN_TIMES = ['12:00', '13:00', '14:00'];
const AD_CHECKOUT_TIMES = ['12:00', '13:00', '14:00'];
const AD_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
const AD_PHOTOS = [
  'https://assets.htmlacademy.ru/content/intensive/javascript-1/keksobooking/duonguyen-8LrGtIxxa4w.jpg',
  'https://assets.htmlacademy.ru/content/intensive/javascript-1/keksobooking/brandon-hoogenboom-SNxQGWxZQi0.jpg',
  'https://assets.htmlacademy.ru/content/intensive/javascript-1/keksobooking/claire-rendall-b6kAwr1i0Iw.jpg',
];

const AD_COUNT = 10;

function getRandomArrayElement(array) {
  return array[getRandomPositiveInteger(0, array.length - 1)];
}

function getRandomArrayElements(array) {
  const count = getRandomPositiveInteger(0, array.length - 1);
  const shuffledArray = array.sort(() => 0.5 - Math.random());

  return shuffledArray.slice(0, count);
}

const createAd = (index) => {
  const latValue = getRandomPositiveFloat(35.65000, 35.70000, 5);
  const lngValue = getRandomPositiveFloat(139.70000, 139.80000, 5);

  return {
    author: {
      avatar: (index <= 8) ? `img/avatars/user0${index}.png` : '',
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

const ads = new Array(AD_COUNT).fill(null).map((value, index) => createAd(index + 1));

// eslint-disable-next-line no-console
console.log(ads);

import {enablePage, updateAddress} from './form.js';
import {roundFloat} from './utils.js';
import {ads} from './data.js';
import {createCard} from './cards.js';

const START_LAT = 35.68950;
const START_LNG = 139.69171;
const MAP_ZOOM = 12;

const ICON_MAIN_PATH = '/img/main-pin.svg';
const ICON_MAIN_WIDTH = 52;
const ICON_MAIN_HEIGHT = 52;
const ICON_MAIN_TIP_X = 26;
const ICON_MAIN_TIP_Y = 52;

const ICON_CARD_PATH = '/img/pin.svg';
const ICON_CARD_WIDTH = 40;
const ICON_CARD_HEIGHT = 40;
const ICON_CARD_TIP_X = 20;
const ICON_CARD_TIP_Y = 40;

const map = L.map('map-canvas')
  .on('load', () => {
    enablePage();
    updateAddress(START_LAT, START_LNG);
  })
  .setView({
    lat: START_LAT,
    lng: START_LNG,
  }, MAP_ZOOM);

L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
).addTo(map);

const mainPinIcon = L.icon({
  iconUrl: ICON_MAIN_PATH,
  iconSize: [ICON_MAIN_WIDTH, ICON_MAIN_HEIGHT],
  iconAnchor: [ICON_MAIN_TIP_X, ICON_MAIN_TIP_Y],
});

const mainMarker = L.marker(
  {
    lat: START_LAT,
    lng: START_LNG,
  },
  {
    draggable: true,
    icon: mainPinIcon,
  },
);

mainMarker.addTo(map);

mainMarker.on('moveend', (evt) => {
  const coordinate = evt.target.getLatLng();
  updateAddress(roundFloat(coordinate.lat), roundFloat(coordinate.lng));
});

const createMarker = (ad) => {
  const {location: {lat, lng}} = ad;
  const icon = L.icon({
    iconUrl: ICON_CARD_PATH,
    iconSize: [ICON_CARD_WIDTH, ICON_CARD_HEIGHT],
    iconAnchor: [ICON_CARD_TIP_X, ICON_CARD_TIP_Y],
  });

  const cardMarker = L.marker(
    {
      lat,
      lng,
    },
    {
      icon,
    },
  );

  cardMarker
    .addTo(map)
    .bindPopup(
      createCard(ad),
      {
        keepInView: true,
      },
    );
};

ads.forEach((ad) => {
  createMarker(ad);
});

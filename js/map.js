import {enableAdForm, enableMapFilter, updateAddress} from './form.js';
import {roundFloat} from './utils.js';
import {createCard} from './cards.js';
import {createFetch} from './create-fetch.js';

const map = L.map('map-canvas');
const dataErrorLoadContainer = document.querySelector('#data-error').content;
const messageContainer = document.querySelector('#map-message');

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

const showAdsLoadError = () => {
  messageContainer.appendChild(dataErrorLoadContainer);
};

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
      () => createCard(ad),
      {
        keepInView: true,
      },
    );
};

const getAds = createFetch(
  (ads) => {
    enableMapFilter();
    ads.forEach((ad) => {
      createMarker(ad);
    });
  },
  (error) => {
    showAdsLoadError();
    throw new Error(`${error}`);
  });

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

mainMarker.on('moveend', (event) => {
  const coordinate = event.target.getLatLng();
  updateAddress(roundFloat(coordinate.lat), roundFloat(coordinate.lng));
});

const setupMap = () => {
  L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
  ).addTo(map);

  mainMarker.addTo(map);
  getAds.then();
};

const initMap = () => {
  map.on('load', () => {
    setupMap();
    enableAdForm();
    updateAddress(START_LAT, START_LNG);
  })
    .setView({
      lat: START_LAT,
      lng: START_LNG,
    }, MAP_ZOOM);
};

const setInitMapState = () => {
  mainMarker.setLatLng({
    lat: START_LAT,
    lng: START_LNG,
  });

  mainMarker.fire('moveend');

  map.setView({
    lat: START_LAT,
    lng: START_LNG,
  }, MAP_ZOOM);
};

export {setInitMapState, initMap};

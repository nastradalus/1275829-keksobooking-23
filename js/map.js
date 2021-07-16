import {enableAdForm, enableMapFilter, updateAddress} from './form.js';
import {roundFloat} from './utils.js';
import {createCard} from './cards.js';
import {getAdsFromServer} from './create-fetch.js';
import {filterAds} from './filter.js';

const map = L.map('map-canvas');
const markerGroup = L.layerGroup();

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

const dataErrorLoadContainer = document.querySelector('#data-error').content;
const messageContainer = document.querySelector('#map-message');

const showAdsLoadError = () => {
  messageContainer.appendChild(dataErrorLoadContainer);
};

const createMarker = (ad) => {
  const icon = L.icon({
    iconUrl: ICON_CARD_PATH,
    iconSize: [ICON_CARD_WIDTH, ICON_CARD_HEIGHT],
    iconAnchor: [ICON_CARD_TIP_X, ICON_CARD_TIP_Y],
  });

  const cardMarker = L.marker(
    ad.location,
    {
      icon,
    },
  );

  cardMarker
    .addTo(markerGroup)
    .bindPopup(
      () => createCard(ad),
      {
        keepInView: true,
      },
    );
};

mainMarker.on('moveend', (evt) => {
  const coordinate = evt.target.getLatLng();
  updateAddress(roundFloat(coordinate.lat), roundFloat(coordinate.lng));
});

const addMarkers = (ads) => {
  markerGroup.clearLayers();

  ads.forEach((ad) => {
    createMarker(ad);
  });
};

const setupMap = () => {
  L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
  ).addTo(map);

  markerGroup.addTo(map);
  mainMarker.addTo(map);

  getAdsFromServer(
    (ads) => {
      enableMapFilter();
      addMarkers(filterAds(ads));
    },
    () => {
      showAdsLoadError();
    });
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

export {setInitMapState, initMap, addMarkers, showAdsLoadError};

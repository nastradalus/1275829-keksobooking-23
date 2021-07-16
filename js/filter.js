import {getAdsFromServer} from './create-fetch.js';
import {addMarkers, showAdsLoadError} from './map.js';

const filterContainers = document.querySelectorAll('.map__filters select, .map__filters input');
const filterFormContainer = document.querySelector('.map__filters');

const filterTypeContainer = document.querySelector('#housing-type');
const filterPriceContainer = document.querySelector('#housing-price');
const filterRoomsContainer = document.querySelector('#housing-rooms');
const filterGuestsContainer = document.querySelector('#housing-guests');
const filterFeaturesContainers = [...document.querySelectorAll('#housing-features input')];

const DELAY = 500;
const MAX_COUNT = 10;
const ALL_OPTIONS = 'any';
const PRICE_VALUES = {
  middle: {
    min: 10000,
    max: 50000,
  },
  low: {
    min: 0,
    max: 10000,
  },
  high: {
    min: 50000,
    max: Infinity,
  },
  any: {
    min: 0,
    max: Infinity,
  },
};

let timerId = 0;

const filterTypeCondition = ({offer: {type}}, filterValue) => filterValue === ALL_OPTIONS || type === filterValue;
const filterPriceCondition = ({offer: {price}}, filterValue, maxValue, minValue) => filterValue === ALL_OPTIONS || (price <= maxValue && price >= minValue);
const filterRoomsCondition = ({offer: {rooms}}, filterValue) => filterValue === ALL_OPTIONS || rooms === +filterValue;
const filterGuestsCondition = ({offer: {guests}}, filterValue) => filterValue === ALL_OPTIONS || guests === +filterValue;
const filterFeaturesCondition = ({offer: {features}}) => {
  const adFeatures = features || [];
  const filterFeatures = filterFeaturesContainers
    .map((filterFeaturesContainer) => (filterFeaturesContainer.checked) ? filterFeaturesContainer.value : '')
    .filter((feature) => feature !== '');

  return filterFeatures.every((filterFeature) => adFeatures.includes(filterFeature));
};

const filterAds = (ads) => {
  const filterType = filterTypeContainer.value;
  const filterPrice = filterPriceContainer.value;
  const filterRooms = filterRoomsContainer.value;
  const filterGuests = filterGuestsContainer.value;

  const maxPrice = PRICE_VALUES[filterPrice].max;
  const minPrice = PRICE_VALUES[filterPrice].min;

  const filteredAds = [];

  for (const ad of ads) {
    if (filterTypeCondition(ad, filterType)
      && filterPriceCondition(ad, filterPrice, maxPrice, minPrice)
      && filterRoomsCondition(ad, filterRooms)
      && filterGuestsCondition(ad, filterGuests)
      && filterFeaturesCondition(ad)) {
      filteredAds.push(ad);

      if (filteredAds.length >= MAX_COUNT) {
        break;
      }
    }
  }

  return filteredAds;
};

const filterChangeAndResetHandler = () => {
  clearTimeout(timerId);
  timerId = setTimeout(() => {
    getAdsFromServer(
      (ads) => {
        addMarkers(filterAds(ads));
      },
      () => {
        showAdsLoadError();
      });
  }, DELAY);
};

filterFormContainer.addEventListener('reset', filterChangeAndResetHandler);

filterContainers.forEach((filterContainer) => {
  filterContainer.addEventListener('change', filterChangeAndResetHandler);
});

export {filterAds};

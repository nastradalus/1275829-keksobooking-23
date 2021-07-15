import {getAdsFromServer} from './create-fetch.js';
import {addMarkers, showAdsLoadError} from './map.js';

const filterContainers = document.querySelectorAll('.map__filters select, .map__filters input');

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

const filterAds = (ads) => {
  const filterType = filterTypeContainer.value;
  const filterPrice = filterPriceContainer.value;
  const filterRooms = filterRoomsContainer.value;
  const filterGuests = filterGuestsContainer.value;

  const maxPrice = PRICE_VALUES[filterPrice].max;
  const minPrice = PRICE_VALUES[filterPrice].min;

  const filterTypeCondition = ({offer: {type}}) => filterType === ALL_OPTIONS || type === filterType;
  const filterPriceCondition = ({offer: {price}}) => filterPrice === ALL_OPTIONS || (price <= maxPrice && price >= minPrice);
  const filterRoomsCondition = ({offer: {rooms}}) => filterRooms === ALL_OPTIONS || rooms === +filterRooms;
  const filterGuestsCondition = ({offer: {guests}}) => filterGuests === ALL_OPTIONS || guests === +filterGuests;
  const filterFeaturesCondition = ({offer: {features}}) => {
    const adFeatures = features || [];
    const filterFeatures = filterFeaturesContainers
      .map((filterFeaturesContainer) => (filterFeaturesContainer.checked) ? filterFeaturesContainer.value : '')
      .filter((feature) => feature !== '');

    return filterFeatures.every((filterFeature) => adFeatures.includes(filterFeature));
  };

  const filteredAds = [];

  for (const ad of ads) {
    if (filterTypeCondition(ad) && filterPriceCondition(ad) && filterRoomsCondition(ad) && filterGuestsCondition(ad) && filterFeaturesCondition(ad)) {
      filteredAds.push(ad);

      if (filteredAds.length >= MAX_COUNT) {
        break;
      }
    }
  }

  return filteredAds;
};

const filterChangeHandler = () => {
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

filterContainers.forEach((filterContainer) => {
  filterContainer.addEventListener('change', filterChangeHandler);
});

export {filterAds};

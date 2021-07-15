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

  return ads
    .filter((ad) => filterType === ALL_OPTIONS || ad.offer.type === filterType)
    .filter((ad) => filterPrice === ALL_OPTIONS || (ad.offer.price <= maxPrice && ad.offer.price >= minPrice))
    .filter((ad) => filterRooms === ALL_OPTIONS || ad.offer.rooms === +filterRooms)
    .filter((ad) => filterGuests === ALL_OPTIONS || ad.offer.guests === +filterGuests)
    .filter((ad) => {
      const adFeatures = ad.offer.features || [];
      const requiredFeatures = filterFeaturesContainers
        .map((filterFeaturesContainer) => (filterFeaturesContainer.checked) ? filterFeaturesContainer.value : '')
        .filter((feature) => feature !== '');

      return requiredFeatures.every((requiredFeature) => adFeatures.includes(requiredFeature));
    })
    .slice(0, MAX_COUNT);
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

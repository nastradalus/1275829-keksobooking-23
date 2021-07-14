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
};

let timerId = 0;

const filterAds = (ads) =>
  ads
    .filter((ad) => filterTypeContainer.value === ALL_OPTIONS || ad.offer.type === filterTypeContainer.value)
    .filter((ad) => filterPriceContainer.value === ALL_OPTIONS
      || (ad.offer.price <= PRICE_VALUES[filterPriceContainer.value].max
        && ad.offer.price >= PRICE_VALUES[filterPriceContainer.value].min))
    .filter((ad) => filterRoomsContainer.value === ALL_OPTIONS || ad.offer.rooms === +filterRoomsContainer.value)
    .filter((ad) => filterGuestsContainer.value === ALL_OPTIONS || ad.offer.guests === +filterGuestsContainer.value)
    .filter((ad) => {
      const adFeatures = ad.offer.features || [];
      const requiredFeatures = filterFeaturesContainers
        .map((filterFeaturesContainer) => (filterFeaturesContainer.checked) ? filterFeaturesContainer.value : '')
        .filter((feature) => feature !== '');

      for (const requiredFeature of requiredFeatures) {
        if (!adFeatures.includes(requiredFeature)) {
          return false;
        }
      }

      return true;
    })
    .slice(0, MAX_COUNT);

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

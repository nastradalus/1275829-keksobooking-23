import {AD_COUNT} from './constants.js';
import {createAd} from './data.js';

const ads = new Array(AD_COUNT).fill(null).map((value, index) => createAd(index));

// eslint-disable-next-line no-console
console.log(ads);

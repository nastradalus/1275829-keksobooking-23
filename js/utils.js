export function getRandomPositiveFloat (min, max, digits = 1) {
  const lower = Math.min(Math.abs(min), Math.abs(max));
  const upper = Math.max(Math.abs(min), Math.abs(max));
  const result = Math.random() * (upper - lower) + lower;

  return +result.toFixed(digits);
}

export function getRandomPositiveInteger (min, max) {
  const lower = Math.ceil(Math.min(Math.abs(min), Math.abs(max)));
  const upper = Math.floor(Math.max(Math.abs(min), Math.abs(max)));
  const result = Math.random() * (upper - lower + 1) + lower;

  return +Math.floor(result);
}

export function getRandomArrayElement(array) {
  return array[getRandomPositiveInteger(0, array.length - 1)];
}

export function getRandomArrayElements(array) {
  const count = getRandomPositiveInteger(0, array.length - 1);
  const shuffledArray = array.sort(() => 0.5 - Math.random());

  return shuffledArray.slice(0, count);
}

export function roundFloat(float) {
  return +float.toFixed(5);
}

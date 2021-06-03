function getRandomInteger(min, max) {
  if (min > max || min < 0 || max < 0) {
    return NaN;
  }

  min = Math.ceil(min);
  max = Math.floor(max);

  if (min === max) {
    return min;
  }

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min, max, round) {
  if (min > max || min < 0 || max < 0 || round < 1 || round % 1 !== 0) {
    return NaN;
  }

  if (min === max) {
    return +min.toFixed(round);
  }

  return +(Math.random() * (max - min) + min).toFixed(round);
}

getRandomInteger(0, 1);
getRandomFloat(0, 1, 2);

function getRandomNumber(min, max, round = 0) {
  if (typeof min !== 'number' || typeof max !== 'number' || typeof round !== 'number' || min > max || min < 0 || max < 0 || round < 0 || round % 1 !== 0) {
    return NaN;
  }

  if (min === max) {
    if (round === 0) {
      return (min % 1 !== 0) ? NaN : min;
    }

    return +min.toFixed(round);
  }

  if (round === 0) {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  return +(Math.random() * (max - min) + min).toFixed(round);
}

getRandomNumber(0, 1, 2);

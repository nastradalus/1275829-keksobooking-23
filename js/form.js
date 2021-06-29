const formContainer = document.querySelector('.ad-form');
const formControlsContainers = document.querySelectorAll('.ad-form-header, .ad-form__element');
const mapFiltersContainer = document.querySelector('.map__filters');
const mapFiltersControlsContainers = document.querySelectorAll('.map__filter, .map__checkbox');

const formDisableClass = 'ad-form--disabled';
const mapFiltersDisableClass = 'map__filters--disabled';

const formTitleContainer = document.querySelector('#title');
const formTypeContainer = document.querySelector('#type');
const formPriceContainer = document.querySelector('#price');
const formTimeInContainer = document.querySelector('#timein');
const formTimeOutContainer = document.querySelector('#timeout');
const formRoomNumberContainer = document.querySelector('#room_number');
const formCapacityContainer = document.querySelector('#capacity');

const typePrice = {
  bungalow: 0,
  flat: 1000,
  hotel: 3000,
  house: 5000,
  palace: 10000,
};

const disablePage = () => {
  formContainer.classList.add(formDisableClass);
  mapFiltersContainer.classList.add(mapFiltersDisableClass);

  for (const formControlsContainer of formControlsContainers) {
    formControlsContainer.disabled = true;
  }

  for (const mapFiltersControlsContainer of mapFiltersControlsContainers) {
    mapFiltersControlsContainer.disabled = true;
  }
};

const enablePage = () => {
  formContainer.classList.remove(formDisableClass);
  mapFiltersContainer.classList.remove(mapFiltersDisableClass);

  for (const formControlsContainer of formControlsContainers) {
    formControlsContainer.disabled = false;
  }

  for (const mapFiltersControlsContainer of mapFiltersControlsContainers) {
    mapFiltersControlsContainer.disabled = false;
  }
};

disablePage();
setTimeout(enablePage, 1000);

formTitleContainer.addEventListener('input', () => {
  const valueLength = formTitleContainer.value.length;
  const minValueLength = +formTitleContainer.minLength;
  const maxValueLength = +formTitleContainer.maxLength;

  if (valueLength < minValueLength) {
    formTitleContainer.setCustomValidity(`Ещё ${minValueLength - valueLength} симв.`);
  } else if (valueLength > maxValueLength) {
    formTitleContainer.setCustomValidity(`Удалите лишние ${valueLength - maxValueLength} симв.`);
  } else {
    formTitleContainer.setCustomValidity('');
  }

  formTitleContainer.reportValidity();
});

formTypeContainer.addEventListener('change', () => {
  const typeMinPrice = typePrice[formTypeContainer.value];

  formPriceContainer.min = typeMinPrice;
  formPriceContainer.placeholder = typeMinPrice;
});

formPriceContainer.addEventListener('input', () => {
  const value = +formPriceContainer.value;
  const minValue = +formPriceContainer.min;
  const maxValue = +formPriceContainer.max;

  if (value < minValue) {
    formPriceContainer.setCustomValidity(`Минимальная цена - ${minValue} руб.`);
  } else if (value > maxValue) {
    formPriceContainer.setCustomValidity(`Максимальная цена - ${maxValue} руб.`);
  } else {
    formPriceContainer.setCustomValidity('');
  }

  formPriceContainer.reportValidity();
});

formTimeInContainer.addEventListener('change', () => {
  formTimeOutContainer.value = formTimeInContainer.value;
});

formTimeOutContainer.addEventListener('change', () => {
  formTimeInContainer.value = formTimeOutContainer.value;
});

formCapacityContainer.addEventListener('change', () => {
  const capacityValue = +formCapacityContainer.value;
  const roomValue = +formRoomNumberContainer.value;

  if (roomValue !== 100 && (capacityValue > roomValue || capacityValue === 0)) {
    formCapacityContainer.setCustomValidity(`Для текущего количества комнат возможное количество гостей: не меньше 1 и не больше ${roomValue}`);
  } else if (roomValue === 100 && capacityValue !== 0) {
    formCapacityContainer.setCustomValidity('100 комнат не для гостей');
  } else {
    formCapacityContainer.setCustomValidity('');
  }

  formCapacityContainer.reportValidity();
});

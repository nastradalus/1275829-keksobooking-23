import {sendFormData} from './create-fetch.js';
import {setInitMapState} from './map.js';

const formContainer = document.querySelector('.ad-form');
const formControlsContainers = document.querySelectorAll('.ad-form-header, .ad-form__element');
const mapFiltersContainer = document.querySelector('.map__filters');
const mapFiltersControlsContainers = document.querySelectorAll('.map__filter, .map__checkbox');

const formResetContainer = document.querySelector('.ad-form__reset');
const messageContainer = {
  success: document.querySelector('#success').content.querySelector('.success'),
  error: document.querySelector('#error').content.querySelector('.error'),
};

const formDisableClass = 'ad-form--disabled';
const mapFiltersDisableClass = 'map__filters--disabled';

const formTitleContainer = document.querySelector('#title');
const formTypeContainer = document.querySelector('#type');
const formPriceContainer = document.querySelector('#price');
const formTimeInContainer = document.querySelector('#timein');
const formTimeOutContainer = document.querySelector('#timeout');
const formRoomNumberContainer = document.querySelector('#room_number');
const formCapacityContainer = document.querySelector('#capacity');
const formAddressContainer = document.querySelector('#address');
const formAvatarContainer = document.querySelector('#avatar');
const formPhotoContainer = document.querySelector('#images');

const formAvatarHolderContainer = document.querySelector('.ad-form-header__preview');
const formPhotoHolderContainer = document.querySelector('.ad-form__photo');

const typePrice = {
  bungalow: 0,
  flat: 1000,
  hotel: 3000,
  house: 5000,
  palace: 10000,
};

const MAX_ROOMS = 100;
const MIN_CAPACITY = 0;

const FILE_TYPES = ['jpg', 'png'];

const disablePage = () => {
  formContainer.classList.add(formDisableClass);
  mapFiltersContainer.classList.add(mapFiltersDisableClass);

  formControlsContainers.forEach((formControlContainer) => formControlContainer.disabled = true);
  mapFiltersControlsContainers.forEach((mapFiltersControlsContainer) => mapFiltersControlsContainer.disabled = true);
};

const enableMapFilter = () => {
  mapFiltersContainer.classList.remove(mapFiltersDisableClass);
  mapFiltersControlsContainers.forEach((mapFiltersControlsContainer) => mapFiltersControlsContainer.disabled = false);
};

const enableAdForm = () => {
  formContainer.classList.remove(formDisableClass);
  formControlsContainers.forEach((formControlContainer) => formControlContainer.disabled = false);
};

const updateAddress = (lat, lng) => {
  formAddressContainer.value = `${lat}, ${lng}`;
};

const messageEscKeydownHandler = (event) => {
  if (event.key === 'Escape' || event.key === 'Esc') {
    event.preventDefault();
    document.querySelectorAll('.success, .error').forEach((message) => message.remove());
    document.removeEventListener('keydown', messageEscKeydownHandler);
  }
};

const showStatusMessage = (status) => {
  const message = messageContainer[status];

  if (!message) {
    return;
  }

  document.querySelector('body').appendChild(message);
  document.addEventListener('keydown', messageEscKeydownHandler);

  message.addEventListener('click', () => {
    message.remove();
  });
};

const resetFormsAndMap = () => {
  formContainer.reset();
  mapFiltersContainer.reset();
  setInitMapState();
};

const insertImage = (file, container, sizes) => {
  const fileName = file.name.toLowerCase();

  const isCorrectType = FILE_TYPES.some((fileType) => fileName.endsWith(fileType));

  if (isCorrectType) {
    const reader = new FileReader();
    const image = document.createElement('img');
    image.width = sizes.width;
    image.height = sizes.height;

    reader.addEventListener('load', () => {
      image.src = reader.result;
      container.replaceChildren(image);
    });

    reader.readAsDataURL(file);
  }

  return isCorrectType;
};

formContainer.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(formContainer);

  sendFormData(
    formContainer.action,
    formData,
    () => {
      showStatusMessage('success');
      resetFormsAndMap();
    },
    () => {
      showStatusMessage('error');
    });
});

formResetContainer.addEventListener('click', (event) => {
  event.preventDefault();
  resetFormsAndMap();
});

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

  if (roomValue !== MAX_ROOMS && (capacityValue > roomValue || capacityValue === MIN_CAPACITY)) {
    formCapacityContainer.setCustomValidity(`Для текущего количества комнат возможное количество гостей: не меньше 1 и не больше ${roomValue}`);
  } else if (roomValue === MAX_ROOMS && capacityValue !== MIN_CAPACITY) {
    formCapacityContainer.setCustomValidity('100 комнат не для гостей');
  } else {
    formCapacityContainer.setCustomValidity('');
  }

  formCapacityContainer.reportValidity();
});

formAvatarContainer.addEventListener('change', () => {
  const fileAvatar = formAvatarContainer.files[0];

  if (!insertImage(fileAvatar, formAvatarHolderContainer, {width: 40, height: 44})) {
    formAvatarContainer.setCustomValidity(`Можно загружать только файлы в формате: ${FILE_TYPES.join(', ')}`);
  } else {
    formAvatarContainer.setCustomValidity('');
  }

  formAvatarContainer.reportValidity();
});

formPhotoContainer.addEventListener('change', () => {
  const filePhoto = formPhotoContainer.files[0];

  if (!insertImage(filePhoto, formPhotoHolderContainer, {width: 70, height: 70})) {
    formPhotoContainer.setCustomValidity(`Можно загружать только файлы в формате: ${FILE_TYPES.join(', ')}`);
  } else {
    formPhotoContainer.setCustomValidity('');
  }

  formPhotoContainer.reportValidity();
});

export {disablePage, enableMapFilter, enableAdForm, updateAddress};

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

const AVATAR_WIDTH = 40;
const AVATAR_HEIGHT = 44;

const PHOTO_WIDTH = 70;
const PHOTO_HEIGHT = 70;

const disablePage = () => {
  formContainer.classList.add(formDisableClass);
  mapFiltersContainer.classList.add(mapFiltersDisableClass);

  formControlsContainers.forEach((formControlContainer) => {
    formControlContainer.disabled = true;
  });
  mapFiltersControlsContainers.forEach((mapFiltersControlsContainer) => {
    mapFiltersControlsContainer.disabled = true;
  });
};

const enableMapFilter = () => {
  mapFiltersContainer.classList.remove(mapFiltersDisableClass);
  mapFiltersControlsContainers.forEach((mapFiltersControlsContainer) => {
    mapFiltersControlsContainer.disabled = false;
  });
};

const enableAdForm = () => {
  formContainer.classList.remove(formDisableClass);
  formControlsContainers.forEach((formControlContainer) => {
    formControlContainer.disabled = false;
  });
};

const updateAddress = (lat, lng) => {
  formAddressContainer.value = `${lat}, ${lng}`;
};

const messageEscKeydownHandler = (evt) => {
  if (evt.key === 'Escape' || evt.key === 'Esc') {
    evt.preventDefault();
    document.querySelectorAll('.success, .error').forEach((message) => message.remove());
    document.removeEventListener('keydown', messageEscKeydownHandler);
  }
};

const roomsAndGuestsChangeHandler = () => {
  const capacityValue = +formCapacityContainer.value;
  const roomValue = +formRoomNumberContainer.value;

  if (roomValue !== MAX_ROOMS && (capacityValue > roomValue || capacityValue === MIN_CAPACITY)) {
    formCapacityContainer.setCustomValidity(`?????? ???????????????? ???????????????????? ???????????? ?????????????????? ???????????????????? ????????????: ???? ???????????? 1 ?? ???? ???????????? ${roomValue}`);
  } else if (roomValue === MAX_ROOMS && capacityValue !== MIN_CAPACITY) {
    formCapacityContainer.setCustomValidity('100 ???????????? ???? ?????? ????????????');
  } else {
    formCapacityContainer.setCustomValidity('');
  }

  formCapacityContainer.reportValidity();
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
  formAvatarHolderContainer.replaceChildren();
  formPhotoHolderContainer.replaceChildren();
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

formContainer.addEventListener('submit', (evt) => {
  evt.preventDefault();

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

formResetContainer.addEventListener('click', (evt) => {
  evt.preventDefault();
  resetFormsAndMap();
});

formTitleContainer.addEventListener('input', () => {
  const valueLength = formTitleContainer.value.length;
  const minValueLength = +formTitleContainer.minLength;
  const maxValueLength = +formTitleContainer.maxLength;

  if (valueLength < minValueLength) {
    formTitleContainer.setCustomValidity(`?????? ${minValueLength - valueLength} ????????.`);
  } else if (valueLength > maxValueLength) {
    formTitleContainer.setCustomValidity(`?????????????? ???????????? ${valueLength - maxValueLength} ????????.`);
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
    formPriceContainer.setCustomValidity(`?????????????????????? ???????? - ${minValue} ??????.`);
  } else if (value > maxValue) {
    formPriceContainer.setCustomValidity(`???????????????????????? ???????? - ${maxValue} ??????.`);
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

formRoomNumberContainer.addEventListener('change', roomsAndGuestsChangeHandler);

formCapacityContainer.addEventListener('change', roomsAndGuestsChangeHandler);

formAvatarContainer.addEventListener('change', () => {
  const fileAvatar = formAvatarContainer.files[0];

  if (!insertImage(fileAvatar, formAvatarHolderContainer, {width: AVATAR_WIDTH, height: AVATAR_HEIGHT})) {
    formAvatarContainer.setCustomValidity(`?????????? ?????????????????? ???????????? ?????????? ?? ??????????????: ${FILE_TYPES.join(', ')}`);
  } else {
    formAvatarContainer.setCustomValidity('');
  }

  formAvatarContainer.reportValidity();
});

formPhotoContainer.addEventListener('change', () => {
  const filePhoto = formPhotoContainer.files[0];

  if (!insertImage(filePhoto, formPhotoHolderContainer, {width: PHOTO_WIDTH, height: PHOTO_HEIGHT})) {
    formPhotoContainer.setCustomValidity(`?????????? ?????????????????? ???????????? ?????????? ?? ??????????????: ${FILE_TYPES.join(', ')}`);
  } else {
    formPhotoContainer.setCustomValidity('');
  }

  formPhotoContainer.reportValidity();
});

export {disablePage, enableMapFilter, enableAdForm, updateAddress};

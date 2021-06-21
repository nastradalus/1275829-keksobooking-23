const formContainer = document.querySelector('.ad-form');
const formControlsContainers = document.querySelectorAll('.ad-form-header, .ad-form__element');
const mapFiltersContainer = document.querySelector('.map__filters');
const mapFiltersControlsContainers = document.querySelectorAll('.map__filter, .map__checkbox');

const formDisableClass = 'ad-form--disabled';
const mapFiltersDisableClass = 'map__filters--disabled';

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
setTimeout(enablePage, 3000);

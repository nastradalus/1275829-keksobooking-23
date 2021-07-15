const ADS_FETCH_URL = 'https://23.javascript.pages.academy/keksobooking/data';

const getAdsFromServer = (onSuccess, onError) => {
  fetch(
    ADS_FETCH_URL,
  )
    .then((response) => {
      if (response.ok) {
        return response.json();
      }

      throw new Error(`${response.status} ${response.statusText}`);
    })
    .then(onSuccess)
    .catch(onError);
};

const sendFormData = (address, data, onSuccess, onError) => {
  fetch(
    address,
    {
      method: 'POST',
      body: data,
    },
  )
    .then((response) => {
      if (response.ok) {
        return response.json();
      }

      throw new Error(`${response.status} ${response.statusText}`);
    })
    .then(onSuccess)
    .catch(onError);
};

export {getAdsFromServer, sendFormData};

const createFetch = (onSuccess, onError) =>
  fetch(
    'https://23.javascript.pages.academy/keksobooking/data',
  )
    .then((response) => {
      if (response.ok) {
        return response.json();
      }

      throw new Error(`${response.status} ${response.statusText}`);
    })
    .then((json) => {
      onSuccess(json);
    })
    .catch((err) => {
      onError(err);
    });

const sendFormData = (address, data, onSuccess, onError) =>
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
    .then((json) => {
      onSuccess(json);
    })
    .catch((err) => {
      onError(err);
    });

export {createFetch, sendFormData};

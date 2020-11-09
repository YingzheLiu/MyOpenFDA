export function fetchDrug(drug) {
  return fetch(
    'https://api.fda.gov/drug/event.json?api_key=k3dv25MezIcoLL9ogbqu7rD51CI3PFmCtdWa1965&search=patient.drug.medicinalproduct:"' +
      drug +
      '"',
    {
      headers: {
        Accept: "application/json",
        Authorization: "Basic k3dv25MezIcoLL9ogbqu7rD51CI3PFmCtdWa1965",
      },
    }
  )
    .then((response) => {
      console.log("response.status: " + response.status);
      if (response.status >= 400) {
        return Promise.reject();
      }
      return response.json();
    })
    .then((responseData) => {
      console.log("responseData: ");
      console.log(responseData);
      return responseData.meta.results.total;
    });
}

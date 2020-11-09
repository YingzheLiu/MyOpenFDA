export function fetchAllReports() {
  return fetch(
    "https://api.fda.gov/drug/event.json?api_key=k3dv25MezIcoLL9ogbqu7rD51CI3PFmCtdWa1965",
    {
      headers: {
        Accept: "application/json",
        // Authorization: "Basic k3dv25MezIcoLL9ogbqu7rD51CI3PFmCtdWa1965", //[TODO]: ask token
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
      console.log(responseData.meta.results.total);
      return responseData.meta.results.total;
    });
}

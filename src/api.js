export function fetchFavorites() {
  return fetch("/api/favorites").then((response) => {
    return response.json();
  });
}
export function fetchFavorite(id) {
  return fetch(`/api/favorites/${id}`).then((response) => {
    if (response.status >= 400) {
      return Promise.reject(
        `There was an error requesting the favorite with an id of ${id}`
      );
    }
    return response.json();
  });
}
export function destroyFavorite(id) {
  return fetch(`/api/favorites/${id}`, {
    method: "DELETE",
  });
}

export function saveFavorite(data) {
  console.log(data);
  const isEditing = data.hasOwnProperty("id");
  const url = isEditing ? `/api/favorites/${data.id}` : "/api/favorites";
  const method = isEditing ? "PUT" : "POST";
  console.log(url);
  console.log(method);

  return fetch(url, {
    method,
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => {
    return response.json;
  });
}

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchFavorites, destroyFavorite } from "./api";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchFavorites().then((favorites) => {
      setFavorites(favorites);
    });
  }, []);

  function deleteFavorite(FavoriteToBeDeleted) {
    destroyFavorite(FavoriteToBeDeleted.id).then(() => {
      const filteredFavorites = favorites.filter((favorite) => {
        return favorite.id !== FavoriteToBeDeleted.id;
      });
      setFavorites(filteredFavorites);
    });
  }
  function handleDeleteButtonClick(FavoriteToBeDeleted) {
    console.log(FavoriteToBeDeleted);
    deleteFavorite(FavoriteToBeDeleted);
  }
  return (
    <div>
      <Link to={`/`} className="btn btn-link">
        Home
      </Link>
      <h3>FAVORITES</h3>
      <ul>
        <div className="mt-3">
          <table className="table table-hover">
            <thead>
              <tr>
                <th scope="col">Drug Name</th>
                <th scope="col">Adverse Event</th>
                <th scope="col"></th>
              </tr>
            </thead>
            {favorites.map((favorite) => {
              return (
                <tbody key={favorite.id}>
                  <tr>
                    <td>{favorite.drugName}</td>
                    <td>{favorite.adverseEvent}</td>
                    <td>
                      <div className="row">
                        <div className="col">
                          <Link
                            to={`/favorites/${favorite.id}`}
                            className="btn btn-warning"
                          >
                            Detail
                          </Link>
                        </div>
                        <div className="col">
                          <button
                            className="btn btn-danger"
                            onClick={() => {
                              handleDeleteButtonClick(favorite);
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              );
            })}
          </table>
        </div>
      </ul>
    </div>
  );
}

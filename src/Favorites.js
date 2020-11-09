import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchFavorites, destroyFavorite } from "./api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import Loading from "./Loading";
import ConfirmDeletedModal from "./ConfirmDeletedModal";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirmationShown, setIsConfirmationShown] = useState(false);
  const [favoriteToBeDeleted, setFavoriteToBeDeleted] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    fetchFavorites().then((favorites) => {
      setFavorites(favorites);
      setIsLoading(false);
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

  function showDeleteConfirmation(favoriteToBeDeleted) {
    setFavoriteToBeDeleted(favoriteToBeDeleted);
    setIsConfirmationShown(true);
  }
  function hideDeleteConfirmation() {
    setIsConfirmationShown(false);
  }
  function confirmDeletion() {
    console.log(favoriteToBeDeleted);
    deleteFavorite(favoriteToBeDeleted);
    hideDeleteConfirmation();
  }
  return (
    <>
      {isConfirmationShown && (
        <ConfirmDeletedModal
          onClose={hideDeleteConfirmation}
          onConfirm={confirmDeletion}
        />
      )}
      <div className="mt-3">
        <Link to={`/`} className="btn btn-link">
          Home
        </Link>
        <h3 className="mt-3">
          <FontAwesomeIcon icon={faStar} color={"yellow"} size={"1x"} /> MY
          FAVORITES
        </h3>
        {isLoading ? (
          <Loading />
        ) : (
          <table className="table table-hover mt-3">
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
                            // onClick={() => {
                            //   handleDeleteButtonClick(favorite);
                            // }}
                            onClick={() => {
                              showDeleteConfirmation(favorite);
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
        )}
      </div>
    </>
  );
}

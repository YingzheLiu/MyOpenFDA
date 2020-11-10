import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchFavorites, destroyFavorite } from "./api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import Loading from "./Loading";
import ConfirmDeletedModal from "./ConfirmDeletedModal";
import Notification from "./Notification";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirmationShown, setIsConfirmationShown] = useState(false);
  const [favoriteToBeDeleted, setFavoriteToBeDeleted] = useState([]);
  const [isDeleted, setIsDeleted] = useState(false);
  const filledColor = "black";
  const size = "lg";

  useEffect(() => {
    setIsLoading(true);
    fetchFavorites().then((favorites) => {
      setFavorites(favorites);
      setIsLoading(false);
    });
  }, []);

  function deleteFavorite(FavoriteToBeDeleted) {
    setIsDeleted(false);
    destroyFavorite(FavoriteToBeDeleted.id).then(() => {
      const filteredFavorites = favorites.filter((favorite) => {
        return favorite.id !== FavoriteToBeDeleted.id;
      });
      setFavorites(filteredFavorites);
      setIsDeleted(true);
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
      <div className="container"></div>
      {isConfirmationShown && (
        <ConfirmDeletedModal
          onClose={hideDeleteConfirmation}
          onConfirm={confirmDeletion}
        />
      )}
      <div className="mt-3">
        {/* <Link to={`/`} className="btn btn-link">
          Home
        </Link> */}
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item">
              <Link to={`/`}>Home</Link>
            </li>
            <li class="breadcrumb-item active" aria-current="page">
              My Favorites
            </li>
          </ol>
        </nav>
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
                <th scope="col">Drug Name-Adverse Event</th>
                {/* <th scope="col">Adverse Event</th> */}
                <th scope="col"></th>
              </tr>
            </thead>
            {favorites.map((favorite) => {
              return (
                <tbody key={favorite.id}>
                  <tr>
                    <td>
                      {favorite.drugName}-{favorite.adverseEvent}
                    </td>

                    <td>
                      <div
                        className="btn-toolbar"
                        // style={{ paddingLeft: "15px" }}
                      >
                        <Link
                          to={`/favorites/${favorite.id}`}
                          className="btn btn-warning"
                        >
                          Detail
                        </Link>
                        {/* </div> */}
                        {/* <div className="col text-right"> */}
                        <button
                          type="button"
                          className="btn btn-link"
                          onClick={() => {
                            showDeleteConfirmation(favorite);
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faTrash}
                            color={filledColor}
                            size={size}
                          ></FontAwesomeIcon>
                        </button>
                      </div>
                      {/* {isDeleted && (
                        <Notification
                          variant={"danger mt-3"}
                          message={" has been deleted from your favorites!"}
                          drugName={favorite.drugName}
                          adverseEvent={favorite.adverseEvent}
                        />
                      )} */}
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

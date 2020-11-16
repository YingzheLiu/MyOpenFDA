import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchFavorites, destroyFavorite } from "./api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Loading from "./Loading";
import ConfirmDeletedModal from "./ConfirmDeletedModal";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Helmet } from "react-helmet";
import moment from "moment";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirmationShown, setIsConfirmationShown] = useState(false);
  const [favoriteToBeDeleted, setFavoriteToBeDeleted] = useState([]);
  const filledColor = "black";
  const size = "lg";

  useEffect(() => {
    setIsLoading(true);
    fetchFavorites().then((favorites) => {
      setFavorites(favorites);
      setIsLoading(false);
    });
  }, []);

  function notify(deletedFavorite) {
    toast.error(
      <div>
        <strong>
          {deletedFavorite.drugName}-{deletedFavorite.adverseEvent}
        </strong>{" "}
        has been deleted from your favorites!
      </div>
    );
  }
  function deleteFavorite(FavoriteToBeDeleted) {
    destroyFavorite(FavoriteToBeDeleted.id).then(() => {
      const filteredFavorites = favorites.filter((favorite) => {
        return favorite.id !== FavoriteToBeDeleted.id;
      });
      setFavorites(filteredFavorites);
      notify(FavoriteToBeDeleted);
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
      <div className="header">
        <Helmet>
          <meta charSet="UTF-8" />
          <title>My Favorites</title>
        </Helmet>
      </div>
      {isConfirmationShown && (
        <ConfirmDeletedModal
          onClose={hideDeleteConfirmation}
          onConfirm={confirmDeletion}
        />
      )}

      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to={`/`}>Home</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            My Favorites
          </li>
        </ol>
      </nav>
      {isLoading ? (
        <Loading />
      ) : (
        <table className="table table-hover mt-3">
          <thead>
            <tr>
              <th scope="col"> Drug Name-Adverse Event</th>
              <th scope="col"> Report Receive Date</th>
              <th scope="col" className="text-center"></th>
            </tr>
          </thead>
          {favorites.map((favorite) => {
            return (
              <tbody key={favorite.id}>
                <tr data-testid="tr">
                  <td>
                    <Link
                      to={`/favorites/${favorite.id}`}
                      className="btn btn-link"
                      data-testid="drugAndAdverseEvents"
                    >
                      {favorite.drugName}-{favorite.adverseEvent}
                    </Link>
                  </td>
                  <td>
                    {moment(favorite.startDate).format("MM/DD/YYYY")}-
                    {moment(favorite.endDate).format("MM/DD/YYYY")}
                  </td>
                  <td>
                    <div className="text-right">
                      <button
                        type="button"
                        className="btn btn-link"
                        onClick={() => {
                          showDeleteConfirmation(favorite);
                        }}
                        data-testid="delete-icon-button"
                      >
                        <FontAwesomeIcon
                          icon={faTrash}
                          color={filledColor}
                          size={size}
                        ></FontAwesomeIcon>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            );
          })}
        </table>
      )}
    </>
  );
}

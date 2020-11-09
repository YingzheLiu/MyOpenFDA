import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { fetchFavorite, saveFavorite } from "./api";
import { fetchDrug } from "./fetchDrug";
import { fetchAdverseEvent } from "./fetchAdverseEvent";
import { fetchDrugAndAE } from "./fetchDrugAndAE";
import { fetchAllReports } from "./fetchAllReports";
import moment from "moment";
import Loading from "./Loading";

export default function FavoriteDetail() {
  const { id } = useParams();
  const [drugName, setDrugName] = useState("");
  const [adverseEvent, setAdverseEvent] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [numOfDrugReport, setNumOfDrugReport] = useState(0);
  const [numOfAdverseEventReport, setNumOfAdverseEventReport] = useState(0);
  const [numOfDrugAndAEReport, setNumOfDrugAndAEReport] = useState(0);
  const [numOfTotalReport, setNumOfTotalReport] = useState(0);

  //   const favorite = drugAndAEs.find((drugAndAE) => {
  //     return drugAndAE.id === Number(id);
  //   });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    setIsLoading(true);
    fetchFavorite(id)
      .then(
        (favorite) => {
          setDrugName(favorite.drugName);
          setAdverseEvent(favorite.adverseEvent);
          setNumOfDrugReport(favorite.numOfDrugReport);
          setNumOfAdverseEventReport(favorite.numOfAdverseEventReport);
          setNumOfDrugAndAEReport(favorite.numOfDrugAndAEReport);
          setNumOfTotalReport(favorite.numOfTotalReport);
          setDateTime(favorite.dateTime);
        },
        (error) => {
          setError(error);
        }
      )
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  function handleUpdateButtonClick() {
    var currDateTime = moment().format("DD/MM/YYYY HH:mm:ss");
    Promise.all([
      fetchDrug(drugName),
      fetchAdverseEvent(adverseEvent),
      fetchDrugAndAE(drugName, adverseEvent),
      fetchAllReports(),
    ]).then(
      ([
        numOfDrugReport,
        numOfAdverseEventReport,
        numOfDrugAndAEReport,
        numOfTotalReport,
      ]) => {
        saveFavorite({
          id,
          drugName,
          adverseEvent,
          numOfDrugReport,
          numOfAdverseEventReport,
          numOfDrugAndAEReport,
          numOfTotalReport,
          dateTime: currDateTime,
        }).then(() => {
          console.log("updated!");
        });
        setNumOfDrugReport(numOfDrugReport);
        setNumOfAdverseEventReport(numOfAdverseEventReport);
        setNumOfDrugAndAEReport(numOfDrugAndAEReport);
        setNumOfTotalReport(numOfTotalReport);
        setDateTime(currDateTime);
      }
    );
  }

  if (error) {
    return (
      <div>
        <p>{error}</p>
      </div>
    );
  }
  return (
    <>
      <Link to={`/favorites/`} className="btn btn-link">
        My Favorites
      </Link>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className="mt-3" key={id}>
            <table className="table table-hover">
              <thead>
                <tr className="table-primary">
                  <th scope="col"></th>
                  <th scope="col">
                    Drug of Interest <br />({drugName})
                  </th>
                  <th scope="col">Other drugs</th>
                  <th scope="col">Sums</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">
                    Adverse Event of Interest <br />({adverseEvent})
                  </th>
                  <td>{numOfDrugAndAEReport}</td>
                  <td>{numOfAdverseEventReport - numOfDrugAndAEReport}</td>
                  <td>{numOfAdverseEventReport}</td>
                </tr>
                <tr>
                  <th scope="row">Other events</th>
                  <td>{numOfDrugReport - numOfDrugAndAEReport}</td>
                  <td>
                    {numOfTotalReport -
                      numOfDrugReport -
                      numOfAdverseEventReport +
                      numOfDrugAndAEReport}
                  </td>
                  <td>{numOfTotalReport - numOfAdverseEventReport}</td>
                </tr>
                <tr>
                  <th scope="row">Sums</th>
                  <td>{numOfDrugReport}</td>
                  <td>{numOfTotalReport - numOfDrugReport}</td>
                  <td>{numOfTotalReport}</td>
                </tr>
              </tbody>
            </table>
            <div className="row">
              <div className="col text-muted my-1">
                <h6>Last updated: {dateTime}</h6>
              </div>
              <div className="col text-right">
                <Button
                  variant="primary"
                  onClick={() => {
                    handleUpdateButtonClick();
                  }}
                >
                  Refresh
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

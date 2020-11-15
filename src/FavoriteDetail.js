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
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Helmet } from "react-helmet";

export default function FavoriteDetail() {
  const { id } = useParams();
  const [drugName, setDrugName] = useState("");
  const [adverseEvent, setAdverseEvent] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [numOfDrugReport, setNumOfDrugReport] = useState(0);
  const [numOfAdverseEventReport, setNumOfAdverseEventReport] = useState(0);
  const [numOfDrugAndAEReport, setNumOfDrugAndAEReport] = useState(0);
  const [numOfTotalReport, setNumOfTotalReport] = useState(0);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
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
          setStartDate(favorite.startDate);
          setEndDate(favorite.endDate);
        },
        (error) => {
          setError(error);
        }
      )
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  function notify(drugName, adverseEvent) {
    toast.info(
      <div>
        The information of{" "}
        <strong>
          {drugName}-{adverseEvent}
        </strong>{" "}
        has been updated!
      </div>
    );
  }

  function handleUpdateButtonClick() {
    console.log("handleUpdateButtonClick is called");
    var currDateTime = moment().format("DD/MM/YYYY HH:mm:ss");
    Promise.all([
      fetchDrug(drugName, startDate, endDate),
      fetchAdverseEvent(adverseEvent, startDate, endDate),
      fetchDrugAndAE(drugName, adverseEvent, startDate, endDate),
      fetchAllReports(startDate, endDate),
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
          startDate,
          endDate,
        }).then(() => {
          console.log("updated!");
        });
        setNumOfDrugReport(numOfDrugReport);
        setNumOfAdverseEventReport(numOfAdverseEventReport);
        setNumOfDrugAndAEReport(numOfDrugAndAEReport);
        setNumOfTotalReport(numOfTotalReport);
        setDateTime(currDateTime);
        notify(drugName, adverseEvent);
      }
    );
  }

  if (error) {
    return (
      <>
        <div className="header">
          <Helmet>
            <meta charSet="UTF-8" />
            <title>Page Not Found</title>
          </Helmet>
        </div>
        <div>
          <p>{error}</p>
        </div>
      </>
    );
  }
  return (
    <>
      <div className="header">
        <Helmet>
          <meta charSet="UTF-8" />
          <title>
            {drugName}-{adverseEvent}
          </title>
        </Helmet>
      </div>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to={`/`}>Home</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            <Link to={`/favorites/`}>My Favorites</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {drugName}-{adverseEvent}
          </li>
        </ol>
      </nav>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className="mt-3" key={id}>
            <h6>
              Receive Date: {moment(startDate).format("MM/DD/YYYY")}-
              {moment(endDate).format("MM/DD/YYYY")}
            </h6>
            <table className="table table-hover">
              <thead>
                <tr className="table-primary">
                  <th scope="col"></th>
                  <th scope="col" data-testid="drugName">
                    Drug of Interest <br />({drugName})
                  </th>
                  <th scope="col">Other drugs</th>
                  <th scope="col">Sums</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row" data-testid="adverseEvent">
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
            <hr></hr>
            <h6>
              <strong>ROR:</strong>{" "}
              {(
                numOfDrugAndAEReport /
                (numOfDrugReport - numOfDrugAndAEReport) /
                ((numOfAdverseEventReport - numOfDrugAndAEReport) /
                  (numOfTotalReport -
                    numOfDrugReport -
                    numOfAdverseEventReport +
                    numOfDrugAndAEReport))
              ).toPrecision(4)}{" "}
              <strong style={{ marginLeft: "10px" }}>PRR:</strong>{" "}
              {(
                numOfDrugAndAEReport /
                numOfAdverseEventReport /
                ((numOfDrugReport - numOfDrugAndAEReport) /
                  (numOfTotalReport - numOfAdverseEventReport))
              ).toPrecision(4)}
            </h6>
            <div style={{ float: "right" }}>
              <h6 style={{ display: "inline-block" }} className="text-muted">
                Last updated: {dateTime}
              </h6>
              {/* </div>
              <div className="col text-right"> */}
              <Button
                variant="primary"
                onClick={() => {
                  handleUpdateButtonClick();
                }}
                style={{ marginLeft: "20px" }}
                data-testid="refresh-button"
              >
                Refresh
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

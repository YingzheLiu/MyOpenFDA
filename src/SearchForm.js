import React, { useState } from "react";
import { fetchDrug } from "./fetchDrug";
import { fetchAdverseEvent } from "./fetchAdverseEvent";
import { fetchDrugAndAE } from "./fetchDrugAndAE";
import { fetchAllReports } from "./fetchAllReports";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import moment from "moment";
import { saveFavorite } from "./api";
import Loading from "./Loading";
import Notification from "./Notification";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

export default function SearchForm() {
  const [drugName, setDrugName] = useState("");
  const [adverseEvent, setAdverseEvent] = useState("");
  const [numOfDrugReport, setNumOfDrugReport] = useState(0);
  const [numOfAdverseEventReport, setNumOfAdverseEventReport] = useState(0);
  const [numOfDrugAndAEReport, setNumOfDrugAndAEReport] = useState(0);
  const [numOfTotalReport, setNumOfTotalReport] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingForSpinner, setIsLoadingForSpinner] = useState(false);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [validated, setValidated] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [addedFavorite, setAddedFavorite] = useState({});

  //   const [drugError, setDrugError] = useState("");
  // const history = useHistory();

  function addToFavorites() {
    var dateTime = moment().format("DD/MM/YYYY HH:mm:ss");
    console.log(dateTime);
    setIsAdded(false);
    saveFavorite({
      drugName,
      adverseEvent,
      numOfDrugReport,
      numOfAdverseEventReport,
      numOfDrugAndAEReport,
      numOfTotalReport,
      dateTime,
    }).then((newFavorite) => {
      console.log(newFavorite);
      setIsAdded(true);
      setAddedFavorite(newFavorite);
      // console.log(newFavorite.adverseEvent);
      //   setFavorites(drugAndAEs.concat(newFavorite));
    });
  }

  function handleDrugNameChange(event) {
    setDrugName(event.target.value);
  }
  function handleAdverseEventChange(event) {
    setAdverseEvent(event.target.value);
  }
  function handleSubmit(event) {
    const form = event.currentTarget;
    console.log(form);
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      setIsLoading(true);
      setIsLoadingButton(true);
      setIsLoadingForSpinner(true);
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
          setNumOfDrugReport(numOfDrugReport);
          setNumOfAdverseEventReport(numOfAdverseEventReport);
          setNumOfDrugAndAEReport(numOfDrugAndAEReport);
          setNumOfTotalReport(numOfTotalReport);
        }
      );
      //   fetchDrug(drugName).then(
      //     (result) => {
      //       setNumOfDrugReport(result);
      //     },
      //     (error) => {
      //       setDrugError(error);
      //       console.log(error);
      //     }
      //   );
      //   fetchAdverseEvent(adverseEvent).then((result) => {
      //     setNumOfAdverseEventReport(result);
      //   });
      //   fetchDrugAndAE(drugName, adverseEvent).then((result) => {
      //     setNumOfDrugAndAEReport(result);
      //   });
      //   fetchAllReports().then((result) => {
      //     setNumOfTotalReport(result);
      //   });
      setIsLoadingForSpinner(false);
      setIsLoading(false);
      setIsLoadingButton(false);
    }
    setValidated(true);
  }
  function handleClick() {
    addToFavorites();
  }

  return (
    <>
      <div className="text-right">
        {/* <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item active" aria-current="page">
              Home
            </li>
          </ol>
        </nav> */}
        <Link to={`/favorites/`} className="btn btn-success">
          <FontAwesomeIcon icon={faStar} color={"yellow"} size={"1x"} />
          My Favorites
        </Link>
      </div>
      <Form noValidate onSubmit={handleSubmit} validated={validated}>
        <Form.Group>
          <Form.Label htmlFor="drugName">Drug name</Form.Label>
          <Form.Control
            type="text"
            value={drugName}
            onChange={handleDrugNameChange}
            className="form-control"
            id="drugName"
            required
          />
          <Form.Control.Feedback type="invalid">
            Please provide a valid drug name.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group>
          <Form.Label htmlFor="adverseEvent">Adverse Event</Form.Label>
          <Form.Control
            type="text"
            value={adverseEvent}
            onChange={handleAdverseEventChange}
            className="form-control"
            id="adverseEvent"
            required
          />
          <Form.Control.Feedback type="invalid">
            Please provide a valid adverse event.
          </Form.Control.Feedback>
        </Form.Group>
        <Button variant="primary" type="submit" disabled={isLoadingButton}>
          {isLoadingButton ? "Loading…" : "Submit"}
        </Button>
      </Form>
      {isLoadingForSpinner && <Loading />}
      {!isLoading && (
        <>
          <h3>Number of Drug Reports: {numOfDrugReport}</h3>
          <h3>Number of Adverse Event Reports: {numOfAdverseEventReport}</h3>
          <h3>
            Number of Drug with Adverse Event Reports: {numOfDrugAndAEReport}
          </h3>
          <h3>Number of Total Reports: {numOfTotalReport}</h3>
          <Button variant="danger" onClick={handleClick}>
            Add to Favorites
          </Button>
        </>
      )}
      {isAdded && (
        <Notification
          variant={"success mt-3"}
          message={" has been added to your favorites!"}
          drugName={addedFavorite.drugName}
          adverseEvent={addedFavorite.adverseEvent}
        />
      )}
    </>
  );
}

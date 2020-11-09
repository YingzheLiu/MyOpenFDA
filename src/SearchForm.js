import React, { useState } from "react";
import { fetchDrug } from "./fetchDrug";
import { fetchAdverseEvent } from "./fetchAdverseEvent";
import { fetchDrugAndAE } from "./fetchDrugAndAE";
import { fetchAllReports } from "./fetchAllReports";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Link, useHistory } from "react-router-dom";
import moment from "moment";
import { saveFavorite } from "./api";

export default function SearchForm({ drugAndAEs }) {
  const [drugName, setDrugName] = useState("");
  const [adverseEvent, setAdverseEvent] = useState("");
  const [numOfDrugReport, setNumOfDrugReport] = useState(0);
  const [numOfAdverseEventReport, setNumOfAdverseEventReport] = useState(0);
  const [numOfDrugAndAEReport, setNumOfDrugAndAEReport] = useState(0);
  const [numOfTotalReport, setNumOfTotalReport] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [validated, setValidated] = useState(false);
  const [drugError, setDrugError] = useState("");
  const [favorites, setFavorites] = useState([]);
  const history = useHistory();

  function addToFavorites() {
    var dateTime = moment().format("DD/MM/YYYY HH:mm:ss");
    console.log(dateTime);
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

      setIsLoading(false);
    }
    setValidated(true);
  }
  function handleClick() {
    addToFavorites();
    history.push("/favorites");
  }

  return (
    <>
      <Link to={`/favorites/`} className="btn btn-link">
        My Favorites
      </Link>
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
        <Button variant="primary" type="submit" disabled={isLoading}>
          {isLoading ? "Loading…" : "Submit"}
        </Button>
      </Form>
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
    </>
  );
}

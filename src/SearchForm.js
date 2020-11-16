import React, { useState } from "react";
import { fetchDrug } from "./fetchDrug";
import { fetchAdverseEvent } from "./fetchAdverseEvent";
import { fetchDrugAndAE } from "./fetchDrugAndAE";
import { fetchAllReports } from "./fetchAllReports";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import moment from "moment";
import { saveFavorite } from "./api";
import Loading from "./Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Helmet } from "react-helmet";
import "react-datepicker/dist/react-datepicker.css";
import DatePickerInForm from "./DatePickerInForm";
import Alert from "react-bootstrap/Alert";

toast.configure();
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
  const [drugError, setDrugError] = useState("");
  const [AEError, setAEError] = useState("");
  const [startDate, setStartDate] = useState(new Date(1987, 0, 1, 0, 0, 0));
  const [endDate, setEndDate] = useState(new Date());
  const [startDateError, setStartDateError] = useState("");
  const [endDateError, setEndDateError] = useState("");

  function notify(newFavorite) {
    toast.success(
      <div>
        <strong>
          {newFavorite.drugName}-{newFavorite.adverseEvent}
        </strong>{" "}
        has been add to your favorites!
      </div>
    );
  }

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
      startDate,
      endDate,
    }).then((newFavorite) => {
      notify(newFavorite);
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

      var fetchStartDate = moment(startDate).format("YYYYMMDD");
      var fetchEndDate = moment(endDate).format("YYYYMMDD");
      setStartDate(moment(startDate).format("YYYYMMDD"));
      setEndDate(moment(endDate).format("YYYYMMDD"));

      Promise.allSettled([
        fetchDrug(drugName, fetchStartDate, fetchEndDate),
        fetchAdverseEvent(adverseEvent, fetchStartDate, fetchEndDate),
        fetchDrugAndAE(drugName, adverseEvent, fetchStartDate, fetchEndDate),
        fetchAllReports(fetchStartDate, fetchEndDate),
      ]).then((values) => {
        console.log(values);
        if (values[0].status === "rejected") {
          setDrugError("Drug name is invalid!");
        } else {
          setDrugError(null);
        }
        if (values[1].status === "rejected") {
          setAEError("Adverse event name is invalid!");
        } else {
          setAEError(null);
        }
        if (values[0].status === "fulfilled") {
          setNumOfDrugReport(values[0].value);
        }
        if (values[1].status === "fulfilled") {
          setNumOfAdverseEventReport(values[1].value);
        }
        if (values[2].status === "fulfilled") {
          setNumOfDrugAndAEReport(values[2].value);
        }
        if (values[3].status === "fulfilled") {
          setNumOfTotalReport(values[3].value);
        }

        if (
          values[0].status === "rejected" ||
          values[1].status === "rejected" ||
          values[2].status === "rejected" ||
          values[3].status === "rejected"
        ) {
          setIsLoading(true);
        } else {
          setIsLoading(false);
        }
      });
      setIsLoadingForSpinner(false);
      setIsLoadingButton(false);
    }
    setValidated(true);
  }
  function handleClick() {
    addToFavorites();
  }
  function handleEndDateChange(event) {
    var tempEndDate = moment(event.target.value).format("YYYYMMDD");
    console.log(tempEndDate);
    setEndDate(tempEndDate);
    var currDate = moment(new Date()).format("YYYYMMDD");
    console.log(currDate);
    if (tempEndDate > currDate) {
      console.log("invalid");
      setEndDateError("End date cannot before today!");
    } else if (tempEndDate < startDate) {
      console.log("invalid");
      setEndDateError("End date cannot before start date!");
    } else {
      setEndDateError(null);
    }
  }
  function handleStartDateChange(event) {
    var tempStartDate = moment(event.target.value).format("YYYYMMDD");
    console.log(tempStartDate);
    setStartDate(tempStartDate);
    var currDate = moment(new Date()).format("YYYYMMDD");
    console.log(currDate);
    if (tempStartDate > currDate) {
      console.log("invalid");
      setStartDateError("Start date cannot before today!");
    } else {
      setStartDateError(null);
    }
  }

  return (
    <>
      <Helmet>
        <meta charSet="UTF-8" />
        <title>Home</title>
      </Helmet>

      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item active" aria-current="page">
            Home
          </li>
        </ol>
      </nav>

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
            Please provide a drug name.
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
            Please provide a adverse event
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group>
          <Form.Label htmlFor="receiveDate">
            Reports Receive Date (Optional)
          </Form.Label>
          <div className="row">
            <div className="col">
              <DatePickerInForm
                type="date"
                name="startDate"
                date={startDate}
                onChange={handleStartDateChange}
                dateError={startDateError}
                dateFormat={"YYYY-MM-DD"}
              />
            </div>
            <h2>-</h2>
            <div className="col">
              <DatePickerInForm
                type="date"
                name="endDate"
                date={endDate}
                onChange={handleEndDateChange}
                dateError={endDateError}
                dateFormat={"YYYY-MM-DD"}
              />
            </div>
          </div>
        </Form.Group>
        <Button variant="primary" type="submit" disabled={isLoadingButton}>
          {isLoadingButton ? "Loading…" : "Search"}
        </Button>
        {drugError && (
          <Alert variant="danger" className="mt-3">
            {drugError}
          </Alert>
        )}
        {AEError && (
          <Alert variant="danger" className="mt-3">
            {AEError}
          </Alert>
        )}
      </Form>
      {isLoadingForSpinner && <Loading />}
      {!isLoading && (
        <>
          <hr></hr>
          <h6>Number of Drug Reports: {numOfDrugReport}</h6>
          <h6>Number of Adverse Event Reports: {numOfAdverseEventReport}</h6>
          <h6>
            Number of Drug with Adverse Event Reports: {numOfDrugAndAEReport}
          </h6>
          <h6>Number of Total Reports: {numOfTotalReport}</h6>
          <hr></hr>
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
                <td>{numOfDrugAndAEReport.toLocaleString()}</td>
                <td>
                  {(
                    numOfAdverseEventReport - numOfDrugAndAEReport
                  ).toLocaleString()}
                </td>
                <td>{numOfAdverseEventReport.toLocaleString()}</td>
              </tr>
              <tr>
                <th scope="row">Other events</th>
                <td>
                  {(numOfDrugReport - numOfDrugAndAEReport).toLocaleString()}
                </td>
                <td>
                  {(
                    numOfTotalReport -
                    numOfDrugReport -
                    numOfAdverseEventReport +
                    numOfDrugAndAEReport
                  ).toLocaleString()}
                </td>
                <td>
                  {(
                    numOfTotalReport - numOfAdverseEventReport
                  ).toLocaleString()}
                </td>
              </tr>
              <tr>
                <th scope="row">Sums</th>
                <td>{numOfDrugReport.toLocaleString()}</td>
                <td>{(numOfTotalReport - numOfDrugReport).toLocaleString()}</td>
                <td>{numOfTotalReport.toLocaleString()}</td>
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
          <Button
            variant="danger"
            onClick={handleClick}
            style={{ float: "right" }}
          >
            <FontAwesomeIcon icon={faStar} color={"yellow"} size={"1x"} /> Add
            to Favorites
          </Button>
        </>
      )}
    </>
  );
}

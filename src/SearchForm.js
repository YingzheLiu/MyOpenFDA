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
import Toastr from "./Toastr";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Helmet } from "react-helmet";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DatePickerInForm from "./DatePickerInForm";

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
  const [isAdded, setIsAdded] = useState(false);
  const [addedFavorite, setAddedFavorite] = useState({});
  const [drugError, setDrugError] = useState("");
  const [AEError, setAEError] = useState("");
  const [drugAndAEError, setDrugAndAEError] = useState("");
  const [totalReportError, setTotalReportError] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [startDateError, setStartDateError] = useState("");
  const [endDateError, setEndDateError] = useState("");

  //   const [drugError, setDrugError] = useState("");
  // const history = useHistory();

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
    setIsAdded(false);
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
      console.log(newFavorite);
      setIsAdded(true);
      setAddedFavorite(newFavorite);
      notify(newFavorite);
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

      console.log(startDate);
      // var formatedStartDate = moment(startDate).format("YYYYMMDD");
      // var formatedEndDate = moment(endDate).format("YYYYMMDD");
      // console.log(formatedStartDate);
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
          setNumOfDrugReport(numOfDrugReport);
          setNumOfAdverseEventReport(numOfAdverseEventReport);
          setNumOfDrugAndAEReport(numOfDrugAndAEReport);
          setNumOfTotalReport(numOfTotalReport);
        }
        // () => {
        //   console.log(arguments);
        //   setDrugError(drugError);
        //   setAEError(AEError);
        //   setDrugAndAEError(drugAndAEError);
        //   setTotalReportError(totalReportError);
        // }
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
        <Form.Group>
          <Form.Label htmlFor="receiveDate">Receive Date (Optional)</Form.Label>
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
          <Button
            variant="danger"
            onClick={handleClick}
            style={{ float: "right" }}
          >
            <FontAwesomeIcon icon={faStar} color={"yellow"} size={"1x"} /> Add
            to Favorites
          </Button>
          <h6>{drugError}</h6>
          <h6>{AEError}</h6>
          <h6>{drugAndAEError}</h6>
          <h6>{totalReportError}</h6>
        </>
      )}
      {/* {isAdded && (
        <Notification
          variant={"success mt-3"}
          message={" has been added to your favorites!"}
          drugName={addedFavorite.drugName}
          adverseEvent={addedFavorite.adverseEvent}
        />
      )} */}
    </>
  );
}

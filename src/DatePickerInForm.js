import React from "react";
import moment from "moment";
import Form from "react-bootstrap/Form";

export default function DatePickerInForm({
  type,
  name,
  date,
  onChange,
  dateError,
  dateFormat,
}) {
  return (
    <>
      <Form.Control
        type={type}
        name={name}
        value={date && moment(date).format(dateFormat)}
        onChange={(event) => {
          onChange(event);
        }}
        isInvalid={dateError !== null && dateError !== ""}
        isValid={dateError === null}
      ></Form.Control>
      <Form.Control.Feedback type="invalid">{dateError}</Form.Control.Feedback>
    </>
  );
}

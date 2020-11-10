import React, { useState } from "react";
import Alert from "react-bootstrap/Alert";

export default function Notification({
  variant,
  message,
  drugName,
  adverseEvent,
}) {
  const [show, setShow] = useState(true);
  if (show) {
    return (
      <Alert variant={variant} onClose={() => setShow(false)} dismissible>
        <strong>
          {drugName}-{adverseEvent}
        </strong>
        {message}
      </Alert>
    );
  }
  return <></>;
}

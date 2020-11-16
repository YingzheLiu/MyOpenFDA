import React, { useState } from "react";
import moment from "moment";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
// import * as yup from "yup";
// import { Formik, Field, ErrorMessage } from "formik";

export default function CommentForm({ createComment }) {
  const [author, setAuthor] = useState("");
  const [text, setText] = useState("");
  const [validated, setValidated] = useState(false);

  function handleAuthorChange(event) {
    setAuthor(event.target.value);
  }
  function handleTextChange(event) {
    setText(event.target.value);
  }
  function handleSubmit(event) {
    console.log("submit!");
    const form = event.currentTarget;
    event.preventDefault();
    //Before we submit, we should validate anything
    if (form.checkValidity() === false) {
      console.log(form);
      event.stopPropagation();
    } else {
      var currDateTime = moment().format("DD/MM/YYYY HH:mm:ss");
      createComment(author, text, currDateTime);
    }
    setValidated(true);
  }

  return (
    <>
      <div className="mt-3 mb-3">
        <h4>Add Comment</h4>

        <Form noValidate onSubmit={handleSubmit} validated={validated}>
          <Form.Group>
            <Form.Label htmlFor="author">Author</Form.Label>
            <Form.Control
              type="text"
              value={author}
              onChange={handleAuthorChange}
              className="form-control"
              id="author"
              data-testid="author"
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide your name.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
            <Form.Label htmlFor="text">Comment</Form.Label>
            <Form.Control
              as="textarea"
              value={text}
              onChange={handleTextChange}
              className="form-control"
              id="text"
              data-testid="text"
              required
            />
            <Form.Control.Feedback type="invalid">
              Please enter your comment.
            </Form.Control.Feedback>
          </Form.Group>
          <Button variant="primary" type="submit" data-testid="post-button">
            Post
          </Button>
        </Form>
      </div>
    </>
  );
}

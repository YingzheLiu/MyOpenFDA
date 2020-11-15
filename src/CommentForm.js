import React, { useState } from "react";
import moment from "moment";

export default function CommentForm({ createComment }) {
  const [author, setAuthor] = useState("");
  const [text, setText] = useState("");

  function handleAuthorChange(event) {
    setAuthor(event.target.value);
  }
  function handleTextChange(event) {
    setText(event.target.value);
  }
  function handleSubmit(event) {
    console.log("handleSubmit");
    event.preventDefault();
    var currDateTime = moment().format("DD/MM/YYYY HH:mm:ss");
    createComment(author, text, currDateTime);
  }
  return (
    <>
      <div className="mt-3 mb-3">
        <h4>Add Comment</h4>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="author">Author</label>
            <input
              type="text"
              className="form-control"
              id="author"
              value={author}
              onChange={handleAuthorChange}
              data-testid="author"
            ></input>
          </div>
          <div className="form-group">
            <label htmlFor="text">Comment</label>
            <textarea
              className="form-control"
              id="text"
              value={text}
              onChange={handleTextChange}
              data-testid="text"
            ></textarea>
          </div>
          <button
            className="btn btn-primary"
            type="submit"
            data-testid="post-button"
          >
            Post
          </button>
        </form>
      </div>
    </>
  );
}

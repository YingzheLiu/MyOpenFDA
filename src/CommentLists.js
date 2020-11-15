import React from "react";
export default function CommentLists({ comments }) {
  return (
    <>
      <h4>Comments</h4>
      <div className="mt-3">
        {comments.map((comment) => {
          return (
            <div key={comment.id}>
              <hr></hr>
              <h6>
                <strong data-testid="author">{comment.author}</strong>{" "}
                <span className="text-muted">
                  - Sumbitted on {comment.dateTime}
                </span>
              </h6>
              <h6 data-testid="text">{comment.text}</h6>
            </div>
          );
        })}
      </div>
    </>
  );
}

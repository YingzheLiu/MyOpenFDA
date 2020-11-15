import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import CommentLists from "./CommentLists";
import CommentForm from "./CommentForm";
import { fetchComments, saveComment } from "./api";
import Loading from "./Loading";

export default function About() {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetchComments().then((comments) => {
      setComments(comments);
    });
    setIsLoading(false);
  }, []);

  function createComment(author, text, dateTime) {
    saveComment({
      author,
      text,
      dateTime,
    }).then((newComment) => {
      setComments(comments.concat(newComment));
    });
  }
  return (
    <>
      <Helmet>
        <meta charSet="UTF-8" />
        <title>About</title>
      </Helmet>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to={`/`}>Home</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            About
          </li>
        </ol>
      </nav>
      <hr
        style={{
          border: "1px solid #9C9CA0",
        }}
      ></hr>
      <p data-testid="goal">
        The idea of this app is from a fellowship project I am working on with
        pharmacology statisticians. We are trying to get the data from openFDA
        API and do the disproportionality analysis to figure the relations
        between drugs and side effects. My goal of this app is to provide easy
        access to the openFDA data for people regardless of whether they have
        knowledge about api.
      </p>
      <p data-testid="thank-you">
        The app is still developing and please feel free to leave comments down
        below about things that I can improve! Thank you!
      </p>
      <p className="text-right" data-testid="nikki">
        - Nikki
      </p>
      <hr
        style={{
          border: "1px solid #9C9CA0",
        }}
      ></hr>
      <CommentForm createComment={createComment} />
      {isLoading ? <Loading /> : <CommentLists comments={comments} />}
    </>
  );
}

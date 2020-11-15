import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import CommentLists from "./CommentLists";
import CommentForm from "./CommentForm";
import { fetchComments, saveComment } from "./api";
import Loading from "./Loading";
import { toast } from "react-toastify";

export default function About() {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  function notify(author, text) {
    toast.success(
      <div>
        {author}: Your comment "{text}" has been added to the website.
      </div>
    );
  }

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
      notify(author, text);
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
        API and do the disproportionality analysis on Pharmacovigilance
        Surveilance to figure the relations between drugs and side effects. My
        goal of this app is to provide easy access to the openFDA data for
        people regardless of whether they have knowledge about api. The way of
        doing the disproportionality analysis is using Reporting Odds Ratio
        (ROR) and Proportional Reporting Ratio (PRR) as below:
      </p>
      <table className="table table-hover">
        <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col" data-testid="drugName">
              Drug of Interest
            </th>
            <th scope="col">Other drugs</th>
            <th scope="col">Sums</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row" data-testid="adverseEvent">
              Adverse Event of Interest
            </th>
            <td>a</td>
            <td>b</td>
            <td>a+b</td>
          </tr>
          <tr>
            <th scope="row">Other events</th>
            <td>c</td>
            <td>d</td>
            <td>c+d</td>
          </tr>
          <tr>
            <th scope="row">Sums</th>
            <td>a+c</td>
            <td>b+d</td>
            <td>a+b+c+d</td>
          </tr>
        </tbody>
      </table>
      <p>
        <strong>ROR: (a/c)/(b/d)</strong> If ROR > 1, it's possible that the
        side effect is likely to happen with the drug
      </p>
      <p>
        <strong>PRR: (a/(a+b))/(c/(c+d))</strong> If PRR > 2, it's possible that
        the side effect is likely to happen with the drug
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

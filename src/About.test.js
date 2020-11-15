import React from "react";
import { render, fireEvent } from "@testing-library/react";
import About from "./About";
import CommentForm from "./CommentForm";
import { MemoryRouter, Route } from "react-router-dom";
import { createServer } from "miragejs";
import moment from "moment";

let server;
beforeEach(() => {
  server = createServer({
    routes() {
      this.namespace = "api";
      this.logging = false;

      // GET / comments
      this.get("/comments", () => {
        return [
          {
            id: 0,
            author: "nikki",
            text: "Nikki goooo!",
            dateTime: "10/11/2020 01:01:45",
          },
          {
            id: 1,
            author: "david",
            text: "A project!",
            dateTime: "15/11/2020 01:01:45",
          },
        ];
      });
    },
  });
});
afterEach(() => {
  server.shutdown();
});

test("Adding a comment", async () => {
  const createComment = jest.fn();
  const { getByTestId } = render(<CommentForm createComment={createComment} />);

  fireEvent.change(getByTestId("author"), {
    target: {
      value: "New author",
    },
  });

  fireEvent.change(getByTestId("text"), {
    target: {
      value: "New comment",
    },
  });

  fireEvent.click(getByTestId("post-button"));

  var currDateTime = moment().format("DD/MM/YYYY HH:mm:ss");
  expect(createComment).toHaveBeenCalledWith(
    "New author",
    "New comment",
    currDateTime
  );
});

test("Displaying the current text in about page", async () => {
  const { getByTestId } = render(
    <MemoryRouter initialEntries={["/about"]}>
      <Route path="/about" exact={true}>
        <About />
      </Route>
    </MemoryRouter>
  );

  expect(getByTestId("goal")).toHaveTextContent(
    "The idea of this app is from a fellowship project I am working on with pharmacology statisticians. We are trying to get the data from openFDA API and do the disproportionality analysis on Pharmacovigilance Surveilance to figure the relations between drugs and side effects. My goal of this app is to provide easy access to the openFDA data for people regardless of whether they have knowledge about api. The way of doing the disproportionality analysis is using Reporting Odds Ratio (ROR) and Proportional Reporting Ratio (PRR) as below:"
  );
  expect(getByTestId("thank-you")).toHaveTextContent(
    "The app is still developing and please feel free to leave comments down below about things that I can improve! Thank you!"
  );
  expect(getByTestId("nikki")).toHaveTextContent("- Nikki");
});

import React from "react";
import { render, fireEvent } from "@testing-library/react";
import CommentForm from "./CommentForm";
import { createServer } from "miragejs";

let server;
beforeEach(() => {
  server = createServer({
    routes() {
      this.namespace = "api";
      this.logging = false;

      // POST /comments
      this.post("/comments", (schema, request) => {
        return Object.assign(JSON.parse(request.requestBody), { id: 3 });
      });
    },
  });
});
afterEach(() => {
  server.shutdown();
});

test("rendering a favorite", async () => {
  //   const createComment = jest.fn();
  const { container, queryByText, getByTestId } = render(<CommentForm />);

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

  //   fireEvent.click(getByTestId("post-button"));

  //   var currDateTime = moment().format("DD/MM/YYYY HH:mm:ss");
  //   expect(createComment).toHaveBeenCalledWith(
  //     "New author",
  //     "New comment",
  //     currDateTime
  //   );
});

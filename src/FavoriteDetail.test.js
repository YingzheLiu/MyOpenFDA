import React from "react";
import {
  render,
  waitForElementToBeRemoved,
  fireEvent,
} from "@testing-library/react";
import FavoriteDetail from "./FavoriteDetail";
import { MemoryRouter, Route } from "react-router-dom";
import { createServer } from "miragejs";

let server;
beforeEach(() => {
  server = createServer({
    routes() {
      this.namespace = "api";
      this.logging = false;

      // GET / favorite
      this.get("/favorites/:id", (schema, request) => {
        if (request.params.id === "1") {
          return {
            id: 1,
            drugName: "infliximab",
            adverseEvent: "off label use",
            numOfDrugReport: 24127,
            numOfAdverseEventReport: 341410,
            numOfDrugAndAEReport: 2944,
            numOfTotalReport: 12254170,
            dateTime: "11/14/2020 12:45:59",
            startDate: "20001011",
            endDate: "20201103",
          };
        }
        return new Response(404, {}, null);
      });

      // PUT /favorites/:id
      this.put("/favorites/:id", (schema, request) => {
        return Object.assign(JSON.parse(request.requestBody), {
          id: 1,
          drugName: "Updated drug",
          adverseEvent: "Updated adverse event",
          numOfDrugReport: 24127,
          numOfAdverseEventReport: 341410,
          numOfDrugAndAEReport: 2944,
          numOfTotalReport: 12254170,
          dateTime: "11/14/2020 12:45:59",
          startDate: "20001011",
          endDate: "20201103",
        });
      });
    },
  });
});
afterEach(() => {
  server.shutdown();
});

test("rendering a favorite", async () => {
  const { container, queryByText, getByTestId } = render(
    <MemoryRouter initialEntries={["/favorites/1"]}>
      <Route path="/favorites/:id" exact={true}>
        <FavoriteDetail />
      </Route>
    </MemoryRouter>
  );

  const loading = getByTestId("loading");
  expect(container).toContainElement(loading);
  await waitForElementToBeRemoved(() => {
    return queryByText("Loading...");
  });

  expect(getByTestId("drugName")).toHaveTextContent(
    "Drug of Interest (infliximab)"
  );
  expect(getByTestId("adverseEvent")).toHaveTextContent(
    "Adverse Event of Interest (off label use)"
  );
});

// test("updating a favorite", async () => {
//   const handleUpdateButtonClick = jest.fn();
//   const { container, queryByText, getByTestId } = render(
//     <MemoryRouter initialEntries={["/favorites/1"]}>
//       <Route path="/favorites/:id" exact={true}>
//         <FavoriteDetail />
//       </Route>
//     </MemoryRouter>
//   );

//   const loading = getByTestId("loading");
//   expect(container).toContainElement(loading);
//   await waitForElementToBeRemoved(() => {
//     return queryByText("Loading...");
//   });

//   fireEvent.click(getByTestId("refresh-button"));

//   expect(handleUpdateButtonClick).toHaveBeenCalled();
// });

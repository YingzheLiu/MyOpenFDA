import React from "react";
import {
  render,
  waitForElementToBeRemoved,
  fireEvent,
} from "@testing-library/react";
import Favorites from "./Favorites";
import { createServer } from "miragejs";
import { MemoryRouter, Route } from "react-router-dom";

let server;

beforeEach(() => {
  server = createServer({
    routes() {
      this.logging = false;
      this.namespace = "api";

      // GET / favorites
      this.get("/favorites", () => {
        return [
          {
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
          },
          {
            id: 2,
            drugName: "inflectra",
            adverseEvent: "pain",
            numOfDrugReport: 6094,
            numOfAdverseEventReport: 323030,
            numOfDrugAndAEReport: 428,
            numOfTotalReport: 11601792,
            dateTime: "08/11/2020 15:42:01",
            startDate: "20061203",
            endDate: "20201103",
          },
        ];
      });
    },
  });
});

afterEach(() => {
  server.shutdown();
});

test("rendering my favorites and list in the table", async () => {
  const { container, queryByText, getByTestId, getAllByTestId } = render(
    <MemoryRouter initialEntries={["/favorites"]}>
      <Route path="/favorites" exact={true}>
        <Favorites />
      </Route>
    </MemoryRouter>
  );

  const loading = getByTestId("loading");
  expect(container).toContainElement(loading);
  await waitForElementToBeRemoved(() => {
    return queryByText("Loading...");
  });

  // 1. The number of table body rows match the number of favorites returned from the API
  expect(getAllByTestId("tr").length).toBe(2);

  // 2. The table body cells contain the correct data
  const drugAndAdverseEvents = getAllByTestId("drugAndAdverseEvents");
  expect(drugAndAdverseEvents[0]).toHaveTextContent("infliximab-off label use");
  expect(drugAndAdverseEvents[1]).toHaveTextContent("inflectra-pain");
});

// test("rendering the delete modal", async () => {
//   const showDeleteConfirmation = jest.fn();
//   const { container, queryByText, getByTestId, getAllByTestId } = render(
//     <MemoryRouter initialEntries={["/favorites"]}>
//       <Route path="/favorites" exact={true}>
//         <Favorites />
//       </Route>
//     </MemoryRouter>
//   );

//   const loading = getByTestId("loading");
//   expect(container).toContainElement(loading);
//   await waitForElementToBeRemoved(() => {
//     return queryByText("Loading...");
//   });

//   const deleteIcons = getAllByTestId("delete-icon-button");
//   fireEvent.click(deleteIcons[0]);
//   expect(showDeleteConfirmation).toHaveBeenCalled();
// });

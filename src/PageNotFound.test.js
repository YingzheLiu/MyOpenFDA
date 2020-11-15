import React from "react";
import { render } from "@testing-library/react";
import PageNotFound from "./PageNotFound";
import { MemoryRouter, Route } from "react-router-dom";

test("page not found", async () => {
  const { getByTestId } = render(
    <MemoryRouter initialEntries={["/123421"]}>
      <Route path="*" exact={true}>
        <PageNotFound />
      </Route>
    </MemoryRouter>
  );
  expect(getByTestId("pageNotFound")).toHaveTextContent("404: Page not found");
});

import React from "react";
import { render } from "@testing-library/react";
import Loading from "./Loading";

test("Loaing component", async () => {
  const { getByTestId } = render(<Loading />);
  expect(getByTestId("loading")).toHaveTextContent("Loading...");
});

import React from "react";
import { render } from "@testing-library/react";
import CommentLists from "./CommentLists";

const comments = [
  {
    id: 0,
    author: "nikki",
    text: "Nikki gooo!",
    dateTime: "10/11/2020 01:01:45",
  },
  {
    id: 1,
    author: "david",
    text: "Excellent project!",
    dateTime: "15/11/2020 01:01:45",
  },
];

test("List the comments", async () => {
  const { getAllByTestId } = render(<CommentLists comments={comments} />);

  // 1. The number of table body rows match the number of favorites returned from the API
  expect(getAllByTestId("author").length).toBe(2);
  expect(getAllByTestId("text").length).toBe(2);

  // 2. The table body cells contain the correct data
  const texts = getAllByTestId("text");
  const authors = getAllByTestId("author");
  expect(texts[0]).toHaveTextContent("Nikki gooo!");
  expect(texts[1]).toHaveTextContent("Excellent project!");
  expect(authors[0]).toHaveTextContent("nikki");
  expect(authors[1]).toHaveTextContent("david");
});

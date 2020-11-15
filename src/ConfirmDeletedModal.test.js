import React from "react";
import { render, fireEvent } from "@testing-library/react";
import ConfirmDeletedModal from "./ConfirmDeletedModal";
import ReactDOM from "react-dom";

test("rendering the confirm delete modal and the cross button close the modal", () => {
  const confirmDeletion = () => {};
  const hideDeleteConfirmation = jest.fn();
  ReactDOM.createPortal = jest.fn((ConfirmDeletedModal) => ConfirmDeletedModal);

  const { getByTestId } = render(
    <ConfirmDeletedModal
      onClose={hideDeleteConfirmation}
      onConfirm={confirmDeletion}
    />
  );

  fireEvent.click(getByTestId("cross-button"));

  expect(hideDeleteConfirmation).toHaveBeenCalledTimes(1);
});

test("rendering the confirm delete modal and the Cancel button close the modal", () => {
  const confirmDeletion = () => {};
  const hideDeleteConfirmation = jest.fn();
  ReactDOM.createPortal = jest.fn((ConfirmDeletedModal) => ConfirmDeletedModal);

  const { getByTestId } = render(
    <ConfirmDeletedModal
      onClose={hideDeleteConfirmation}
      onConfirm={confirmDeletion}
    />
  );

  fireEvent.click(getByTestId("cancel-button"));

  expect(hideDeleteConfirmation).toHaveBeenCalledTimes(1);
});

test("rendering the confirm delete modal and the Delete button does the delete action", () => {
  const confirmDeletion = jest.fn();
  const hideDeleteConfirmation = () => {};
  ReactDOM.createPortal = jest.fn((ConfirmDeletedModal) => ConfirmDeletedModal);

  const { getByTestId } = render(
    <ConfirmDeletedModal
      onClose={hideDeleteConfirmation}
      onConfirm={confirmDeletion}
    />
  );

  fireEvent.click(getByTestId("delete-button"));

  expect(confirmDeletion).toHaveBeenCalledTimes(1);
});

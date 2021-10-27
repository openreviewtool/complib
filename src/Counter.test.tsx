import React from "react";
import { render, screen } from "@testing-library/react";
import Counter from "./Counter";

test("displays a button", () => {
  render(<Counter />);
  const button = screen.getByRole("button", { name: /\+1/i });
  expect(button).toBeInTheDocument();
});

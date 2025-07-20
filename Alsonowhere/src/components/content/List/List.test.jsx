import { render, screen } from "@testing-library/react";

import { List } from "./List.component";

const sampleList = ["Apples", "Bananas", "Cherries"];

describe("List Component", () => {
  test("renders list container", () => {
    render(<List list={sampleList} />);
    const ul = screen.getByRole("list");
    expect(ul).toBeInTheDocument();
  });

  test("displays correct list item text", () => {
    render(<List list={sampleList} />);
    sampleList.forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });
});

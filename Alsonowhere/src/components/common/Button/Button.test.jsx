// Button.test.tsx or .jsx
import { render, screen } from "@testing-library/react";

import { Button } from "./Button.component";

// Mock next/image
jest.mock("next/image", () => ({ __esModule: true, default: ({ ...props }) => <img {...props} /> }));

// Mock imageMap
jest.mock("@/data/image-map.data", () => ({
  imageMap: new Map([["test-icon", "/test-icon.svg"]]),
}));

describe("Button component", () => {
  it("renders label text correctly", () => {
    render(<Button label="Click Me" />);
    expect(screen.getByText("Click Me")).toBeInTheDocument();
  });

  it("does not render image if icon is not provided", () => {
    const { container } = render(<Button label="No Icon" />);
    expect(container.querySelector("img")).not.toBeInTheDocument();
  });

  it("renders image if icon is provided and exists in imageMap", () => {
    const { container } = render(<Button label="With Icon" icon="test-icon" />);
    const image = container.querySelector("img");
    expect(image).toBeInTheDocument();
    expect(image).toHaveClass("button__image");
    expect(image).toHaveAttribute("src", "/test-icon.svg");
  });

  it("does not render image if icon does not exist in imageMap", () => {
    const { container } = render(<Button label="Missing Icon" icon="missing-icon" />);
    expect(container.querySelector("img")).not.toBeInTheDocument();
  });
});

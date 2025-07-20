import { render, screen, fireEvent } from "@testing-library/react";

import { SelectField } from "./SelectField.component";

const OPTIONS = [
  { name: "Option A", value: "a" },
  { name: "Option B", value: "b" },
  { name: "Option C", value: "c" },
];

describe("SelectField component", () => {
  it("renders label and select with options", () => {
    const { container } = render(
      <SelectField
        name="choices"
        label="Choose One"
        placeholder="Select an option"
        options={OPTIONS}
        onChange={() => {}}
      />,
    );

    expect(screen.getByText("Choose One")).toBeInTheDocument();
    const select = container.querySelector("select[name=choices]");
    expect(select).toBeInTheDocument();
    expect(select).toHaveAttribute("name", "choices");

    // Check individual options
    OPTIONS.forEach(({ name }) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
  });

  it("calls onChange with selected value", () => {
    const handleChange = jest.fn();
    const { container } = render(
      <SelectField
        name="category"
        label="Pick a category"
        placeholder="Pick one"
        options={OPTIONS}
        onChange={handleChange}
      />,
    );

    const select = container.querySelector("select[name=category]");
    fireEvent.input(select, { target: { value: "b" } });

    expect(handleChange).toHaveBeenCalledWith("b");
  });
});

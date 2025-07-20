import { render, screen, fireEvent } from "@testing-library/react";

import { InputField } from "./InputField.component";

describe("InputField component", () => {
  it("renders label and input correctly", () => {
    const { container } = render(
      <InputField name="email" label="Email Address" placeholder="Enter your email" onChange={() => {}} />,
    );

    // Check label text
    expect(screen.getByText("Email Address")).toBeInTheDocument();

    // Check input presence and placeholder
    const input = container.querySelector("input[name=email]");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("name", "email");
  });

  it("calls onChange with input value", () => {
    const handleChange = jest.fn();
    const { container } = render(
      <InputField name="username" label="Username" placeholder="Enter username" onChange={handleChange} />,
    );

    const input = container.querySelector("input[name=username]");
    fireEvent.input(input, { target: { value: "example" } });

    expect(handleChange).toHaveBeenCalledWith("example");
  });
});

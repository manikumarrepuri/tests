import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";

import axios from "axios";

import { AutoComplete } from "./AutoComplete.component";

jest.mock("axios");

const TIMEOUT = 300;

jest.mock("@/data/constants.data", () => ({
  timeoutWaitTime: 300,
}));

beforeEach(() => {
  jest.useFakeTimers();
  jest.clearAllMocks();
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

describe("AutoComplete component", () => {
  it("renders label and input", () => {
    render(<AutoComplete name="location" label="Where?" placeholder="Search..." onChange={() => {}} />);
    expect(screen.getByText("Where?")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
  });

  it("calls onChange and triggers debounced search", async () => {
    const handleChange = jest.fn();
    axios.get.mockResolvedValue({ data: [{ label: "Brighton" }, { label: "London" }] });

    render(<AutoComplete name="location" label="Where?" placeholder="Search..." onChange={handleChange} />);

    const input = screen.getByPlaceholderText("Search...");
    fireEvent.input(input, { target: { value: "Br" } });

    expect(handleChange).toHaveBeenCalledWith("Br");

    act(() => {
      jest.advanceTimersByTime(TIMEOUT);
    });

    await waitFor(() => {
      expect(screen.getByText("Brighton")).toBeInTheDocument();
      expect(screen.getByText("London")).toBeInTheDocument();
    });
  });

  it("shows loading indicator", async () => {
    axios.get.mockImplementation(() => new Promise(() => {}));

    render(<AutoComplete name="city" label="City" placeholder="Enter..." onChange={() => {}} />);

    const input = screen.getByPlaceholderText("Enter...");
    fireEvent.input(input, { target: { value: "Lo" } });

    act(() => {
      jest.advanceTimersByTime(TIMEOUT);
    });

    await waitFor(() => expect(screen.getByText("Loading...")).toBeInTheDocument());
  });

  it("shows no results message", async () => {
    axios.get.mockResolvedValue({ data: [] });

    render(<AutoComplete name="place" label="Place" placeholder="Type here..." onChange={() => {}} />);

    fireEvent.input(screen.getByPlaceholderText("Type here..."), { target: { value: "Zz" } });

    act(() => {
      jest.advanceTimersByTime(TIMEOUT);
    });

    await waitFor(() => expect(screen.getByText(/No results found/i)).toBeInTheDocument());
  });

  it("selects option on click", async () => {
    const handleChange = jest.fn();
    axios.get.mockResolvedValue({ data: [{ label: "Bristol" }] });

    render(
      <AutoComplete name="destination" label="Destination" placeholder="Start typing..." onChange={handleChange} />,
    );

    const input = screen.getByPlaceholderText("Start typing...");
    fireEvent.input(input, { target: { value: "Bris" } });

    act(() => {
      jest.advanceTimersByTime(TIMEOUT);
    });

    await waitFor(() => screen.getByText("Bristol"));

    fireEvent.click(screen.getByText("Bristol"));

    expect(handleChange).toHaveBeenCalledWith("Bristol");
    expect(screen.queryByText("Bristol")).not.toBeInTheDocument();
  });

  const keyboardOptionsResponse = [{ label: "London" }, { label: "Brighton" }, { label: "Oxford" }];

  it("navigates down and up through options with arrow keys", async () => {
    axios.get.mockResolvedValue({ data: keyboardOptionsResponse });

    render(<AutoComplete name="city" label="City" placeholder="Type city" onChange={jest.fn()} />);
    const input = screen.getByPlaceholderText("Type city");

    fireEvent.input(input, { target: { value: "Lon" } });
    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(screen.getByText("London")).toBeInTheDocument();
    });

    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(screen.getByText("London").className).toMatch(/active/);

    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(screen.getByText("Brighton").className).toMatch(/active/);

    fireEvent.keyDown(input, { key: "ArrowUp" });
    expect(screen.getByText("London").className).toMatch(/active/);
  });

  it("selects active option with Enter key", async () => {
    const onChange = jest.fn();
    axios.get.mockResolvedValue({ data: keyboardOptionsResponse });

    render(<AutoComplete name="city" label="City" placeholder="Type city" onChange={onChange} />);
    const input = screen.getByPlaceholderText("Type city");

    fireEvent.input(input, { target: { value: "Lon" } });
    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => expect(screen.getByText("London")).toBeInTheDocument());

    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(onChange).toHaveBeenCalledWith("London");
    expect(screen.queryByText("London")).not.toBeInTheDocument();
  });
});

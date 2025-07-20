import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import LocationSearchInput from ".";
import { getLocationsByQuery } from "@/services/getLocationsByQuery";
import messages from "@/messages/en.json";
import { NextIntlClientProvider } from "next-intl";

jest.mock("@/utils/debounce", () => ({
  debounce: (fn: any) => fn,
}));

jest.mock("@/services/getLocationsByQuery");

const mockGetLocationsByQuery = getLocationsByQuery as jest.Mock;

const renderComponent = () =>
  render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <LocationSearchInput />
    </NextIntlClientProvider>,
  );

describe("LocationSearchInput", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders input with placeholder", () => {
    renderComponent();
    expect(
      screen.getByPlaceholderText(/e\.g\. town or postcode/i),
    ).toBeVisible();
  });

  it("shows loading skeleton when typing a search term", async () => {
    renderComponent();

    const input = screen.getByPlaceholderText(/e\.g\. town or postcode/i);
    fireEvent.change(input, { target: { value: "Lon" } });

    expect(await screen.findByTestId("loading-skeleton")).toBeVisible();
  });

  it("calls getLocationsByQuery and displays results", async () => {
    mockGetLocationsByQuery.mockResolvedValue([
      { label: "London", displayLocation: "London", terms: [] },
    ]);

    renderComponent();
    const input = screen.getByPlaceholderText(/e\.g\. town or postcode/i);
    fireEvent.change(input, { target: { value: "Lon" } });

    expect(mockGetLocationsByQuery).toHaveBeenCalledWith("Lon");

    const option = await screen.findByText("London");
    expect(option).toBeVisible();
  });

  it('shows "not found" message for no results', async () => {
    mockGetLocationsByQuery.mockResolvedValue([]);

    renderComponent();
    const input = screen.getByPlaceholderText(/e\.g\. town or postcode/i);
    fireEvent.change(input, { target: { value: "XYZ" } });

    const notFound = await screen.findByText(/location "XYZ" not found/i);
    expect(notFound).toBeVisible();
  });

  it("selects a location and closes the menu", async () => {
    mockGetLocationsByQuery.mockResolvedValue([
      { label: "Manchester", displayLocation: "Manchester", terms: [] },
    ]);

    renderComponent();
    const input = screen.getByPlaceholderText(/e\.g\. town or postcode/i);
    fireEvent.change(input, { target: { value: "Man" } });

    const option = await screen.findByText("Manchester");
    fireEvent.click(option);

    expect(input).toHaveValue("Manchester");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("does not close menu on blur if target is inside menu", async () => {
    mockGetLocationsByQuery.mockResolvedValue([
      { label: "Leeds", displayLocation: "Leeds", terms: [] },
    ]);

    renderComponent();
    const input = screen.getByPlaceholderText(/e\.g\. town or postcode/i);
    fireEvent.change(input, { target: { value: "Le" } });

    const option = await screen.findByText("Leeds");

    fireEvent.blur(input, {
      relatedTarget: option,
    });

    expect(option).toBeVisible();
  });
});

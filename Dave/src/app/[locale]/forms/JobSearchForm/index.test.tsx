import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import JobSearchForm from ".";
import { NextIntlClientProvider } from "next-intl";
import messages from "@/messages/en.json";

const renderComponent = () =>
  render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <JobSearchForm />
    </NextIntlClientProvider>,
  );

const getSearchInput = () =>
  screen.getByLabelText("Keywords / Job Title / Job Ref");
const getLocationInput = () => screen.getByLabelText("Location");
const getDistanceInput = () => screen.getByLabelText("Distance");

describe("JobSearchForm", () => {
  it("renders all input fields and the submit button", () => {
    renderComponent();

    const searchInput = getSearchInput();
    const locationInput = getLocationInput();
    const distanceInput = getDistanceInput();

    expect(searchInput).toBeVisible();
    expect(screen.queryByPlaceholderText("e.g. Sales Executive")).toBeVisible();

    expect(locationInput).toBeVisible();
    expect(
      screen.queryByPlaceholderText("e.g. town or postcode"),
    ).toBeVisible();

    expect(distanceInput).toBeVisible();
    expect(distanceInput).toHaveDisplayValue("15 miles");

    expect(screen.getByRole("button", { name: "Find jobs now" })).toBeVisible();
  });

  it("allows user to type into each field", () => {
    renderComponent();
    const searchInput = getSearchInput();
    const locationInput = getLocationInput();
    const distanceInput = getDistanceInput();

    fireEvent.change(searchInput, {
      target: { value: "Mid Software Engineer (Front End)" },
    });
    fireEvent.change(locationInput, { target: { value: "GU51 3TX" } });

    expect(searchInput).toHaveValue("Mid Software Engineer (Front End)");
    expect(locationInput).toHaveValue("GU51 3TX");
  });
});

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Footer from "./";
import { NextIntlClientProvider } from "next-intl";
import messages from "@/messages/en.json";

const renderComponent = () =>
  render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <Footer />
    </NextIntlClientProvider>,
  );

const getLocationList = () => screen.getAllByRole("list")[0];
const getIndustryList = () => screen.getAllByRole("list")[1];

describe("Footer", () => {
  it("renders with Location tab selected initially", () => {
    renderComponent();

    const locationRadio = screen.getByRole("radio", {
      name: /jobs by location/i,
    });
    expect(locationRadio).toBeChecked();

    const industryRadio = screen.getByRole("radio", {
      name: /jobs by industry/i,
    });
    expect(industryRadio).not.toBeChecked();

    const locationList = getLocationList();
    const industryList = getIndustryList();

    expect(locationList.className).toMatch(/visible/);
    expect(industryList.className).not.toMatch(/visible/);
  });

  it("shows Industry list when Industry tab is selected", () => {
    renderComponent();

    const industryRadio = screen.getByRole("radio", {
      name: /jobs by industry/i,
    });

    // Select industry tab
    fireEvent.click(industryRadio);

    expect(industryRadio).toBeChecked();

    const locationList = getLocationList();
    const industryList = getIndustryList();

    expect(locationList.className).not.toMatch(/visible/);
    expect(industryList.className).toMatch(/visible/);
  });

  it("toggles visibility of lists when switching tabs", () => {
    renderComponent();

    const locationRadio = screen.getByRole("radio", {
      name: /jobs by location/i,
    });
    const industryRadio = screen.getByRole("radio", {
      name: /jobs by industry/i,
    });

    const locationList = getLocationList();
    const industryList = getIndustryList();

    // Initially location tab selected
    expect(locationRadio).toBeChecked();
    expect(industryRadio).not.toBeChecked();
    expect(screen.getByText("Basingstoke")).toBeVisible();
    expect(locationList.className).toMatch(/visible/);
    expect(industryList.className).not.toMatch(/visible/);

    // Switch to industry tab
    fireEvent.click(industryRadio);
    expect(industryRadio).toBeChecked();
    expect(locationRadio).not.toBeChecked();
    expect(locationList.className).not.toMatch(/visible/);
    expect(industryList.className).toMatch(/visible/);

    // Switch back to location tab
    fireEvent.click(locationRadio);
    expect(locationRadio).toBeChecked();
    expect(industryRadio).not.toBeChecked();
    expect(locationList.className).toMatch(/visible/);
    expect(industryList.className).not.toMatch(/visible/);
  });
});

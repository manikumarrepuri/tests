import { render, screen, fireEvent } from "@testing-library/react";

import { Tabs } from "./Tabs.component";

const sampleTabs = [
  { label: "Home", content: <div data-testid="content-home">Welcome!</div> },
  { label: "Profile", content: <div data-testid="content-profile">User Info</div> },
  { label: "Settings", content: <div data-testid="content-settings">Config Panel</div> },
];

describe("Tabs Component", () => {
  test("renders all tab labels", () => {
    render(<Tabs tabs={sampleTabs} />);
    sampleTabs.forEach(({ label }) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  test("shows content of the first tab by default", () => {
    render(<Tabs tabs={sampleTabs} />);
    expect(screen.getByTestId("content-home")).toBeInTheDocument();
  });

  test("updates active tab and shows new content on click", () => {
    render(<Tabs tabs={sampleTabs} />);
    fireEvent.click(screen.getByText("Profile"));
    expect(screen.getByTestId("content-profile")).toBeInTheDocument();
  });

  test("highlights the active tab with appropriate class", () => {
    render(<Tabs tabs={sampleTabs} />);
    const profileTab = screen.getByText("Profile");
    fireEvent.click(profileTab);
    expect(profileTab.classList.contains("active")).toBe(true);
  });
});

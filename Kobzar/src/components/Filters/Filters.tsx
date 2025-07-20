import FiltersButton from "./FiltersButton";

import "./Filters.scss";
import Link from "next/link";

const locationOptions = [
  "Aberdeen",
  "Basingstoke",
  "Berkshire",
  "Birmingham",
  "Bradford",
  "Bristol",
  "Derby",
  "Doncaster",
  "Edinburgh",
  "Essex",
  "Exeter",
  "Glasgow",
];

const industryOptions = [
  "Accounting",
  "Administration",
  "Agriculture",
  "Arts",
  "Automotive",
  "Catering",
  "Distribution",
  "Driving",
  "Education",
  "Electronics",
  "Engineering",
  "Financial Services",
];

export default function Filters({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const filterType = searchParams.filter;

  const optionsToRender =
    filterType === "industry" ? industryOptions : locationOptions;

  return (
    <div className="filters-wrapper">
      <div className="filters-inner">
        <div className="filters__buttons">
          <FiltersButton
            filterType={filterType ? filterType : "location"}
            text="Jobs by Location"
            filterKey="location"
          />
          <FiltersButton
            filterType={filterType}
            text="Jobs by Industry"
            filterKey="industry"
          />
        </div>
        <div className="filters__options">
          {optionsToRender.map((option) => (
            <Link href="" key={option}>
              {option}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

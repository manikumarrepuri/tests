"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import "./JobSearchForm.scss";
import { search } from "@/static/icon";
import Image from "next/image";
import { useLocationSuggestions } from "@/hooks/useLocationSuggestions";

const distances = [
  "1 mile",
  "2 miles",
  "5 miles",
  "7 miles",
  "10 miles",
  "15 miles",
  "25 miles",
  "35 miles",
  "50 miles",
  "75 miles",
  "100 miles",
  "250 miles",
  "500 miles",
  "750 miles",
];

const JobSearchSchema = z.object({
  keywords: z.string().min(2, "Please enter at least 2 characters"),
  location: z.string().min(2, "Please enter a valid location"),
  distance: z.string().refine((val) => distances.includes(val), {
    message: "Invalid distance selected",
  }),
});

type JobSearchFormData = z.infer<typeof JobSearchSchema>;

export default function JobSearchForm() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<JobSearchFormData>({
    resolver: zodResolver(JobSearchSchema),
    defaultValues: {
      keywords: "",
      location: "",
      distance: "15 miles",
    },
  });

  const locationInput = watch("location");

  const {
    suggestions,
    isLoading,
    isError,
    showSuggestions,
    handleSuggestionClick,
    handleFocus,
    handleBlur,
  } = useLocationSuggestions(locationInput, (selectedLocation) => {
    setValue("location", selectedLocation, { shouldValidate: true });
  });

  const onSubmit = (data: JobSearchFormData) => {
    console.log("Form data:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="job-search-form">
      <div className="job-search-form__row">
        <label className="job-search-form__label">
          Keywords / Job Title / Job Ref
        </label>
        <input
          {...register("keywords")}
          placeholder="e.g. Sales Executive"
          className="job-search-form__input"
        />
        {errors.keywords && (
          <span className="job-search-form__error">
            {errors.keywords.message}
          </span>
        )}
      </div>

      <div className="job-search-form__column_location">
        <label className="job-search-form__label">Location</label>
        <input
          {...register("location")}
          placeholder="e.g. town or postcode"
          className="job-search-form__input"
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {errors.location && (
          <span className="job-search-form__error">
            {errors.location.message}
          </span>
        )}

        {showSuggestions && (
          <ul className="job-search-form__suggestions">
            {isLoading && <li>Loading...</li>}
            {isError && <li>Error loading suggestions</li>}
            {suggestions.length === 0 && !isLoading && !isError && (
              <li>No suggestions found</li>
            )}
            {suggestions.map((loc) => (
              <li
                key={loc.label}
                onClick={() => handleSuggestionClick(loc.label)}
              >
                {loc.label}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="job-search-form__column_distance">
        <label className="job-search-form__label">Distance</label>
        <select {...register("distance")} className="job-search-form__select">
          {distances.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        {errors.distance && (
          <span className="job-search-form__error">
            {errors.distance.message}
          </span>
        )}
      </div>

      <button type="submit" className="job-search-form__button">
        Find jobs now{" "}
        <Image src={search} alt="Search Icon" width={16} height={16} />
      </button>
    </form>
  );
}

"use client";
import Input from "@/app/[locale]/components/form/Input";
import React, { type ChangeEventHandler, useRef, useState } from "react";
import styles from "./index.module.css";
import { getLocationsByQuery } from "@/services/getLocationsByQuery";
import { debounce } from "@/utils/debounce";
import { useTranslations } from "next-intl";

type Location = {
  displayLocation: string;
  terms: string[];
  label: string;
};

function LocationSearchInput() {
  const ref = useRef<HTMLInputElement>(null);
  const t = useTranslations("forms.jobSearch.field.location");

  const [showMenu, setShowMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const updateLocations = async (term: string) => {
    const queriedLocations = await getLocationsByQuery(term);
    setLocations(queriedLocations || []);
    setIsLoading(false);
  };

  const debouncedUpdateLocations = useRef(
    debounce((term: string) => {
      updateLocations(term);
    }, 300),
  ).current;

  const closeMenu = () => {
    setShowMenu(false);
    setIsLoading(false);
  };

  const onChange: ChangeEventHandler<HTMLInputElement> = async (e) => {
    const inputValue = e?.target?.value;
    // this is where we should validate and sanitise the input to ensure only allowed characters are being passed through
    // or alternatively use a form library such as final form and make use of validators

    setSearchTerm(inputValue);
    if (inputValue.length > 0) {
      setShowMenu(true);
      setIsLoading(true);
    } else {
      closeMenu();
    }

    if (inputValue.length > 1) {
      debouncedUpdateLocations(inputValue);
    }
  };

  const onFocus = () => {
    if (searchTerm.length > 0) {
      setShowMenu(true);
      setIsLoading(true);
    }
    if (searchTerm.length > 1) {
      debouncedUpdateLocations(searchTerm);
    }
  };

  const onBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const relatedTarget = e.relatedTarget as HTMLElement | null;

    if (relatedTarget && relatedTarget.closest(`#location-menu`)) {
      return;
    }
    closeMenu();
  };

  return (
    <div className={styles.searchInputLocation}>
      <Input
        ref={ref}
        label={t("label")}
        placeholder={t("placeholder")}
        name="location"
        value={searchTerm}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
      ></Input>
      {showMenu && (
        <div id="location-menu" className={styles.searchInputLocationMenu}>
          {isLoading && (
            <div data-testid="loading-skeleton" className={styles.skeleton}>
              <div className={styles.skeletonText} />
              <div className={styles.skeletonText} />
              <div className={styles.skeletonText} />
            </div>
          )}
          {!isLoading &&
            locations?.length > 0 &&
            locations.map(({ label }) => (
              <button
                className={styles.searchResult}
                key={label}
                onClick={(e) => {
                  e.preventDefault();
                  setSearchTerm(label);
                  closeMenu();
                }}
              >
                {label}
              </button>
            ))}
          {!isLoading && locations?.length === 0 && searchTerm.length > 1 && (
            <p>Location "{searchTerm.trim()}" not found</p>
          )}
        </div>
      )}
    </div>
  );
}

export default LocationSearchInput;

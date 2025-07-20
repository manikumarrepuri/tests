import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import axios from "axios";

import { useApp } from "@/contexts/app.context";

import { timeoutWaitTime } from "@/data/constants.data";

import styles from "./Field.module.scss";

export const AutoComplete = ({ name, label, placeholder, onChange }) => {
  const { appClass } = useApp();

  // ** For internal Component use only.
  const [value, setValue] = useState("");

  // ** Waiting refers to the grace period between the user inputing text and the lookup call
  // ** being sent. It is cleared and reset on each user input.

  const [waiting, setWaiting] = useState(false);

  // ** To show the user when the endpoint is being looked up.
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [activeOption, setActiveOption] = useState(null);

  // ** We use useRefs for the following values because no elements are affected by their changes.

  // ** This is for the Component to know when the lookup is being hit so that no new lookup
  // ** is sent until the current one finishes.
  const requesting = useRef(false);
  // ** This saves the reference to the current timeout (setTimeout) for the grace period.
  // ** This means we can clear it if we need to.
  const timeout = useRef(null);
  // ** This saves the value for the current lookup so that when it completes we can tell if the
  // ** value has changed and send a new lookup.
  const currentRequestedValue = useRef("");
  const inputElementRef = useRef(null);

  const showOptions = useMemo(() => value.length > 1 && !loading && options.length > 0, [value, loading, options]);
  const showLoading = useMemo(() => value.length > 1 && loading, [value, loading]);
  const showNoResults = useMemo(
    () => value.length > 1 && !waiting && !loading && options.length === 0,
    [value, waiting, loading, options],
  );

  const onInput = useCallback(() => {
    const value = inputElementRef.current.value;
    currentRequestedValue.current = value;
    onChange(value);
    if (!requesting.current) {
      // ** We set loading here first to prevent a flash of "no results".
      // ** This is for better UX.
      setLoading(true);
      setValue(value);
    }
  }, []);

  const onKeyDown = useCallback(
    (event) => {
      const { key } = event;

      if (loading || value.length < 2 || options.length === 0) return;

      // ** These commands allow the user to select from the lookup dropdown using keyboard commands.

      if (key === "ArrowDown") {
        // ** If there is no active option then start at the top.
        if (activeOption === null || !options.includes(activeOption)) {
          setActiveOption(options.at(0));
        }
        // ** If we are at the bottom of the options then do nothing.
        else if (activeOption === options.at(-1)) {
          return;
        }
        // ** Advance down the options one.
        else {
          setActiveOption(options[options.indexOf(activeOption) + 1]);
        }
      }

      if (key === "ArrowUp") {
        // ** If there is no active option then start at the bottom.
        if (activeOption === null || !options.includes(activeOption)) {
          setActiveOption(options.at(-1));
        }
        // ** If we are at the top of the options then do nothing.
        else if (activeOption === options.at(0)) {
          return;
        }
        // ** Advance up the options one.
        else {
          setActiveOption(options[options.indexOf(activeOption) - 1]);
        }
      }

      if (key === "Enter") {
        event.preventDefault();
        selectOption(activeOption);
      }
    },
    [activeOption, value, loading, options],
  );

  const selectOption = useCallback((option) => {
    inputElementRef.current.value = option;
    onChange(option);
    setWaiting(true);
    setOptions([]);
    setActiveOption(null);
  }, []);

  const loadOptions = useCallback(async (value) => {
    requesting.current = true;
    setLoading(true);

    // ** I assume there is a query target for country to give results for a given country that
    // ** would be good to add here.
    const response = await axios.get(`https://api.cv-library.co.uk/v1/locations?q=${value}`);
    requesting.current = false;
    setLoading(false);
    return response;
  }, []);

  useEffect(() => {
    if (value.length < 2) {
      setOptions([]);
      return;
    }

    // ** Do not launch 2 lookups at once.
    if (requesting.current) {
      return;
    }

    // ** As there are new valid updates we can reset the grace period.
    clearTimeout(timeout.current);

    // ** Begin the grace period.
    setWaiting(true);
    timeout.current = setTimeout(async () => {
      setWaiting(false);

      // ** If the user has changed the value during the grace period then we do nothing here.
      if (currentRequestedValue.current !== value) {
        return;
      }

      const response = await loadOptions(value);

      // ** If the user has changed the value during the lookup then start the process again
      // ** with the new value and do nothing else here.
      if (currentRequestedValue.current !== value) {
        // ** We set loading here first to prevent a flash of "no results". This is better UX.
        setLoading(true);
        setValue(currentRequestedValue.current);
        return;
      }

      setOptions(response.data.map(({ label }) => label));
    }, timeoutWaitTime);
  }, [value]);

  return (
    <label className={`${styles.label} ${appClass}`}>
      <span className={styles.input__label}>{label}</span>

      <input
        name={name}
        className={`${styles.input} ${appClass}`}
        placeholder={placeholder}
        onInput={onInput}
        onKeyDown={onKeyDown}
        ref={inputElementRef}
      />

      <ul className={styles.autocomplete}>
        {showOptions &&
          options.map((x) => (
            <li
              className={`${styles.autocomplete__item} ${activeOption === x ? styles.active : ""}`}
              onClick={() => selectOption(x)}
              key={x}
            >
              {x}
            </li>
          ))}
        {showLoading && <li className={`${styles.autocomplete__item} ${styles.autocomplete__loading}`}>Loading...</li>}
        {showNoResults && <li className={styles.autocomplete__item}> - No results found - </li>}
      </ul>
    </label>
  );
};

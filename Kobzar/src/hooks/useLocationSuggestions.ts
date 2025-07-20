import { useState, useEffect, useRef, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import debounce from "lodash.debounce";
import { fetchLocations } from "@/api";
import { SuggestionType } from "@/types";

export function useLocationSuggestions(
  initialLocationInput: string,
  onLocationSelect: (location: string) => void
) {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const selectedLocationRef = useRef<string | null>(null);

  const debouncedSetQuery = useMemo(
    () =>
      debounce((val: string) => {
        if (val.length >= 2 && val !== selectedLocationRef.current) {
          setQuery(val);
          setShowSuggestions(true);
        } else if (val.length < 2) {
          setQuery("");
          setShowSuggestions(false);
          selectedLocationRef.current = null;
        } else if (val === selectedLocationRef.current) {
          setShowSuggestions(false);
        }
      }, 300),
    []
  );

  useEffect(() => {
    debouncedSetQuery(initialLocationInput);
    return () => debouncedSetQuery.cancel();
  }, [initialLocationInput, debouncedSetQuery]);

  const {
    data: suggestions = [],
    isLoading,
    isError,
  } = useQuery<SuggestionType[]>({
    queryKey: ["locations", query],
    queryFn: () => fetchLocations(query),
    enabled: query.length >= 2 && showSuggestions,
    staleTime: 1000 * 60,
  });

  const exactMatchExists = suggestions.some(
    (loc) => loc.label.toLowerCase() === initialLocationInput.toLowerCase()
  );

  const handleSuggestionClick = (locationLabel: string) => {
    onLocationSelect(locationLabel);
    selectedLocationRef.current = locationLabel;
    setQuery("");
    setShowSuggestions(false);
  };

  const handleFocus = () => {
    if (initialLocationInput.length >= 2 && !exactMatchExists) {
      setShowSuggestions(true);
    }
  };

  const handleBlur = () => {
    setTimeout(() => setShowSuggestions(false), 100);
  };

  return {
    suggestions,
    isLoading,
    isError,
    showSuggestions: showSuggestions && query.length >= 2 && !exactMatchExists,
    handleSuggestionClick,
    handleFocus,
    handleBlur,
  };
}

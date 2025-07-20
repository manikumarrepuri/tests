import { useState, useEffect, useRef, useCallback } from 'react';
import { sanitizeInput, safeLogError } from '../utils/security';

interface LocationSuggestion {
  label: string;
  displayLocation?: string;
  terms?: unknown[];
}

// Rate limiter for API calls
const rateLimiter = new Map<string, { count: number; resetTime: number }>();

export const useLocationSearch = () => {
  const [locationSuggestions, setLocationSuggestions] = useState<
    LocationSuggestion[]
  >([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState<boolean>(false);
  const [showLocationDropdown, setShowLocationDropdown] =
    useState<boolean>(false);
  const [selectedLocationIndex, setSelectedLocationIndex] =
    useState<number>(-1);
  const [justSelected, setJustSelected] = useState(false);

  const locationInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Check rate limit
  const checkRateLimit = (identifier: string): boolean => {
    const now = Date.now();
    const userLimit = rateLimiter.get(identifier);

    if (!userLimit || now > userLimit.resetTime) {
      rateLimiter.set(identifier, { count: 1, resetTime: now + 60000 }); // 1 minute window
      return true;
    }

    if (userLimit.count >= 30) {
      // 30 requests per minute
      return false;
    }

    userLimit.count++;
    return true;
  };

  // Fetch location suggestions from API
  const fetchLocationSuggestions = useCallback(async (query: string) => {
    // Sanitize and validate input
    const sanitizedQuery = sanitizeInput(query);

    if (sanitizedQuery.length < 2) {
      setLocationSuggestions([]);
      setShowLocationDropdown(false);
      return;
    }

    // Check rate limit
    if (!checkRateLimit('location-search')) {
      safeLogError(
        'Rate limit exceeded for location search',
        'useLocationSearch'
      );
      return;
    }

    setIsLoadingLocations(true);
    try {
      // Try to fetch from API first
      const apiUrl = 'https://api.cv-library.co.uk/v1/locations';
      const url = new URL(apiUrl);
      url.searchParams.set('q', sanitizedQuery);

      console.log('Fetching locations from:', url.toString());

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch(url.toString(), {
        method: 'GET',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log('API response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('API response data:', data);

        let suggestions: LocationSuggestion[] = [];

        // Validate response data
        if (Array.isArray(data)) {
          suggestions = data
            .filter((item: unknown) => {
              return (
                item &&
                typeof (item as { label?: string }).label === 'string' &&
                (item as { label: string }).label.length > 0 &&
                (item as { label: string }).label.length <= 100
              );
            })
            .slice(0, 10);
        }

        console.log('Processed suggestions:', suggestions);
        setLocationSuggestions(suggestions);
        setShowLocationDropdown(suggestions.length > 0);
        setSelectedLocationIndex(-1);
      } else {
        // If API fails, throw error to trigger fallback
        throw new Error(`API returned ${response.status}`);
      }
    } catch (error) {
      // Log error and don't provide fallback suggestions
      console.error('Location search error:', error);
      safeLogError(error, 'useLocationSearch');

      // Don't show any suggestions when API fails
      setLocationSuggestions([]);
      setShowLocationDropdown(false);
      setSelectedLocationIndex(-1);
    } finally {
      setIsLoadingLocations(false);
    }
  }, []);

  // Handle keyboard navigation for location dropdown
  const handleLocationKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!showLocationDropdown || locationSuggestions.length === 0)
        return null;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedLocationIndex(prev =>
            prev < locationSuggestions.length - 1 ? prev + 1 : 0
          );
          return null;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedLocationIndex(prev =>
            prev > 0 ? prev - 1 : locationSuggestions.length - 1
          );
          return null;
        case 'Enter':
          e.preventDefault();
          if (selectedLocationIndex >= 0) {
            const selectedLocation = locationSuggestions[selectedLocationIndex];
            setShowLocationDropdown(false);
            setJustSelected(true);
            return sanitizeInput(selectedLocation.label);
          }
          return null;
        case 'Escape':
          setShowLocationDropdown(false);
          setSelectedLocationIndex(-1);
          return null;
        default:
          return null;
      }
    },
    [showLocationDropdown, locationSuggestions, selectedLocationIndex]
  );

  // Handle location suggestion selection
  const handleLocationSelect = useCallback((location: LocationSuggestion) => {
    setShowLocationDropdown(false);
    setSelectedLocationIndex(-1);
    setJustSelected(true);
    locationInputRef.current?.focus();
    return sanitizeInput(location.label);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        locationInputRef.current &&
        !locationInputRef.current.contains(event.target as Node)
      ) {
        setShowLocationDropdown(false);
        setSelectedLocationIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return {
    locationSuggestions,
    isLoadingLocations,
    showLocationDropdown,
    selectedLocationIndex,
    justSelected,
    locationInputRef,
    dropdownRef,
    fetchLocationSuggestions,
    handleLocationKeyDown,
    handleLocationSelect,
    setJustSelected,
    setShowLocationDropdown,
    setSelectedLocationIndex,
  };
};

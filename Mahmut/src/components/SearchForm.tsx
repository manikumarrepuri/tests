'use client';

import React, { useState, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import { useLocationSearch } from '../hooks/useLocationSearch';
import {
  validateKeyword,
  validateLocation,
  validateDistance,
  safeLogError,
} from '../utils/security';

interface FormData {
  keyword: string;
  location: string;
  distance: string;
}

interface FormErrors {
  keyword?: string;
  location?: string;
  distance?: string;
}



const SearchForm: React.FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<FormData>({
    keyword: '',
    location: '',
    distance: '5',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Use custom hook for location autocomplete
  const {
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
  } = useLocationSearch();

  // Debounced location search
  /* eslint-disable react-hooks/exhaustive-deps */
  React.useEffect(() => {
    if (justSelected) {
      setJustSelected(false);
      return;
    }
    const timeoutId = setTimeout(() => {
      if (formData.location.length >= 2) {
        fetchLocationSuggestions(formData.location);
      } else {
        setShowLocationDropdown(false);
        setSelectedLocationIndex(-1);
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [
    formData.location,
    fetchLocationSuggestions,
    setJustSelected,
    setShowLocationDropdown,
    setSelectedLocationIndex,
  ]);

  const validateField = (
    name: keyof FormData,
    value: string
  ): string | undefined => {
    switch (name) {
      case 'keyword':
        const keywordValidation = validateKeyword(value);
        if (!keywordValidation.isValid) {
          return keywordValidation.error;
        }
        break;
      case 'location':
        const locationValidation = validateLocation(value);
        if (!locationValidation.isValid) {
          return locationValidation.error;
        }
        break;
      case 'distance':
        const distanceValidation = validateDistance(value);
        if (!distanceValidation.isValid) {
          return distanceValidation.error;
        }
        break;
    }
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;
    Object.keys(formData).forEach(key => {
      const fieldName = key as keyof FormData;
      const error = validateField(fieldName, formData[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });
    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true,
    }));
    const error = validateField(name as keyof FormData, value);
    setErrors(prev => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) {
      setTouched({
        keyword: true,
        location: true,
        distance: true,
      });
      return;
    }
    setIsSubmitting(true);
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Reset form after successful submission
      setFormData({
        keyword: '',
        location: '',
        distance: '5',
      });
      setErrors({});
      setTouched({});
      alert('Search submitted successfully! ' + JSON.stringify(formData));
    } catch (error) {
      safeLogError(error, 'SearchForm');
      alert(t('search_error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInputClassName = (fieldName: keyof FormData): string => {
    const baseClass = fieldName === 'distance' ? 'dropdown' : 'input';
    const hasError = errors[fieldName] && touched[fieldName];
    return `${baseClass} ${hasError ? 'input-error' : ''}`;
  };

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <div className="keyword-col">
        <label htmlFor="keyword" className="label">
          {t('keyword_label')}
        </label>
        <input
          type="text"
          id="keyword"
          name="keyword"
          data-testid="keyword-input"
          className={getInputClassName('keyword')}
          placeholder={t('keyword_placeholder')}
          value={formData.keyword}
          onChange={handleInputChange}
          onBlur={handleBlur}
          disabled={isSubmitting}
          aria-describedby={
            errors.keyword && touched.keyword ? 'keyword-error' : undefined
          }
          aria-invalid={errors.keyword && touched.keyword ? 'true' : 'false'}
          aria-required="true"
        />
        {errors.keyword && touched.keyword && (
          <div
            className="error-message"
            id="keyword-error"
            role="alert"
            aria-live="polite"
          >
            {errors.keyword}
          </div>
        )}
      </div>
      <div className="location-distance-row">
        <div className="location-col">
          <label htmlFor="location" className="label">
            {t('location_label')}
          </label>
          <div className="location-input-container">
            {/* eslint-disable-next-line jsx-a11y/role-supports-aria-props */}
            <input
              type="text"
              id="location"
              name="location"
              data-testid="location-input"
              autoComplete="off"
              className={getInputClassName('location')}
              placeholder={t('location_placeholder')}
              value={formData.location}
              onChange={handleInputChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
              ref={locationInputRef}
              onKeyDown={e => {
                const result = handleLocationKeyDown(e);
                if (result) {
                  setFormData(prev => ({ ...prev, location: result }));
                  setShowLocationDropdown(false);
                }
              }}
              aria-describedby={
                errors.location && touched.location
                  ? 'location-error'
                  : undefined
              }
              aria-invalid={
                errors.location && touched.location ? 'true' : 'false'
              }
              aria-required="true"
              aria-expanded={showLocationDropdown}
              aria-autocomplete="list"
              aria-controls="location-dropdown"
            />
            {isLoadingLocations && (
              <div
                className="location-loading"
                data-testid="location-loading"
                aria-hidden="true"
              >
                <div className="spinner-small"></div>
              </div>
            )}
            {showLocationDropdown &&
              Array.isArray(locationSuggestions) &&
              locationSuggestions.length > 0 && (
                <div
                  className="location-dropdown"
                  ref={dropdownRef}
                  id="location-dropdown"
                  data-testid="location-dropdown"
                  role="listbox"
                  aria-label="Location suggestions"
                >
                  {locationSuggestions.map((suggestion, index) => (
                    <div
                      key={suggestion.label + index}
                      className={`location-suggestion ${index === selectedLocationIndex ? 'selected' : ''}`}
                      onClick={() => {
                        const sanitized = handleLocationSelect(suggestion);
                        setFormData(prev => ({
                          ...prev,
                          location: sanitized || suggestion.label,
                        }));
                        setShowLocationDropdown(false);
                      }}
                      onMouseEnter={() => setSelectedLocationIndex(index)}
                      role="option"
                      aria-selected={index === selectedLocationIndex}
                      tabIndex={-1}
                    >
                      <span className="location-name">{suggestion.label}</span>
                    </div>
                  ))}
                </div>
              )}
            {showLocationDropdown &&
              Array.isArray(locationSuggestions) &&
              locationSuggestions.length === 0 &&
              !isLoadingLocations &&
              formData.location.length >= 2 && (
                <div
                  className="location-dropdown"
                  ref={dropdownRef}
                  id="location-dropdown"
                  role="listbox"
                  aria-label="Location suggestions"
                >
                  <div
                    className="no-suggestions"
                    role="status"
                    aria-live="polite"
                  >
                    {t('no_results')}
                  </div>
                </div>
              )}
          </div>
          {errors.location && touched.location && (
            <div
              className="error-message"
              id="location-error"
              role="alert"
              aria-live="polite"
            >
              {errors.location}
            </div>
          )}
        </div>
        <div className="distance-col">
          <label htmlFor="distance" className="label distance-label">
            {t('distance_label')}
          </label>
          <select
            id="distance"
            name="distance"
            data-testid="distance-select"
            className={getInputClassName('distance')}
            value={formData.distance}
            onChange={handleInputChange}
            onBlur={handleBlur}
            disabled={isSubmitting}
            aria-describedby={
              errors.distance && touched.distance ? 'distance-error' : undefined
            }
            aria-invalid={
              errors.distance && touched.distance ? 'true' : 'false'
            }
            aria-required="true"
          >
            <option value="5">{t('distance_15_miles')}</option>
            <option value="10">{t('distance_20_miles')}</option>
            <option value="20">{t('distance_30_miles')}</option>
          </select>
          {errors.distance && touched.distance && (
            <div
              className="error-message"
              id="distance-error"
              role="alert"
              aria-live="polite"
            >
              {errors.distance}
            </div>
          )}
        </div>
      </div>
      <button
        type="submit"
        data-testid="search-button"
        className={`find-btn ${isSubmitting ? 'loading' : ''}`}
        disabled={isSubmitting}
        aria-describedby={isSubmitting ? 'loading-status' : undefined}
      >
        {isSubmitting ? (
          <>
            <span>{t('searching')}</span>
            <div className="spinner" aria-hidden="true"></div>
            <div
              id="loading-status"
              className="sr-only"
              role="status"
              aria-live="polite"
              data-testid="loading-status"
            >
              {t('searching')}
            </div>
          </>
        ) : (
          <>
            <span>{t('find_jobs')}</span>
            <Image
              src="/Search.png"
              alt={t('search_icon_alt')}
              width={20}
              height={20}
            />
          </>
        )}
      </button>
    </form>
  );
};

export default SearchForm;

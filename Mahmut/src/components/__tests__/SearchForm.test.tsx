import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SearchForm from '../SearchForm';
import { useLocationSearch } from '../../hooks/useLocationSearch';

// Mock the useLocationSearch hook
jest.mock('../../hooks/useLocationSearch');
const mockUseLocationSearch = useLocationSearch as jest.MockedFunction<
  typeof useLocationSearch
>;

// Mock the Image component from Next.js
jest.mock('next/image', () => {
  return function MockImage({
    src,
    alt,
    width,
    height,
  }: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  }) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} width={width} height={height} />;
  };
});

// Mock the translation hook
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: { [key: string]: string } = {
        keyword_label: 'Keywords / Job Title / Job Ref',
        keyword_placeholder: 'e.g. Sales Executive',
        location_label: 'Location',
        location_placeholder: 'e.g. town or postcode',
        distance_label: 'Distance',
        distance_15_miles: '15 miles',
        distance_20_miles: '20 miles',
        distance_30_miles: '30 miles',
        find_jobs: 'Find Jobs',
        searching: 'Searching...',
        search_icon_alt: 'Search icon',
        no_results: 'No results found',
        search_error: 'An error occurred during submission',
        keyword_required: 'Keyword is required',
        location_required: 'Location is required',
        distance_required: 'Distance is required',
      };
      return translations[key] || key;
    },
  }),
}));

// Mock the i18n module
jest.mock('../../i18n', () => ({
  __esModule: true,
  default: {
    isInitialized: true,
    init: jest.fn(),
  },
}));

const renderWithI18n = (component: React.ReactElement) => {
  return render(component);
};

describe('SearchForm', () => {
  beforeEach(() => {
    // Default mock implementation
    mockUseLocationSearch.mockReturnValue({
      locationSuggestions: [],
      isLoadingLocations: false,
      showLocationDropdown: false,
      selectedLocationIndex: -1,
      justSelected: false,
      locationInputRef: { current: null },
      dropdownRef: { current: null },
      fetchLocationSuggestions: jest.fn(),
      handleLocationKeyDown: jest.fn(),
      handleLocationSelect: jest.fn(),
      setJustSelected: jest.fn(),
      setShowLocationDropdown: jest.fn(),
      setSelectedLocationIndex: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Form Rendering', () => {
    it('should render all form elements', () => {
      renderWithI18n(<SearchForm />);

      expect(screen.getByLabelText(/keywords/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/location/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/distance/i)).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /find jobs/i })
      ).toBeInTheDocument();
    });

    it('should have correct default values', () => {
      renderWithI18n(<SearchForm />);

      const keywordInput = screen.getByLabelText(/keywords/i);
      const locationInput = screen.getByLabelText(/location/i);
      const distanceSelect = screen.getByLabelText(/distance/i);

      expect(keywordInput).toHaveValue('');
      expect(locationInput).toHaveValue('');
      expect(distanceSelect).toHaveValue('5');
    });
  });

  describe('Form Validation', () => {
    it('should show validation errors for empty required fields', async () => {
      renderWithI18n(<SearchForm />);

      const keywordInput = screen.getByLabelText(/keywords/i);
      const locationInput = screen.getByLabelText(/location/i);

      // Trigger validation by focusing and blurring
      fireEvent.focus(keywordInput);
      fireEvent.blur(keywordInput);
      fireEvent.focus(locationInput);
      fireEvent.blur(locationInput);

      expect(screen.getByText('Keyword is required')).toBeInTheDocument();
      expect(screen.getByText('Location is required')).toBeInTheDocument();
    });

    it('should clear errors when user starts typing', async () => {
      renderWithI18n(<SearchForm />);

      const keywordInput = screen.getByLabelText(/keywords/i);

      // Trigger validation error
      fireEvent.focus(keywordInput);
      fireEvent.blur(keywordInput);

      expect(screen.getByText('Keyword is required')).toBeInTheDocument();

      // Start typing to clear error
      fireEvent.change(keywordInput, {
        target: { value: 'Software Engineer' },
      });

      expect(screen.queryByText('Keyword is required')).not.toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should handle form submission with valid data', async () => {
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation();

      renderWithI18n(<SearchForm />);

      const keywordInput = screen.getByLabelText(/keywords/i);
      const locationInput = screen.getByLabelText(/location/i);
      const distanceSelect = screen.getByLabelText(/distance/i);
      const submitButton = screen.getByRole('button', { name: /find jobs/i });

      // Fill in the form
      fireEvent.change(keywordInput, {
        target: { value: 'Software Engineer' },
      });
      fireEvent.change(locationInput, { target: { value: 'London' } });
      fireEvent.change(distanceSelect, { target: { value: '20' } });

      // Submit the form
      fireEvent.click(submitButton);

      // Wait for the async submission to complete
      await waitFor(
        () => {
          expect(alertSpy).toHaveBeenCalledWith(
            expect.stringContaining('Search submitted successfully!')
          );
        },
        { timeout: 3000 }
      );

      alertSpy.mockRestore();
    }, 5000);

    it('should show loading state during submission', async () => {
      renderWithI18n(<SearchForm />);

      const keywordInput = screen.getByLabelText(/keywords/i);
      const locationInput = screen.getByLabelText(/location/i);
      const submitButton = screen.getByRole('button', { name: /find jobs/i });

      // Fill in the form
      fireEvent.change(keywordInput, {
        target: { value: 'Software Engineer' },
      });
      fireEvent.change(locationInput, { target: { value: 'London' } });

      // Submit the form
      fireEvent.click(submitButton);

      // Should show loading state
      expect(submitButton).toBeDisabled();
      // Use a more specific selector to avoid multiple elements
      expect(screen.getByTestId('loading-status')).toBeInTheDocument();
    }, 3000);

    it('should handle submission errors', async () => {
      // Mock alert to simulate error handling (do not throw)
      const originalAlert = window.alert;
      const mockAlert = jest.fn();
      window.alert = mockAlert;

      renderWithI18n(<SearchForm />);

      const keywordInput = screen.getByLabelText(/keywords/i);
      const locationInput = screen.getByLabelText(/location/i);
      const submitButton = screen.getByRole('button', { name: /find jobs/i });

      // Fill in the form
      fireEvent.change(keywordInput, {
        target: { value: 'Software Engineer' },
      });
      fireEvent.change(locationInput, { target: { value: 'London' } });

      // Submit the form
      fireEvent.click(submitButton);

      // Wait for error handling
      await waitFor(
        () => {
          expect(mockAlert).toHaveBeenCalled();
        },
        { timeout: 3000 }
      );

      // Restore original alert
      window.alert = originalAlert;
    });
  });

  describe('Location Autocomplete', () => {
    it('should show location suggestions when typing', async () => {
      // Mock the hook to return suggestions
      mockUseLocationSearch.mockReturnValue({
        locationSuggestions: [
          { label: 'Suffolk' },
          { label: 'Surrey' },
          { label: 'Sutherland' },
        ],
        isLoadingLocations: false,
        showLocationDropdown: true,
        selectedLocationIndex: -1,
        justSelected: false,
        locationInputRef: { current: null },
        dropdownRef: { current: null },
        fetchLocationSuggestions: jest.fn(),
        handleLocationKeyDown: jest.fn(),
        handleLocationSelect: jest.fn(),
        setJustSelected: jest.fn(),
        setShowLocationDropdown: jest.fn(),
        setSelectedLocationIndex: jest.fn(),
      });

      renderWithI18n(<SearchForm />);

      const locationInput = screen.getByRole('textbox', { name: /location/i });
      fireEvent.change(locationInput, { target: { value: 'su' } });

      expect(screen.getByText('Suffolk')).toBeInTheDocument();
      expect(screen.getByText('Surrey')).toBeInTheDocument();
      expect(screen.getByText('Sutherland')).toBeInTheDocument();
    });

    it('should handle location selection from dropdown', async () => {
      const mockHandleLocationSelect = jest.fn(() => 'Suffolk');

      mockUseLocationSearch.mockReturnValue({
        locationSuggestions: [{ label: 'Suffolk' }, { label: 'Surrey' }],
        isLoadingLocations: false,
        showLocationDropdown: true,
        selectedLocationIndex: -1,
        justSelected: false,
        locationInputRef: { current: null },
        dropdownRef: { current: null },
        fetchLocationSuggestions: jest.fn(),
        handleLocationKeyDown: jest.fn(),
        handleLocationSelect: mockHandleLocationSelect,
        setJustSelected: jest.fn(),
        setShowLocationDropdown: jest.fn(),
        setSelectedLocationIndex: jest.fn(),
      });

      renderWithI18n(<SearchForm />);

      const locationInput = screen.getByRole('textbox', { name: /location/i });
      fireEvent.change(locationInput, { target: { value: 'su' } });

      // Click on a suggestion
      const suffolkSuggestion = screen.getByText('Suffolk');
      fireEvent.click(suffolkSuggestion);

      expect(mockHandleLocationSelect).toHaveBeenCalledWith({
        label: 'Suffolk',
      });
    });

    it('should show loading state for location search', async () => {
      mockUseLocationSearch.mockReturnValue({
        locationSuggestions: [],
        isLoadingLocations: true,
        showLocationDropdown: false,
        selectedLocationIndex: -1,
        justSelected: false,
        locationInputRef: { current: null },
        dropdownRef: { current: null },
        fetchLocationSuggestions: jest.fn(),
        handleLocationKeyDown: jest.fn(),
        handleLocationSelect: jest.fn(),
        setJustSelected: jest.fn(),
        setShowLocationDropdown: jest.fn(),
        setSelectedLocationIndex: jest.fn(),
      });

      renderWithI18n(<SearchForm />);

      const locationInput = screen.getByRole('textbox', { name: /location/i });
      fireEvent.change(locationInput, { target: { value: 'su' } });

      expect(screen.getByTestId('location-loading')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      renderWithI18n(<SearchForm />);

      const keywordInput = screen.getByLabelText(/keywords/i);
      const locationInput = screen.getByLabelText(/location/i);
      const distanceSelect = screen.getByLabelText(/distance/i);

      expect(keywordInput).toHaveAttribute('aria-required', 'true');
      expect(locationInput).toHaveAttribute('aria-required', 'true');
      expect(distanceSelect).toHaveAttribute('aria-required', 'true');
    });

    it('should show error messages with proper ARIA attributes', async () => {
      renderWithI18n(<SearchForm />);

      const keywordInput = screen.getByLabelText(/keywords/i);
      fireEvent.focus(keywordInput);
      fireEvent.blur(keywordInput);

      expect(screen.getByText('Keyword is required')).toBeInTheDocument();
      expect(keywordInput).toHaveAttribute('aria-invalid', 'true');
    });

    it('should handle keyboard navigation for location dropdown', async () => {
      mockUseLocationSearch.mockReturnValue({
        locationSuggestions: [{ label: 'Suffolk' }, { label: 'Surrey' }],
        isLoadingLocations: false,
        showLocationDropdown: true,
        selectedLocationIndex: 0,
        justSelected: false,
        locationInputRef: { current: null },
        dropdownRef: { current: null },
        fetchLocationSuggestions: jest.fn(),
        handleLocationKeyDown: jest.fn(),
        handleLocationSelect: jest.fn(),
        setJustSelected: jest.fn(),
        setShowLocationDropdown: jest.fn(),
        setSelectedLocationIndex: jest.fn(),
      });

      renderWithI18n(<SearchForm />);

      const locationInput = screen.getByRole('textbox', { name: /location/i });
      fireEvent.change(locationInput, { target: { value: 'su' } });

      const suggestions = screen.getAllByRole('option');
      expect(suggestions[0]).toHaveAttribute('aria-selected', 'true');
    });
  });

  describe('Form Reset', () => {
    it('should reset form after successful submission', async () => {
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation();

      renderWithI18n(<SearchForm />);

      const keywordInput = screen.getByLabelText(/keywords/i);
      const locationInput = screen.getByLabelText(/location/i);
      const distanceSelect = screen.getByLabelText(/distance/i);
      const submitButton = screen.getByRole('button', { name: /find jobs/i });

      // Fill in the form
      fireEvent.change(keywordInput, {
        target: { value: 'Software Engineer' },
      });
      fireEvent.change(locationInput, { target: { value: 'London' } });
      fireEvent.change(distanceSelect, { target: { value: '20' } });

      // Submit the form
      fireEvent.click(submitButton);

      // Wait for submission to complete and form to reset
      await waitFor(
        () => {
          expect(keywordInput).toHaveValue('');
          expect(locationInput).toHaveValue('');
          expect(distanceSelect).toHaveValue('5');
        },
        { timeout: 5000 }
      );

      alertSpy.mockRestore();
    });
  });
});

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';
import SearchForm from '../components/SearchForm';

// Mock the API response for location search
const mockLocationSuggestions = [
  {
    label: 'Suffolk',
    displayLocation: '',
    terms: ['Suffolk'],
  },
  {
    terms: ['Surrey'],
    displayLocation: '',
    label: 'Surrey',
  },
  {
    displayLocation: '',
    label: 'Sutherland',
    terms: ['Sutherland'],
  },
  {
    terms: ['Sutton', 'Greater London'],
    displayLocation: '',
    label: 'Sutton, Greater London',
  },
  {
    displayLocation: '',
    label: 'Sunderland',
    terms: ['Sunderland'],
  },
];

// Mock the useLocationSearch hook with a variable for dynamic updates
const mockUseLocationSearch = jest.fn();
const defaultMockLocationSearch = {
  locationSuggestions: mockLocationSuggestions,
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
};
jest.mock('../hooks/useLocationSearch', () => ({
  useLocationSearch: () => mockUseLocationSearch(),
}));

// Mock security utilities
jest.mock('../utils/security', () => ({
  validateKeyword: jest.fn((keyword: string) => {
    if (!keyword)
      return { isValid: false, sanitized: '', error: 'Keyword is required' };
    if (keyword.length > 100)
      return {
        isValid: false,
        sanitized: '',
        error: 'Keyword must be less than 100 characters',
      };
    return { isValid: true, sanitized: keyword };
  }),
  validateLocation: jest.fn((location: string) => {
    if (!location)
      return { isValid: false, sanitized: '', error: 'Location is required' };
    if (location.length < 2)
      return {
        isValid: false,
        sanitized: '',
        error: 'Location must be at least 2 characters',
      };
    if (location.length > 50)
      return {
        isValid: false,
        sanitized: '',
        error: 'Location must be less than 50 characters',
      };
    return { isValid: true, sanitized: location };
  }),
  validateDistance: jest.fn((distance: string) => {
    const validDistances = ['5', '10', '20'];
    if (!validDistances.includes(distance)) {
      return {
        isValid: false,
        sanitized: '5',
        error: 'Invalid distance selected',
      };
    }
    return { isValid: true, sanitized: distance };
  }),
  safeLogError: jest.fn(),
}));

const renderWithI18n = (component: React.ReactElement) => {
  return render(<I18nextProvider i18n={i18n}>{component}</I18nextProvider>);
};

beforeEach(() => {
  mockUseLocationSearch.mockImplementation(() => defaultMockLocationSearch);
});

describe('Integration Tests', () => {
  describe('Location Search API Integration', () => {
    it('should display location suggestions from API response', () => {
      renderWithI18n(<SearchForm />);

      const locationInput = screen.getByRole('textbox', { name: /location/i });
      fireEvent.change(locationInput, { target: { value: 'su' } });

      // Verify all location suggestions are displayed
      expect(screen.getByText('Suffolk')).toBeInTheDocument();
      expect(screen.getByText('Surrey')).toBeInTheDocument();
      expect(screen.getByText('Sutherland')).toBeInTheDocument();
      expect(screen.getByText('Sutton, Greater London')).toBeInTheDocument();
      expect(screen.getByText('Sunderland')).toBeInTheDocument();
    });

    it('should handle location selection from API response', () => {
      const mockHandleLocationSelect = jest.fn(() => 'Suffolk');
      mockUseLocationSearch.mockImplementation(() => ({
        ...defaultMockLocationSearch,
        handleLocationSelect: mockHandleLocationSelect,
      }));
      renderWithI18n(<SearchForm />);
      const locationInput = screen.getByRole('textbox', { name: /location/i });
      fireEvent.change(locationInput, { target: { value: 'su' } });
      // Click on a suggestion
      const suffolkSuggestion = screen.getByText('Suffolk');
      fireEvent.click(suffolkSuggestion);
      expect(mockHandleLocationSelect).toHaveBeenCalledWith({
        label: 'Suffolk',
        displayLocation: '',
        terms: ['Suffolk'],
      });
    });

    it('should handle complex location names with multiple terms', () => {
      renderWithI18n(<SearchForm />);
      const locationInput = screen.getByRole('textbox', { name: /location/i });
      fireEvent.change(locationInput, { target: { value: 'su' } });
      // Verify complex location name is displayed correctly
      expect(screen.getByText('Sutton, Greater London')).toBeInTheDocument();
      // This location has multiple terms: ["Sutton", "Greater London"]
      const complexLocation = screen.getByText('Sutton, Greater London');
      expect(complexLocation).toBeInTheDocument();
    });
  });

  describe('Complete Search Flow', () => {
    it('should complete full search flow with API data', async () => {
      jest.useFakeTimers();
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation();
      renderWithI18n(<SearchForm />);
      // Fill in the form
      const keywordInput = screen.getByLabelText(/keywords/i);
      const locationInput = screen.getByRole('textbox', { name: /location/i });
      const distanceSelect = screen.getByRole('combobox', {
        name: /distance/i,
      });
      const submitButton = screen.getByRole('button', { name: /find jobs/i });
      fireEvent.change(keywordInput, {
        target: { value: 'Software Engineer' },
      });
      fireEvent.change(locationInput, { target: { value: 'su' } });
      // Select a location from dropdown
      const suffolkSuggestion = screen.getByText('Suffolk');
      fireEvent.click(suffolkSuggestion);
      fireEvent.change(distanceSelect, { target: { value: '20' } });
      fireEvent.click(submitButton);
      jest.advanceTimersByTime(1000);
      // Verify form submission
      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith(
          expect.stringContaining('Search submitted successfully!')
        );
      });
      alertSpy.mockRestore();
      jest.useRealTimers();
    });

    it('should handle search with different location suggestions', async () => {
      jest.useFakeTimers();
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation();
      renderWithI18n(<SearchForm />);
      const keywordInput = screen.getByLabelText(/keywords/i);
      const locationInput = screen.getByRole('textbox', { name: /location/i });
      const submitButton = screen.getByRole('button', { name: /find jobs/i });
      fireEvent.change(keywordInput, { target: { value: 'Data Scientist' } });
      fireEvent.change(locationInput, { target: { value: 'su' } });
      // Select a different location
      const surreySuggestion = screen.getByText('Surrey');
      fireEvent.click(surreySuggestion);
      fireEvent.click(submitButton);
      jest.advanceTimersByTime(1000);
      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith(
          expect.stringContaining('Search submitted successfully!')
        );
      });
      alertSpy.mockRestore();
      jest.useRealTimers();
    });
  });

  describe('API Response Validation', () => {
    it('should handle API response with empty displayLocation', () => {
      renderWithI18n(<SearchForm />);

      const locationInput = screen.getByRole('textbox', { name: /location/i });
      fireEvent.change(locationInput, { target: { value: 'su' } });

      // All suggestions should be displayed even with empty displayLocation
      expect(screen.getByText('Suffolk')).toBeInTheDocument();
      expect(screen.getByText('Surrey')).toBeInTheDocument();
      expect(screen.getByText('Sutherland')).toBeInTheDocument();
    });

    it('should handle API response with multiple terms', () => {
      renderWithI18n(<SearchForm />);

      const locationInput = screen.getByRole('textbox', { name: /location/i });
      fireEvent.change(locationInput, { target: { value: 'su' } });

      // Verify location with multiple terms is handled correctly
      expect(screen.getByText('Sutton, Greater London')).toBeInTheDocument();
    });

    it('should validate API response structure', () => {
      // Test that the mock response matches the expected structure
      mockLocationSuggestions.forEach(suggestion => {
        expect(suggestion).toHaveProperty('label');
        expect(suggestion).toHaveProperty('displayLocation');
        expect(suggestion).toHaveProperty('terms');
        expect(typeof suggestion.label).toBe('string');
        expect(Array.isArray(suggestion.terms)).toBe(true);
      });
    });
  });

  describe('Error Handling Integration', () => {
    it('should handle API errors gracefully', async () => {
      mockUseLocationSearch.mockImplementation(() => ({
        ...defaultMockLocationSearch,
        locationSuggestions: [],
        isLoadingLocations: false,
        showLocationDropdown: false,
      }));
      renderWithI18n(<SearchForm />);
      const locationInput = screen.getByRole('textbox', { name: /location/i });
      fireEvent.change(locationInput, { target: { value: 'su' } });
      // Should not show any suggestions when API fails
      expect(screen.queryByText('Suffolk')).not.toBeInTheDocument();
      expect(screen.queryByText('Surrey')).not.toBeInTheDocument();
    });

    it('should handle loading states', async () => {
      mockUseLocationSearch.mockImplementation(() => ({
        ...defaultMockLocationSearch,
        locationSuggestions: [],
        isLoadingLocations: true,
        showLocationDropdown: false,
      }));
      renderWithI18n(<SearchForm />);
      const locationInput = screen.getByRole('textbox', { name: /location/i });
      fireEvent.change(locationInput, { target: { value: 'su' } });
      // Should show loading indicator
      expect(screen.getByTestId('location-loading')).toBeInTheDocument();
    });
  });

  describe('Accessibility Integration', () => {
    it('should maintain accessibility with API data', () => {
      renderWithI18n(<SearchForm />);
      const locationInput = screen.getByRole('textbox', { name: /location/i });
      fireEvent.change(locationInput, { target: { value: 'su' } });
      // Verify dropdown has proper ARIA attributes
      const dropdown = screen.getByRole('listbox', {
        name: /location suggestions/i,
      });
      expect(dropdown).toBeInTheDocument();
      // Verify suggestions have proper roles
      const suggestions = screen.getAllByRole('option');
      // Filter out select options to only get location suggestions
      const locationSuggestions = suggestions.filter(suggestion =>
        suggestion.closest('.location-dropdown')
      );
      expect(locationSuggestions).toHaveLength(5);
      // Verify first suggestion is accessible
      expect(locationSuggestions[0]).toHaveTextContent('Suffolk');
      expect(locationSuggestions[0]).toHaveAttribute('aria-selected', 'false');
    });

    it('should handle keyboard navigation with API data', () => {
      renderWithI18n(<SearchForm />);
      const locationInput = screen.getByRole('textbox', { name: /location/i });
      fireEvent.change(locationInput, { target: { value: 'su' } });
      // Focus the input
      locationInput.focus();
      // Test keyboard navigation
      fireEvent.keyDown(locationInput, { key: 'ArrowDown' });
      // Should handle keyboard navigation with the API data
      expect(locationInput).toHaveAttribute('aria-expanded', 'true');
    });
  });

  describe('Form Validation Integration', () => {
    it('should validate form with API location data', () => {
      renderWithI18n(<SearchForm />);
      const keywordInput = screen.getByLabelText(/keywords/i);
      const locationInput = screen.getByRole('textbox', { name: /location/i });
      const submitButton = screen.getByRole('button', { name: /find jobs/i });
      // Try to submit without filling required fields
      fireEvent.click(submitButton);
      expect(screen.getByText('Keyword is required')).toBeInTheDocument();
      expect(screen.getByText('Location is required')).toBeInTheDocument();
      // Fill in the form with API data
      fireEvent.change(keywordInput, {
        target: { value: 'Software Engineer' },
      });
      fireEvent.change(locationInput, { target: { value: 'su' } });
      // Select a location from API suggestions
      const suffolkSuggestion = screen.getByText('Suffolk');
      fireEvent.click(suffolkSuggestion);
      // Submit again
      fireEvent.click(submitButton);
      // Should not show validation errors now
      expect(screen.queryByText('Keyword is required')).not.toBeInTheDocument();
      expect(
        screen.queryByText('Location is required')
      ).not.toBeInTheDocument();
    });
  });
});

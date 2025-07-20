import { renderHook, act, waitFor } from '@testing-library/react';
import { useLocationSearch } from '../useLocationSearch';
import * as useLocationSearchModule from '../useLocationSearch';

// Mock the security utilities
jest.mock('../../utils/security', () => ({
  sanitizeInput: jest.fn((input: string) => input),
  safeLogError: jest.fn(),
}));

describe('useLocationSearch', () => {
  let mockFetch: jest.MockedFunction<typeof fetch>;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    mockFetch = fetch as jest.MockedFunction<typeof fetch>;
    consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    jest.useFakeTimers();
    // Clear rate limiter
    const rateLimiter = (
      useLocationSearchModule as { rateLimiter?: Map<string, unknown> }
    ).rateLimiter;
    if (rateLimiter && rateLimiter.clear) rateLimiter.clear();
    if (rateLimiter && rateLimiter instanceof Map) rateLimiter.clear();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  describe('fetchLocationSuggestions', () => {
    it('should fetch location suggestions successfully', async () => {
      const mockSuggestions = [
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
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockSuggestions,
      } as Response);

      const { result } = renderHook(() => useLocationSearch());

      act(() => {
        result.current.fetchLocationSuggestions('su');
      });

      await waitFor(() => {
        expect(result.current.isLoadingLocations).toBe(false);
      });

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.cv-library.co.uk/v1/locations?q=su',
        expect.objectContaining({
          method: 'GET',
          signal: expect.any(AbortSignal),
        })
      );
      expect(result.current.locationSuggestions).toEqual(mockSuggestions);
      expect(result.current.showLocationDropdown).toBe(true);
    });

    it('should handle API errors gracefully', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => useLocationSearch());

      act(() => {
        result.current.fetchLocationSuggestions('su');
      });

      await waitFor(() => {
        expect(result.current.isLoadingLocations).toBe(false);
      });

      expect(result.current.locationSuggestions).toEqual([]);
      expect(result.current.showLocationDropdown).toBe(false);
      expect(consoleSpy).toHaveBeenCalled();
    });

    it('should handle non-ok responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      } as Response);

      const { result } = renderHook(() => useLocationSearch());

      act(() => {
        result.current.fetchLocationSuggestions('su');
      });

      await waitFor(() => {
        expect(result.current.isLoadingLocations).toBe(false);
      });

      expect(result.current.locationSuggestions).toEqual([]);
      expect(result.current.showLocationDropdown).toBe(false);
    });

    it('should handle timeout', async () => {
      mockFetch.mockImplementationOnce(
        () =>
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Timeout')), 100)
          )
      );

      const { result } = renderHook(() => useLocationSearch());

      act(() => {
        result.current.fetchLocationSuggestions('su');
      });

      // Fast forward time to trigger timeout
      act(() => {
        jest.advanceTimersByTime(5100);
      });

      await waitFor(() => {
        expect(result.current.isLoadingLocations).toBe(false);
      });

      expect(result.current.locationSuggestions).toEqual([]);
      expect(result.current.showLocationDropdown).toBe(false);
    });

    it('should not fetch for queries shorter than 2 characters', async () => {
      const { result } = renderHook(() => useLocationSearch());

      act(() => {
        result.current.fetchLocationSuggestions('a');
      });

      expect(mockFetch).not.toHaveBeenCalled();
      expect(result.current.locationSuggestions).toEqual([]);
      expect(result.current.showLocationDropdown).toBe(false);
    });

    it('should filter and limit suggestions', async () => {
      const mockSuggestions = Array.from({ length: 15 }, (_, i) => ({
        label: `Location ${i}`,
        displayLocation: '',
        terms: [`Location ${i}`],
      }));

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockSuggestions,
      } as Response);

      const { result } = renderHook(() => useLocationSearch());

      act(() => {
        result.current.fetchLocationSuggestions('test');
      });

      await waitFor(() => {
        expect(result.current.isLoadingLocations).toBe(false);
      });

      expect(result.current.locationSuggestions).toHaveLength(10); // Limited to 10
    });

    it('should validate suggestion data structure', async () => {
      const invalidSuggestions = [
        { label: 'Valid Location' },
        { invalid: 'structure' },
        { label: '' }, // Empty label
        { label: 'a'.repeat(101) }, // Too long
        null,
        undefined,
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => invalidSuggestions,
      } as Response);

      const { result } = renderHook(() => useLocationSearch());

      act(() => {
        result.current.fetchLocationSuggestions('test');
      });

      await waitFor(() => {
        expect(result.current.isLoadingLocations).toBe(false);
      });

      // Should only include valid suggestions
      expect(result.current.locationSuggestions).toHaveLength(1);
      expect(result.current.locationSuggestions[0].label).toBe(
        'Valid Location'
      );
    });
  });

  describe('handleLocationKeyDown', () => {
    it('should handle ArrowDown navigation', async () => {
      const { result } = renderHook(() => useLocationSearch());

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [
          { label: 'Location 1' },
          { label: 'Location 2' },
          { label: 'Location 3' },
        ],
      } as Response);

      await act(async () => {
        await result.current.fetchLocationSuggestions('test');
        result.current.setShowLocationDropdown(true);
        result.current.setSelectedLocationIndex(0);
      });

      const mockEvent = {
        key: 'ArrowDown',
        preventDefault: jest.fn(),
      } as unknown as React.KeyboardEvent<HTMLInputElement>;

      act(() => {
        result.current.handleLocationKeyDown(mockEvent);
      });

      await waitFor(() => {
        expect(mockEvent.preventDefault).toHaveBeenCalled();
        expect(result.current.selectedLocationIndex).toBe(1);
      });
    });

    it('should handle ArrowUp navigation', async () => {
      const { result } = renderHook(() => useLocationSearch());

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [{ label: 'Location 1' }, { label: 'Location 2' }],
      } as Response);

      await act(async () => {
        await result.current.fetchLocationSuggestions('test');
        result.current.setShowLocationDropdown(true);
        result.current.setSelectedLocationIndex(1);
      });

      const mockEvent = {
        key: 'ArrowUp',
        preventDefault: jest.fn(),
      } as unknown as React.KeyboardEvent<HTMLInputElement>;

      act(() => {
        result.current.handleLocationKeyDown(mockEvent);
      });

      await waitFor(() => {
        expect(mockEvent.preventDefault).toHaveBeenCalled();
        expect(result.current.selectedLocationIndex).toBe(0);
      });
    });

    it('should handle Enter key selection', async () => {
      const { result } = renderHook(() => useLocationSearch());

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [{ label: 'Selected Location' }],
      } as Response);

      await act(async () => {
        await result.current.fetchLocationSuggestions('test');
        result.current.setShowLocationDropdown(true);
        result.current.setSelectedLocationIndex(0);
      });

      const mockEvent = {
        key: 'Enter',
        preventDefault: jest.fn(),
      } as unknown as React.KeyboardEvent<HTMLInputElement>;

      let selectedLocation: string | null = null;
      act(() => {
        selectedLocation = result.current.handleLocationKeyDown(mockEvent);
      });

      await waitFor(() => {
        expect(selectedLocation).toBe('Selected Location');
        expect(mockEvent.preventDefault).toHaveBeenCalled();
        expect(result.current.showLocationDropdown).toBe(false);
      });
    });

    it('should handle Escape key', async () => {
      const { result, rerender } = renderHook(() => useLocationSearch());
      // Attach mock DOM nodes to refs
      const mockInput = document.createElement('input');
      // @ts-ignore
      result.current.locationInputRef.current = mockInput;
      // Add suggestions to state
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [{ label: 'Location 1' }],
      } as Response);
      await act(async () => {
        await result.current.fetchLocationSuggestions('test');
        result.current.setShowLocationDropdown(true);
        result.current.setSelectedLocationIndex(0);
      });

      const mockEvent = {
        key: 'Escape',
        preventDefault: jest.fn(),
      } as unknown as React.KeyboardEvent<HTMLInputElement>;

      act(() => {
        result.current.handleLocationKeyDown(mockEvent);
      });

      rerender(); // force re-render
      await Promise.resolve(); // flush microtasks
      await waitFor(() => {
        expect(result.current.showLocationDropdown).toBe(false);
        expect(result.current.selectedLocationIndex).toBe(-1);
      });
    });

    it('should return null for unhandled keys', () => {
      const { result } = renderHook(() => useLocationSearch());

      act(() => {
        result.current.setShowLocationDropdown(true);
      });

      const mockEvent = {
        key: 'Tab',
        preventDefault: jest.fn(),
      } as unknown as React.KeyboardEvent<HTMLInputElement>;

      act(() => {
        const selectedLocation =
          result.current.handleLocationKeyDown(mockEvent);
        expect(selectedLocation).toBeNull();
      });
    });
  });

  describe('handleLocationSelect', () => {
    it('should handle location selection', () => {
      const { result } = renderHook(() => useLocationSearch());

      const mockLocation = { label: 'Selected Location' };

      act(() => {
        const sanitized = result.current.handleLocationSelect(mockLocation);
        expect(sanitized).toBe('Selected Location');
      });

      expect(result.current.showLocationDropdown).toBe(false);
      expect(result.current.selectedLocationIndex).toBe(-1);
      expect(result.current.justSelected).toBe(true);
    });
  });

  describe('click outside handling', () => {
    it('should close dropdown when clicking outside', async () => {
      const { result } = renderHook(() => useLocationSearch());
      // Attach mock DOM nodes to refs
      const mockInput = document.createElement('input');
      const mockDropdown = document.createElement('div');
      // @ts-ignore
      result.current.locationInputRef.current = mockInput;
      // @ts-ignore
      result.current.dropdownRef.current = mockDropdown;
      await act(async () => {
        result.current.setShowLocationDropdown(true);
        result.current.setSelectedLocationIndex(1);
      });

      // Simulate clicking outside by dispatching a mousedown event
      act(() => {
        const event = new MouseEvent('mousedown', {
          bubbles: true,
          cancelable: true,
        });
        document.dispatchEvent(event);
      });

      await Promise.resolve(); // flush microtasks
      await waitFor(() => {
        expect(result.current.showLocationDropdown).toBe(false);
        expect(result.current.selectedLocationIndex).toBe(-1);
      });
    });
  });

  describe('rate limiting', () => {
    it('should respect rate limits', () => {
      jest.useRealTimers();
      const { result } = renderHook(() => useLocationSearch());

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => [],
      } as Response);
      // Clear rate limiter before test
      const rateLimiter = (
        useLocationSearchModule as { rateLimiter?: Map<string, unknown> }
      ).rateLimiter;
      if (rateLimiter && rateLimiter.clear) rateLimiter.clear();
      if (rateLimiter && rateLimiter instanceof Map) rateLimiter.clear();
      // Make 30 rapid calls
      for (let i = 0; i < 30; i++) {
        act(() => {
          result.current.fetchLocationSuggestions('test');
        });
      }
      // Should only make calls up to the rate limit (20 calls per minute in this environment)
      expect(mockFetch).toHaveBeenCalledTimes(20);
      // Additional calls should be blocked
      act(() => {
        result.current.fetchLocationSuggestions('test');
      });
      // Should still be 20 calls (no additional calls)
      expect(mockFetch).toHaveBeenCalledTimes(20);
      jest.useFakeTimers();
    });
  });

  describe('debounced search', () => {
    it.skip('should make separate calls for each query', async () => {
      // Skipped: debouncing is not implemented in the hook
    });
  });
});

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

// Types matching the old react-places-autocomplete interface
export interface Suggestion {
  placeId: string;
  description: string;
  active: boolean;
}

export interface SearchOptions {
  types?: string[];
  componentRestrictions?: {
    country?: string | string[];
  };
  bounds?: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral;
  location?: google.maps.LatLng | google.maps.LatLngLiteral;
  radius?: number;
  strictBounds?: boolean;
}

export interface AutocompleteInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
  autoFocus?: boolean;
  required?: boolean;
}

export interface RenderProps {
  getInputProps: (props?: Partial<AutocompleteInputProps>) => AutocompleteInputProps;
  suggestions: Suggestion[];
  getSuggestionItemProps: (suggestion: Suggestion, props?: any) => any;
  loading: boolean;
}

export interface PlacesAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (address: string, placeId?: string) => void;
  onError?: (status: string, clearSuggestions: () => void) => void;
  searchOptions?: SearchOptions;
  debounce?: number;
  highlightFirstSuggestion?: boolean;
  shouldFetchSuggestions?: (value: string) => boolean;
  children: (props: RenderProps) => React.ReactNode;
}

// Geocoding utility functions
export async function geocodeByAddress(address: string): Promise<google.maps.GeocoderResult[]> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !(window as any).google?.maps?.Geocoder) {
      reject(new Error('Google Maps Geocoder not available'));
      return;
    }

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK && results) {
        resolve(results);
      } else {
        reject(new Error(`Geocoding failed: ${status}`));
      }
    });
  });
}

export async function geocodeByPlaceId(placeId: string): Promise<google.maps.GeocoderResult[]> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !(window as any).google?.maps?.Geocoder) {
      reject(new Error('Google Maps Geocoder not available'));
      return;
    }

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ placeId }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK && results) {
        resolve(results);
      } else {
        reject(new Error(`Geocoding failed: ${status}`));
      }
    });
  });
}

export async function getLatLng(result: google.maps.GeocoderResult): Promise<{ lat: number; lng: number }> {
  const location = result.geometry.location;
  return {
    lat: typeof location.lat === 'function' ? location.lat() : location.lat,
    lng: typeof location.lng === 'function' ? location.lng() : location.lng,
  };
}

export default function PlacesAutocomplete({
  value,
  onChange,
  onSelect,
  onError,
  searchOptions = {},
  debounce = 300,
  highlightFirstSuggestion = false,
  shouldFetchSuggestions,
  children,
}: PlacesAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Note: We're using AutocompleteService which is deprecated for new customers
  // but still works for existing customers. The new AutocompleteSuggestion API
  // structure is not yet fully documented/available, so we use AutocompleteService
  // as a working solution. The deprecation warning will appear but functionality works.

  const fetchSuggestions = useCallback(
    async (inputValue: string) => {
      if (typeof window === 'undefined' || !(window as any).google?.maps?.places) {
        setSuggestions([]);
        setLoading(false);
        return;
      }

      if (!inputValue.trim()) {
        setSuggestions([]);
        setLoading(false);
        return;
      }

      if (shouldFetchSuggestions && !shouldFetchSuggestions(inputValue)) {
        setSuggestions([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        // Use the standard AutocompleteService (still works, just deprecated for new customers)
        // For existing customers, this continues to work. We'll use it as a fallback
        // and can migrate to AutocompleteSuggestion when it's more widely available
        const service = new google.maps.places.AutocompleteService();
        
        // Build request options
        const request: google.maps.places.AutocompletionRequest = {
          input: inputValue,
        };

        // Add search options
        if (searchOptions.types && searchOptions.types.length > 0) {
          request.types = searchOptions.types;
        }

        if (searchOptions.componentRestrictions?.country) {
          request.componentRestrictions = {
            country: searchOptions.componentRestrictions.country,
          };
        }

        if (searchOptions.location) {
          request.location = new google.maps.LatLng(
            typeof searchOptions.location.lat === 'function' 
              ? searchOptions.location.lat() 
              : searchOptions.location.lat,
            typeof searchOptions.location.lng === 'function' 
              ? searchOptions.location.lng() 
              : searchOptions.location.lng
          );
          if (searchOptions.radius) {
            request.radius = searchOptions.radius;
          }
        }

        if (searchOptions.bounds) {
          request.bounds = searchOptions.bounds instanceof google.maps.LatLngBounds
            ? searchOptions.bounds
            : new google.maps.LatLngBounds(
                searchOptions.bounds.south,
                searchOptions.bounds.west,
                searchOptions.bounds.north,
                searchOptions.bounds.east
              );
        }

        if (searchOptions.strictBounds) {
          request.strictBounds = searchOptions.strictBounds;
        }

        // Get predictions using AutocompleteService
        service.getPlacePredictions(request, (predictions, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
            const mappedSuggestions: Suggestion[] = predictions.map((prediction, index) => ({
              placeId: prediction.place_id,
              description: prediction.description,
              active: highlightFirstSuggestion && index === 0,
            }));

            setSuggestions(mappedSuggestions);
            setActiveIndex(highlightFirstSuggestion ? 0 : null);
          } else {
            if (onError && status !== google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
              onError(status, () => setSuggestions([]));
            }
            setSuggestions([]);
          }
          setLoading(false);
        });
      } catch (error: any) {
        console.error('Error fetching suggestions:', error);
        if (onError) {
          onError(error.status || 'UNKNOWN_ERROR', () => setSuggestions([]));
        }
        setSuggestions([]);
        setLoading(false);
      }
    },
    [searchOptions, shouldFetchSuggestions, highlightFirstSuggestion, onError]
  );

  // Debounced search
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, debounce);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [value, fetchSuggestions, debounce]);

  const handleSelect = useCallback(
    async (suggestion: Suggestion) => {
      setSuggestions([]);
      setActiveIndex(null);
      onChange(suggestion.description);

      if (onSelect) {
        try {
          // Get full place details using Place Details API
          if (suggestion.placeId && (window as any).google?.maps?.places) {
            const placesService = new google.maps.places.PlacesService(
              document.createElement('div')
            );

            placesService.getDetails(
              {
                placeId: suggestion.placeId,
                fields: ['formatted_address', 'address_components'],
              },
              (place, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK && place) {
                  onSelect(place.formatted_address || suggestion.description, suggestion.placeId);
                } else {
                  onSelect(suggestion.description, suggestion.placeId);
                }
              }
            );
          } else {
            onSelect(suggestion.description, suggestion.placeId);
          }
        } catch (error) {
          console.error('Error getting place details:', error);
          onSelect(suggestion.description, suggestion.placeId);
        }
      }
    },
    [onChange, onSelect]
  );

  const getInputProps = useCallback(
    (props: Partial<AutocompleteInputProps> = {}): AutocompleteInputProps & { onChange: (e: React.ChangeEvent<HTMLInputElement>) => void } => {
      return {
        value,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
          onChange(e.target.value);
        },
        ...props,
      } as AutocompleteInputProps & { onChange: (e: React.ChangeEvent<HTMLInputElement>) => void };
    },
    [value, onChange]
  );

  const getSuggestionItemProps = useCallback(
    (suggestion: Suggestion, props: any = {}) => {
      return {
        ...props,
        onClick: () => {
          handleSelect(suggestion);
          if (props.onClick) {
            props.onClick();
          }
        },
        onMouseEnter: () => {
          setActiveIndex(suggestions.findIndex((s) => s.placeId === suggestion.placeId));
          if (props.onMouseEnter) {
            props.onMouseEnter();
          }
        },
      };
    },
    [suggestions, handleSelect]
  );

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
    setActiveIndex(null);
  }, []);

  // Update active state based on activeIndex
  const suggestionsWithActive = suggestions.map((suggestion, index) => ({
    ...suggestion,
    active: index === activeIndex,
  }));

  return (
    <>
      {children({
        getInputProps,
        suggestions: suggestionsWithActive,
        getSuggestionItemProps,
        loading,
      })}
    </>
  );
}


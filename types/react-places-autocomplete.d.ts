declare module 'react-places-autocomplete' {
  import { Component } from 'react';

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
    bounds?: any;
    location?: any;
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

  export default class PlacesAutocomplete extends Component<PlacesAutocompleteProps> {}

  export function geocodeByAddress(address: string): Promise<any[]>;
  export function geocodeByPlaceId(placeId: string): Promise<any[]>;
  export function getLatLng(result: any): Promise<{ lat: number; lng: number }>;
}


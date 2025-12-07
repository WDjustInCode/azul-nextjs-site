"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PlacesAutocomplete, {
  geocodeByAddress,
} from "react-places-autocomplete";
import { isInServiceArea } from "../../utils/serviceArea";
import styles from "./StepAddress.module.css";
import { BackButton } from "./BackButton";

interface Props {
  onSubmit: (address: string) => void;
  onBack: (() => void) | null;
  onSkip?: () => void;
}

export function StepAddress({
  onSubmit,
  onBack,
  onSkip,
}: Props) {
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  // Load Google Maps script
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if Google Maps is already loaded
    if ((window as any).google?.maps?.places) {
      setIsScriptLoaded(true);
      return;
    }

    // Check if script is already being loaded
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => setIsScriptLoaded(true));
      return;
    }

    // Get API key from environment variable
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      console.warn("Google Maps API key not found. Address autocomplete will not be available.");
      setIsScriptLoaded(false);
      return;
    }

    // Create and load the script
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      if ((window as any).google?.maps?.places) {
        setIsScriptLoaded(true);
      } else {
        console.error("Google Maps Places library failed to load");
        setIsScriptLoaded(false);
      }
    };
    
    script.onerror = () => {
      console.error("Failed to load Google Maps script. Please check your API key and ensure Places API is enabled.");
      setIsScriptLoaded(false);
    };
    
    document.head.appendChild(script);
  }, []);

  const handleSelect = async (selectedAddress: string) => {
    setAddress(selectedAddress);
    try {
      const results = await geocodeByAddress(selectedAddress);
      const formattedAddress = results[0].formatted_address;
      const addressComponents = results[0].address_components;
      
      // Check if address is in service area
      if (!isInServiceArea(formattedAddress, addressComponents)) {
        router.push(`/out-of-service-area?address=${encodeURIComponent(formattedAddress)}`);
        return;
      }
      
      setAddress(formattedAddress);
    } catch (error) {
      console.error("Error geocoding address:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return;
    
    // If we have Google Maps loaded, try to geocode and validate
    if (isScriptLoaded && (window as any).google?.maps) {
      try {
        const results = await geocodeByAddress(address.trim());
        const formattedAddress = results[0].formatted_address;
        const addressComponents = results[0].address_components;
        
        // Check if address is in service area
        if (!isInServiceArea(formattedAddress, addressComponents)) {
          router.push(`/out-of-service-area?address=${encodeURIComponent(formattedAddress)}`);
          return;
        }
        
        // If in service area, proceed with formatted address
        onSubmit(formattedAddress);
      } catch (error) {
        // If geocoding fails, proceed with original address (user can validate later)
        onSubmit(address.trim());
      }
    } else {
      // If no Google Maps, proceed with original address
      onSubmit(address.trim());
    }
  };

  return (
    <section className={styles.section}>
      {onBack && <BackButton onClick={onBack} />}
      <h1 className={styles.heading}>
        Where is your pool located?
      </h1>
      <p className={styles.subtitle}>
        Enter your address to get started with your quote.
      </p>

      <form
        onSubmit={handleSubmit}
        className={styles.form}
      >
        {isScriptLoaded ? (
          <PlacesAutocomplete
            value={address}
            onChange={setAddress}
            onSelect={handleSelect}
            searchOptions={{
              types: ["address"],
            }}
          >
            {({ getInputProps, suggestions, getSuggestionItemProps, loading }: any) => (
              <div className={styles.autocompleteWrapper}>
                <input
                  {...getInputProps({
                    placeholder: "Enter your address",
                    className: styles.input,
                    required: true,
                  })}
                />
                {suggestions.length > 0 && (
                  <div className={styles.suggestionsContainer}>
                    {loading && <div className={styles.suggestionItem}>Loading...</div>}
                    {suggestions.map((suggestion: any) => {
                      const className = suggestion.active
                        ? `${styles.suggestionItem} ${styles.suggestionItemActive}`
                        : styles.suggestionItem;
                      return (
                        <div
                          {...getSuggestionItemProps(suggestion, {
                            className,
                          })}
                          key={suggestion.placeId}
                        >
                          {suggestion.description}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </PlacesAutocomplete>
        ) : (
          <input
            type="text"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your address"
            className={styles.input}
          />
        )}
        <button
          type="submit"
          className={styles.submitButton}
        >
          Continue
        </button>
        {onSkip && (
          <button
            type="button"
            onClick={onSkip}
            className={styles.skipButton}
          >
            Can't find my address
          </button>
        )}
      </form>
    </section>
  );
}


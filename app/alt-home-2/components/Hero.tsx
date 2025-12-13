'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState, useEffect } from 'react';
import PlacesAutocomplete, {
  geocodeByAddress,
} from '../../lib/placesAutocomplete';
import { isInServiceArea } from '../../utils/serviceArea';
import styles from './Hero.module.css';

export default function Hero() {
  const router = useRouter();
  const [address, setAddress] = useState('');
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
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      // With loading=async, we need to wait for the library to be ready
      let attempts = 0;
      const maxAttempts = 50; // 5 seconds total (50 * 100ms)
      
      const checkPlacesLibrary = () => {
        attempts++;
        if ((window as any).google?.maps?.places) {
          setIsScriptLoaded(true);
        } else if (attempts < maxAttempts) {
          // Retry after a short delay if library isn't ready yet
          setTimeout(checkPlacesLibrary, 100);
        } else {
          console.error("Google Maps Places library failed to load after multiple attempts");
          setIsScriptLoaded(false);
        }
      };
      // Start checking immediately and retry if needed
      checkPlacesLibrary();
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

  const handleSubmit = async (e: FormEvent) => {
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
        router.push(`/quote?address=${encodeURIComponent(formattedAddress)}`);
      } catch (error) {
        // If geocoding fails, proceed with original address (user can validate later)
        router.push(`/quote?address=${encodeURIComponent(address.trim())}`);
      }
    } else {
      // If no Google Maps, proceed with original address
      router.push(`/quote?address=${encodeURIComponent(address.trim())}`);
    }
  };

  const handleSkipAddress = () => {
    router.push('/quote?step=manual-address-entry');
  };

  return (
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        <div className={styles.heroText}>
          <h1 className={`${styles.headline} ${styles.headlineDesktop}`}>We Don't Just Maintain Pools, <br />We Maintain Trust</h1>
          <h1 className={`${styles.headline} ${styles.headlineMobile}`}>We Don't Just Maintain Pools, We Maintain Trust</h1>
          <p className={styles.subheadline}>
            Reliable, friendly service that keeps your water clean, clear, and worry-free.
          </p>
          <form onSubmit={handleSubmit} className={styles.formContainer}>
            <div className={styles.autocompleteWrapper}>
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
                    <>
                      <input
                        {...getInputProps({
                          placeholder: "Enter your address",
                          className: styles.addressInput,
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
                    </>
                  )}
                </PlacesAutocomplete>
              ) : (
                <input
                  type="text"
                  placeholder="Enter your address"
                  className={styles.addressInput}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              )}
            </div>
            <button type="submit" className={styles.ctaButton}>See My Price</button>
          </form>
          <button
            onClick={handleSkipAddress}
            className={styles.skipLink}
            type="button"
          >
            Can't find my address
          </button>
        </div>
      </div>
    </section>
  );
}


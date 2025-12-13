'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState, useEffect } from 'react';
import PlacesAutocomplete, {
  geocodeByAddress,
} from 'react-places-autocomplete';
import { isInServiceArea } from '../utils/serviceArea';
import AltHeroHeader from './AltHeroHeader';
import styles from './AltHero.module.css';

export default function AltHero() {
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
      <AltHeroHeader />
      <div className={styles.heroContent}>
        <div className={styles.heroText}>
          <div className={styles.logoWrap}>
            <svg
              className={styles.logoImage}
              width="377"
              height="174"
              viewBox="0 0 789.14 351.78"
              preserveAspectRatio="xMidYMid meet"
              shapeRendering="geometricPrecision"
              textRendering="geometricPrecision"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
            >
              <defs>
                <radialGradient id="radial-gradient-combination" cx="391.82" cy="132.19" fx="391.82" fy="132.19" r="245.54" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor="#bde4ff"/>
                  <stop offset="1" stopColor="#66b2ff"/>
                </radialGradient>
                <filter id="drop-shadow-1-combination" x="123.43" y="12.88" width="523" height="223" filterUnits="userSpaceOnUse">
                  <feOffset dx="0" dy="0"/>
                  <feGaussianBlur result="blur" stdDeviation="10"/>
                  <feFlood floodColor="#000" floodOpacity=".15"/>
                  <feComposite in2="blur" operator="in"/>
                  <feComposite in="SourceGraphic"/>
                </filter>
                <filter id="drop-shadow-2-combination" x="442.43" y="18.88" width="102" height="94" filterUnits="userSpaceOnUse">
                  <feOffset dx="0" dy="0"/>
                  <feGaussianBlur result="blur-2" stdDeviation="10"/>
                  <feFlood floodColor="#000" floodOpacity=".15"/>
                  <feComposite in2="blur-2" operator="in"/>
                  <feComposite in="SourceGraphic"/>
                </filter>
              </defs>
              <g id="Layer_4" data-name="Layer 4">
                <g>
                  <g shapeRendering="geometricPrecision">
                    <path d="M0,346.08v-56.82c0-3.4,1.9-5.29,5.39-5.29h22.67c13.68,0,21.27,9.39,21.27,20.47s-7.69,20.47-21.27,20.47H9.99v21.17c0,2.7-2.2,4.99-4.89,4.99s-5.09-2.3-5.09-4.99ZM26.76,292.76H9.99v23.37h16.78c7.19,0,12.28-4.69,12.28-11.68s-5.09-11.68-12.28-11.68Z" style={{fill: '#002147'}}/>
                    <path d="M95.37,282.87c19.87,0,33.55,14.68,33.55,34.45s-13.68,34.45-33.55,34.45-33.55-14.68-33.55-34.45,13.68-34.45,33.55-34.45ZM95.37,291.76c-14.28,0-23.27,10.88-23.27,25.57s8.99,25.57,23.27,25.57,23.27-10.99,23.27-25.57-9.19-25.57-23.27-25.57Z" style={{fill: '#002147'}}/>
                    <path d="M176.76,282.87c19.87,0,33.55,14.68,33.55,34.45s-13.68,34.45-33.55,34.45-33.55-14.68-33.55-34.45,13.68-34.45,33.55-34.45ZM176.76,291.76c-14.28,0-23.27,10.88-23.27,25.57s8.99,25.57,23.27,25.57,23.27-10.99,23.27-25.57-9.19-25.57-23.27-25.57Z" style={{fill: '#002147'}}/>
                    <path d="M227.4,345.29v-56.82c0-2.7,2.3-4.99,5.09-4.99s4.89,2.3,4.89,4.99v53.33h26.26c2.4,0,4.49,1.9,4.49,4.29s-2.1,4.49-4.49,4.49h-30.86c-3.5,0-5.39-1.9-5.39-5.29Z" style={{fill: '#002147'}}/>
                    <path d="M311.48,340.29c0-2.6,2.2-4.79,4.79-4.79,1.1,0,2.2.4,3,1,4.49,3.59,10.39,6.39,17.68,6.39,10.79,0,14.58-5.49,14.58-10.29,0-6.99-7.59-8.99-16.08-11.19-10.69-2.8-23.07-5.89-23.07-19.47,0-10.99,9.69-18.97,24.37-18.97,8.09,0,14.48,2.2,20.57,6.49,1.3.8,2.1,2.2,2.1,3.8,0,2.6-2.1,4.79-4.69,4.79-1.1,0-2.1-.4-2.8-.9-4.69-3.7-10.49-5.29-15.98-5.29-8.19,0-13.28,3.8-13.28,9.39,0,5.99,7.19,7.89,15.48,9.99,10.88,2.9,23.57,6.29,23.57,20.47,0,10.39-7.19,20.07-25.17,20.07-9.79,0-17.48-3-23.17-7.69-1.1-.9-1.9-2.2-1.9-3.79Z" style={{fill: '#002147'}}/>
                    <path d="M378.29,345.29v-56.02c0-3.4,1.9-5.29,5.39-5.29h35.35c2.4,0,4.49,2,4.49,4.49s-2.1,4.29-4.49,4.29h-30.76v19.47h30.06c2.4,0,4.49,1.9,4.49,4.29s-2.1,4.49-4.49,4.49h-30.06v20.77h30.76c2.4,0,4.49,1.9,4.49,4.29s-2.1,4.49-4.49,4.49h-35.35c-3.5,0-5.39-1.9-5.39-5.29Z" style={{fill: '#002147'}}/>
                    <path d="M490.14,346.48c0,2.1-1.9,4.59-4.69,4.59-1.7,0-3.3-.8-4.19-2.1l-16.68-24.07h-14.08v21.17c0,2.7-2.2,4.99-4.89,4.99s-5.09-2.3-5.09-4.99v-56.82c0-3.4,1.9-5.29,5.39-5.29h22.67c12.68,0,21.37,8.19,21.37,20.47,0,11.18-6.99,17.58-14.88,19.17l14.08,19.77c.6.7,1,1.5,1,3.1ZM450.5,316.12h16.78c7.19,0,12.38-4.69,12.38-11.68s-5.19-11.68-12.38-11.68h-16.78v23.37Z" style={{fill: '#002147'}}/>
                    <path d="M523.8,345.48l-21.77-54.83c-.3-.6-.5-1.2-.5-1.9,0-2.9,2.4-5.29,5.29-5.29,2.3,0,4.19,1.4,4.99,3.4l20.17,52.83,20.27-52.83c.7-2,2.7-3.4,4.89-3.4,3,0,5.29,2.4,5.29,5.29,0,.7-.1,1.3-.4,1.9l-21.77,54.83c-1.3,3.2-4.49,5.59-8.29,5.59s-6.89-2.4-8.19-5.59Z" style={{fill: '#002147'}}/>
                    <path d="M577.73,346.08v-57.62c0-2.7,2.3-4.99,5.09-4.99s4.89,2.3,4.89,4.99v57.62c0,2.7-2.2,4.99-4.89,4.99s-5.09-2.3-5.09-4.99Z" style={{fill: '#002147'}}/>
                    <path d="M604.79,317.32c0-20.47,15.18-34.45,34.15-34.45,10.39,0,17.78,3.89,23.17,9.79.8.8,1.2,2,1.2,3.2,0,2.6-2.1,4.69-4.69,4.69-1.5,0-2.8-.6-3.6-1.6-3.89-4.39-9.59-7.19-16.08-7.19-13.48,0-23.87,10.59-23.87,25.57s10.39,25.57,23.87,25.57c6.49,0,12.18-2.8,16.18-7.19.8-1,2-1.6,3.5-1.6,2.6,0,4.69,2.1,4.69,4.69,0,1.2-.4,2.4-1.2,3.2-5.49,5.89-12.78,9.79-23.17,9.79-18.97,0-34.15-13.98-34.15-34.45Z" style={{fill: '#002147'}}/>
                    <path d="M679.59,345.29v-56.02c0-3.4,1.9-5.29,5.39-5.29h35.35c2.4,0,4.49,2,4.49,4.49s-2.1,4.29-4.49,4.29h-30.76v19.47h30.06c2.4,0,4.49,1.9,4.49,4.29s-2.1,4.49-4.49,4.49h-30.06v20.77h30.76c2.4,0,4.49,1.9,4.49,4.29s-2.1,4.49-4.49,4.49h-35.35c-3.5,0-5.39-1.9-5.39-5.29Z" style={{fill: '#002147'}}/>
                    <path d="M738.91,340.29c0-2.6,2.2-4.79,4.79-4.79,1.1,0,2.2.4,3,1,4.49,3.59,10.39,6.39,17.68,6.39,10.79,0,14.58-5.49,14.58-10.29,0-6.99-7.59-8.99-16.08-11.19-10.69-2.8-23.07-5.89-23.07-19.47,0-10.99,9.69-18.97,24.37-18.97,8.09,0,14.48,2.2,20.57,6.49,1.3.8,2.1,2.2,2.1,3.8,0,2.6-2.1,4.79-4.69,4.79-1.1,0-2.1-.4-2.8-.9-4.69-3.7-10.49-5.29-15.98-5.29-8.19,0-13.28,3.8-13.28,9.39,0,5.99,7.19,7.89,15.48,9.99,10.88,2.9,23.57,6.29,23.57,20.47,0,10.39-7.19,20.07-25.17,20.07-9.79,0-17.48-3-23.17-7.69-1.1-.9-1.9-2.2-1.9-3.79Z" style={{fill: '#002147'}}/>
                  </g>
                  <g>
                    <path d="M426.48,16.29L140.23,122.78l.06,5.58c-.16.87-1.14,1.51-2.23,1.28-.83-.17-1.38-.86-1.38-1.6v-2.03h0v-18.35c0-3.21-3.02-5.84-6.72-5.84h0c-2.81,0-5.24,1.53-6.24,3.67,0,0,0,0,0,0l3.16,1.59s0,0,0,0c.37-1.46,2.1-2.5,3.96-2.04,1.37.34,2.26,1.49,2.26,2.72v3.52s0,0,0,0l-14.24,5.44s0,0,0,0v3.41s0,0,0,0l11.71-4.39,2.52-.94s0,0,0,0v3.44s0,0,0,0l-14.23,5.3h0v3.44s0,0,0,0l12.66-4.71,1.51-.56s0,0,0,0v3.43s0,0,0,0l-13.22,4.92c-.31.12-.64.15-.96.11,0,0,0,0,0,0v7.16c0,.23-.05.44-.15.63h0s-.66.88-1.54.87c-1.04,0-1.94-.82-1.94-1.51v-3.46h0v-18.35c0-3.21-3.02-5.84-6.72-5.84-2.82,0-5.24,1.53-6.24,3.67,0,0,0,0,0,0l3.16,1.59s0,0,0,0c.37-1.46,2.1-2.5,3.96-2.04,1.37.34,2.26,1.49,2.26,2.72v3.83h0s0-.05,0-.05h0l-.09,13.82-47.09,17.72c24.65,9.47,216.5,82.97,216.5,82.97,49.05,18.82,104.92,18.93,154.07.31l284.1-107.66L426.48,16.29Z" style={{fill: 'url(#radial-gradient-combination)', fillRule: 'evenodd'}}/>
                    <path d="M59.78,149.11l48.14-17.91v-10.41s-61.19,23.19-61.19,23.19l.21.08-.21.08,6.19,2.35h0c1,.38,3.41,1.3,6.85,2.62Z" style={{fill: '#0052cc', fillRule: 'evenodd'}}/>
                    <polygon points="426.64 0 426.64 0 140.07 108.61 140.07 108.61 140.19 119.13 426.67 12.37 726.01 123.94 739.21 118.94 739.21 118.94 426.64 0" style={{fill: '#0052cc', fillRule: 'evenodd'}}/>
                  </g>
                  <g>
                    <g shapeRendering="geometricPrecision" textRendering="geometricPrecision">
                      <path d="M258.55,176.92h-57l-9.14,26.98h-38.95l55.26-152.74h43.08l55.26,152.74h-39.38l-9.14-26.98ZM248.98,148.2l-18.93-55.92-18.71,55.92h37.64Z" style={{fill: '#002147'}}/>
                      <path d="M358.63,173.22h52.65v30.68h-94.21v-29.59l50.48-61.14h-50.04v-30.68h92.69v29.59l-51.57,61.14Z" style={{fill: '#002147'}}/>
                      <path d="M551.62,82.49v121.41h-37.21v-16.54c-3.77,5.37-8.89,9.68-15.34,12.95-6.46,3.26-13.6,4.9-21.43,4.9-9.28,0-17.48-2.07-24.59-6.2-7.11-4.13-12.62-10.12-16.54-17.95-3.92-7.83-5.87-17.04-5.87-27.63v-70.93h36.99v65.93c0,8.13,2.1,14.43,6.31,18.93,4.21,4.5,9.86,6.74,16.97,6.74s12.98-2.25,17.19-6.74c4.21-4.49,6.31-10.8,6.31-18.93v-65.93h37.21Z" style={{fill: '#002147'}}/>
                      <path d="M615.59,42.89v161.01h-37.21V42.89h37.21Z" style={{fill: '#002147'}}/>
                    </g>
                    <polyline points="472.48 75.47 475.2 82 514.03 64.99 504.18 49.5" style={{fill: '#002147'}} shapeRendering="geometricPrecision"/>
                  </g>
                </g>
              </g>
            </svg>
          </div>
          <p className={styles.subtitle}>
            We don't just maintain pools — we maintain trust.
          </p>
          <p style={{ fontSize: 13, color: '#5a6574', opacity: 0.85 }}>
            Request a quote in just a couple minutes.
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
            <div className={styles.buttonContainer}>
              <button type="submit" className={styles.primaryButton}>Get a Quote</button>
              <button
                onClick={handleSkipAddress}
                className={styles.skipLink}
                type="button"
              >
                Can't find my address
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

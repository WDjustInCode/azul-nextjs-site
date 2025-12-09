// List of cities where we provide service
export const SERVICE_CITIES = [
  "San Antonio",
  "Alamo Heights",
  "Atascosa",
  "Balcones Heights",
  "Boerne",
  "Bulverde",
  "Castle Hills",
  "China Grove",
  "Cibolo",
  "Converse",
  "Elmendorf",
  "Fair Oaks Ranch",
  "Floresville",
  "Garden Ridge",
  "Helotes",
  "Kirby",
  "La Vernia",
  "Leon Valley",
  "Live Oak",
  "Marion",
  "Schertz",
  "Selma",
  "Somerset",
  "St. Hedwig",
  "Terrell Hills",
  "Universal City",
  "Von Ormy",
  "Windcrest",
];

/**
 * Extracts the city from a Google Places address component
 */
export function extractCityFromAddressComponents(addressComponents: any[]): string | null {
  if (!addressComponents || !Array.isArray(addressComponents)) {
    return null;
  }

  // Try to find city in different possible fields
  const cityComponent = addressComponents.find(
    (component) =>
      component.types.includes("locality") ||
      component.types.includes("sublocality") ||
      component.types.includes("sublocality_level_1")
  );

  return cityComponent ? cityComponent.long_name : null;
}

/**
 * Checks if an address is in our service area
 * @param formattedAddress - The full formatted address string
 * @param addressComponents - The address components from Google Places API
 * @returns true if the address is in our service area, false otherwise
 */
export function isInServiceArea(
  formattedAddress: string,
  addressComponents?: any[]
): boolean {
  let city: string | null = null;

  // First try to extract from address components if provided
  if (addressComponents) {
    city = extractCityFromAddressComponents(addressComponents);
  }

  // If we couldn't get city from components, try to parse from formatted address
  if (!city && formattedAddress) {
    // Try to extract city from formatted address (usually format: "Street, City, State ZIP")
    const parts = formattedAddress.split(",");
    if (parts.length >= 2) {
      city = parts[1].trim();
    }
  }

  if (!city) {
    return false;
  }

  // Check if city is in our service area (case-insensitive)
  return SERVICE_CITIES.some(
    (serviceCity) => serviceCity.toLowerCase() === city!.toLowerCase()
  );
}


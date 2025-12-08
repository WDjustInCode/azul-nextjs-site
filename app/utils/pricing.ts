import { QuoteState, PoolSize, ServiceCategory } from "../quote/components/types";

/**
 * Competitive pool service pricing for San Antonio, TX
 * Based on market research: $150-$400/month for weekly full-service,
 * $99-$120/month for chemical-only, $30-$39 per visit
 */

// Base monthly prices (for weekly service)
const BASE_PRICES = {
  regular: 200, // Full-service weekly maintenance (mid-range of $150-$400)
  equipment: 150, // Equipment service/repair (per visit basis, converted to monthly estimate)
  filter: 110, // Filter/salt cell cleaning (chemical-only range)
  green: 350, // Green-to-clean rescue (premium service, higher end)
  other: 200, // Other services (default to regular pricing)
} as const;

// Pool size multipliers
const SIZE_MULTIPLIERS: Record<PoolSize, number> = {
  small: 0.85, // 15% discount for small pools
  medium: 1.0, // Base price
  large: 1.25, // 25% premium for large pools
};

// Special condition add-ons (monthly)
const SPECIAL_CONDITION_FEES = {
  saltwaterPool: 15, // Saltwater pools require special handling
  treesOverPool: 20, // Extra cleaning time for debris
  aboveGroundPool: -30, // Discount (chemical-only service, no cleaning)
} as const;

// Pool type adjustments
const POOL_TYPE_MULTIPLIERS = {
  "pool-only": 1.0,
  "pool-spa": 1.15, // 15% premium for pool + spa combo
  "hot-tub": 0.6, // 40% discount for hot tub only (smaller volume)
  "other": 1.0,
} as const;

// Equipment service pricing (one-time or per-visit estimates)
const EQUIPMENT_PRICES: Record<string, number> = {
  "Pool pump": 120,
  "Pool filter": 100,
  "Pool heater": 150,
  "Salt system": 110,
  "Automation system": 180,
  "I'm not sure / something else": 130, // Default for unknown equipment
};

/**
 * Calculate the monthly service price based on the quote state
 * @param quoteState - The complete quote state object
 * @returns Object containing pricing breakdown and total
 */
export function calculateServicePrice(quoteState: QuoteState): {
  basePrice: number;
  sizeAdjustment: number;
  poolTypeAdjustment: number;
  specialConditionFees: number;
  equipmentFees: number;
  subtotal: number;
  monthlyTotal: number;
  breakdown: string[];
} {
  const breakdown: string[] = [];
  let basePrice = 0;
  let sizeAdjustment = 0;
  let poolTypeAdjustment = 0;
  let specialConditionFees = 0;
  let equipmentFees = 0;

  // Get base price based on service category
  if (quoteState.serviceCategory) {
    basePrice = BASE_PRICES[quoteState.serviceCategory];
    breakdown.push(
      `Base ${quoteState.serviceCategory} service: $${basePrice.toFixed(2)}/month`
    );
  } else {
    // Default to regular service if no category selected
    basePrice = BASE_PRICES.regular;
    breakdown.push(`Base service: $${basePrice.toFixed(2)}/month`);
  }

  // Apply pool size multiplier
  if (quoteState.poolSize) {
    const multiplier = SIZE_MULTIPLIERS[quoteState.poolSize];
    sizeAdjustment = basePrice * (multiplier - 1);
    basePrice = basePrice * multiplier;
    if (sizeAdjustment !== 0) {
      breakdown.push(
        `Pool size (${quoteState.poolSize}): ${sizeAdjustment > 0 ? "+" : ""}$${sizeAdjustment.toFixed(2)}`
      );
    }
  }

  // Apply pool type multiplier
  if (quoteState.poolType) {
    const multiplier = POOL_TYPE_MULTIPLIERS[quoteState.poolType];
    poolTypeAdjustment = basePrice * (multiplier - 1);
    basePrice = basePrice * multiplier;
    if (poolTypeAdjustment !== 0) {
      breakdown.push(
        `Pool type (${quoteState.poolType}): ${poolTypeAdjustment > 0 ? "+" : ""}$${poolTypeAdjustment.toFixed(2)}`
      );
    }
  }

  // Add special condition fees
  if (quoteState.specialFlags) {
    if (quoteState.specialFlags.saltwaterPool) {
      specialConditionFees += SPECIAL_CONDITION_FEES.saltwaterPool;
      breakdown.push(
        `Saltwater pool: +$${SPECIAL_CONDITION_FEES.saltwaterPool.toFixed(2)}/month`
      );
    }
    if (quoteState.specialFlags.treesOverPool) {
      specialConditionFees += SPECIAL_CONDITION_FEES.treesOverPool;
      breakdown.push(
        `Trees over pool: +$${SPECIAL_CONDITION_FEES.treesOverPool.toFixed(2)}/month`
      );
    }
    if (quoteState.specialFlags.aboveGroundPool) {
      specialConditionFees += SPECIAL_CONDITION_FEES.aboveGroundPool;
      breakdown.push(
        `Above-ground pool: $${SPECIAL_CONDITION_FEES.aboveGroundPool.toFixed(2)}/month`
      );
    }
  }

  // Add equipment service fees (for equipment category)
  if (
    quoteState.serviceCategory === "equipment" &&
    quoteState.equipmentSelections &&
    quoteState.equipmentSelections.length > 0
  ) {
    // For equipment service, calculate based on selected equipment
    // This is typically a one-time or per-visit fee, but we'll estimate monthly
    const equipmentTotal = quoteState.equipmentSelections.reduce((sum, equipment) => {
      const price = EQUIPMENT_PRICES[equipment] || EQUIPMENT_PRICES["I'm not sure / something else"];
      return sum + price;
    }, 0);

    // Convert to monthly estimate (assuming 1-2 visits per month for equipment service)
    equipmentFees = equipmentTotal * 0.5; // Average of 0.5 visits per month
    breakdown.push(
      `Equipment service (${quoteState.equipmentSelections.length} item${quoteState.equipmentSelections.length > 1 ? "s" : ""}): $${equipmentFees.toFixed(2)}/month`
    );
  }

  const subtotal = basePrice + specialConditionFees + equipmentFees;
  const monthlyTotal = Math.max(0, subtotal); // Ensure non-negative

  breakdown.push(`---`);
  breakdown.push(`Monthly total: $${monthlyTotal.toFixed(2)}`);

  return {
    basePrice: BASE_PRICES[quoteState.serviceCategory || "regular"],
    sizeAdjustment,
    poolTypeAdjustment,
    specialConditionFees,
    equipmentFees,
    subtotal,
    monthlyTotal,
    breakdown,
  };
}

/**
 * Get a formatted price string for display
 * @param quoteState - The complete quote state object
 * @returns Formatted price string
 */
export function getFormattedPrice(quoteState: QuoteState): string {
  const pricing = calculateServicePrice(quoteState);
  return `$${pricing.monthlyTotal.toFixed(2)}/month`;
}

/**
 * Get annual price estimate
 * @param quoteState - The complete quote state object
 * @returns Annual price
 */
export function getAnnualPrice(quoteState: QuoteState): number {
  const pricing = calculateServicePrice(quoteState);
  return pricing.monthlyTotal * 12;
}


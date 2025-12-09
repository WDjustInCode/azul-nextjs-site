import { QuoteState, PoolSize, ServiceCategory } from "../quote/components/types";

/**
 * Competitive pool service pricing for San Antonio, TX
 * Calibrated from market research:
 * - Weekly full-service, medium in-ground pool: ~ $210/month
 * - Bi-weekly and monthly variants are derived for display only
 */

// Base prices (for WEEKLY full-service or equivalent, MEDIUM pool)
// For one-time categories, this is a base job anchor (not monthly).
const BASE_PRICES: Record<ServiceCategory, number> = {
  regular: 210, // Weekly full-service maintenance, medium in-ground pool
  equipment: 150, // Base job anchor for equipment (trip + first hour, etc.)
  filter: 150, // Weekly chemical-only / light service for medium pool
  green: 350, // One-time green-to-clean baseline for a small/light-medium scenario
  other: 210, // Default to regular pricing
} as const;

// Pool size multipliers tuned to land near 190/210/230 for small/medium/large weekly full-service
const SIZE_MULTIPLIERS: Record<PoolSize, number> = {
  small: 190 / 210, // ≈ 0.90 – 15k gal or less
  medium: 1.0,      // 15–25k gal
  large: 230 / 210, // ≈ 1.095 – 25k+ gal
};

// Special condition add-ons (recurring, per month)
const SPECIAL_CONDITION_FEES: Record<
  "saltwaterPool" | "treesOverPool" | "aboveGroundPool",
  number
> = {
  saltwaterPool: 0,   // Treat saltwater as neutral; cost difference shows in salt-cell maintenance
  treesOverPool: 20,  // Extra time/chemicals for heavy debris
  aboveGroundPool: -20, // Slight discount vs in-ground baseline
};

// Pool type adjustments
const POOL_TYPE_MULTIPLIERS = {
  "pool-only": 1.0,
  "pool-spa": 1.15, // 15% premium for pool + spa combo
  "hot-tub": 0.6,   // Hot tub only (smaller volume)
  other: 1.0,
} as const;

// Equipment service pricing (per-visit / per-job anchors)
const EQUIPMENT_PRICES: Record<string, number> = {
  "Pool pump": 120,
  "Pool filter": 100,
  "Pool heater": 150,
  "Salt system": 110,
  "Automation system": 180,
  "I'm not sure / something else": 130,
};

type FrequencyVariants = {
  weekly: number | null;
  biWeekly: number | null;
  monthly: number | null;
};

/**
 * Calculate the service price based on the quote state.
 *
 * - Recurring categories (regular, filter, other):
 *   * main number is WEEKLY service per month
 *   * we also compute “what it would be” for bi-weekly and monthly and list them
 *
 * - One-time categories (green, equipment):
 *   * totals are per-job / one-time
 *   * no frequency variants, no "/month" wording
 */
export function calculateServicePrice(quoteState: QuoteState): {
  basePrice: number;
  sizeAdjustment: number;
  poolTypeAdjustment: number;
  specialConditionFees: number;
  equipmentFees: number;
  subtotal: number;
  monthlyTotal: number;
  isOneTime: boolean;
  frequencyVariants: FrequencyVariants;
  breakdown: string[];
} {
  const breakdown: string[] = [];
  let basePrice = 0;
  let sizeAdjustment = 0;
  let poolTypeAdjustment = 0;
  let specialConditionFees = 0;
  let equipmentFees = 0;

  const serviceCategory: ServiceCategory =
    quoteState.serviceCategory || "regular";

  const isRecurringCategory =
    serviceCategory === "regular" ||
    serviceCategory === "filter" ||
    serviceCategory === "other";

  // Treat BOTH green and equipment as true one-time jobs
  const isOneTime =
    serviceCategory === "green" || serviceCategory === "equipment";

  // 1. Base price from service category
  // - Recurring: weekly, medium pool baseline (per month)
  // - One-time: base job anchor
  basePrice = BASE_PRICES[serviceCategory];
  breakdown.push(
    `Base ${serviceCategory} service${
      isRecurringCategory ? " (weekly, medium pool)" : " (base job)"
    }: $${basePrice.toFixed(2)}`
  );

  // 2. Pool size multiplier (applied to both recurring and one-time anchors)
  if (quoteState.poolSize) {
    const multiplier = SIZE_MULTIPLIERS[quoteState.poolSize];
    const before = basePrice;
    basePrice = basePrice * multiplier;
    sizeAdjustment = basePrice - before;

    if (sizeAdjustment !== 0) {
      breakdown.push(
        `Pool size (${quoteState.poolSize}): ${
          sizeAdjustment > 0 ? "+" : ""
        }$${sizeAdjustment.toFixed(2)}`
      );
    }
  }

  // 3. Pool type multiplier
  if (quoteState.poolType) {
    const multiplier = POOL_TYPE_MULTIPLIERS[quoteState.poolType];
    const before = basePrice;
    basePrice = basePrice * multiplier;
    poolTypeAdjustment = basePrice - before;

    if (poolTypeAdjustment !== 0) {
      breakdown.push(
        `Pool type (${quoteState.poolType}): ${
          poolTypeAdjustment > 0 ? "+" : ""
        }$${poolTypeAdjustment.toFixed(2)}`
      );
    }
  }

  // 4. Special condition fees (only really meaningful for recurring,
  // but we can leave the aboveGround discount in for one-time as well)
  if (quoteState.specialFlags) {
    if (quoteState.specialFlags.saltwaterPool) {
      specialConditionFees += SPECIAL_CONDITION_FEES.saltwaterPool;
      if (SPECIAL_CONDITION_FEES.saltwaterPool !== 0) {
        breakdown.push(
          `Saltwater pool: +$${SPECIAL_CONDITION_FEES.saltwaterPool.toFixed(
            2
          )}/month`
        );
      }
    }
    if (quoteState.specialFlags.treesOverPool) {
      specialConditionFees += SPECIAL_CONDITION_FEES.treesOverPool;
      if (isRecurringCategory) {
        breakdown.push(
          `Trees over pool: +$${SPECIAL_CONDITION_FEES.treesOverPool.toFixed(
            2
          )}/month`
        );
      } else {
        breakdown.push(
          `Trees over pool: +$${SPECIAL_CONDITION_FEES.treesOverPool.toFixed(
            2
          )} (extra debris handling)`
        );
      }
    }
    if (quoteState.specialFlags.aboveGroundPool) {
      specialConditionFees += SPECIAL_CONDITION_FEES.aboveGroundPool;
      if (isRecurringCategory) {
        breakdown.push(
          `Above-ground pool: $${SPECIAL_CONDITION_FEES.aboveGroundPool.toFixed(
            2
          )}/month`
        );
      } else {
        breakdown.push(
          `Above-ground pool: $${SPECIAL_CONDITION_FEES.aboveGroundPool.toFixed(
            2
          )} (simpler setup)`
        );
      }
    }
  }

  // 5. Equipment add-on estimate (ONE-TIME, not monthly)
  if (
    serviceCategory === "equipment" &&
    quoteState.equipmentSelections &&
    quoteState.equipmentSelections.length > 0
  ) {
    const equipmentTotal = quoteState.equipmentSelections.reduce(
      (sum, equipment) => {
        const price =
          EQUIPMENT_PRICES[equipment] ||
          EQUIPMENT_PRICES["I'm not sure / something else"];
        return sum + price;
      },
      0
    );

    equipmentFees = equipmentTotal;
    breakdown.push(
      `Equipment items (${quoteState.equipmentSelections.length}): $${equipmentFees.toFixed(
        2
      )} (per-job estimate)`
    );
  }

  // 6. Subtotal
  const subtotal = basePrice + specialConditionFees + equipmentFees;
  const monthlyTotal = Math.max(0, subtotal);

  // 7. Frequency variants (for display only; recurring categories only)
  let frequencyVariants: FrequencyVariants = {
    weekly: null,
    biWeekly: null,
    monthly: null,
  };

  breakdown.push(`---`);

  if (isRecurringCategory) {
    // Interpret monthlyTotal as WEEKLY service per month
    frequencyVariants.weekly = monthlyTotal;
    frequencyVariants.biWeekly = monthlyTotal * 0.65; // “every other week” estimate
    frequencyVariants.monthly = monthlyTotal * 0.4; // “once per month” estimate

    breakdown.push(
      `Standard weekly service: $${monthlyTotal.toFixed(2)}/month`
    );
    breakdown.push(
      `If serviced every other week: ~$${
        frequencyVariants.biWeekly?.toFixed(2) || "0.00"
      }/month`
    );
    breakdown.push(
      `If serviced once per month: ~$${
        frequencyVariants.monthly?.toFixed(2) || "0.00"
      }/month`
    );
  } else if (isOneTime) {
    breakdown.push(
      `This service is priced as a one-time job. Estimated total: $${monthlyTotal.toFixed(
        2
      )}`
    );
  } else {
    // Non-recurring but not explicitly marked (future-proof)
    breakdown.push(`Estimated service total: $${monthlyTotal.toFixed(2)}`);
  }

  return {
    basePrice: BASE_PRICES[serviceCategory],
    sizeAdjustment,
    poolTypeAdjustment,
    specialConditionFees,
    equipmentFees,
    subtotal,
    monthlyTotal,
    isOneTime,
    frequencyVariants,
    breakdown,
  };
}

/**
 * Get a formatted price string for display
 * - Recurring (regular/filter/other): "$X.XX/month (weekly service)"
 * - One-time (green/equipment): "$X.XX (one-time estimate)"
 */
export function getFormattedPrice(quoteState: QuoteState): string {
  const pricing = calculateServicePrice(quoteState);
  if (pricing.isOneTime) {
    return `$${pricing.monthlyTotal.toFixed(2)} (one-time estimate)`;
  }
  return `$${pricing.monthlyTotal.toFixed(2)}/month (weekly service)`;
}

/**
 * Get annual price estimate.
 * - For recurring services, monthly * 12
 * - For one-time services, just return the job total
 */
export function getAnnualPrice(quoteState: QuoteState): number {
  const pricing = calculateServicePrice(quoteState);
  if (pricing.isOneTime) {
    return pricing.monthlyTotal;
  }
  return pricing.monthlyTotal * 12;
}

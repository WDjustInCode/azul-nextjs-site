export type ServiceCategory =
  | "regular"
  | "equipment"
  | "filter"
  | "green"
  | "other";

export type PoolSize = "small" | "medium" | "large";

export type StepId =
  | "address-entry"
  | "contact-info"
  | "manual-address-entry"
  | "res-or-comm"
  | "res-service-type"
  | "res-regular-pool-type"
  | "res-regular-flags"
  | "res-regular-size"
  | "res-regular-email"
  | "res-equipment-options"
  | "res-equipment-pool-type"
  | "res-equipment-flags"
  | "res-equipment-size"
  | "res-equipment-email"
  | "res-filter-pool-type"
  | "res-filter-flags"
  | "res-filter-size"
  | "res-filter-email"
  | "res-green-email"
  | "res-other-pool-type"
  | "res-other-size"
  | "res-other-email"
  | "above-ground-notice"
  | "commercial-form"
  | "thank-you";

export interface QuoteState {
  address?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;

  segment: "residential" | "commercial" | null;
  serviceCategory: ServiceCategory | null;
  serviceCategoryOther?: string; // text input for "other" service category

  poolType?: "pool-only" | "pool-spa" | "hot-tub" | "other";
  poolTypeOther?: string; // text input for "other" pool type

  equipmentSelections: string[]; // pump, filter, etc
  equipmentOther?: string; // text input for "something else" equipment
  specialFlags: {
    aboveGroundPool: boolean;
    saltwaterPool: boolean;
    treesOverPool: boolean;
    otherNote?: string;
  };

  poolSize?: PoolSize;

  commercial?: {
    email: string;
    company: string;
    message: string;
  };

  // Calculated pricing details (added server-side when quote is submitted)
  pricing?: QuotePricing;

  // Admin lifecycle metadata
  status?: "pending" | "updated" | "accepted";
  createdAt?: string;
  updatedAt?: string;
  acceptedAt?: string;
}

export interface QuotePricing {
  basePrice: number;
  sizeAdjustment: number;
  poolTypeAdjustment: number;
  specialConditionFees: number;
  equipmentFees: number;
  subtotal: number;
  monthlyTotal: number;
  isOneTime: boolean;
  frequencyVariants: {
    weekly: number | null;
    biWeekly: number | null;
    monthly: number | null;
  };
  breakdown: string[];
}


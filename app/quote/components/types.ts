export type ServiceCategory =
  | "regular"
  | "equipment"
  | "filter"
  | "green"
  | "other";

export type PoolSize = "small" | "medium" | "large";

export type StepId =
  | "address-entry"
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

  // forms
  email?: string;

  commercial?: {
    email: string;
    company: string;
    message: string;
  };
}


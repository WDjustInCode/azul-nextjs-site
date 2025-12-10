import { NextRequest, NextResponse } from 'next/server';
import { validateSession } from '../../../lib/auth';
import { getPricingConfig, savePricingConfig } from '../../../lib/storage';
import { clearPricingConfigCache } from '../../../utils/pricing';

// Default pricing configuration (fallback)
const DEFAULT_PRICING_CONFIG = {
  basePrices: {
    regular: 210,
    equipment: 150,
    filter: 150,
    green: 350,
    other: 210,
  },
  sizeMultipliers: {
    small: 190 / 210, // ≈ 0.90
    medium: 1.0,
    large: 230 / 210, // ≈ 1.095
  },
  poolTypeMultipliers: {
    'pool-only': 1.0,
    'pool-spa': 1.15,
    'hot-tub': 0.6,
    other: 1.0,
  },
  specialConditionFees: {
    saltwaterPool: 0,
    treesOverPool: 20,
    aboveGroundPool: -20,
  },
  equipmentPrices: {
    'Pool pump': 120,
    'Pool filter': 100,
    'Pool heater': 150,
    'Salt system': 110,
    'Automation system': 180,
    "I'm not sure / something else": 130,
  },
  frequencyMultipliers: {
    biWeekly: 0.65,
    monthly: 0.4,
  },
};

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const isAuthenticated = await validateSession(request.cookies);
    if (!isAuthenticated) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get pricing configuration from storage
    let config: typeof DEFAULT_PRICING_CONFIG | null = null;
    try {
      config = await getPricingConfig<typeof DEFAULT_PRICING_CONFIG>();
    } catch (error: any) {
      // If file doesn't exist, that's okay - we'll use defaults
      // Only log actual errors (not 404s)
      if (!error?.message?.includes('not found') && !error?.message?.includes('Not Found')) {
        console.error('Error loading pricing config:', error);
      }
      config = null;
    }
    
    // Merge with defaults to ensure all fields are present
    const mergedConfig = {
      basePrices: { ...DEFAULT_PRICING_CONFIG.basePrices, ...(config?.basePrices || {}) },
      sizeMultipliers: { ...DEFAULT_PRICING_CONFIG.sizeMultipliers, ...(config?.sizeMultipliers || {}) },
      poolTypeMultipliers: { ...DEFAULT_PRICING_CONFIG.poolTypeMultipliers, ...(config?.poolTypeMultipliers || {}) },
      specialConditionFees: { ...DEFAULT_PRICING_CONFIG.specialConditionFees, ...(config?.specialConditionFees || {}) },
      equipmentPrices: { ...DEFAULT_PRICING_CONFIG.equipmentPrices, ...(config?.equipmentPrices || {}) },
      frequencyMultipliers: { ...DEFAULT_PRICING_CONFIG.frequencyMultipliers, ...(config?.frequencyMultipliers || {}) },
    };

    return NextResponse.json({
      success: true,
      config: mergedConfig,
      defaults: DEFAULT_PRICING_CONFIG,
    });
  } catch (error) {
    console.error('Error fetching pricing config:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const isAuthenticated = await validateSession(request.cookies);
    if (!isAuthenticated) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { config } = body;

    if (!config || typeof config !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Invalid configuration data' },
        { status: 400 }
      );
    }

    // Validate and merge with defaults
    const validatedConfig = {
      basePrices: { ...DEFAULT_PRICING_CONFIG.basePrices, ...(config.basePrices || {}) },
      sizeMultipliers: { ...DEFAULT_PRICING_CONFIG.sizeMultipliers, ...(config.sizeMultipliers || {}) },
      poolTypeMultipliers: { ...DEFAULT_PRICING_CONFIG.poolTypeMultipliers, ...(config.poolTypeMultipliers || {}) },
      specialConditionFees: { ...DEFAULT_PRICING_CONFIG.specialConditionFees, ...(config.specialConditionFees || {}) },
      equipmentPrices: { ...DEFAULT_PRICING_CONFIG.equipmentPrices, ...(config.equipmentPrices || {}) },
      frequencyMultipliers: { ...DEFAULT_PRICING_CONFIG.frequencyMultipliers, ...(config.frequencyMultipliers || {}) },
    };

    // Save to storage
    await savePricingConfig(validatedConfig);
    
    // Clear cache so new config is used immediately
    clearPricingConfigCache();

    return NextResponse.json({
      success: true,
      config: validatedConfig,
      message: 'Pricing configuration saved successfully',
    });
  } catch (error) {
    console.error('Error saving pricing config:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}


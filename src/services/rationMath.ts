// Pure mathematical functions for WFP / Sphere Humanitarian Ration Planning
// Formulas implemented:
// 1. Total Food Quantity Required (kg): N * R * D * (1 + W) / 1000
// 2. People Served From Stock: Total Available (g) / (R * D * (1 + W))
// 3. Raw to Cooked Kitchen Yield: Cooked Output = Raw Input * Y
// 4. Perishable Meat / Custom Donation Substitution & Offset

export type SphereBenchmark = 'full_relief' | 'single_meal' | 'custom';

export type YieldFactor = {
  rawToCookedMultiplier: number; // Y factor
  defaultWasteMargin: number;    // W factor (0.05 = 5%)
};

export const YIELD_MULTIPLIERS: Record<string, YieldFactor> = {
  rice: { rawToCookedMultiplier: 2.8, defaultWasteMargin: 0.05 },
  dal: { rawToCookedMultiplier: 3.2, defaultWasteMargin: 0.05 },
  khichdi: { rawToCookedMultiplier: 3.8, defaultWasteMargin: 0.05 },
  wheat: { rawToCookedMultiplier: 1.4, defaultWasteMargin: 0.05 },
  maize: { rawToCookedMultiplier: 3.0, defaultWasteMargin: 0.05 },
  chicken: { rawToCookedMultiplier: 0.85, defaultWasteMargin: 0.10 },
  mutton: { rawToCookedMultiplier: 0.80, defaultWasteMargin: 0.10 },
  vegetables: { rawToCookedMultiplier: 0.90, defaultWasteMargin: 0.10 },
};

/**
 * Formula 1: Total Food Quantity Required (kg)
 * Q = (N * R * D * (1 + W)) / 1000
 */
export function calculateFoodRequiredKg(
  peopleCount: number,      // N
  rationGramPerPerson: number, // R
  daysOrMeals: number,         // D
  wasteAllowanceMargin: number = 0.05 // W (e.g. 0.05)
): number {
  if (peopleCount <= 0 || rationGramPerPerson <= 0 || daysOrMeals <= 0) return 0;
  const grossGrams = peopleCount * rationGramPerPerson * daysOrMeals * (1 + wasteAllowanceMargin);
  return Number((grossGrams / 1000).toFixed(2));
}

/**
 * Formula 2: People Served From Available Stock
 * P = AvailableGrams / (R * D * (1 + W))
 */
export function calculatePeopleServedFromStock(
  availableStockKg: number,
  rationGramPerPerson: number,
  daysOrMeals: number = 1,
  wasteAllowanceMargin: number = 0.05
): number {
  if (availableStockKg <= 0 || rationGramPerPerson <= 0 || daysOrMeals <= 0) return 0;
  const availableGrams = availableStockKg * 1000;
  const denominator = rationGramPerPerson * daysOrMeals * (1 + wasteAllowanceMargin);
  return Math.floor(availableGrams / denominator);
}

/**
 * Formula 3: Raw to Cooked Kitchen Yield
 * Cooked Weight (kg) = Raw Weight (kg) * Yield Multiplier (Y)
 */
export function calculateCookedOutputKg(
  rawWeightKg: number,
  commodityKey: string = 'rice'
): number {
  if (rawWeightKg <= 0) return 0;
  const factor = YIELD_MULTIPLIERS[commodityKey.toLowerCase()]?.rawToCookedMultiplier || 2.5;
  return Number((rawWeightKg * factor).toFixed(2));
}

/**
 * Formula 3 (Reverse): Raw Weight Required from Target Cooked Weight
 * Raw Weight (kg) = Target Cooked Weight (kg) / Yield Multiplier (Y)
 */
export function calculateRawRequiredForCookedKg(
  targetCookedKg: number,
  commodityKey: string = 'rice'
): number {
  if (targetCookedKg <= 0) return 0;
  const factor = YIELD_MULTIPLIERS[commodityKey.toLowerCase()]?.rawToCookedMultiplier || 2.5;
  return Number((targetCookedKg / factor).toFixed(2));
}

/**
 * Custom Donor Inflow Meat / Perishable Substitution Offset
 * Calculates how many dry pulse/protein grams a meat donation offsets.
 * 100g Fresh Meat ~ 60g Pulse/Protein Equivalence after cooking loss
 */
export function calculateMeatProteinOffsetKg(freshMeatKg: number): number {
  if (freshMeatKg <= 0) return 0;
  const cookedUsableMeat = freshMeatKg * 0.85;
  return Number((cookedUsableMeat * 0.70).toFixed(2));
}

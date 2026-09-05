import {
  calculateCookedOutputKg,
  calculateFoodRequiredKg,
  calculateMeatProteinOffsetKg,
  calculatePeopleServedFromStock,
  calculateRawRequiredForCookedKg,
} from '../src/services/rationMath';

describe('Sphere & WFP Ration Mathematics', () => {
  test('Formula 1: Total Food Quantity Required (kg)', () => {
    // 2,000 people, 120g rice, 7 days, 5% waste
    const riceRequired = calculateFoodRequiredKg(2000, 120, 7, 0.05);
    expect(riceRequired).toBe(1764);

    // 2,000 people, 40g dal, 7 days, 5% waste
    const dalRequired = calculateFoodRequiredKg(2000, 40, 7, 0.05);
    expect(dalRequired).toBe(588);
  });

  test('Formula 2: People Served From Available Stock', () => {
    // 500 kg stock (500,000g), 150g ration, 1 meal, 5% waste -> 157.5g per person
    const people = calculatePeopleServedFromStock(500, 150, 1, 0.05);
    expect(people).toBe(3174);
  });

  test('Formula 3: Raw to Cooked Kitchen Yield Multipliers', () => {
    // 100 kg raw rice -> 280 kg cooked rice (2.8x)
    expect(calculateCookedOutputKg(100, 'rice')).toBe(280);

    // 50 kg raw lentils -> 160 kg cooked dal soup (3.2x)
    expect(calculateCookedOutputKg(50, 'dal')).toBe(160);

    // Reverse: Target 380 kg cooked Khichdi -> 100 kg raw mix (3.8x)
    expect(calculateRawRequiredForCookedKg(380, 'khichdi')).toBe(100);
  });

  test('Custom Donor Fresh Meat Protein Offset', () => {
    // 100 kg Fresh Chicken donation -> ~59.5 kg dry protein offset
    const offset = calculateMeatProteinOffsetKg(100);
    expect(offset).toBeGreaterThan(50);
    expect(offset).toBeLessThan(70);
  });
});

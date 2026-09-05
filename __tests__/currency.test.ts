import { CURRENCY_OPTIONS, FALLBACK_RATES } from '../src/contexts/CurrencyContext.tsx';

describe('Currency Exchange Rates & Conversion Engine', () => {
  test('Supported ISO Currencies Catalog', () => {
    expect(CURRENCY_OPTIONS.length).toBeGreaterThanOrEqual(10);
    const usd = CURRENCY_OPTIONS.find((c) => c.code === 'USD');
    const inr = CURRENCY_OPTIONS.find((c) => c.code === 'INR');
    const eur = CURRENCY_OPTIONS.find((c) => c.code === 'EUR');
    const jpy = CURRENCY_OPTIONS.find((c) => c.code === 'JPY');

    expect(usd).toBeDefined();
    expect(inr).toBeDefined();
    expect(eur).toBeDefined();
    expect(jpy).toBeDefined();
    expect(usd?.locale).toBe('en-US');
    expect(inr?.locale).toBe('en-IN');
  });

  test('Conversion Math: Base USD to Target Currencies', () => {
    const usdAmount = 100; // $100 USD base cost

    const inrAmount = usdAmount * FALLBACK_RATES['INR'];
    const eurAmount = usdAmount * FALLBACK_RATES['EUR'];
    const gbpAmount = usdAmount * FALLBACK_RATES['GBP'];
    const jpyAmount = usdAmount * FALLBACK_RATES['JPY'];

    expect(inrAmount).toBe(8390);
    expect(eurAmount).toBe(92);
    expect(gbpAmount).toBe(78);
    expect(jpyAmount).toBe(14550);
  });

  test('Intl.NumberFormat Currency Formatting & Decimal Rules', () => {
    // USD formatting
    const formattedUsd = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(100);
    expect(formattedUsd).toContain('100.00');

    // JPY zero decimal rule
    const formattedJpy = new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(14550);
    expect(formattedJpy).toContain('14,550');
    expect(formattedJpy).not.toContain('.00');
  });
});

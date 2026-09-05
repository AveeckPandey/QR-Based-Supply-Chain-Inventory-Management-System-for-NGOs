import { createContext, useContext, useEffect, useState, useMemo, useCallback, type ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CURRENCY_KEY = "hopebox-currency";
const RATES_KEY = "hopebox-exchange-rates";
const RATES_TIME_KEY = "hopebox-rates-timestamp";
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 Hours in ms

export type CurrencyOption = {
  code: string;
  symbol: string;
  label: string;
  locale: string;
};

export const CURRENCY_OPTIONS: CurrencyOption[] = [
  { code: "USD", symbol: "$", label: "USD ($ - US Dollar)", locale: "en-US" },
  { code: "INR", symbol: "₹", label: "INR (₹ - Indian Rupee)", locale: "en-IN" },
  { code: "EUR", symbol: "€", label: "EUR (€ - Euro)", locale: "de-DE" },
  { code: "GBP", symbol: "£", label: "GBP (£ - British Pound)", locale: "en-GB" },
  { code: "JPY", symbol: "¥", label: "JPY (¥ - Japanese Yen)", locale: "ja-JP" },
  { code: "BDT", symbol: "৳", label: "BDT (৳ - Bangladeshi Taka)", locale: "bn-BD" },
  { code: "NPR", symbol: "रु", label: "NPR (रु - Nepalese Rupee)", locale: "ne-NP" },
  { code: "LKR", symbol: "Rs", label: "LKR (Rs - Sri Lankan Rupee)", locale: "si-LK" },
  { code: "KES", symbol: "KSh", label: "KES (KSh - Kenyan Shilling)", locale: "sw-KE" },
  { code: "NGN", symbol: "₦", label: "NGN (₦ - Nigerian Naira)", locale: "en-NG" },
  { code: "PHP", symbol: "₱", label: "PHP (₱ - Philippine Peso)", locale: "fil-PH" },
  { code: "IDR", symbol: "Rp", label: "IDR (Rp - Indonesian Rupiah)", locale: "id-ID" },
  { code: "BRL", symbol: "R$", label: "BRL (R$ - Brazilian Real)", locale: "pt-BR" },
  { code: "ZAR", symbol: "R", label: "ZAR (R - South African Rand)", locale: "en-ZA" },
];

export const FALLBACK_RATES: Record<string, number> = {
  USD: 1.0,
  INR: 83.9,
  EUR: 0.92,
  GBP: 0.78,
  JPY: 145.5,
  BDT: 117.5,
  NPR: 134.2,
  LKR: 302.0,
  KES: 129.0,
  NGN: 1600.0,
  PHP: 56.5,
  IDR: 15400.0,
  BRL: 5.6,
  ZAR: 17.8,
};

type CurrencyContextValue = {
  currency: CurrencyOption;
  setCurrencyCode: (code: string) => Promise<void>;
  rates: Record<string, number>;
  convert: (usdAmount: number, targetCode?: string) => number;
  formatCurrency: (usdAmount: number, overrideCode?: string) => string;
  isLiveRates: boolean;
  refreshRates: () => Promise<void>;
};

const CurrencyContext = createContext<CurrencyContextValue>({
  currency: CURRENCY_OPTIONS[0],
  setCurrencyCode: async () => {},
  rates: FALLBACK_RATES,
  convert: (usdAmount: number) => usdAmount,
  formatCurrency: (usdAmount: number) => `$${usdAmount.toFixed(2)}`,
  isLiveRates: false,
  refreshRates: async () => {},
});

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currencyCode, setCurrencyCodeState] = useState<string>("USD");
  const [rates, setRates] = useState<Record<string, number>>(FALLBACK_RATES);
  const [isLiveRates, setIsLiveRates] = useState<boolean>(false);

  const refreshRates = useCallback(async () => {
    try {
      const storedRates = await AsyncStorage.getItem(RATES_KEY);
      const storedTime = await AsyncStorage.getItem(RATES_TIME_KEY);
      const now = Date.now();

      // Use cache if fresh (< 24 hrs)
      if (storedRates && storedTime && now - Number(storedTime) < CACHE_TTL) {
        setRates(JSON.parse(storedRates));
        setIsLiveRates(true);
        return;
      }

      // Fetch live rates from open.er-api.com
      const res = await fetch("https://open.er-api.com/v6/latest/USD");
      const data = await res.json();

      if (data && data.result === "success" && data.rates) {
        const mergedRates = { ...FALLBACK_RATES, ...data.rates };
        setRates(mergedRates);
        setIsLiveRates(true);
        await AsyncStorage.setItem(RATES_KEY, JSON.stringify(mergedRates));
        await AsyncStorage.setItem(RATES_TIME_KEY, String(now));
      } else if (storedRates) {
        setRates(JSON.parse(storedRates));
      }
    } catch (_err) {
      const storedRates = await AsyncStorage.getItem(RATES_KEY);
      if (storedRates) {
        try {
          setRates(JSON.parse(storedRates));
        } catch (_parseErr) {
          setRates(FALLBACK_RATES);
        }
      }
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      const storedCode = await AsyncStorage.getItem(CURRENCY_KEY);
      if (storedCode && CURRENCY_OPTIONS.some((c) => c.code === storedCode)) {
        setCurrencyCodeState(storedCode);
      }
      await refreshRates();
    };
    void init();
  }, [refreshRates]);

  const setCurrencyCode = async (code: string) => {
    if (!CURRENCY_OPTIONS.some((c) => c.code === code)) return;
    setCurrencyCodeState(code);
    await AsyncStorage.setItem(CURRENCY_KEY, code);
  };

  const currency = useMemo(
    () => CURRENCY_OPTIONS.find((c) => c.code === currencyCode) || CURRENCY_OPTIONS[0],
    [currencyCode]
  );

  const convert = useCallback(
    (usdAmount: number, targetCode?: string): number => {
      const code = targetCode || currency.code;
      const rate = rates[code] ?? FALLBACK_RATES[code] ?? 1.0;
      return (usdAmount || 0) * rate;
    },
    [currency.code, rates]
  );

  const formatCurrency = useCallback(
    (usdAmount: number, overrideCode?: string): string => {
      const targetCode = overrideCode || currency.code;
      const targetOption = CURRENCY_OPTIONS.find((c) => c.code === targetCode) || currency;
      const convertedValue = convert(usdAmount, targetCode);
      const decimals = targetCode === "JPY" ? 0 : 2;

      try {
        return new Intl.NumberFormat(targetOption.locale, {
          style: "currency",
          currency: targetOption.code,
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        }).format(convertedValue);
      } catch (_e) {
        const formattedNum = Number(convertedValue || 0).toLocaleString(undefined, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        });
        return `${targetOption.symbol}${formattedNum}`;
      }
    },
    [currency, convert]
  );

  const value = useMemo(
    () => ({ currency, setCurrencyCode, rates, convert, formatCurrency, isLiveRates, refreshRates }),
    [currency, setCurrencyCode, rates, convert, formatCurrency, isLiveRates, refreshRates]
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  return useContext(CurrencyContext);
}

import { createContext, useContext, useEffect, useState, useMemo, useCallback, type ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CURRENCY_KEY = "hopebox-currency";

export type CurrencyOption = {
  code: string;
  symbol: string;
  label: string;
};

export const CURRENCY_OPTIONS: CurrencyOption[] = [
  { code: "USD", symbol: "$", label: "USD ($ - US Dollar)" },
  { code: "INR", symbol: "₹", label: "INR (₹ - Indian Rupee)" },
  { code: "BDT", symbol: "৳", label: "BDT (৳ - Bangladeshi Taka)" },
  { code: "NPR", symbol: "रु", label: "NPR (रु - Nepalese Rupee)" },
  { code: "LKR", symbol: "Rs", label: "LKR (Rs - Sri Lankan Rupee)" },
  { code: "EUR", symbol: "€", label: "EUR (€ - Euro)" },
  { code: "GBP", symbol: "£", label: "GBP (£ - British Pound)" },
  { code: "KES", symbol: "KSh", label: "KES (KSh - Kenyan Shilling)" },
  { code: "NGN", symbol: "₦", label: "NGN (₦ - Nigerian Naira)" },
  { code: "PHP", symbol: "₱", label: "PHP (₱ - Philippine Peso)" },
  { code: "IDR", symbol: "Rp", label: "IDR (Rp - Indonesian Rupiah)" },
  { code: "BRL", symbol: "R$", label: "BRL (R$ - Brazilian Real)" },
  { code: "ZAR", symbol: "R", label: "ZAR (R - South African Rand)" },
];

type CurrencyContextValue = {
  currency: CurrencyOption;
  setCurrencyCode: (code: string) => Promise<void>;
  formatCurrency: (amount: number) => string;
};

const CurrencyContext = createContext<CurrencyContextValue>({
  currency: CURRENCY_OPTIONS[0],
  setCurrencyCode: async () => {},
  formatCurrency: (amount: number) => `$${amount.toLocaleString()}`,
});

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currencyCode, setCurrencyCodeState] = useState<string>("USD");

  useEffect(() => {
    const loadCurrency = async () => {
      const stored = await AsyncStorage.getItem(CURRENCY_KEY);
      if (stored && CURRENCY_OPTIONS.some((c) => c.code === stored)) {
        setCurrencyCodeState(stored);
      }
    };
    void loadCurrency();
  }, []);

  const setCurrencyCode = async (code: string) => {
    if (!CURRENCY_OPTIONS.some((c) => c.code === code)) return;
    setCurrencyCodeState(code);
    await AsyncStorage.setItem(CURRENCY_KEY, code);
  };

  const currency = useMemo(
    () => CURRENCY_OPTIONS.find((c) => c.code === currencyCode) || CURRENCY_OPTIONS[0],
    [currencyCode]
  );

  const formatCurrency = useCallback(
    (amount: number) => {
      const formattedNum = Number(amount || 0).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      return `${currency.symbol}${formattedNum}`;
    },
    [currency.symbol]
  );

  const value = useMemo(
    () => ({ currency, setCurrencyCode, formatCurrency }),
    [currency, formatCurrency]
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  return useContext(CurrencyContext);
}

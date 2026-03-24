/** Currency symbols resolved at runtime to avoid unicode escape issues in JSX */
export const RUPEE = String.fromCodePoint(0x20B9);
export const POUND = String.fromCodePoint(0x00A3);
export const DOLLAR = '$';

export const CURRENCY_SYMBOLS: Record<string, string> = {
  INR: RUPEE,
  USD: DOLLAR,
  GBP: POUND,
  EUR: String.fromCodePoint(0x20AC),
};

export function formatCurrency(amount: number | string, currency = 'INR'): string {
  const symbol = CURRENCY_SYMBOLS[currency] || currency;
  return `${symbol}${amount}`;
}

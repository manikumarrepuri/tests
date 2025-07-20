export async function convertCurrency(amount: number, from: string, to: string): Promise<string> {
  const response = await fetch(`https://api.exchangerate.host/latest?base=${from}&symbols=${to}`);
  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }
  const data = await response.json();
  const rate = data.rates[to];
  if (typeof rate !== 'number') {
    throw new Error(`Rate for currency '${to}' not found`);
  }
  const converted = amount * rate;
  const symbol = currencySymbol(to);
  return `${symbol}${converted.toFixed(2)}`;
}

export function currencySymbol(code: string): string {
  const symbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    CNY: '¥',
    INR: '₹',
    RUB: '₽',
    KRW: '₩',
    AUD: 'A$',
    CAD: 'C$',
    CHF: 'CHF',
    HKD: 'HK$',
    NZD: 'NZ$',
    SGD: 'S$',
    SEK: 'kr',
    NOK: 'kr',
    MXN: '$',
  };
  return symbols[code] || `${code} `;
}

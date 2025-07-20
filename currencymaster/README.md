# CurrencyMaster

A simple TypeScript library for converting currencies using the [exchangerate.host](https://exchangerate.host) API.

## Usage

```ts
import { convertCurrency } from 'currencymaster';

const result = await convertCurrency(10, 'USD', 'EUR');
console.log(result); // "€9.20" (example)
```

The function returns a string with the converted amount prefixed by the correct symbol when known.

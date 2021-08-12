import { writable, derived, Readable } from 'svelte/store';
import type { Transaction, Active, Portfolio } from '../../common/types';

export const transactions = writable<Transaction[]>([]);

export const prices = writable<{ [key: string]: number | string | null }>({});

export const actives = writable<Active[]>([]);

export const portfolios = writable<Portfolio[]>([]);
export const currentPortfolioId = writable<Portfolio['id'] | null>(null);

export const user = writable(null);

export const total = derived(
  actives,
  (actives) => +actives.reduce((sum, x) => (sum += x.value), 0).toFixed(2)
);

export const balance = derived(
  actives,
  (actives) =>
    +actives.reduce((sum, x) => (sum += x.value + x.profit), 0).toFixed(2)
);

export function createPrices(
  transactions: Transaction[],
  prices = {}
): {
  [key: string]: number | null;
} {
  const unique = Array.from(new Set(transactions.map((x) => x.coinSymbol)));
  return unique.reduce(
    (acc: object, symbol: string) => ({
      ...acc,
      [symbol]: prices[symbol] ?? null,
    }),
    {}
  );
}

export function createActive(prices) {
  return (active: Active) => {
    const price = prices[active.coinSymbol];
    return {
      ...active,
      profit: +(active.count * price - active.value).toFixed(2),
      price,
    };
  };
}

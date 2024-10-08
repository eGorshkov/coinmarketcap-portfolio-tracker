import { writable, derived, Readable } from 'svelte/store';
import type {
  Transaction,
  Active,
  Portfolio,
  User,
  Feature,
  Prices,
} from '../../common/types';

export const transactions = writable<Transaction[]>([]);

export const prices = writable<Prices>({});

export const actives = writable<Active[]>([]);

export const portfolios = writable<Portfolio[]>([]);
export const currentPortfolioId = writable<Portfolio['id'] | null>(null);

export const user = writable<User | null>(null);

export const features = writable<Feature[]>([]);

export const activesBalance = derived(actives, (actives) =>
  actives.length
    ? +actives.reduce((sum, x) => (sum += x.value + x.profit), 0).toFixed(2)
    : 0
);

export const activesTotal = derived(actives, (actives) =>
  actives.length
    ? +actives.reduce((sum, x) => (sum += x.value), 0).toFixed(2)
    : 0
);

export const featuresTotal = derived(features, (features) =>
  features.length
    ? +features.reduce((sum, x) => (sum += x.margin), 0).toFixed(2)
    : 0
);

export const featuresBalance = derived(features, (features) =>
  features.length
    ? +features.reduce((sum, x) => (sum += x.margin + x.pnl), 0).toFixed(2)
    : 0
);

export function createPrices(
  transactions: Transaction[],
  prices: Prices = {}
): Prices {
  const unique = Array.from(new Set(transactions.map((x) => x.coinSymbol)));
  return unique.reduce(
    (acc: object, symbol: string) => ({
      ...acc,
      [symbol]: +prices[symbol]?.lastPrice,
    }),
    {}
  );
}

export function createActive(prices: Prices) {
  return (active: Active) => {
    const price = +prices[active.coinSymbol]?.lastPrice;
    return {
      ...active,
      profit: +(active.count * price - active.value).toFixed(2),
      price,
    };
  };
}

export function createFeature(prices: Prices) {
  return (feature: Feature) => {
    const price = +prices[feature.coinSymbol]?.lastPrice;
    console.log(feature.coinSymbol, price, feature.count, feature.startPrice);

    return {
      ...feature,
      pnl: feature.count * (price - feature.startPrice),
      liquidation: feature.startPrice * (1 - 1 / feature.coefficient),
    };
  };
}

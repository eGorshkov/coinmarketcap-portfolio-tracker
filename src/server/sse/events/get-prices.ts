import fetch from 'node-fetch';
import type { Price } from '../../../common/types';

type GetPricesParams = {
  symbols: string[];
  currency: string;
};

export async function getPrices(params: GetPricesParams) {
  const { symbols = [], currency = 'USDT' } = params;

  const promises = symbols.map((x) =>
    //@ts-ignore
    fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${x + currency}`)
      .then((response: any) => response.json())
      .then((result: Price) => ({ [x]: result }))
      .catch(() => ({ [x]: null }))
  );
  const result = await Promise.all(promises).then((res) =>
    res.reduce((acc: object, price) => ({ ...acc, ...price }), {})
  );

  return result;
}

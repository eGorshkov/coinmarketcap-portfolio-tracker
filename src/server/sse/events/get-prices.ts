import fetch from 'node-fetch';

type GetPricesParams = {
  symbols: string[];
  currency: string;
};

export async function getPrices(params: GetPricesParams) {
  const { symbols = [], currency = 'USDT' } = params;

  const promises = symbols.map((x) =>
    //@ts-ignore
    fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${x + currency}`)
      .then((response: any) => response.json())
      .then((result: any) => ({ [x]: Number(result.price) }))
      .catch(() => ({ [x]: 'Ошибка в запросе' }))
  );
  const result = await Promise.all(promises).then((res) =>
    res.reduce((acc: object, price) => ({ ...acc, ...price }), {})
  );

  return result;
}

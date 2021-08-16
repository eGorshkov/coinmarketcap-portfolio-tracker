import sqlite3 from 'sqlite3';
import { SQLITE_DIR } from '../../constants';
import type { SSE } from '../../sse/sse';
import type { ServerRouteProps } from '../../../common/types';

let intervalSSESend;

function SSESend(sse: SSE) {
  const db = new sqlite3.Database(SQLITE_DIR);

  db.all(`SELECT symbol from ${process.env.ACTIVES_DB}`, [], (err, symbols) => {
    symbols = symbols.map((x) => x.symbol);
    sse.send({
      event: 'get-prices',
      params: { symbols, currency: 'USDT' },
    });
    db.close();
  });
}

function getPrices(props: ServerRouteProps) {
  const { sse } = props;
  if (intervalSSESend) clearInterval(intervalSSESend);
  intervalSSESend = setInterval(() => SSESend(sse), 60000);
  SSESend(sse);
}

export default getPrices;

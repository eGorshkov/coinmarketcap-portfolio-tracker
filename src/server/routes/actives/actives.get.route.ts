import { constants, ServerHttp2Stream } from 'http2';
import sqlite3 from 'sqlite3';
import { SQLITE_DIR } from '../../constants';
import type { ServerRouteProps } from '../../../common/types';

function getActives(props: ServerRouteProps) {
  const { stream } = props;
  const SQL_REQUEST_ALL_TRANSACTIONS = `SELECT 
	ac.id,
	ac.symbol as coinSymbol,
	COUNT(tr.id) as transactionsCount,
	SUM(tr.count) as count,
	SUM(tr.count*tr.coinPrice) as value,
	IFNULL(SUM(tr.count*tr.coinPrice)/SUM(tr.count), 0) as avgPrice
    FROM ${process.env.ACTIVES_DB} ac, (SELECT * FROM ${process.env.ACTIVES_TRANSASCTIONS_DB}) actr, (SELECT * FROM ${process.env.TRANSACTIONS_DB}) tr
	WHERE actr.activityId = ac.id
	AND tr.id = actr.transactionId
	GROUP BY ac.id
	ORDER BY value DESC`;
  const db = new sqlite3.Database(SQLITE_DIR);

  db.all(SQL_REQUEST_ALL_TRANSACTIONS, [], (err, data) => {
    if (err) {
      stream.respond({
        ':status': constants.HTTP_STATUS_BAD_REQUEST,
      });
      stream.end(err.message);
      return console.log(err.message);
    }

    stream.respond({
      ':status': constants.HTTP_STATUS_OK,
    });
    stream.end(JSON.stringify(data));
    db.close();
  });
}

export default getActives;

import { constants, ServerHttp2Stream } from 'http2';
import sqlite3 from 'sqlite3';
import { SQLITE_DIR } from '../../constants';
import type { ServerRouteProps } from '../../../common/types';

function getTransactions(props: ServerRouteProps) {
  const { url, stream } = props;
  const SQL_REQUEST_ALL_TRANSACTIONS = `SELECT * FROM ${process.env.TRANSACTIONS_DB}`;
  const SQL_REQUEST_TRANSACTIONS_BY_ACTIVITY_ID = `SELECT 
            tr.id,
            tr.coinPrice,
            tr.coinSymbol,
            tr.count,
            tr.date,
            tr.typeƒ∂
            FROM ${process.env.TRANSACTIONS_DB} tr, (SELECT * FROM ${process.env.ACTIVES_TRANSASCTIONS_DB}) actr
            WHERE actr.activityId == ?
            AND actr.transactionId == tr.id`;

  const db = new sqlite3.Database(SQLITE_DIR);
  const activityId = url.searchParams.has('activityId')
    ? +url.searchParams.get('activityId')
    : null;

  db.all(
    activityId
      ? SQL_REQUEST_TRANSACTIONS_BY_ACTIVITY_ID
      : SQL_REQUEST_ALL_TRANSACTIONS,
    activityId ? [activityId] : [],
    (err, data) => {
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
    }
  );

  db.close();
}

export default getTransactions;

import { constants, ServerHttp2Stream } from 'http2';
import sqlite3 from 'sqlite3';
import { SQLITE_DIR } from '../../constants';
import type { ServerRouteProps } from '../../../common/types';

function getTransactions(props: ServerRouteProps) {
  const { url, stream, cookie } = props;
  const db = new sqlite3.Database(SQLITE_DIR);

  const activityId = url.searchParams.has('activityId')
    ? +url.searchParams.get('activityId')
    : null;
  const portfolioId = url.searchParams.has('portfolioId')
    ? +url.searchParams.get('portfolioId')
    : null;

  const SQL_REQUEST_TRANSACTIONS = [
    `SELECT 
    tr.*,
    (SELECT ptc.portfolioId  FROM ${process.env.PORTFOLIOS_TRANSACTIONS_DB} ptc WHERE ptc.transactionId = tr.id) as portfolioId
    FROM ${process.env.TRANSACTIONS_DB} tr, ${process.env.ACTIVES_TRANSASCTIONS_DB} actr, ${process.env.USERS_TRANSACTIONS_DB} ut
    WHERE ut.transactionId == tr.id
		  AND ut.userId == (SELECT id FROM Users WHERE uuid == IFNULL(?, ""))
      AND actr.transactionId == tr.id`,
    activityId && ' AND actr.activityId == ?',
    portfolioId && ' AND portfolioId == ?',
  ]
    .filter(Boolean)
    .join('\n');

  db.all(
    SQL_REQUEST_TRANSACTIONS,
    [cookie.uuid].concat(
      [activityId, portfolioId].filter(Boolean).map((x) => x.toString())
    ),
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

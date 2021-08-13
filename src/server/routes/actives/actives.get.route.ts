import { constants, ServerHttp2Stream } from 'http2';
import sqlite3 from 'sqlite3';
import { SQLITE_DIR } from '../../constants';
import type { ServerRouteProps } from '../../../common/types';

function getActives(props: ServerRouteProps) {
  const { url, stream, headers, cookie } = props;
  const portfolioId = url.searchParams.has('portfolioId')
    ? +url.searchParams.get('portfolioId')
    : null;

  const SQL_REQUEST_ALL_ACTIVES = [
    `
    SELECT 
      ac.id,
      ac.symbol as coinSymbol,
      COUNT(tr.id) as transactionsCount,	
      SUM(tr.count) as count,
      SUM(tr.count*tr.coinPrice) as value,
      IFNULL(SUM(tr.count*tr.coinPrice)/SUM(tr.count), 0) as avgPrice,
      (SELECT GROUP_CONCAT(DISTINCT ptc.portfolioId) FROM ${process.env.PORTFOLIOS_TRANSACTIONS_DB} ptc WHERE ptc.transactionId == atc.transactionId) as portfolioIds

    FROM
      ${process.env.ACTIVES_DB} ac, 
      ${process.env.ACTIVES_TRANSASCTIONS_DB} atc, 
      ${process.env.TRANSACTIONS_DB} tr,
      ${process.env.USERS_TRANSACTIONS_DB} ut

    WHERE ac.id == atc.activityId
      AND tr.id == atc.transactionId
	    AND tr.id == ut.transactionId
      AND ut.userId == (SELECT id FROM Users WHERE uuid == IFNULL(?, ""))
      
    GROUP BY atc.activityId`,
    portfolioId && `HAVING instr(portfolioIds, ${portfolioId}) > 0`,
    'ORDER BY value DESC',
  ]
    .filter(Boolean)
    .join('\n');

  const db = new sqlite3.Database(SQLITE_DIR);

  db.all(SQL_REQUEST_ALL_ACTIVES, [cookie.uuid], (err, data) => {
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

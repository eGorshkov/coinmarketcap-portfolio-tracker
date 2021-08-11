import { constants } from 'http2';
import sqlite3 from 'sqlite3';
import { SQLITE_DIR } from '../../constants';
import { getBufferData } from '../../helpers';
import type { ServerRouteProps, Transaction } from '../../../common/types';

async function postTransactions(props: ServerRouteProps) {
  const { stream, headers } = props;
  const SQL_REQUEST = `INSERT INTO ${process.env.TRANSACTIONS_DB} (coinPrice, count,  coinSymbol,  date,  type)
	VALUES (?, ?, ?, ?, ?)`;
  const db = new sqlite3.Database(SQLITE_DIR);

  getBufferData(stream, headers, (data) => {
    if (!data) return;
    const transaction = JSON.parse(data) as Transaction;
    let statement = db.prepare(SQL_REQUEST);
    statement.run(
      [
        transaction.coinPrice,
        transaction.count,
        transaction.coinSymbol,
        transaction.date,
        transaction.type,
      ],
      function (err) {
        if (err) {
          stream.respond({
            ':status': constants.HTTP_STATUS_BAD_REQUEST,
          });
          stream.end(err.message);
          return console.log(err.message);
        }

        if (transaction.portfolioId) {
          db.run(
            `INSERT INTO ${process.env.PORTFOLIOS_TRANSACTIONS_DB} (portfolioId, transactionId) VALUES (?, ?)`,
            [transaction.portfolioId, statement.lastID]
          );
        }

        stream.respond({
          ':status': constants.HTTP_STATUS_OK,
        });
        stream.end('ok');
      }
    );

    statement.finalize();
    db.close();
  });
}

export default postTransactions;

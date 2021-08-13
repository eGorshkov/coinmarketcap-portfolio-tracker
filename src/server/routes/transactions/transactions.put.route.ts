import { constants } from 'http2';
import sqlite3 from 'sqlite3';
import { SQLITE_DIR } from '../../constants';
import { getBufferData } from '../../helpers';
import type { ServerRouteProps, Transaction } from '../../../common/types';

function putTransactions(props: ServerRouteProps) {
  const { stream, headers } = props;
  const SQL_REQUEST = `UPDATE ${process.env.TRANSACTIONS_DB}
                     SET coinPrice = ?, count = ?,  coinSymbol = ?,  date = ?,  type = ?
	                   WHERE id = ?`;
  const db = new sqlite3.Database(SQLITE_DIR);

  getBufferData(stream, headers, (data) => {
    if (!data) return;
    const transaction = JSON.parse(data) as Transaction;
    if (!transaction.id) {
      stream.respond({
        ':status': constants.HTTP_STATUS_BAD_REQUEST,
      });
      stream.end('has not transaction.id');
    }

    db.run(
      SQL_REQUEST,
      [
        transaction.coinPrice,
        transaction.count,
        transaction.coinSymbol,
        transaction.date,
        transaction.type,
        transaction.id,
      ],
      function (err) {
        if (err) {
          stream.respond({
            ':status': constants.HTTP_STATUS_BAD_REQUEST,
          });
          stream.end(err.message);
          return console.log(err.message);
        }
        console.log(`Row(s) updated: ${this.changes}`);

        db.run(
          `DELETE FROM ${process.env.PORTFOLIOS_TRANSACTIONS_DB} WHERE transactionId = ?`,
          [transaction.id]
        );

        if (transaction.portfolioId) {
          db.run(
            `INSERT INTO ${process.env.PORTFOLIOS_TRANSACTIONS_DB} (portfolioId, transactionId) VALUES (?, ?)`,
            [transaction.portfolioId, transaction.id]
          );
        }

        stream.respond({
          ':status': constants.HTTP_STATUS_OK,
        });
        stream.end('ok');
        db.close();
      }
    );
  });
}

export default putTransactions;

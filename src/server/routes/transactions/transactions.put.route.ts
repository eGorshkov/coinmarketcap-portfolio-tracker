import { constants } from 'http2';
import sqlite3 from 'sqlite3';
import { SQLITE_DIR } from '../../constants';
import { getBufferData } from '../../helpers';
import type { ServerRouteProps, Transaction } from '../../../common/types';

function putTransactions(props: ServerRouteProps) {
  const { req, res, headers } = props;
  const SQL_REQUEST = `UPDATE Transactions
                     SET coinPrice = ?, count = ?,  coinSymbol = ?,  date = ?,  type = ?
	                   WHERE id = ?`;
  const db = new sqlite3.Database(SQLITE_DIR);

  getBufferData(req, headers, (data) => {
    if (!data) return;
    const transaction = JSON.parse(data) as Transaction;
    if (!transaction.id) {
      res.statusCode = constants.HTTP_STATUS_BAD_REQUEST;
      res.end('has not transaction.id');
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
          res.statusCode = constants.HTTP_STATUS_BAD_REQUEST;
          res.end(err.message);
          return console.log(err.message);
        }

        db.run(`DELETE FROM Portfolios_Transactions WHERE transactionId = ?`, [
          transaction.id,
        ]);

        if (transaction.portfolioId) {
          db.run(
            `INSERT INTO Portfolios_Transactions (portfolioId, transactionId) VALUES (?, ?)`,
            [transaction.portfolioId, transaction.id]
          );
        }

        res.statusCode = constants.HTTP_STATUS_OK;
        res.end('ok');
        db.close();
      }
    );
  });
}

export default putTransactions;

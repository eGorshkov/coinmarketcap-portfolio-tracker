import { constants } from 'http2';
import sqlite3 from 'sqlite3';
import { SQLITE_DIR } from '../../constants';
import { getBufferData } from '../../helpers';
import type { Feature, ServerRouteProps } from '../../../common/types';

async function postTransactions(props: ServerRouteProps) {
  const { req, res, headers, cookie } = props;
  const SQL_REQUEST = `INSERT INTO Features (coinSymbol, margin, coefficient, startPrice, count)
	VALUES (?, ?, ?, ?, ?)`;
  const db = new sqlite3.Database(SQLITE_DIR);

  getBufferData(req, headers, (data) => {
    if (!data) return;
    const feature = JSON.parse(data) as Feature;
    let statement = db.prepare(SQL_REQUEST);
    statement.run(
      [
        feature.coinSymbol,
        feature.margin,
        feature.coefficient,
        feature.startPrice,
        feature.count,
      ],
      function (err) {
        if (err) {
          res.statusCode = constants.HTTP_STATUS_BAD_REQUEST;
          res.end(err.message);
          return console.log(err.message);
        }

        db.run(
          `INSERT INTO Users_Features (userId, featureId) VALUES ((SELECT id FROM Users WHERE uuid = ?), ?)`,
          [cookie.uuid, statement.lastID]
        );

        res.statusCode = constants.HTTP_STATUS_OK;
        res.end('ok');
      }
    );

    statement.finalize();
    db.close();
  });
}

export default postTransactions;

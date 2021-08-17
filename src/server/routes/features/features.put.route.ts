import { constants } from 'http2';
import sqlite3 from 'sqlite3';
import { SQLITE_DIR } from '../../constants';
import { getBufferData } from '../../helpers';
import type { Feature, ServerRouteProps } from '../../../common/types';

function putFeatures(props: ServerRouteProps) {
  const { req, res, headers } = props;
  const SQL_REQUEST = `UPDATE Transactions
                     SET coinSymbol = ?, margin = ?,  coefficient = ?,  startPrice = ?,  count = ?
	                   WHERE id = ?`;
  const db = new sqlite3.Database(SQLITE_DIR);

  getBufferData(req, headers, (data) => {
    if (!data) return;
    const feature = JSON.parse(data) as Feature;
    if (!feature.id) {
      res.statusCode = constants.HTTP_STATUS_BAD_REQUEST;
      res.end('has not transaction.id');
    }

    db.run(
      SQL_REQUEST,
      [
        feature.coinSymbol,
        feature.margin,
        feature.coefficient,
        feature.startPrice,
        feature.count,
        feature.id,
      ],
      function (err) {
        if (err) {
          res.statusCode = constants.HTTP_STATUS_BAD_REQUEST;
          res.end(err.message);
          return console.log(err.message);
        }

        res.statusCode = constants.HTTP_STATUS_OK;
        res.end('ok');
        db.close();
      }
    );
  });
}

export default putFeatures;

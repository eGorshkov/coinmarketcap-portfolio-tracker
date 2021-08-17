import { constants, ServerHttp2Stream } from 'http2';
import sqlite3 from 'sqlite3';
import { SQLITE_DIR } from '../../constants';
import type { ServerRouteProps } from '../../../common/types';

function getTransactions(props: ServerRouteProps) {
  const { url, res, cookie } = props;
  const db = new sqlite3.Database(SQLITE_DIR);

  const SQL_REQUEST_TRANSACTIONS = [
    `SELECT f.* 
    FROM Features f, Users_Features uf
    WHERE f.id == uf.featureId AND uf.userId == (SELECT id FROM Users WHERE uuid == ?)`,
  ]
    .filter(Boolean)
    .join('\n');

  db.all(SQL_REQUEST_TRANSACTIONS, [cookie.uuid], (err, data) => {
    if (err) {
      res.statusCode = constants.HTTP_STATUS_BAD_REQUEST;
      res.end(err.message);
      return console.log(err.message);
    }

    res.statusCode = constants.HTTP_STATUS_OK;
    res.end(JSON.stringify(data));
  });

  db.close();
}

export default getTransactions;

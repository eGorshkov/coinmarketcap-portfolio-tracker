import { constants, ServerHttp2Stream } from 'http2';
import sqlite3 from 'sqlite3';
import { SQLITE_DIR } from '../../constants';
import type { ServerRouteProps } from '../../../common/types';

function getUsers(props: ServerRouteProps) {
  const { res, headers } = props;
  const db = new sqlite3.Database(SQLITE_DIR);
  const SQL_REQUEST_USERS = `SELECT 
    *,
    (SELECT ptc.portfolioId  FROM Users`;

  db.all(SQL_REQUEST_USERS, [], (err, data) => {
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

export default getUsers;

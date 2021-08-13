import { constants, ServerHttp2Stream } from 'http2';
import sqlite3 from 'sqlite3';
import { SQLITE_DIR } from '../../constants';
import type { ServerRouteProps } from '../../../common/types';

function getUsers(props: ServerRouteProps) {
  const { url, stream, headers } = props;
  const db = new sqlite3.Database(SQLITE_DIR);
  const SQL_REQUEST_USERS = `SELECT 
    *,
    (SELECT ptc.portfolioId  FROM ${process.env.USERS_DB}`;

  db.all(SQL_REQUEST_USERS, [], (err, data) => {
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
  });

  db.close();
}

export default getUsers;

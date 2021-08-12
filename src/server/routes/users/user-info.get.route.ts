import { constants, ServerHttp2Stream } from 'http2';
import sqlite3 from 'sqlite3';
import { SQLITE_DIR } from '../../constants';
import type { ServerRouteProps } from '../../../common/types';

async function getUserInfo(props: ServerRouteProps) {
  const db = new sqlite3.Database(SQLITE_DIR);
  const { stream, cookie } = props;

  if (!cookie.hasOwnProperty('uuid')) {
    stream.respond({
      ':status': constants.HTTP_STATUS_BAD_REQUEST,
    });
    stream.end(null);
    db.close();
    return;
  }

  const SQL_REQUEST = `
    SELECT *
      FROM ${process.env.USERS_DB} 
      WHERE uuid == ?`;
  db.get(SQL_REQUEST, [cookie.uuid], function (err, data) {
    if (err) {
      stream.respond({
        ':status': constants.HTTP_STATUS_BAD_REQUEST,
      });
      stream.end(null);
      return console.log(err.message);
    }

    stream.respond({
      ':status': constants.HTTP_STATUS_OK,
    });
    stream.end(
      JSON.stringify(
        data
          ? {
              id: data.uuid,
              login: data.login,
            }
          : null
      )
    );
  });

  db.close();
}

export default getUserInfo;

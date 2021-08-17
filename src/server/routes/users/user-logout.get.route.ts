import { constants, ServerHttp2Stream } from 'http2';
import sqlite3 from 'sqlite3';
import { SQLITE_DIR } from '../../constants';
import type { ServerRouteProps, User } from '../../../common/types';
import setCookie from '../../helpers/setCookie';

async function logout(props: ServerRouteProps) {
  const { res, headers } = props;
  const _uuid = headers.cookie['uuid'];
  const SQL_REQUEST = `
    UPDATE Users 
      SET uuid = NULL
      WHERE uuid == ?`;
  const db = new sqlite3.Database(SQLITE_DIR);
  db.run(SQL_REQUEST, [_uuid], function (err, data) {
    if (err) {
      res.statusCode = constants.HTTP_STATUS_BAD_REQUEST;
      res.end(err.message);
      return console.log(err.message);
    }

    res.statusCode = constants.HTTP_STATUS_OK;
    res.setHeader('Set-Cookie', setCookie('uuid='));
    res.end('ok');
    db.close();
  });
}

export default logout;

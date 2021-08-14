import { constants, ServerHttp2Stream } from 'http2';
import sqlite3 from 'sqlite3';
import { SQLITE_DIR } from '../../constants';
import type { ServerRouteProps, User } from '../../../common/types';
import setCookie from '../../helpers/setCookie';

async function logout(props: ServerRouteProps) {
  const { stream, headers } = props;
  const _uuid = headers.cookie['uuid'];
  const SQL_REQUEST = `
    UPDATE ${process.env.USERS_DB} 
      SET uuid = NULL
      WHERE uuid == ?`;
  const db = new sqlite3.Database(SQLITE_DIR);
  db.run(SQL_REQUEST, [_uuid], function (err, data) {
    if (err) {
      stream.respond({
        ':status': constants.HTTP_STATUS_BAD_REQUEST,
      });
      stream.end(err.message);
      return console.log(err.message);
    }

    stream.respond({
      ':status': constants.HTTP_STATUS_OK,
      'Set-Cookie': setCookie('uuid='),
    });
    stream.end('ok');
    db.close();
  });
}

export default logout;

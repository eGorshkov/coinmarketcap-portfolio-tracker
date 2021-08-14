import { constants, ServerHttp2Stream } from 'http2';
import sqlite3 from 'sqlite3';
import { SQLITE_DIR } from '../../constants';
import { getBufferData } from '../../helpers';
import { v4 as uuid } from 'uuid';
import setCookie from '../../helpers/setCookie';
import type { ServerRouteProps, User } from '../../../common/types';

async function logging(props: ServerRouteProps) {
  const { stream, headers } = props;
  const SQL_REQUEST = `
    SELECT *
    FROM Users
    WHERE login == ?
        AND password == ?`;
  const db = new sqlite3.Database(SQLITE_DIR);

  getBufferData(stream, headers, (data) => {
    if (!data) return;
    const user =
      data &&
      (data.split('&').reduce((acc, str) => {
        const [key, val] = str.split('=');
        return { ...acc, [key]: val };
      }, {}) as { login: string; password: string });

    db.get(SQL_REQUEST, [user.login, user.password], function (err, data) {
      console.log(data);

      if (err) {
        stream.respond({
          ':status': constants.HTTP_STATUS_BAD_REQUEST,
        });
        stream.end();
        return console.log(err.message || '');
      }

      if (!data?.id) {
        stream.respond({
          ':status': constants.HTTP_STATUS_MOVED_PERMANENTLY,
          location: '/',
        });
        stream.end();
        return;
      }

      const _uuid = uuid();
      db.run(
        `UPDATE ${process.env.USERS_DB}
                     SET uuid = ?
	                   WHERE id = ?`,
        [_uuid, data.id]
      );

      stream.respond({
        ':status': constants.HTTP_STATUS_MOVED_PERMANENTLY,
        'Set-Cookie': setCookie(`uuid=${_uuid}`),
        location: '/',
      });
      stream.end();
    });

    db.close();
  });
}

export default logging;

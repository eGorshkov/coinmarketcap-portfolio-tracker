import { constants, ServerHttp2Stream } from 'http2';
import sqlite3 from 'sqlite3';
import { SQLITE_DIR } from '../../constants';
import { getBufferData } from '../../helpers';
import { v4 as uuid } from 'uuid';
import setCookie from '../../helpers/setCookie';
import type { ServerRouteProps, User } from '../../../common/types';

async function logging(props: ServerRouteProps) {
  const { req, res, headers } = props;
  const SQL_REQUEST = `
    SELECT *
    FROM Users
    WHERE login == ?
        AND password == ?`;
  const db = new sqlite3.Database(SQLITE_DIR);

  getBufferData(req, headers, (data) => {
    if (!data) return;
    const user =
      data &&
      (data.split('&').reduce((acc, str) => {
        const [key, val] = str.split('=');
        return { ...acc, [key]: val };
      }, {}) as { login: string; password: string });

    db.get(SQL_REQUEST, [user.login, user.password], function (err, data) {
      if (err) {
        res.statusCode = constants.HTTP_STATUS_BAD_REQUEST;
        res.end();
        return console.log(err.message || '');
      }

      if (!data?.id) {
        res.statusCode = constants.HTTP_STATUS_MOVED_PERMANENTLY;
        res.setHeader('location', '/');
        res.end();
        return;
      }

      const _uuid = uuid();
      db.run(
        `UPDATE ${process.env.USERS_DB}
                     SET uuid = ?
	                   WHERE id = ?`,
        [_uuid, data.id]
      );

      res.statusCode = constants.HTTP_STATUS_MOVED_PERMANENTLY;
      res.setHeader('Set-Cookie', setCookie(`uuid=${_uuid}`));
      res.setHeader('location', '/');
      res.end();
    });

    db.close();
  });
}

export default logging;

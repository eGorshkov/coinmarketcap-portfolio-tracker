import { constants, ServerHttp2Stream } from 'http2';
import sqlite3 from 'sqlite3';
import { SQLITE_DIR } from '../../constants';
import { getBufferData } from '../../helpers';
import { v4 as uuid } from 'uuid';
import type { ServerRouteProps, User } from '../../../common/types';
import getUserRights from '../../helpers/defaultRule';

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
    const user = JSON.parse(data) as { login: string; password: string };
    db.get(SQL_REQUEST, [user.login, user.password], function (err, data) {
      if (err || !data?.id) {
        stream.respond({
          ':status': constants.HTTP_STATUS_BAD_REQUEST,
        });
        stream.end(null);
        return console.log(err.message || '');
      }

      const _uuid = uuid();
      db.run(
        `UPDATE ${process.env.USERS_DB}
                     SET uuid = ?
	                   WHERE id = ?`,
        [_uuid, data.id]
      );

      const userData: User = {
        id: _uuid,
        login: data.login,
        rights: getUserRights(data),
      };
      stream.respond({
        ':status': constants.HTTP_STATUS_OK,
        'Set-Cookie': `uuid=${_uuid}; path=/; SameSite=None; domain=localhost; secure`,
      });
      stream.end(JSON.stringify(userData));
    });

    db.close();
  });
}

export default logging;

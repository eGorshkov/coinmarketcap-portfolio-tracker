import { constants } from 'http2';
import sqlite3 from 'sqlite3';
import { SQLITE_DIR } from '../../constants';
import { getBufferData } from '../../helpers';
import type { ServerRouteProps, Transaction } from '../../../common/types';

async function postUsers(props: ServerRouteProps) {
  const { stream, headers } = props;
  const SQL_REQUEST = `INSERT INTO ${process.env.TRANSACTIONS_DB} (login, password)
	VALUES (?, ?)`;
  const db = new sqlite3.Database(SQLITE_DIR);

  getBufferData(stream, headers, (data) => {
    if (!data) return;
    const user = JSON.parse(data) as { login: string; password: string };
    let statement = db.prepare(SQL_REQUEST);
    statement.run([user.login, user.password], function (err) {
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
      stream.end('ok');
    });

    statement.finalize();
    db.close();
  });
}

export default postUsers;

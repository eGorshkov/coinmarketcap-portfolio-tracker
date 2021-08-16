import { constants } from 'http2';
import sqlite3 from 'sqlite3';
import { SQLITE_DIR } from '../../constants';
import { getBufferData } from '../../helpers';
import type { ServerRouteProps, Transaction } from '../../../common/types';

async function postUsers(props: ServerRouteProps) {
  const { req, res, headers } = props;
  const SQL_REQUEST = `INSERT INTO ${process.env.TRANSACTIONS_DB} (login, password)
	VALUES (?, ?)`;
  const db = new sqlite3.Database(SQLITE_DIR);

  getBufferData(req, headers, (data) => {
    if (!data) return;
    const user = JSON.parse(data) as { login: string; password: string };
    let statement = db.prepare(SQL_REQUEST);
    statement.run([user.login, user.password], function (err) {
      if (err) {
        res.statusCode = constants.HTTP_STATUS_BAD_REQUEST;
        res.end(err.message);
        return console.log(err.message);
      }

      res.statusCode = constants.HTTP_STATUS_OK;
      res.end('ok');
    });

    statement.finalize();
    db.close();
  });
}

export default postUsers;

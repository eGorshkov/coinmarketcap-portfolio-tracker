import { constants } from 'http2';
import sqlite3 from 'sqlite3';
import { SQLITE_DIR } from '../../constants';
import { getBufferData } from '../../helpers';
import type { ServerRouteProps, User } from '../../../common/types';

function putUsers(props: ServerRouteProps) {
  const { req, res, headers } = props;
  const SQL_REQUEST = `UPDATE ${process.env.TRANSACTIONS_DB}
                     SET login = ?, password = ?
	                   WHERE id = ?`;
  const db = new sqlite3.Database(SQLITE_DIR);

  getBufferData(req, headers, (data) => {
    if (!data) return;
    const user = JSON.parse(data) as User & { password: string };
    if (!user.id) {
      res.statusCode = constants.HTTP_STATUS_BAD_REQUEST;
      res.end('has not transaction.id');
    }

    db.run(SQL_REQUEST, [user.login, user.password], function (err) {
      if (err) {
        res.statusCode = constants.HTTP_STATUS_BAD_REQUEST;
        res.end(err.message);
        return console.log(err.message);
      }

      res.statusCode = constants.HTTP_STATUS_OK;
      res.end('ok');
      db.close();
    });
  });
}

export default putUsers;

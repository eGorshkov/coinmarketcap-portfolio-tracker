import { constants } from 'http2';
import sqlite3 from 'sqlite3';
import { SQLITE_DIR } from '../../constants';
import { getBufferData } from '../../helpers';
import type { ServerRouteProps, User } from '../../../common/types';

function putUsers(props: ServerRouteProps) {
  const { stream, headers } = props;
  const SQL_REQUEST = `UPDATE ${process.env.TRANSACTIONS_DB}
                     SET login = ?, password = ?
	                   WHERE id = ?`;
  const db = new sqlite3.Database(SQLITE_DIR);

  getBufferData(stream, headers, (data) => {
    if (!data) return;
    const user = JSON.parse(data) as User & { password: string };
    if (!user.id) {
      stream.respond({
        ':status': constants.HTTP_STATUS_BAD_REQUEST,
      });
      stream.end('has not transaction.id');
    }

    db.run(SQL_REQUEST, [user.login, user.password], function (err) {
      if (err) {
        stream.respond({
          ':status': constants.HTTP_STATUS_BAD_REQUEST,
        });
        stream.end(err.message);
        return console.log(err.message);
      }
      console.log(`Row(s) updated: ${this.changes}`);
      stream.respond({
        ':status': constants.HTTP_STATUS_OK,
      });
      stream.end('ok');
      db.close();
    });
  });
}

export default putUsers;

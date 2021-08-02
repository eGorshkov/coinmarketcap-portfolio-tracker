import sqlite3 from 'sqlite3';
import { constants } from 'http2';
import { SQLITE_DIR } from '../../constants';
import type { ServerRouteProps } from '../../../common/types';
function getRisks(props: ServerRouteProps) {
  const { stream } = props;
  const db = new sqlite3.Database(SQLITE_DIR);
  const SQL_REQUEST = `SELECT * FROM ${process.env.RISKS_DB}`;
  db.all(SQL_REQUEST, [], (err, data) => {
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
    stream.end(JSON.stringify(data));
    db.close();
  });
}

export default getRisks;

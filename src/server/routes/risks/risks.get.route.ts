import sqlite3 from 'sqlite3';
import { constants } from 'http2';
import { SQLITE_DIR } from '../../constants';
import type { ServerRouteProps } from '../../../common/types';
function getRisks(props: ServerRouteProps) {
  const { res } = props;
  const db = new sqlite3.Database(SQLITE_DIR);
  const SQL_REQUEST = `SELECT * FROM Risks`;
  db.all(SQL_REQUEST, [], (err, data) => {
    if (err) {
      res.statusCode = constants.HTTP_STATUS_BAD_REQUEST;
      res.end(err.message);
      return console.log(err.message);
    }

    res.statusCode = constants.HTTP_STATUS_OK;
    res.end(JSON.stringify(data));
    db.close();
  });
}

export default getRisks;

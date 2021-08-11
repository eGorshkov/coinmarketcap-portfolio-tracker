import { constants, ServerHttp2Stream } from 'http2';
import sqlite3 from 'sqlite3';
import { SQLITE_DIR } from '../../constants';
import type { ServerRouteProps } from '../../../common/types';

function getPortfolios(props: ServerRouteProps) {
  const { stream } = props;
  const SQL_REQUEST_ALL_TRANSACTIONS = `SELECT * FROM ${process.env.PORTFOLIOS_DB}`;
  const db = new sqlite3.Database(SQLITE_DIR);

  db.all(SQL_REQUEST_ALL_TRANSACTIONS, [], (err, data) => {
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

export default getPortfolios;

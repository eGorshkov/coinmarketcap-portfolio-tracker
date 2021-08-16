import { constants, ServerHttp2Stream } from 'http2';
import sqlite3 from 'sqlite3';
import { SQLITE_DIR } from '../../constants';
import type { ServerRouteProps } from '../../../common/types';

function getPortfolios(props: ServerRouteProps) {
  const { res, cookie } = props;
  const SQL_REQUEST_PORTFOLIOS = `SELECT p.*
    FROM ${process.env.PORTFOLIOS_DB} p, ${process.env.USERS_PORTFOLIOS_DB} up
	  WHERE up.portfolioId == p.id
      AND up.userId == (SELECT id FROM Users WHERE uuid = ?)`;

  const db = new sqlite3.Database(SQLITE_DIR);

  db.all(SQL_REQUEST_PORTFOLIOS, [cookie.uuid], (err, data) => {
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

export default getPortfolios;

import { constants } from 'http2';
import sqlite3 from 'sqlite3';
import { SQLITE_DIR } from '../../constants';
import { getBufferData } from '../../helpers';
import type { Portfolio, ServerRouteProps } from '../../../common/types';

function deletePortfolios(props: ServerRouteProps) {
  const { req, res, headers } = props;
  const SQL_REQUEST = `DELETE FROM ${process.env.PORTFOLIOS_DB} WHERE id = ?`;
  const db = new sqlite3.Database(SQLITE_DIR);

  getBufferData(req, headers, (data) => {
    if (!data) return;
    let transaction = JSON.parse(data) as Portfolio;

    if (!transaction.id) {
      res.statusCode = constants.HTTP_STATUS_BAD_REQUEST;
      res.end(`has not portfolio.id`);
    }

    db.run(SQL_REQUEST, transaction.id, function (err) {
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

export default deletePortfolios;

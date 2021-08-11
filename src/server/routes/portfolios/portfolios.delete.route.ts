import { constants } from 'http2';
import sqlite3 from 'sqlite3';
import { SQLITE_DIR } from '../../constants';
import { getBufferData } from '../../helpers';
import type { Portfolio, ServerRouteProps } from '../../../common/types';

function deletePortfolios(props: ServerRouteProps) {
  const { stream, headers } = props;
  const SQL_REQUEST = `DELETE FROM ${process.env.PORTFOLIOS_DB} WHERE id = ?`;
  const db = new sqlite3.Database(SQLITE_DIR);

  getBufferData(stream, headers, (data) => {
    if (!data) return;
    let transaction = JSON.parse(data) as Portfolio;

    if (!transaction.id) {
      stream.respond({
        ':status': constants.HTTP_STATUS_BAD_REQUEST,
      });
      stream.end(`has not portfolio.id`);
    }

    db.run(SQL_REQUEST, transaction.id, function (err) {
      if (err) {
        stream.respond({
          ':status': constants.HTTP_STATUS_BAD_REQUEST,
        });
        stream.end(err.message);
        return console.log(err.message);
      }
      console.log(`Row(s) deleted: ${this.changes}`);
      stream.respond({
        ':status': constants.HTTP_STATUS_OK,
      });
      stream.end('ok');
      db.close();
    });
  });
}

export default deletePortfolios;

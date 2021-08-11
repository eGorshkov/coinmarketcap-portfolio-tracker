import { constants } from 'http2';
import sqlite3 from 'sqlite3';
import { SQLITE_DIR } from '../../constants';
import { getBufferData } from '../../helpers';
import type { Portfolio, ServerRouteProps } from '../../../common/types';

function putPortfolios(props: ServerRouteProps) {
  const { stream, headers } = props;
  const SQL_REQUEST = `UPDATE ${process.env.PORTFOLIOS_DB}
                     SET name = ?
                     WHERE id = ?`;
  const db = new sqlite3.Database(SQLITE_DIR);

  getBufferData(stream, headers, (data) => {
    if (!data) return;
    const transaction = JSON.parse(data) as Portfolio;
    if (!transaction.id) {
      stream.respond({
        ':status': constants.HTTP_STATUS_BAD_REQUEST,
      });
      stream.end('has not transaction.id');
    }

    db.run(SQL_REQUEST, [transaction.name, transaction.id], function (err) {
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

export default putPortfolios;

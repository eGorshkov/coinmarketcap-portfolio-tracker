import { constants } from 'http2';
import sqlite3 from 'sqlite3';
import { SQLITE_DIR } from '../../constants';
import { getBufferData } from '../../helpers';
import type { Portfolio, ServerRouteProps } from '../../../common/types';

async function postPortfolio(props: ServerRouteProps) {
  const { stream, headers } = props;
  const SQL_REQUEST = `INSERT INTO ${process.env.PORTFOLIOS_DB} (name)
	VALUES (?)`;
  const db = new sqlite3.Database(SQLITE_DIR);

  getBufferData(stream, headers, (data) => {
    if (!data) return;
    const transaction = JSON.parse(data) as Portfolio;
    db.run(SQL_REQUEST, [transaction.name], (err, data) => {
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
      stream.end('ok');
      db.close();
    });
  });
}

export default postPortfolio;

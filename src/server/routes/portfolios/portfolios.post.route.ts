import { constants } from 'http2';
import sqlite3 from 'sqlite3';
import { SQLITE_DIR } from '../../constants';
import { getBufferData } from '../../helpers';
import type { Portfolio, ServerRouteProps } from '../../../common/types';

async function postPortfolio(props: ServerRouteProps) {
  const { stream, headers, cookie } = props;
  const SQL_REQUEST = `INSERT INTO ${process.env.PORTFOLIOS_DB} (name)
	VALUES (?)`;
  const db = new sqlite3.Database(SQLITE_DIR);

  getBufferData(stream, headers, (data) => {
    if (!data) return;
    const portfolio = JSON.parse(data) as Portfolio;
    let statement = db.prepare(SQL_REQUEST);
    statement.run([portfolio.name], (err) => {
      if (err) {
        stream.respond({
          ':status': constants.HTTP_STATUS_BAD_REQUEST,
        });
        stream.end(err.message);
        return console.log(err.message);
      }

      db.run(
        `INSERT INTO ${process.env.USERS_PORTFOLIOS_DB} (userId, portfolioId)
	        VALUES ((SELECT id FROM ${process.env.USERS_DB} WHERE uuid = ?), ?)`,
        [cookie.uuid, statement.lastID]
      );

      stream.respond({
        ':status': constants.HTTP_STATUS_OK,
      });
      stream.end('ok');
    });

    statement.finalize();
    db.close();
  });
}

export default postPortfolio;

import { constants } from 'http2';
import sqlite3 from 'sqlite3';
import { SQLITE_DIR } from '../../constants';
import { getBufferData } from '../../helpers';
import type { Portfolio, ServerRouteProps } from '../../../common/types';

async function postPortfolio(props: ServerRouteProps) {
  const { req, res, headers, cookie } = props;
  const SQL_REQUEST = `INSERT INTO Portfolios (name)
	VALUES (?)`;
  const db = new sqlite3.Database(SQLITE_DIR);

  getBufferData(req, headers, (data) => {
    if (!data) return;
    const portfolio = JSON.parse(data) as Portfolio;
    let statement = db.prepare(SQL_REQUEST);
    statement.run([portfolio.name], (err) => {
      if (err) {
        res.statusCode = constants.HTTP_STATUS_BAD_REQUEST;
        res.end(err.message);
        return console.log(err.message);
      }

      db.run(
        `INSERT INTO Users_Portfolios (userId, portfolioId)
	        VALUES ((SELECT id FROM Users WHERE uuid = ?), ?)`,
        [cookie.uuid, statement.lastID]
      );

      res.statusCode = constants.HTTP_STATUS_OK;
      res.end('ok');
    });

    statement.finalize();
    db.close();
  });
}

export default postPortfolio;

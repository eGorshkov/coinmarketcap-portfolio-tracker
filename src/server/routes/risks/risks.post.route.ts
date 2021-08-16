import { constants } from 'http2';
import sqlite3 from 'sqlite3';
import { SQLITE_DIR } from '../../constants';
import { getBufferData } from '../../helpers';
import type { ServerRouteProps } from '../../../common/types';

async function postRisks(props: ServerRouteProps) {
  const { req, res, headers } = props;
  const SQL_REQUEST = `INSERT INTO ${process.env.ACTIVES_RISKS_DB} (activeId, riskId)
	VALUES (?, ?)`;
  const db = new sqlite3.Database(SQLITE_DIR);

  getBufferData(req, headers, (data) => {
    if (!data) return;
    const values = JSON.parse(data) as any[];
    if (!values?.length) {
      res.statusCode = constants.HTTP_STATUS_BAD_REQUEST;
      res.end('Has not values');
      return console.log('Has not values');
    }

    db.run(`DELETE FROM ${process.env.ACTIVES_RISKS_DB}`, []);

    let statement = db.prepare(SQL_REQUEST);
    for (const active of values) {
      statement.run([active.id, active.riskId], function (err) {
        if (err) {
          res.statusCode = constants.HTTP_STATUS_BAD_REQUEST;
          res.end(err.message);
          return console.log(err.message);
        }
      });
    }

    statement.finalize();
    db.close(() => {
      res.statusCode = constants.HTTP_STATUS_OK;
      res.end('ok');
    });
  });
}

export default postRisks;

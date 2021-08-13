import { constants } from 'http2';
import sqlite3 from 'sqlite3';
import { SQLITE_DIR } from '../../constants';
import { getBufferData } from '../../helpers';
import type { ServerRouteProps } from '../../../common/types';

function getInsertValues(data: any[]) {
  return data
    .filter((x) => x.riskId)
    .map((x) => (x.id, x.riskId))
    .join();
}

async function postRisks(props: ServerRouteProps) {
  const { stream, headers } = props;
  const SQL_REQUEST = `INSERT INTO ${process.env.ACTIVES_RISKS_DB} (activeId, riskId)
	VALUES (?, ?)`;
  const db = new sqlite3.Database(SQLITE_DIR);

  getBufferData(stream, headers, (data) => {
    if (!data) return;
    const values = JSON.parse(data) as any[];
    if (!values?.length) {
      stream.respond({
        ':status': constants.HTTP_STATUS_BAD_REQUEST,
      });
      stream.end('Has not values');
      return console.log('Has not values');
    }

    db.run(`DELETE FROM ${process.env.ACTIVES_RISKS_DB}`, []);

    let statement = db.prepare(SQL_REQUEST);
    for (const active of values) {
      statement.run([active.id, active.riskId], function (err) {
        if (err) {
          stream.respond({
            ':status': constants.HTTP_STATUS_BAD_REQUEST,
          });
          stream.end(err.message);
          return console.log(err.message);
        }
      });
    }

    statement.finalize();
    db.close(() => {
      stream.respond({
        ':status': constants.HTTP_STATUS_OK,
      });
      stream.end('ok');
    });
  });
}

export default postRisks;

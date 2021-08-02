import { constants, ServerHttp2Stream } from 'http2';
import sqlite3 from 'sqlite3';
import { SQLITE_DIR } from '../../constants';
import type { ServerRouteProps } from '../../../common/types';

function getActivesRisks(props: ServerRouteProps) {
  const { stream } = props;
  const SQL_REQUEST = `SELECT a.id, a.symbol,
    (SELECT ar.riskId  FROM ${process.env.ACTIVES_RISKS_DB} ar WHERE ar.activeId = a.id) as riskId,
	(SELECT r.value  FROM ${process.env.ACTIVES_RISKS_DB} ar, ${process.env.RISKS_DB} r WHERE ar.activeId = a.id AND ar.riskId == r.id) as riskType
	FROM ${process.env.ACTIVES_DB} a`;
  const db = new sqlite3.Database(SQLITE_DIR);

  db.all(SQL_REQUEST, [], (err, data) => {
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

export default getActivesRisks;

import ActivesRouter from './actives';
import getActivesRisks from './actives/actives.get-risks.route';
import PricesRouter from './prices';
import TransactionsRouter from './transactions';
import RisksRouter from './risks';
import Route from './route.class';

const routes = {
  '/actives': new ActivesRouter(),
  '/actives/get-risks': Route.of('GET', getActivesRisks),
  '/prices': new PricesRouter(),
  '/transactions': new TransactionsRouter(),
  '/risks': new RisksRouter(),
};

export default routes;

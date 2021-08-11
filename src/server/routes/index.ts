import Route from './route.class';
import ActivesRouter from './actives';
import getActivesRisks from './actives/actives.get-risks.route';
import PricesRouter from './prices';
import TransactionsRouter from './transactions';
import RisksRouter from './risks';
import PortfoliosRouter from './portfolios';

const routes = {
  '/actives': new ActivesRouter(),
  '/actives/get-risks': Route.of('GET', getActivesRisks),
  '/prices': new PricesRouter(),
  '/transactions': new TransactionsRouter(),
  '/risks': new RisksRouter(),
  '/portfolios': new PortfoliosRouter(),
};

export default routes;

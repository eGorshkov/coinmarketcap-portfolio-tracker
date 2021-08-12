import Route from './route.class';
import ActivesRouter from './actives';
import getActivesRisks from './actives/actives.get-risks.route';
import PricesRouter from './prices';
import TransactionsRouter from './transactions';
import RisksRouter from './risks';
import PortfoliosRouter from './portfolios';
import UsersRouter from './users';
import userLogin from './users/user-login.post.route';
import userLogout from './users/user-logout.get.route';
import getUserInfo from './users/user-info.get.route';

const routes = {
  '/actives': new ActivesRouter(),
  '/actives/get-risks': Route.of('GET', getActivesRisks),
  '/prices': new PricesRouter(),
  '/transactions': new TransactionsRouter(),
  '/risks': new RisksRouter(),
  '/portfolios': new PortfoliosRouter(),
  '/users': new UsersRouter(),
  '/users/login': Route.of('POST', userLogin),
  '/users/logout': Route.of('GET', userLogout),
  '/users/info': Route.of('GET', getUserInfo),
};

export default routes;

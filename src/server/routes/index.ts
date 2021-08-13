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
  '/api/actives': new ActivesRouter(),
  '/api/actives/get-risks': Route.of('GET', getActivesRisks),

  '/api/prices': new PricesRouter(),

  '/api/transactions': new TransactionsRouter(),

  '/api/risks': new RisksRouter(),

  '/api/portfolios': new PortfoliosRouter(),

  '/api/users': new UsersRouter(),
  '/api/users/login': Route.of('POST', userLogin),
  '/api/users/logout': Route.of('GET', userLogout),
  '/api/users/info': Route.of('GET', getUserInfo),
};

export default routes;

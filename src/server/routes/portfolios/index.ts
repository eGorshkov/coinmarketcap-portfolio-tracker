import type { ServerRouteProps } from '../../../common/types';
import Route from '../route.class';
import get from './portfolios.get.route';
import post from './portfolios.post.route';
import put from './portfolios.put.route';
import _delete from './portfolios.delete.route';

class PortfoliosRouter extends Route {
  GET(props: ServerRouteProps) {
    return get(props);
  }
  POST(props: ServerRouteProps) {
    return post(props);
  }
  PUT(props: ServerRouteProps) {
    return put(props);
  }
  DELETE(props: ServerRouteProps) {
    return _delete(props);
  }
}

export default PortfoliosRouter;

import get from './risks.get.route';
import post from './risks.post.route';
import Route from '../route.class';
import type { ServerRouteProps } from '../../../common/types';

class PricesRouter extends Route {
  GET(props: ServerRouteProps) {
    return get(props);
  }
  POST(props: ServerRouteProps) {
    return post(props);
  }
}

export default PricesRouter;

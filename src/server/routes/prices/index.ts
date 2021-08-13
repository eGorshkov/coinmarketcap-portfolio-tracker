import get from './prices.get.route';
import Route from '../route.class';
import type { ServerRouteProps } from '../../../common/types';

class PricesRouter extends Route {
  GET(props: ServerRouteProps) {
    return get(props);
  }
}

export default PricesRouter;

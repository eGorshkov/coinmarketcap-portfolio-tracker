import type { ServerRouteProps } from '../../../common/types';
import Route from '../route.class';
import get from './actives.get.route';

class ActivesRouter extends Route {
  GET(props: ServerRouteProps) {
    return get(props);
  }
}

export default ActivesRouter;

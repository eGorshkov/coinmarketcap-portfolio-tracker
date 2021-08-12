import get from './users.get.route';
import put from './users.put.route';
import post from './users.post.route';
import _delete from './users.delete.route';
import Route from '../route.class';
import type { ServerRouteProps } from '../../../common/types';

class TransactionsRouter extends Route {
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

export default TransactionsRouter;

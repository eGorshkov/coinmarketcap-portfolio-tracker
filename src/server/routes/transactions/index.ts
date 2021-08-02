import get from './transactions.get.route';
import put from './transactions.put.route';
import post from './transactions.post.route';
import _delete from './transactions.delete.route';
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

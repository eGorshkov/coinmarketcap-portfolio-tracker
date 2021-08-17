import get from './features.get.route';
import put from './features.put.route';
import post from './features.post.route';
import _delete from './features.delete.route';
import Route from '../route.class';
import type { ServerRouteProps } from '../../../common/types';

class FeaturesRouter extends Route {
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

export default FeaturesRouter;

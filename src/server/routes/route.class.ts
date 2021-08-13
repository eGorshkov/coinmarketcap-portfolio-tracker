import { constants } from 'http2';
import type { IncomingHttpHeaders, ServerHttp2Stream } from 'http2';
import type { SSE } from '../sse/sse';
import type { ServerRouteProps } from '../../common/types';
const {
  HTTP2_METHOD_POST,
  HTTP2_METHOD_PUT,
  HTTP2_METHOD_DELETE,
  HTTP2_METHOD_GET,
} = constants;

class Route {
  constructor() {}

  public call(
    url: URL,
    sse: SSE,
    stream: ServerHttp2Stream,
    headers: IncomingHttpHeaders,
    cookie: { [k in string]: string }
  ) {
    const method = headers[':method'] || HTTP2_METHOD_GET;
    try {
      this[method]({ url, sse, stream, headers, cookie });
    } catch (err) {
      stream.respond({
        ':status': constants.HTTP_STATUS_BAD_REQUEST,
      });
      stream.end(err.message);
    }
  }

  static of(
    type: 'GET' | 'POST' | 'DELETE' | 'PUT',
    methodCallback: (props: ServerRouteProps) => void
  ) {
    const route = new Route();
    route[type] = methodCallback;
    return route;
  }

  public GET(props: ServerRouteProps) {
    throw new Error('Method not implemented.');
  }

  public POST(props: ServerRouteProps) {
    throw new Error('Method not implemented.');
  }

  public DELETE(props: ServerRouteProps) {
    throw new Error('Method not implemented.');
  }

  public PUT(props: ServerRouteProps) {
    throw new Error('Method not implemented.');
  }
}

export default Route;

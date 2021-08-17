import { constants, Http2ServerRequest, Http2ServerResponse } from 'http2';
import type { IncomingHttpHeaders, ServerHttp2Stream } from 'http2';
import type { SSE } from '../sse/sse';
import type { ServerRouteProps } from '../../common/types';
const { HTTP2_HEADER_METHOD, HTTP2_METHOD_GET } = constants;

class Route {
  constructor() {}

  public call(
    url: URL,
    sse: SSE,
    req: Http2ServerRequest,
    res: Http2ServerResponse,
    headers: IncomingHttpHeaders,
    cookie: { [k in string]: string }
  ) {
    const methodkey = process.env.HEADER_METHOD || HTTP2_HEADER_METHOD;
    const method = (headers[methodkey] as string) || HTTP2_METHOD_GET;
    try {
      this[method]({ url, sse, req, res, headers, cookie });
    } catch (err) {
      res.statusCode = constants.HTTP_STATUS_BAD_REQUEST;
      res.end(err.message);
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

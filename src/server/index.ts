import { config } from 'dotenv';
import * as fs from 'fs';
import * as http2 from 'http2';
import { SSE } from './sse/sse';

import routes from './routes';
import getCookieAsObject from './helpers/getCookieAsObject';
import responseStatic from './responseStatic';

config({ path: '.env' });

const production = !process.env.ROLLUP_WATCH;

const { HTTP2_HEADER_SCHEME, HTTP2_HEADER_PATH, HTTP2_HEADER_AUTHORITY } =
  http2.constants;
const sse = new SSE();
const server = http2.createSecureServer(
  {
    key: fs.readFileSync(process.env.PRIVKEY_PATH),
    cert: fs.readFileSync(process.env.CERTIFICATE_PATH),
    allowHTTP1: true,
  },
  (req, res) => {
    const { headers } = req;
    const scheme = headers[process.env.HEADER_SCHEME || HTTP2_HEADER_SCHEME];
    const authority =
      headers[process.env.HEADER_AUTHORITY || HTTP2_HEADER_AUTHORITY];
    const urlPath = headers[process.env.HEADER_PATH || HTTP2_HEADER_PATH];
    //@ts-ignore
    const url: URL = new URL(`${scheme}://${authority}${urlPath}`);
    const cookie = getCookieAsObject(headers.cookie);

    if (url.pathname === '/stream') {
      sse.init(req, res, headers);
      const route = routes['/api/prices'];
      route && route.call(url, sse, req, res, headers, cookie);
      return;
    }

    if (routes[url.pathname]) {
      const route = routes[url.pathname];
      route && route.call(url, sse, req, res, headers, cookie);
      return;
    }

    production ? () => {} : responseStatic(req, res);
  }
);

server.on('error', (err) => console.error(err));

server.listen(process.env.PORT, () => {
  console.log(`Server started on ${process.env.PORT}`);
  console.log(fs.readFileSync('.env').toString());
});

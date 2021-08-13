import { config } from 'dotenv';
import * as fs from 'fs';
import * as http2 from 'http2';
import { SSE } from './sse/sse';

import responseStatic from './responseStatic';
import routes from './routes';
import getCookieAsObject from './helpers/getCookieAsObject';

config({ path: '.env' });

const { HTTP2_HEADER_SCHEME, HTTP2_HEADER_PATH, HTTP2_HEADER_AUTHORITY } =
  http2.constants;
const sse = new SSE();
const server = http2.createSecureServer(
  {
    key: fs.readFileSync('localhost-privkey.pem'),
    cert: fs.readFileSync('localhost-cert.pem'),
  },
  responseStatic
);

server.on('error', (err) => console.error(err));

server.on('stream', (stream, headers) => {
  const scheme = headers[HTTP2_HEADER_SCHEME];
  const authority = headers[HTTP2_HEADER_AUTHORITY];
  const urlPath = headers[HTTP2_HEADER_PATH];
  //@ts-ignore
  const url: URL = new URL(`${scheme}://${authority}${urlPath}`);
  const cookie = getCookieAsObject(headers.cookie);

  if (url.pathname === '/stream') {
    sse.init(stream, headers);
    const route = routes['/prices'];
    route && route.call(url, sse, stream, headers, cookie);
    return;
  }

  if (routes[url.pathname]) {
    const route = routes[url.pathname];
    route && route.call(url, sse, stream, headers, cookie);
    return;
  }
});

server.listen(process.env.PORT, () => {
  console.log(`Server started on ${process.env.PORT}`);
  console.log(fs.readFileSync('.env').toString());
});

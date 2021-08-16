import type {
  Http2ServerRequest,
  Http2ServerResponse,
  IncomingHttpHeaders,
  ServerHttp2Stream,
} from 'http2';

function getBufferData(
  req: Http2ServerRequest,
  headers: IncomingHttpHeaders,
  callback: (data: string) => void
) {
  let buffer = [];
  let counter = 0;
  req.on('data', (chunk) => {
    counter += chunk.length;
    buffer.push(chunk);
    if (counter === Number(headers['content-length'])) {
      const body = Buffer.concat(buffer).toString();
      callback(body);
    }
  });
}

export default getBufferData;

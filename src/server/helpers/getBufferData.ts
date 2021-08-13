import type { IncomingHttpHeaders, ServerHttp2Stream } from 'http2';

function getBufferData(
  stream: ServerHttp2Stream,
  headers: IncomingHttpHeaders,
  callback: (data: string) => void
) {
  let buffer = [];
  let counter = 0;
  stream.on('data', (chunk) => {
    counter += chunk.length;
    buffer.push(chunk);
    if (counter === Number(headers['content-length'])) {
      const body = Buffer.concat(buffer).toString();
      callback(body);
    }
  });
}

export default getBufferData;

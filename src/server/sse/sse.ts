import { EventEmitter } from 'events';
import type {
  ServerHttp2Stream,
  IncomingHttpHeaders,
  Http2ServerRequest,
  Http2ServerResponse,
} from 'http2';
import EVENTS from './events';

interface SSEEvent {
  event: keyof typeof EVENTS;
  params?: any;
}

let streamCount = 0;

export class SSE extends EventEmitter {
  constructor() {
    super();
  }

  public init(
    req: Http2ServerRequest,
    res: Http2ServerResponse,
    headers: IncomingHttpHeaders
  ) {
    let id = 0;

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
    });

    const dataListener = async (config: SSEEvent) => {
      if (!config.event) return;
      const data = await EVENTS[config.event](config.params || {});
      res.write(`event: ${config.event}\n`);
      res.write(`data: ${JSON.stringify(data)}\n`);
      res.write(`id: ${++id} \n`);
      res.write('\n');
    };

    this.on('data', dataListener);

    res.on('close', () => {
      this.removeListener('data', dataListener);
      --streamCount;
      if (this.getMaxListeners() > 1)
        this.setMaxListeners(this.getMaxListeners() - 1);
      res.end();
    });
  }

  public send(data: SSEEvent) {
    this.emit('data', data);
  }
}

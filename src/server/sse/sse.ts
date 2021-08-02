import { EventEmitter } from 'events';
import type { ServerHttp2Stream, IncomingHttpHeaders } from 'http2';
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

  public init(stream: ServerHttp2Stream, headers: IncomingHttpHeaders) {
    let id = 0;

    stream.respond({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
    });

    const dataListener = async (config: SSEEvent) => {
      if (!config.event) return;
      const data = await EVENTS[config.event](config.params || {});
      stream.write(`event: ${config.event}\n`);
      stream.write(`data: ${JSON.stringify(data)}\n`);
      stream.write(`id: ${++id} \n`);
      stream.write('\n');
    };

    this.on('data', dataListener);

    stream.on('close', () => {
      this.removeListener('data', dataListener);
      --streamCount;
      if (this.getMaxListeners() > 1)
        this.setMaxListeners(this.getMaxListeners() - 1);
      console.log(`Stream closed`);
    });

    console.log(`Stream ${++streamCount} created`);
  }

  public send(data: SSEEvent) {
    this.emit('data', data);
  }
}

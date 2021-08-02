import type { IncomingHttpHeaders, ServerHttp2Stream } from 'http2';
import type {
  TRANSACTION_TYPE,
  TABLE_SORT_TYPE,
} from '../client/constants/common';
import type { SSE } from '../server/sse/sse';

export type Coin = {
  name: string;
  price: number | 'Ошибка в запросе';
  symbol: string;
};

export type Transaction = {
  id: number;
  type: TRANSACTION_TYPE;
  count: number;
  date: Date;
  coinSymbol: Coin['symbol'];
  coinPrice: Coin['price'];
};

export type Active = Pick<Transaction, 'id' | 'count' | 'coinSymbol'> & {
  transactionsCount: number;
  avgPrice: number;
  value: number;

  price: number;
  profit: number;
};

export type TableConfigType<T = any> = {
  ordered?: boolean;
  edited?: any;
  headers: Array<TableHeadType<T> & TableRowType<T>>;
};

export enum RENDERING_TYPE {
  COMPONENT = 'COMPONENT',
  TEXT = 'TEXT',
}

export type TableHeadType<T = any> = {
  title: string;
  key: keyof T;
  filtered?: boolean;
  sorted?: boolean;
  headers?: TableHeadType<T>[];
  onFiltering?: (row: T, head: TableHeadType) => string;
  onRendering?: {
    type: RENDERING_TYPE;
    _this: any;
  };
};

export type TableRowType<T = any> = {
  key: keyof T;
};

export type SelectableType = {
  options: Option[];
  selected?: Option | Option[];
  isSelected?: ((option: any) => boolean) | null;
  getLabel?: ((option: any) => string) | null;
  multiple?: boolean;
  hasPanel?: boolean;
};

export type ModalType = {
  cnt: any;
  data?: any;
  afterClosed?(data?: any): void;
};

export type Option =
  | string
  | number
  | {
      name: string | number | ((o: Option) => string | number);
    };

export type OptionSelectEventDetail = {
  option: Option;
  selected: Option[];
};

export type TableFilter = {
  [key: string]: any[];
};

export type TableSort = {
  key: string;
  type: TABLE_SORT_TYPE;
};

export type PieChartType<T = string> = {
  color: string;
  label: T;
  percentage: number;
};

export type PieChartConfig<T = any> = { datasets: PieChartType<T>[] };

export type ServerRouteProps = {
  url: URL;
  sse: SSE;
  stream: ServerHttp2Stream;
  headers: IncomingHttpHeaders;
};

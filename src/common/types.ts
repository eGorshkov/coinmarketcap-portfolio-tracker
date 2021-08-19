import type {
  Http2ServerRequest,
  Http2ServerResponse,
  IncomingHttpHeaders,
  ServerHttp2Stream,
} from 'http2';
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

  portfolioId: Portfolio['id'] | null;
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
  edited?: { component: any; props?: any };
  customTableComponent?: any;
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
  req: Http2ServerRequest;
  res: Http2ServerResponse;
  headers: IncomingHttpHeaders;
  cookie: { [k in string]: string };
};

export type Portfolio = {
  id: number;
  name: string;
  selected: boolean;
};

export type UserRights = {
  actives: {
    canView: boolean;
  };
  portfolios: {
    canAdd: boolean;
    canUpdate: boolean;
  };
  transactions: {
    canAdd: boolean;
    canUpdate: boolean;
    canDelete: boolean;
  };
};

export type User = {
  login: string;
  id: string;
  rights: UserRights;
};

export type Feature = Pick<Transaction, 'id' | 'coinSymbol'> & {
  coefficient: number;
  margin: number;
  startPrice: number;
  count: number;
  pnl: number;
  liquidation: number;
};

export type Price = {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  weightedAvgPrice: string;
  prevClosePrice: string;
  lastPrice: string;
  lastQty: string;
  bidPrice: string;
  bidQty: string;
  askPrice: string;
  askQty: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
  openTime: number;
  closeTime: number;
  firstId: number;
  lastId: number;
  count: number;
};

export type Prices = {
  [k: string]: Price | null;
};

import { writable, derived } from 'svelte/store';
import { TABLE_SORT_TYPE } from '../../constants/common';
import type { TableFilter, TableSort } from '../../../common/types';
import useFilter from './useFilter';

export const data = writable([]);
export const filter = writable<TableFilter>({});
export const sort = writable<TableSort>({
  key: null,
  type: TABLE_SORT_TYPE.DESC,
});

export const tableData = derived([data, filter, sort], useFilter, []);

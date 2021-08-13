import type { TableFilter, TableSort } from '../../../common/types';
import { TABLE_SORT_TYPE } from '../../constants/common';

function sorting(sort: TableSort) {
  return sort.type === TABLE_SORT_TYPE.ASC
    ? (a, b) => (a[sort.key] > b[sort.key] ? -1 : 1)
    : (a, b) => (a[sort.key] > b[sort.key] ? 1 : -1);
}

export default function useFilter([values, filter, sort]: [
  any[],
  TableFilter,
  TableSort
]) {
  let newData = [...values];

  newData = Object.keys(filter).reduce(
    (acc, key) =>
      filter[key]?.length
        ? acc.filter((x) => filter[key].includes(x[key]))
        : acc,
    newData
  );

  if (sort.key) newData = newData.sort(sorting(sort));

  return newData;
}

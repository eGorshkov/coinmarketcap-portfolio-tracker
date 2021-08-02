import {
  TableFilter,
  TableSort,
  TABLE_SORT_TYPE,
} from '../../constants/common';

function sorting(sort: TableSort) {
  console.log('sorting');

  return sort.type === TABLE_SORT_TYPE.ASC
    ? (a, b) => (a[sort.key] > b[sort.key] ? -1 : 1)
    : (a, b) => (a[sort.key] > b[sort.key] ? 1 : -1);
}

export default function useFilter([values, filter, sort]: [
  any[],
  TableFilter,
  TableSort
]) {
  // values = Object.keys(filter).reduce(
  //   (acc, key) =>
  //     filter[key]?.length
  //       ? acc.filter((x) => filter[key].includes(x[key]))
  //       : acc,
  //   values
  // );

  // values = sort.key ? values.sort(sorting(sort)) : values;

  return values;
}

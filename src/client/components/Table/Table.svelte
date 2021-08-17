<script lang="ts">
  import { tableData, filter, data, sort } from './store';
  import TableHead from './TableHead.svelte';
  import TableCoinRow from './TableCoinRow.svelte';
  import type {
    TableConfigType,
    TableHeadType,
    OptionSelectEventDetail,
  } from '../../../common/types';
  import { TABLE_SORT_TYPE } from '../../constants/common';
  import { onMount, beforeUpdate } from 'svelte';

  export let config: TableConfigType | null = null;
  export let values = [];
  export let tableName = 'default';

  const localStorageFilterName = `table-filter-${tableName}`;
  const localStorageSortingName = `table-sorting-${tableName}`;

  function updateFilter(head: TableHeadType) {
    return (e: CustomEvent<OptionSelectEventDetail>) => {
      filter.update((state) => ({
        ...state,
        [head.key]: e?.detail.selected || [],
      }));
      localStorage.setItem(localStorageFilterName, JSON.stringify($filter));
    };
  }

  function updateSort(head: TableHeadType) {
    sort.update((state) => {
      if (state.key === head.key && state.type === TABLE_SORT_TYPE.DESC) {
        return {
          key: null,
          type: TABLE_SORT_TYPE.DESC,
        };
      }
      return {
        key: head.key as string,
        type:
          state.type === TABLE_SORT_TYPE.ASC
            ? TABLE_SORT_TYPE.DESC
            : TABLE_SORT_TYPE.ASC,
      };
    });
    localStorage.setItem(localStorageSortingName, JSON.stringify($sort));
  }

  onMount(() => {
    filter.set(
      localStorage.getItem(localStorageFilterName)
        ? JSON.parse(localStorage.getItem(localStorageFilterName))
        : {}
    );
    sort.set(
      localStorage.getItem(localStorageSortingName)
        ? JSON.parse(localStorage.getItem(localStorageSortingName))
        : {}
    );
  });

  beforeUpdate(() => {
    data.set(values);
  });
</script>

{#if config}
  <table>
    <thead>
      <tr>
        {#if config.ordered} <th>№</th> {/if}
        {#each config.headers as head}
          <TableHead {updateFilter} {updateSort} {head} {values} />
        {/each}
        {#if config.edited}
          <th />
        {/if}
      </tr>
    </thead>
    {#if !config.customTableComponent}
      <tbody>
        {#each $tableData as row, rowIndex}
          <TableCoinRow {row} {config} {rowIndex} />
        {/each}
      </tbody>
    {/if}
  </table>
  {#if config.customTableComponent}
    <svelte:component this={config.customTableComponent} data={$tableData} />
  {/if}
{:else}
  has not config
{/if}

<style>
  table {
    width: 100%;
    border-collapse: collapse;
  }

  :global(table th) {
    height: 42px;
    text-align: left;
    position: sticky;
    top: 0;
    background-color: var(--theme-bg-color);
    box-shadow: inset 0 -1px 0px 0 rgb(0 0 0 / 30%);
  }

  :global(table td) {
    text-align: left;
    border-bottom: 1px solid var(--theme-border-color);
    vertical-align: top;
  }
</style>

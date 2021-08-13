<script lang="ts">
  import { filter, sort } from './store';
  import type {
    TableHeadType,
    OptionSelectEventDetail,
  } from '../../../common/types';
  import { TABLE_SORT_TYPE } from '../../constants/common';
  import selectable from '../Select/selectable';

  export let values = [];
  export let head: TableHeadType;
  export let updateFilter: (
    head: TableHeadType
  ) => (e?: CustomEvent<OptionSelectEventDetail>) => void;
  export let updateSort: (head: TableHeadType) => () => void;

  const handleSelected = updateFilter(head);

  function handleSort() {
    updateSort(head);
  }

  $: filterValues = Object.keys($filter)
    .reduce(
      (acc, key) =>
        key !== head.key && $filter[key]?.length
          ? acc.filter((x) => $filter[key].includes(x[key]))
          : acc,
      values
    )
    .map((x) => (head.onFiltering ? head.onFiltering(x, head) : x[head.key]));

  $: options = Array.from(new Set(filterValues));
  $: selected = $filter[head.key] || [];
  $: isActive = $filter[head.key]?.length;
</script>

<th>
  {#if head.filtered}
    <button
      class="head-filter"
      class:head-filter--active={isActive}
      use:selectable={{ options, selected, multiple: true, hasPanel: true }}
      on:selected={handleSelected}
    >
      {head.title}
    </button>
    {#if isActive}
      <button class="head-filter" on:click={() => handleSelected()}>✕</button>
    {/if}
  {:else}
    {head.title}
  {/if}
  {#if head.sorted}
    <button class="head-sort-button" on:click={handleSort}>
      {#if $sort.key === head.key}
        {$sort.type === TABLE_SORT_TYPE.ASC ? '∧' : '∨'}
      {:else}
        =
      {/if}
    </button>
  {/if}
</th>

<style>
  button {
    margin: 0;
    padding: 0;
  }
  .head-filter {
    font-weight: bold;
    cursor: pointer;
    background-color: transparent;
    border: none;
    margin: 0;
    padding: 0;
  }

  .head-sort-button {
    border-radius: 50%;
    cursor: pointer;
    width: 24px;
    height: 24px;
  }

  .head-filter--active {
    text-decoration: underline;
  }
</style>

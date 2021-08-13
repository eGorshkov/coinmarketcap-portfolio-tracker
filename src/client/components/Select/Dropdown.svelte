<script lang="ts">
  import { afterUpdate, onMount } from 'svelte';

  import type { Option, SelectableType } from '../../../common/types';
  import DropdownItem from './DropdownItem.svelte';
  import DropdownPanel from './DropdownPanel.svelte';

  const _default: SelectableType = {
    options: [],
    selected: [],
    multiple: false,
    hasPanel: false,
    isSelected: null,
    getLabel: null,
  };

  export let options = _default.options;
  export let selected = _default.selected;
  selected = (Array.isArray(selected) ? selected : [selected]) as Option[];
  export let isSelected = _default.isSelected;
  export let getLabel = _default.getLabel;
  export let multiple = _default.multiple;
  export let hasPanel = _default.hasPanel;

  export let optionClick: (option: Option, selected: Option[]) => void;
  export let position: DOMRect;
  export let filterValue: string;

  function init() {
    const s = [],
      o = [];

    options
      .sort((a, b) => (a > b ? 1 : -1))
      .forEach((x) => (selected.includes(x) ? s.push(x) : o.push(x)));

    return s.concat(o);
  }

  function selectMultiple(option: Option) {
    return selected.includes(option)
      ? selected.filter((x) => x !== option)
      : [...selected, option];
  }

  function select(option: Option) {
    return selected.includes(option) ? [] : [option];
  }

  function itemClick(option: Option) {
    selected = multiple ? selectMultiple(option) : select(option);
    optionClick(option, selected);
  }

  onMount(() => {
    options = init();
  });

  $: containerStyle = `top: ${position?.bottom || 0}px; left:${
    position?.left || 0
  }px`;

  $: _selected = multiple ? selected : selected.slice(0, 1);

  $: data = filterValue
    ? options.filter((x) => {
        const value: string = typeof x === 'object' ? x.name : x;
        return value
          .toString()
          .toLowerCase()
          .includes(filterValue.toLowerCase());
      })
    : options;
</script>

<div style={containerStyle} class="dropdown-container" role="listbox">
  {#if hasPanel}
    <DropdownPanel onFilter={(v) => (filterValue = v)} />
  {/if}
  {#each data as option}
    <DropdownItem {itemClick} {getLabel} {isSelected} {option} selected={_selected} />
  {/each}
</div>

<style>
  .dropdown-container {
    height: 200px;
    width: 200px;
    background-color: var(--theme-bg-color);
    overflow: auto;
    position: fixed;
    box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.7);
    z-index: 1000;
  }

  :global(.dropdown-container button),
  :global(.dropdown-container input) {
    margin: 0;
  }
</style>

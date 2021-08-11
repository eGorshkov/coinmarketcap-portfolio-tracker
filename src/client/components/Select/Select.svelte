<script lang="ts">
  import type { SelectableType, Option } from '../../../common/types';
  import selectable from './selectable';

  export let onSelect: (selected: Option[]) => void;
  export let options: SelectableType['options'] = [];
  export let selected: SelectableType['selected'] = [];
  export let hasPanel: SelectableType['hasPanel'] = false;
  export let multiple: SelectableType['multiple'] = false;
  export let isSelected: SelectableType['isSelected'] = null;
  export let getLabel: SelectableType['getLabel'] = null;

  function handleSelected(e) {
    selected = e.detail.selected;
    onSelect && onSelect(selected);
  }

  function onKeyDown(e) {
    if (e.key === 'Enter') e.target.click();
  }
</script>

<ui-select
  type="button"
  tabindex="0"
  title={selected.toString()}
  on:keydown={onKeyDown}
  use:selectable={{
    options,
    selected,
    hasPanel,
    multiple,
    isSelected,
    getLabel
  }}
  on:selected|preventDefault={handleSelected}
>
  {selected.toString()}
</ui-select>

<style>
  ui-select {
    display: block;
    height: 32px;
    width: 100%;
    font-family: inherit;
    font-size: inherit;
    box-sizing: border-box;
    -webkit-padding: 0.4em 0;
    padding: 0.4em;
    text-align: left;
    background-color: transparent;
    border: 1px solid;
    border-radius: 2px;
    cursor: pointer;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    transition: 300ms;
  }

  ui-select:focus {
    outline: none;
    border: 1px solid tomato;
    box-shadow: 0 0 2px 0 tomato;
  }
</style>

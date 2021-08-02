<script lang="ts">
  import type { Option } from '../../../common/types';

  export let option: Option = undefined;
  export let itemClick: (o: Option) => void;
  export let selected = [];
  export let isSelected;
  export let getLabel;

  function handleClick() {
    console.log('option onClick', option);
    itemClick(option);
  }

  $: label = getLabel ? getLabel(option) : option;
  $: _isSelected = isSelected ? isSelected(option) : (selected.includes(option) || false);
</script>

{#if option}
  <button
    class={_isSelected ? 'selected' : ''}
    role="option"
    on:click={handleClick}
  >
    <p title={label}>{label}</p>
  </button>
{:else}
  <div role="option">Ошибка при рендеринге</div>
{/if}

<style>
  button {
    width: 100%;
    height: 42px;
    text-align: left;
    cursor: pointer;
    background-color: white;
  }

  button:focus {
    border-color: tomato;
    box-shadow: inset 0 0 2px 0 tomato;
  }

  p {
    margin: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .selected {
    background-color: turquoise;
  }
</style>

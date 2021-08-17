<script lang="ts">
  import type { Active } from '../../../../common/types';
  import modal from '../../../components/Modal/modal';
  import PlusMinus from '../../../components/PlusMinus/PlusMinus.svelte';
  import ActivesTransactionsForm from '../Form/ActivesTransactionsForm.svelte';

  export let row: Active;

  function getPercent(r) {
    const num = ((r.value + r.profit) / r.value - 1) * 100;
    return Math.round(num * Math.pow(10, 2)) / Math.pow(10, 2);
  }

  $: isProfit = row.profit >= 0;
  $: percent = getPercent(row);
  $: diff = isProfit
    ? `+$${row.profit?.toString()}`
    : row.profit?.toString().replace('-', '-$');
</script>

{#if row}
  <div class="grid-item-container">
    <button
      use:modal={{
        data: row,
        cnt: ActivesTransactionsForm,
      }}
      class="grid-item {isProfit && 'grid-item--profit'}"
    >
      <h2 class="grid-item-title">
        {row.coinSymbol}
        <PlusMinus isPlus={isProfit} {percent}>
          ({diff})
        </PlusMinus>
      </h2>

      <h3>
        Активы - {row.count?.toFixed(2)}
        {row.coinSymbol} (${(row.value + row.profit)?.toFixed(2)})
      </h3>

      <p>
        Текущая цена - ${row.price?.toFixed(2)}
      </p>

      <p>
        Средняя цена покупки - ${row.avgPrice?.toFixed(2)}
      </p>
    </button>
  </div>
{/if}

<style>
  .grid-item-container {
    width: 50%;
    margin-bottom: 20px;
  }

  @media (max-width: 665px) {
    .grid-item-container {
      width: 100%;
    }
  }

  .grid-item {
    --color: hsla(9, 100%, 64%, 0.3);
    --border-color: hsla(9, 100%, 64%, 0.1);

    cursor: pointer;
    position: relative;
    text-align: left;
    border: none;
    height: 200px;
    width: calc(100% - 40px);
    border-radius: 8px;
    padding: 10px;
    margin: auto;
    transition: all 750ms ease-in-out, border 0ms linear;

    background-color: var(--color);
    border: 1px solid var(--border-color);
    box-shadow: 5px 5px 0 0 var(--color);
  }

  .grid-item:hover,
  .grid-item:focus {
    box-shadow: 5px 5px 0 2px var(--color);
    --border-color: hsl(227deg 96% 60%);
    outline: none;
  }

  .grid-item--profit {
    --color: hsla(163, 15%, 53%, 0.3);
    --border-color: hsla(9, 100%, 64%, 0.1);
  }

  .grid-item-title {
    margin: 0;
  }
</style>

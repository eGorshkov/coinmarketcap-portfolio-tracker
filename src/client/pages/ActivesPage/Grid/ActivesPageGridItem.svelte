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
    <div
      use:modal={{
        data: row,
        cnt: ActivesTransactionsForm,
      }}
      class="grid-item {isProfit ? 'grid-item--profit' : 'grid-item--noprofit'}"
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
        Avg. Buy Price - ${row.avgPrice?.toFixed(2)}
      </p>
    </div>
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
    cursor: pointer;
    position: relative;
    text-align: left;
    border: none;
    height: 300px;
    width: calc(100% - 40px);
    border-radius: 8px;
    padding: 10px;
    margin: auto;
  }

  .grid-item--profit {
    background-color: hsla(163, 15%, 53%, 0.3);
  }

  .grid-item--noprofit {
    background-color: hsla(9, 100%, 64%, 0.3);
  }
</style>

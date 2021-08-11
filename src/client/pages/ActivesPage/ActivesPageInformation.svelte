<script lang="ts">
  import { actives, total, balance } from '../../stores';
  import modal from '../../components/Modal/modal';
  import ActivesTransactionsForm from './ActivesTransactionsForm.svelte';
  import PlusMinus from '../../components/PlusMinus/PlusMinus.svelte';
  $: profit = ((($balance - $total) / $total) * 100).toFixed(2);
  $: [best, ...other] = [...$actives].sort((a, b) => b.profit - a.profit);
  $: worst = other[other.length - 1];
</script>

<div class="info-container">
  <div class="info-item">
    <h4>All Time Profit</h4>
    <PlusMinus isPlus={$balance - $total > 0} percent={profit}>
      (${$balance - $total})
    </PlusMinus>
  </div>
  {#if best}
    <button
      class="info-item"
      use:modal={{
        cnt: ActivesTransactionsForm,
        data: best,
      }}
    >
      <h4>Best Performer is {best.coinSymbol}</h4>
      <PlusMinus
        isPlus={true}
        percent={+(((best.value + best.profit) / best.value) * 100).toFixed(2) -
          100}
      >
        (${best.profit})
      </PlusMinus>
    </button>
  {/if}
  {#if worst}
    <button
      class="info-item"
      use:modal={{
        cnt: ActivesTransactionsForm,
        data: worst,
      }}
    >
      <h4>Worst Performer is {worst.coinSymbol}</h4>
      <PlusMinus
        isPlus={false}
        percent={+(((worst.value + worst.profit) / worst.value) * 100).toFixed(
          2
        ) - 100}
      >
        ({worst.profit.toString().replace('-', '-$')})
      </PlusMinus>
    </button>
  {/if}
</div>

<style>
  h4 {
    margin: 0;
  }

  button {
    cursor: pointer;
  }

  .info-container {
    display: flex;
  }

  .info-item {
    margin: 10px;
    padding: 10px;
    border: 1px solid;
    border-radius: 8px;
    text-align: left;
  }
  
  .info-item:not(:last-child) {
    margin-left: 0;
  }
</style>

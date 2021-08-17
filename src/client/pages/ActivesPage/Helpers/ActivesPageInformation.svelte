<script lang="ts">
  import {
    actives,
    activesTotal,
    featuresTotal,
    activesBalance,
    featuresBalance,
  } from '../../../stores';
  import modal from '../../../components/Modal/modal';
  import ActivesTransactionsForm from '../Form/ActivesTransactionsForm.svelte';
  import PlusMinus from '../../../components/PlusMinus/PlusMinus.svelte';

  export let rights;

  $: totalActivesProfit = +($activesBalance - $activesTotal).toFixed(2);
  $: activesProfit = ((totalActivesProfit / $activesTotal) * 100).toFixed(2);

  $: totalFeaturesProfit = +($featuresBalance - $featuresTotal).toFixed(2);
  $: featuresProfit = ((totalFeaturesProfit / $featuresTotal) * 100).toFixed(2);

  $: [best, ...other] = [...$actives].sort((a, b) => b.profit - a.profit);
  $: worst = other[other.length - 1];
</script>

<div class="info-container">
  <div class="info-item">
    <h4>All Time Stock Profit</h4>
    <PlusMinus isPlus={totalActivesProfit > 0} percent={activesProfit}>
      (${totalActivesProfit})
    </PlusMinus>
  </div>
  <div class="info-item">
    <h4>All Time Feature Profit</h4>
    <PlusMinus isPlus={totalFeaturesProfit > 0} percent={featuresProfit}>
      (${totalFeaturesProfit})
    </PlusMinus>
  </div>
  {#if best}
    <button
      class="info-item"
      disabled={!rights?.canView}
      use:modal={{
        cnt: ActivesTransactionsForm,
        data: best,
      }}
    >
      <h4>Best Performer is {best.coinSymbol}</h4>
      <PlusMinus
        isPlus={best.profit > 0}
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
      disabled={!rights?.canView}
      use:modal={{
        cnt: ActivesTransactionsForm,
        data: worst,
      }}
    >
      <h4>Worst Performer is {worst.coinSymbol}</h4>
      <PlusMinus
        isPlus={worst.profit > 0}
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

  button:disabled {
    opacity: 1;
    cursor: default;
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

<script lang="ts">
  import type { Active } from '../../../common/types';
  import { actives, balance } from '../../stores';

  function percent(active: Active): number {
    return +(((active.value + active.profit) / $balance) * 100).toFixed(2);
  }

  $: [first, second, third, four, ...others] = [...$actives].sort(
    (a, b) => b.value + b.profit - (a.value + a.profit)
  );

  $: othersPerceent = others.reduce((sum, x) => (sum += percent(x)), 0);
</script>

<div class="chart">
  {#each [first, second, third, four] as item}
    {#if item}
      <div
        class="chart-item"
        data-symbol="{item.coinSymbol} {percent(item)}%"
        style="width: {percent(item)}%"
      >
        <span class="chart-item--dot">●</span>
      </div>
    {/if}
  {/each}
  {#if othersPerceent}
    <div
      class="chart-item"
      data-symbol="Другие {othersPerceent}%"
      style="width: {othersPerceent}%"
    >
      <span class="chart-item--dot">●</span>
    </div>
  {/if}
</div>

<style>
  .chart {
    width: 100%;
    display: flex;
    font-weight: bold;
  }

  .chart-item::before {
    content: '';
    display: block;
    height: 5px;
    width: 100%;
    background-color: var(--chart-color, lightskyblue);
  }

  .chart-item--dot {
    color: var(--chart-color, lightskyblue);
  }

  .chart-item::after {
    content: attr(data-symbol);
    font-size: 14px;
    margin-left: 5px;
  }

  .chart-item:first-child {
    --chart-color: tomato;
  }

  .chart-item:nth-child(2) {
    --chart-color: aqua;
  }

  .chart-item:nth-child(3) {
    --chart-color: blueviolet;
  }

  .chart-item:nth-child(4) {
    --chart-color: thistle;
  }
</style>

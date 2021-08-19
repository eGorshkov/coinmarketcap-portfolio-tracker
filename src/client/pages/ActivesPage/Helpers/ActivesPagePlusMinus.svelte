<script lang="ts">
  import type { Active } from '../../../../common/types';
  import PlusMinus from '../../../components/PlusMinus/PlusMinus.svelte';
import Usd from '../../../components/USD/USD.svelte';

  export let row: Active;

  function getPercent(r) {
    const num = ((r.value + r.profit) / r.value - 1) * 100;
    return Math.round(num * Math.pow(10, 2)) / Math.pow(10, 2);
  }

  $: percent = getPercent(row);
</script>

<Usd isProfit={row.profit >= 0} value={row.profit} />
<br />
<PlusMinus isPlus={row.profit >= 0} {percent} />

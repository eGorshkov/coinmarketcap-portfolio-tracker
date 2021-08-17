<script lang="ts">
  import type { Active } from '../../../../common/types';
  import PlusMinus from '../../../components/PlusMinus/PlusMinus.svelte';

  export let row: Active;

  function getPercent(r) {
    const num = ((r.value + r.profit) / r.value - 1) * 100;
    return Math.round(num * Math.pow(10, 2)) / Math.pow(10, 2);
  }

  $: percent = getPercent(row);
  $: diff =
    row.profit >= 0
      ? `+$${row.profit?.toString()}`
      : row.profit?.toString().replace('-', '-$');
</script>

<span>{diff}</span>
<br />
<PlusMinus isPlus={row.profit >= 0} {percent} />

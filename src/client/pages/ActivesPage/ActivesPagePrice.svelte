<script lang="ts">
  import type { Active } from '../../../common/types';

  export let row: Active;
</script>

<span>${(row.value + row.profit)?.toFixed(2)}</span>
<br />
<p>{row.count} {row.coinSymbol}</p>

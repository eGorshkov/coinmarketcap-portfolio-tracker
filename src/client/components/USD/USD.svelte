<script lang="ts">
  export let value: number = 0;
  export let isProfit = true;
</script>

{isProfit ? `+$${value?.toString()}` : value?.toString().replace('-', '-$')}

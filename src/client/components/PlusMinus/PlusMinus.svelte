<script>
  export let isPlus;
  export let percent;
</script>

{#if isNaN(percent)}
  <span>
    0
    <slot />
  </span>
{:else}
  <span class="difference {isPlus ? 'green' : 'red'}">
    {isPlus ? '▲' : '▼'}
    {percent === NaN ? 0 : percent.toString().replace('-', '')}%
    <slot />
  </span>
{/if}

<style>
  .difference.green {
    font-weight: bold;
  }

  :global(.difference.green) {
    color: teal;
  }

  :global(.difference.red) {
    color: tomato;
  }
</style>

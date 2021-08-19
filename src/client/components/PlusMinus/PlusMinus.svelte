<script>
  export let isPlus;
  export let percent;
</script>

{#if percent !== 0}
  <span class="difference {isPlus ? 'green' : 'red'}">
    {isPlus ? '▲' : '▼'}
    {percent.toString().replace('-', '')}%
    <slot />
  </span>
{:else}
  <span>
    0
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

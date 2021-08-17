<script>
  export let isPlus;
  export let percent;
</script>

{#if percent !== 0}
  <span class={isPlus ? 'green' : 'red'}>
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
  span {
    font-weight: bold;
  }

  .green {
    color: teal;
  }

  .red {
    color: tomato;
  }
</style>

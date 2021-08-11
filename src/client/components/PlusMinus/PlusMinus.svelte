<script>
  export let isPlus;
  export let percent;
</script>

<span class={isPlus ? 'green' : 'red'}>
  {isPlus ? '▲' : '▼'}
  {percent.toString().replace('-', '')}%
  <slot />
</span>

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

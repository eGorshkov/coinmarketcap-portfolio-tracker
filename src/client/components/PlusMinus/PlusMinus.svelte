<script>
  export let isPlus;
  export let percent;
</script>

<span class={isPlus ? 'green' : 'red'}>
  {isPlus ? '▲' : '▼'}
  {percent.toString().replace('-', '')}%
  <slot></slot>
</span>

<style>
  .green {
    color: teal;
  }

  .red {
    color: tomato;
  }
</style>
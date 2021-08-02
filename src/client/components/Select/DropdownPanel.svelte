<script lang="ts">
  export let onFilter: (v: string) => void;

  let filterValue = '';

  function handleInput(e) {
    onFilter(e.target.value);
  }

  function handleClear(e) {
    filterValue = '';
    onFilter('');
  }
</script>

<div class="panel-container">
  <input
    type="text"
    class="panel-input"
    on:input={handleInput}
    bind:value={filterValue}
  />
  <button class="panel-clear" on:click={handleClear}>✕</button>
</div>

<style>
  .panel-container {
    display: flex;
    position: sticky;
    top: 0;
  }
  .panel-input {
    width: calc(100% - 26px);
  }
  .panel-clear {
    width: 26px;
  }
</style>

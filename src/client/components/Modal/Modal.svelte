<script lang="ts">
  export let cnt;
  export let data;
  export let onClose;
  export let className = '';
</script>

<div class="modal-container {className}">
  <svelte:component this={cnt} {data} {onClose} />
</div>

<style>
  .modal-container {
    position: fixed;
    z-index: 900;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
</style>

<script lang="ts">
  import type { Active } from '../../../../common/types';
  import ActivesPageGridItem from './ActivesPageGridItem.svelte';

  export let data: Active[] = [];
</script>

<div class="grid-container">
  {#each data as row}
    <ActivesPageGridItem {row} />
  {/each}
</div>

<style>
  .grid-container {
    display: flex;
    flex-wrap: wrap;
  }
</style>

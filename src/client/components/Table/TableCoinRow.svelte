<script lang="ts">
  import type { TableConfigType, Coin } from '../../../common/types';
  import { RENDERING_TYPE } from '../../../common/types';

  export let row = null;
  export let rowIndex: number | null = null;
  export let config: TableConfigType<Coin>;
</script>

<tr>
  {#if config.ordered}
    <td>{rowIndex + 1}</td>
  {/if}

  {#each config.headers as head}
    <td>
      {#if head.onRendering}
        {#if head.onRendering.type === RENDERING_TYPE.COMPONENT}
          <svelte:component this={head.onRendering._this} {row} />
        {:else}
          {head.onRendering._this(row)}
        {/if}
      {:else}
        {row[head.key] ||
          `Нет значения в строке ${row.symbol}. Ключ ${head.key}`}
      {/if}
    </td>
  {/each}

  {#if config.edited}
    <td>
      <svelte:component this={config.edited} {row} />
    </td>
  {/if}
</tr>
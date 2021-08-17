<script lang="ts">
  import type { TableConfigType, Active } from '../../../../common/types';

  import { actives } from '../../../stores';
  import { RENDERING_TYPE } from '../../../../common/types';
  import Table from '../../../components/Table/Table.svelte';
  import ActivesPagePlusMinus from '../Helpers/ActivesPagePlusMinus.svelte';
  import ActivesPageGrid from './ActivesPageGrid.svelte';

  let config: TableConfigType<Active> = {
    customTableComponent: ActivesPageGrid,
    headers: [
      { title: 'Наименование', key: 'coinSymbol', filtered: true },
      {
        title: 'Профит',
        key: 'profit',
        sorted: true,
      },
    ],
  };
</script>

<div class="grid-container" style="flex: 70%">
  <Table {config} values={$actives} tableName="actives" />
</div>

<style>
  .grid-container {
    flex: 1;
  }

  :global(.grid-container table tr th) {
    width: 50%;
    border: none;
    box-shadow: none;
  }
</style>

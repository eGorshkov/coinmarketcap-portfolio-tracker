<script lang="ts">
  import type { TableConfigType, Active } from '../../../common/types';

  import { actives, balance, user } from '../../stores';
  import { RENDERING_TYPE } from '../../../common/types';
  import PortfolioPage from '../PortfolioPage/PortfolioPage.svelte';
  import Table from '../../components/Table/Table.svelte';
  import ActivesPagePrice from './ActivesPagePrice.svelte';
  import ActivesPagePlusMinus from './ActivesPagePlusMinus.svelte';
  import ActivesPageAllocation from './ActivesPageAllocation.svelte';
  import ActivesPageInformation from './ActivesPageInformation.svelte';
  import ActivesPageEdit from './ActivesPageEdit.svelte';

  let config: TableConfigType<Active> = {
    edited: { component: ActivesPageEdit, props: { rights: $user?.rights?.actives } },
    headers: [
      { title: 'Наименование', key: 'coinSymbol', filtered: true },
      {
        title: 'Цена',
        key: 'price',
        onRendering: {
          type: RENDERING_TYPE.TEXT,
          _this: (row: Active) => row.price && row.price.toFixed(2),
        },
      },
      {
        title: 'Активы',
        key: 'value',
        onRendering: {
          type: RENDERING_TYPE.COMPONENT,
          _this: ActivesPagePrice,
        },
      },
      {
        title: 'Avg. Buy Price',
        key: 'avgPrice',
        onRendering: {
          type: RENDERING_TYPE.TEXT,
          _this: (row: Active) => row.avgPrice.toFixed(2),
        },
      },
      {
        title: 'Прибыль / убыток',
        key: 'profit',
        sorted: true,
        onRendering: {
          type: RENDERING_TYPE.COMPONENT,
          _this: ActivesPagePlusMinus,
        },
      },
    ],
  };

  const tabs = {
    information: ActivesPageInformation,
    allocation: ActivesPageAllocation,
  };

  let activeTab: keyof typeof tabs = 'information';

</script>

<h6>Текущий баланс</h6>
<h1>${$balance}</h1>

<button on:click={() => (activeTab = 'information')}>Information</button>
<button on:click={() => (activeTab = 'allocation')}>Allocation</button>
<svelte:component this={tabs[activeTab]} rights={$user?.rights?.actives} />
<div class="actives-container">
  <PortfolioPage />
  <Table {config} values={$actives} tableName="actives" />
</div>

<style>
  h6,
  h1 {
    margin: 0;
  }

  .actives-container {
    display: grid;
    grid-template-columns: 30% 1fr;
  }
</style>

<script lang="ts">
  import { RENDERING_TYPE } from '../../../common/types';
  import modal from '../../components/Modal/modal';
  import FeaturesForm from './FeaturesForm.svelte';
  import FeautersPageEdit from './FeautersPageEdit.svelte';
  import Table from '../../components/Table/Table.svelte';
  import { user, getFeatures, prices, features, createFeature } from '../../stores';
  import type { Feature, TableConfigType } from '../../../common/types';

  let config: TableConfigType<Feature> = {
    ordered: true,
    edited: { component: FeautersPageEdit, props: null },
    headers: [
      {
        title: 'Монета',
        key: 'coinSymbol',
        filtered: true,
        onRendering: {
          type: RENDERING_TYPE.TEXT,
          _this: (row: Feature) => `${row.coinSymbol} x${row.coefficient}`,
        },
      },
      { title: 'Цена входа', key: 'startPrice' },
      {
        title: 'Цена маркировки',
        key: 'startPrice',
        onRendering: {
          type: RENDERING_TYPE.TEXT,
          _this: (row: Feature) => $prices[row.coinSymbol],
        },
      },
      { title: 'Ликвидация', key: 'liquidation' },
      { title: 'Маржа', key: 'margin', filtered: true },
      { title: 'PNL', key: 'pnl' },
      {
        title: 'PNL',
        key: 'pnl',
        onRendering: {
          type: RENDERING_TYPE.TEXT,
          _this: (row: Feature) =>
            row.pnl >= 0
              ? `+$${row.pnl.toFixed(2)}`
              : row.pnl?.toFixed(2).replace('-', '-$'),
        },
      },
    ],
  };

  async function afterClosed() {
    const _features = await getFeatures();
    features.set(_features.map(createFeature($prices)));
  }

  async function checkRights() {
    const rights = $user?.rights?.transactions;
    config.edited.props = { rights };
  }

  $: $user, checkRights();
</script>

<div class="transaction-page">
  <button
    disabled={!$user?.rights?.transactions?.canAdd}
    use:modal={{ cnt: FeaturesForm, afterClosed }}>Add</button
  >
  <Table {config} values={$features} tableName="features" />
</div>

<style>
  .transaction-page :global(table td) {
    height: 50px;
    vertical-align: middle;
  }
</style>

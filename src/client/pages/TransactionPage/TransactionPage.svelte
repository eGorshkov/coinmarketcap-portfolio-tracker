<script lang="ts">
  import type { TableConfigType, Transaction } from '../../../common/types';
  import { RENDERING_TYPE } from '../../../common/types';
  import modal from '../../components/Modal/modal';
  import TransactionForm from './TransactionForm.svelte';
  import TransactionPageEdit from './TransactionPageEdit.svelte';
  import Table from '../../components/Table/Table.svelte';
  import {
    createPrices,
    prices,
    transactions,
    getTransactions,
    portfolios,
    currentPortfolioId,
    user,
  } from '../../stores';

  let config: TableConfigType<Transaction> = {
    ordered: true,
    edited: { component: TransactionPageEdit, props: null },
    headers: [
      { title: 'Монета', key: 'coinSymbol', filtered: true },
      { title: 'Цена за монету', key: 'coinPrice', filtered: true },
      {
        title: 'Количество',
        key: 'count',
        onRendering: {
          type: RENDERING_TYPE.TEXT,
          _this: (row: Transaction) => `${row.count} ${row.coinSymbol}`,
        },
      },
      {
        title: 'Цена транзакции',
        key: 'count',
        onRendering: {
          type: RENDERING_TYPE.TEXT,
          _this: (row: Transaction) => row.count * (+row.coinPrice || 0),
        },
      },
      {
        title: 'Дата',
        key: 'date',
        onRendering: {
          type: RENDERING_TYPE.TEXT,
          _this: (row: Transaction) => row.date?.toLocaleString(),
        },
      },
      {
        title: 'Портфолио',
        key: 'portfolioId',
        onRendering: {
          type: RENDERING_TYPE.TEXT,
          _this: (row: Transaction) =>
            $portfolios.find((x) => x.id === row.portfolioId)?.name ?? 'Main',
        },
      },
      {
        title: 'Тип',
        key: 'type',
      },
    ],
  };

  async function afterClosed() {
    const _transactions = await getTransactions({
      portfolioId: $currentPortfolioId,
    });

    transactions.set(_transactions);
    prices.set(createPrices(_transactions, $prices));
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
    use:modal={{ cnt: TransactionForm, afterClosed }}>Add</button
  >
  <Table {config} values={$transactions} tableName="transaction" />
</div>

<style>
  .transaction-page :global(table td) {
    height: 50px;
    vertical-align: middle;
  }
</style>

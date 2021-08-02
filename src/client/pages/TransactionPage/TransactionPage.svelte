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
  } from '../../stores';

  let config: TableConfigType<Transaction> = {
    ordered: true,
    edited: TransactionPageEdit,
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
    ],
  };

  async function afterClosed() {
    const _transactions = await getTransactions();

    transactions.set(_transactions);
    prices.set(createPrices(_transactions, $prices));
  }
</script>

<button use:modal={{ cnt: TransactionForm, afterClosed }}>Add</button>
<Table {config} values={$transactions} tableName="transaction" />

<script lang="ts">
  import modal from '../../components/Modal/modal';
  import TransactionForm from './TransactionForm.svelte';
  import type { Transaction } from '../../../common/types';
  import {
    createPrices,
    prices,
    transactions,
    getTransactions,
    deleteTransaction,
    currentPortfolioId,
  } from '../../stores';

  export let row: Transaction;
  export let props;

  async function onRemoveTransaction() {
    await deleteTransaction(row);
    updateTransactions();
  }

  async function updateTransactions() {
    const _transactions = await getTransactions({
      portfolioId: $currentPortfolioId,
    });

    transactions.set(_transactions);
    prices.set(createPrices(_transactions, $prices));
  }
</script>

<button
  disabled={!props?.rights?.canUpdate}
  use:modal={{
    cnt: TransactionForm,
    data: row,
    afterClosed: updateTransactions,
  }}
>
  ✎
</button>
<button disabled={!props?.rights?.canDelete} on:click={onRemoveTransaction}>
  ✕
</button>

<style>
  button {
    border: none;
    background-color: transparent;
    cursor: pointer;
  }
</style>

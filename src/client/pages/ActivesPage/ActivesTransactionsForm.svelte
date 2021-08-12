<script lang="ts">
  import Table from '../../components/Table/Table.svelte';
  import type { Active, Transaction } from '../../../common/types';
  import { onMount } from 'svelte';
  import { getTransactions, portfolios, currentPortfolioId } from '../../stores';
  export let data: Active;
  let transactions: Transaction[] = [];
  onMount(async () => {
    transactions = await getTransactions({
      activityId: data.id,
      portfolioId: $currentPortfolioId
    });
  });
</script>

<div class="transaction-container">
  <div class="transaction-item ">
    <p>Цена за монету</p>
    <p>Количество {data.coinSymbol}</p>
    <p>Цена транзакции</p>
    <p>Дата</p>
    <p>Портфолио</p>
  </div>
  {#each transactions as transaction}
    <div class="transaction-item ">
      <p>{transaction.coinPrice}</p>
      <p>{transaction.count}</p>
      <p>
        {transaction.count * (+transaction.coinPrice || 0)}
      </p>
      <p>{transaction.date.toLocaleString()}</p>
      <p>{$portfolios.find(x => x.id === transaction.portfolioId)?.name}</p>
    </div>
  {/each}
</div>

<style>
  .transaction-container {
    padding: 15px;
    background-color: var(--theme-bg-color);
    border-radius: 4px;
    max-height: 900px;
  }
  .transaction-item {
    display: grid;
    grid-template-columns: repeat(5, 150px);
  }
</style>

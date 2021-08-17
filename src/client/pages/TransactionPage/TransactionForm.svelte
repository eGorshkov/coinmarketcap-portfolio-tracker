<script lang="ts">
  import type { Transaction } from '../../../common/types';
  import Select from '../../components/Select/Select.svelte';

  import { TRANSACTION_TYPE } from '../../constants/common';
  import { portfolios, postTransaction, putTransaction } from '../../stores';

  export let data: Transaction = {
    coinSymbol: '',
    coinPrice: 0,
    count: 0,
    date: new Date(),
    id: 0,
    portfolioId: null,
    type: TRANSACTION_TYPE.BUY,
  };
  export let onClose;

  function newItem() {
    return {
      ...data,
      date: new Date(_date),
      type: TRANSACTION_TYPE.BUY,
    };
  }

  async function handleSubmit(e) {
    e.preventDefault();
    data.id ? await putTransaction(data) : await postTransaction(newItem());
    onClose();
  }

  function handlePortfolioChange([row]) {
    data.portfolioId = row.id;
  }

  function handleDateChange(e) {
    data.date = new Date(e.target.value);
  }

  $: _date = data.date?.toISOString().slice(0, 16) || ''
  $: selectedPortfolio = $portfolios.find(x => x.id === data.portfolioId)?.name || '';
</script>

<div class="transaction-form-container">
  <h3>Transction</h3>
  <form on:submit={handleSubmit}>
    <div class="transaction-form--symbol">
      <label for="coinSymbol">Монета</label>
      <input
        bind:value={data.coinSymbol}
        type="text"
        id="coinSymbol"
        name="coinSymbol"
      />
    </div>
    <div>
      <label for="coinPrice">Цена за монету</label>
      <input
        bind:value={data.coinPrice}
        step="0.000000001"
        type="number"
        id="coinPrice"
        name="coinPrice"
      />
    </div>
    <div>
      <label for="count">Количество</label>
      <input
        bind:value={data.count}
        step="0.000000001"
        type="number"
        id="count"
        name="count"
      />
    </div>
    <div class="transaction-form--date">
      <label for="date">Дата</label>
      <input
        bind:value={_date}
        on:change={handleDateChange}
        type="datetime-local"
        id="date"
        name="date"
      />
    </div>
    <div class="transaction-form--date">
      <label for="portflio">Портфолио</label>
      <Select
        getLabel={(row) => row.name}
        selected={selectedPortfolio}
        isSelected={(row) => row.id === data.portfolioId}
        onSelect={handlePortfolioChange}
        options={$portfolios}
      />
    </div>
    <div class="transaction-form--value">
      Общий расход
      <span>${Number(data.count * +data.coinPrice).toFixed(2)}</span>
    </div>
    <button type="submit" class="transaction-form--button">
      {data.id ? 'Изменить транзакцию' : 'Добавить транзакцию'}
    </button>
  </form>
</div>

<style>
  .transaction-form-container {
    padding: 15px;
    border-radius: 8px;
    background-color: var(--theme-bg-color);
    box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.7);
  }
  form {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    align-items: flex-end;
  }
  form > *:not(:last-child) {
    margin-right: 10px;
  }
  input,
  button {
    height: 40px;
    width: 100%;
  }

  .transaction-form--button {
    cursor: pointer;
  }

  .transaction-form--symbol,
  .transaction-form--date,
  .transaction-form--value,
  .transaction-form--button {
    grid-column: span 2;
  }
</style>

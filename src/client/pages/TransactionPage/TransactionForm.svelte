<script>
  import { beforeUpdate } from 'svelte';

  import { TRANSACTION_TYPE } from '../../constants/common';
  import { postTransaction, putTransaction } from '../../stores';

  export let data = {
    coinSymbol: '',
    coinPrice: 0,
    count: 0,
    date: new Date().toISOString().slice(0, 16),
    id: 0,
  };
  export let onClose;

  function newItem() {
    return {
      ...data,
      date: new Date(data.date),
      type: TRANSACTION_TYPE.BUY,
    };
  }

  async function handleSubmit(e) {
    e.preventDefault();
    data.id ? await putTransaction(data) : await postTransaction(newItem(data));
    onClose();
  }

  beforeUpdate(() => {
    data = {
      ...data,
      date: new Date(data.date).toISOString().slice(0, 16),
    };
  });
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
        bind:value={data.date}
        type="datetime-local"
        id="date"
        name="date"
      />
    </div>
    <div class="transaction-form--value">
      <label>Общий расход</label>
      <span>${data.count * data.coinPrice}</span>
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
    background-color: white;
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

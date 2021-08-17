<script lang="ts">
  import type { Feature } from '../../../common/types';
  import { postFeatures, putFeatures } from '../../stores';

  export let data: Feature = {
    id: 0,
    coinSymbol: '',
    count: 0,
    coefficient: 5,
    liquidation: 0,
    margin: 0,
    pnl: 0,
    startPrice: 0,
  };
  export let onClose;

  async function handleSubmit(e) {
    e.preventDefault();
    data.id ? await putFeatures(data) : await postFeatures(data);
    onClose();
  }
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
      <label for="coinPrice">Цена входа</label>
      <input
        bind:value={data.startPrice}
        step="0.000000001"
        type="number"
        id="startPrice"
        name="startPrice"
      />
    </div>
    <div>
      <label for="coinPrice">Коэфициент</label>
      <input
        bind:value={data.coefficient}
        step="0.000000001"
        type="number"
        id="coefficient"
        name="coefficient"
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
    <div>
      <label for="count">Маржа</label>
      <input
        bind:value={data.margin}
        step="0.000000001"
        type="number"
        id="margin"
        name="margin"
      />
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

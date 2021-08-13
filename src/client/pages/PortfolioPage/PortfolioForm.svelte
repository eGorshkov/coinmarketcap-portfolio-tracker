<script>
  import { PORTFOLIO_FORM_ACTION } from '../../constants/common';

  export let data = {
    id: 0,
    name: '',
  };
  export let onClose;

  async function handleSubmit(e) {
    const action =
      e.submitter.attributes.getNamedItem('action-type')?.value || null;
    e.preventDefault();
    onClose({ action, data });
  }
</script>

<div class="transaction-form-container">
  <h3>Portfolio</h3>
  <form on:submit={handleSubmit}>
    <div class="transaction-form--symbol">
      <input
        bind:value={data.name}
        placeholder="Введите название портфолио..."
        type="text"
        id="coinSymbol"
        name="coinSymbol"
      />
    </div>
    <button
      type="submit"
      action-type={PORTFOLIO_FORM_ACTION.ADD}
      class="transaction-form--button"
    >
      {data.id ? 'Изменить портфолио' : 'Добавить портфолио'}
    </button>
    {#if data.id}
      <button
        type="submit"
        action-type={PORTFOLIO_FORM_ACTION.REMOVE}
        class="transaction-form--button"
      >
        Удалить
      </button>
    {/if}
  </form>
</div>

<style>
  .transaction-form-container {
    padding: 15px;
    border-radius: 8px;
    background-color: var(--theme-bg-color);
    background-color: var(--theme-bg-color);
    min-width: 500px;
  }

  input,
  button {
    height: 40px;
    width: 100%;
    cursor: pointer;
  }
</style>

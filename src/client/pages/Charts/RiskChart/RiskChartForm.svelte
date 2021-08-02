<script lang="ts">
  import Select from '../../../components/Select/Select.svelte';
  import { CHART_RISK_TYPE } from '../../../constants/common';

  export let data: {
    activesRisks: {symbol: string, riskId: number | null, riskType: CHART_RISK_TYPE | null}[],
    options: any[]
  };
  export let onClose;

  function handleSubmit(e) {
    e.preventDefault();
    onClose(data.activesRisks);
  }

  function handleTypeChange(activeIndex) {
    return ([row]) => {
      console.log(activeIndex, row);
      debugger;
      data.activesRisks[activeIndex].riskId = row.id,
      data.activesRisks[activeIndex].riskType = row.value;
    };
  }


</script>

<div class="risk-form-container">
  <form on:submit={handleSubmit}>
    <div class="risk-form-header">
      <h3>Risk settings</h3>
      <button type="submit" class="risk-form--button"> Обновить </button>
    </div>
    {#if data.activesRisks}
      {#each data.activesRisks as active, index}
        <p>{active.symbol}</p>
        <Select options={data.options}
                selected={active.riskType || CHART_RISK_TYPE.UNKNOW}
                getLabel={(row) => row.value}
                isSelected={(row) => row.id === active.riskId}
                onSelect={handleTypeChange(index)} />
      {/each}
    {/if}
  </form>
</div>

<style>
  .risk-form-container {
    width: 250px;
    border-radius: 8px;
    background-color: white;
    box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.7);
    max-height: 500px;
    overflow: auto;
  }
  .risk-form-header {
    position: sticky;
    top: 0;
    grid-column: span 2;
    width: 100%;
    background-color: white;
  }
  form {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    align-items: flex-end;
    padding: 15px;
  }
  form > *:not(:last-child) {
    margin-right: 10px;
  }
  input,
  button {
    height: 40px;
    width: 100%;
  }

  .risk-form--button {
    cursor: pointer;
  }
</style>

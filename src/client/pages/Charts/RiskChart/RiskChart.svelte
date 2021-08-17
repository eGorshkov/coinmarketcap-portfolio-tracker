<script lang="ts">
  import { actives, balance, getActiveRisks, getRisks, postRisks, total } from '../../../stores';
  import { afterUpdate, onMount } from 'svelte';

  import modal from '../../../components/Modal/modal';
  import PieChart from '../../../components/Charts/PieChart.svelte';
  import { CONSTANTS, CHART_RISK_TYPE } from '../../../constants/common';
  import type { PieChartConfig, TableConfigType } from '../../../../common/types';

  import RiskChartForm from './RiskChartForm.svelte';
  let activesRisks;
  let options = [];
  let pieConfig;

  function reduceRiskData(acc, {symbol, riskType}) {
    riskType = riskType || CHART_RISK_TYPE.UNKNOW;
    return {
      ...acc,
      [riskType]: [...acc[riskType], symbol],
    };
  }

  $: riskData = activesRisks?.reduce(reduceRiskData, {
    [CHART_RISK_TYPE.HIGH]: [],
    [CHART_RISK_TYPE.AVERAGE]: [],
    [CHART_RISK_TYPE.LOW]: [],
    [CHART_RISK_TYPE.UNKNOW]: [],
  });

  function getRiskValue(symbols) {
    const filtered = $actives.filter((x) => symbols.includes(x.coinSymbol));
    return filtered.reduce(
      (acc, x) => ({
        ...acc,
        value: (acc.value += x.value),
        profit: (acc.profit += x.profit),
      }),
      {
        value: 0,
        profit: 0,
      }
    );
  }

  function getPercentageBySymbols(symbols) {
    return getRiskValue(symbols).value / $total;
  }

  function createDatasets(riskData) {
    if (!riskData || !$balance) {
      return [];
    }
    return [
      {
        color: 'red',
        label:
          CHART_RISK_TYPE.HIGH +
          `(${riskData[CHART_RISK_TYPE.HIGH].toString()})`,
        percentage: getPercentageBySymbols(riskData[CHART_RISK_TYPE.HIGH]),
      },
      {
        color: 'yellow',
        label:
          CHART_RISK_TYPE.AVERAGE +
          `(${riskData[CHART_RISK_TYPE.AVERAGE].toString()})`,
        percentage: getPercentageBySymbols(riskData[CHART_RISK_TYPE.AVERAGE]),
      },
      {
        color: 'green',
        label:
          CHART_RISK_TYPE.LOW + `(${riskData[CHART_RISK_TYPE.LOW].toString()})`,
        percentage: getPercentageBySymbols(riskData[CHART_RISK_TYPE.LOW]),
      },
      {
        color: 'gray',
        label:
          CHART_RISK_TYPE.UNKNOW +
          `(${riskData[CHART_RISK_TYPE.UNKNOW].toString()})`,
        percentage: getPercentageBySymbols(riskData[CHART_RISK_TYPE.UNKNOW]),
      },
    ];
  }

  function craetePieConfig(): PieChartConfig<CHART_RISK_TYPE> {
    return {
      datasets: createDatasets(riskData),
    };
  }

  onMount( async () => {
      options = await getRisks();
      activesRisks = await getActiveRisks();
  });

  afterUpdate(() => {
    pieConfig = craetePieConfig();
  });

  async function afterClosed(_data) {
    await postRisks(_data);
    options = await getRisks();
    activesRisks = await getActiveRisks();
    pieConfig = craetePieConfig();
  }
</script>

<button
  use:modal={{
    cnt: RiskChartForm,
    data: {
      activesRisks,
      options
    },
    afterClosed,
  }}
>
  Settings
</button>
<br />
<PieChart size={500} {pieConfig} />

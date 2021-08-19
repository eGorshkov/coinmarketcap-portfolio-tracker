<script lang="ts">
  import {
    activesBalance,
    featuresBalance,
    prices,
    transactions,
    user,
  } from '../../stores';
  import PortfolioPage from '../PortfolioPage/PortfolioPage.svelte';
  import ActivesPageAllocation from './Helpers/ActivesPageAllocation.svelte';
  import ActivesPageInformation from './Helpers/ActivesPageInformation.svelte';
  import ActivesPageGridContainer from './Grid/ActivesPageGridContainer.svelte';
  import PlusMinus from '../../components/PlusMinus/PlusMinus.svelte';
  import Usd from '../../components/USD/USD.svelte';

  const tabs = {
    information: ActivesPageInformation,
    allocation: ActivesPageAllocation,
  };

  let activeTab: keyof typeof tabs = 'information';

  $: activesBalanceChange = $transactions.reduce(
    (sum, x) => (sum += x.count * +$prices[x.coinSymbol]?.lastPrice),
    0
  );
  $: activesBalanceChangePercent =
    (1 - $activesBalance / activesBalanceChange) * 100;
</script>

<h6>Текущий баланс</h6>
<div class="balance-container">
  <h1>
    ${($activesBalance + $featuresBalance || 0).toFixed(2)}
  </h1>
  <div>
    <sup
      >Spot: ${$activesBalance || 0}
      <PlusMinus
        isPlus={activesBalanceChangePercent >= 0}
        percent={+activesBalanceChangePercent.toFixed(2)}>за 24 часа</PlusMinus
      ></sup
    >
    <sub>Features: ${$featuresBalance || 0}</sub>
  </div>
</div>

<button on:click={() => (activeTab = 'information')}>Information</button>
<button on:click={() => (activeTab = 'allocation')}>Allocation</button>
<svelte:component this={tabs[activeTab]} rights={$user?.rights?.actives} />
<div class="actives-container">
  <PortfolioPage />
  <ActivesPageGridContainer />
</div>

<style>
  h6,
  h1 {
    margin: 0;
  }

  .actives-container {
    display: flex;
    flex-wrap: wrap;
  }

  .balance-container {
    display: flex;
  }

  .balance-container div {
    position: relative;
    flex: 1;
  }

  .balance-container div sup,
  .balance-container div sub {
    position: absolute;
    left: 5px;
    top: 5px;
  }

  .balance-container div sub {
    bottom: 0;
    top: auto;
  }

  :global(.actives-container > :first-child) {
    flex: 350px;
  }

  :global(.actives-container table tr th) {
    width: 50%;
    text-align: center;
  }
</style>

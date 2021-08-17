<script lang="ts">
  import { activesBalance, featuresBalance, user } from '../../stores';
  import PortfolioPage from '../PortfolioPage/PortfolioPage.svelte';
  import ActivesPageAllocation from './Helpers/ActivesPageAllocation.svelte';
  import ActivesPageInformation from './Helpers/ActivesPageInformation.svelte';
  import ActivesPageGridContainer from './Grid/ActivesPageGridContainer.svelte';

  const tabs = {
    information: ActivesPageInformation,
    allocation: ActivesPageAllocation,
  };

  let activeTab: keyof typeof tabs = 'information';
</script>

<h6>Текущий баланс</h6>
<div class="balance-container">
  <h1>
    ${$activesBalance + $featuresBalance}
  </h1>
  <div>
    <sup>Spot: ${$activesBalance}</sup>
    <sub>Features: ${$featuresBalance}</sub>
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

  .balance-container div sup,.balance-container div sub {
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

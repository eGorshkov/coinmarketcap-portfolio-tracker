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
<h1>${$activesBalance + $featuresBalance}</h1>

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

  :global(.actives-container > :first-child) {
    flex: 350px;
  }

  :global(.actives-container table tr th) {
    width: 50%;
    text-align: center;
  }
</style>

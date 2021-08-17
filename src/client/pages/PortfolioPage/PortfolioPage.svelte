<script lang="ts">
  import type { Portfolio } from '../../../common/types';

  import modal from '../../components/Modal/modal';
  import { PORTFOLIO_FORM_ACTION } from '../../constants/common';

  import {
    currentPortfolioId,
    deletePortfolios,
    getPortfolios,
    portfolios,
    postPortfolios,
    putPortfolios,
    user,
  } from '../../stores';
  import PortfolioForm from './PortfolioForm.svelte';

  function handleClickPortfolio(portfolio?: Portfolio) {
    return () => {
      if (!portfolio) {
        currentPortfolioId.set(null);
        return;
      }

      currentPortfolioId.update((state) => {
        if (state === portfolio.id) return null;
        return portfolio.id;
      });
    };
  }

  async function afterClosed(props: {
    action: PORTFOLIO_FORM_ACTION;
    data: Portfolio;
  }) {
    const { action, data } = props;
    switch (action) {
      case PORTFOLIO_FORM_ACTION.ADD:
        await (data.id ? putPortfolios(data) : postPortfolios(data));
        break;
      case PORTFOLIO_FORM_ACTION.REMOVE:
        await deletePortfolios(data);
        break;
      default:
        throw Error(`Нет action ${JSON.stringify(props)}`);
    }
    const _portfolios = await getPortfolios();
    portfolios.set(_portfolios);
  }
</script>

<div class="portfolios-container">
  <div class="portfolio-item">
    <button
      class="portfolio-add-button {$currentPortfolioId === null &&
        'portfolio-item--active'}"
      on:click={handleClickPortfolio()}
    >
      Main
    </button>
    <button
      class="portfolio-add-button"
      disabled={!$user?.rights?.portfolios?.canAdd}
      use:modal={{ cnt: PortfolioForm, afterClosed }}>✚</button
    >
  </div>
  <div class="portfolios-item-container">
    {#each $portfolios as portfolio}
      <div class="portfolio-item">
        <button
          class="portfolio-add-button {$currentPortfolioId === portfolio.id &&
            'portfolio-item--active'}"
          on:click={handleClickPortfolio(portfolio)}
        >
          {portfolio.name}
        </button>
        <button
          class="portfolio-add-button"
          disabled={!$user?.rights?.portfolios?.canUpdate}
          use:modal={{ cnt: PortfolioForm, data: portfolio, afterClosed }}
          >✎</button
        >
      </div>
    {/each}
  </div>
</div>

<style>
  .portfolios-container {
    display: flex;
    position: relative;
    flex-direction: column;
    padding-right: 30px;
    min-width: 350px;
  }

  .portfolios-item-container {
    flex: 1 1 calc(100% - 50px);
  }

  .portfolio-add-button,
  .portfolio-item {
    cursor: pointer;
    min-height: 44px;
    height: 44px;
    text-align: left;
    background: transparent;
    border: 1px solid hsl(0deg 0% 0% / 30%);
    margin-bottom: 5px;
  }
  .portfolio-item {
    display: flex;
  }

  .portfolio-item--active {
    background-color: var(--theme-active-element);
  }

  .portfolio-item > *:first-child {
    flex: 1 1 calc(100% - 30px);
  }
  .portfolio-item > *:last-child {
    flex: 1 0 30px;
  }

  .portfolio-add-button {
    border-color: hsl(9deg 100% 64% / 30%);
  }
</style>

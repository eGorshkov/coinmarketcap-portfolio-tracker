<script lang="ts">
  import { afterUpdate, onDestroy, onMount } from 'svelte';
  import {
    Router,
    Route,
    Link,
    createHistory,
    createMemorySource,
  } from 'svelte-navigator';

  import TransactionPage from './pages/TransactionPage/TransactionPage.svelte';
  import ActivesPage from './pages/ActivesPage/ActivesPage.svelte';
  import ChartsPage from './pages/Charts/ChartsPage.svelte';
  import {
    prices,
    transactions,
    createPrices,
    getTransactions,
    getActives,
    actives,
    createActive,
    getPortfolios,
    portfolios,
    currentPortfolioId,
    user,
  } from './stores';
  import { OVERLAY_CONTAINER_ID } from './constants/ui';
  import UserBlock from './components/UserBlock/UserBlock.svelte';

  const memoryHistory = createHistory(createMemorySource());
  let isLoading = false;
  let sse: EventSource;

  async function update() {
    if ($user?.id) {
      const _portfolios = await getPortfolios();
      portfolios.set(_portfolios);
      await updateActives();
    } else {
      portfolios.set([]);
      transactions.set([]);
      actives.set([]);
    }
  }

  async function updateActives() {
    console.log('updateActives', $user, $currentPortfolioId);
    const _transactions = await getTransactions({
      portfolioId: $currentPortfolioId,
    });
    const _actives = await getActives($currentPortfolioId);

    transactions.set(_transactions);
    actives.set(_actives.map(createActive($prices)));
  }

  onMount(async () => {
    sse = new EventSource('/stream');

    sse.addEventListener('get-prices', (e) => {
      const _prices = JSON.parse(e?.data);
      prices.set(_prices);
      actives.update((state) => state.map(createActive(_prices)));
      isLoading = false;
    });

    currentPortfolioId.subscribe(() => $user?.id && updateActives());
  });

  onDestroy(() => {
    sse?.close();
  });

  $: $user, update();
</script>

<Router history={memoryHistory}>
  <header class="header">
    <h2>HULIMARKETCAP</h2>

    <nav class="header__navigation">
      <Link class="navigation__link" to="/">Home</Link>
      <Link class="navigation__link" to="transactions">Transactions</Link>
      <Link class="navigation__link" to="charts">Charts</Link>
    </nav>

    <sup class="header-porfolio">
      Current portfolio - {$currentPortfolioId
        ? $portfolios.find((x) => x.id === $currentPortfolioId)?.name
        : 'Main'}
    </sup>

    <UserBlock />
  </header>
  <main>
    {#if isLoading}
      <div class="ui-overlay ui-overlay--active preloader" />
    {/if}

    <Route path="/">
      <ActivesPage />
    </Route>

    <Route path="transactions">
      <TransactionPage />
    </Route>

    <Route path="charts">
      <ChartsPage />
    </Route>
  </main>
</Router>

<div id={OVERLAY_CONTAINER_ID} />

<style>
  :global(*) {
    font-family: 'Fira Sans Condensed', sans-serif;
  }
  :global(.ui-overlay) {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 900;
  }
  :global(.ui-overlay--active) {
    background-color: var(--theme-overlay-bg-color);
  }

  :global(body.hidden) {
    overflow: hidden;
  }

  :global(body),
  :global(input),
  :global(ui-select),
  :global(button) {
    background-color: var(--theme-bg-color);
    border-color: var(--theme-border-color);
    font-size: 1rem;
  }

  :global(input:disabled),
  :global(ui-select:disabled),
  :global(button:disabled) {
    opacity: 0.3;
  }

  :global(body) {
    width: 100%;
    height: 100vh;
    margin: 0;
  }

  :global(main) {
    padding: 8px;
    height: -webkit-fill-available;
  }

  :global(.navigation__link) {
    padding: 10px;
  }

  :global(.navigation__link[aria-current]) {
    color: var(--theme-link-active-color);
  }

  :global(*) {
    color: var(--theme-color);
  }

  .header {
    background-color: var(--theme-header-bg-color);
    display: flex;
    align-items: center;
    padding: 8px;
    position: relative;
  }

  .header-porfolio {
    position: absolute;
    bottom: 15px;
  }

  .preloader::before {
    content: 'Update prices...';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 48px;
    color: var(--theme-color);
  }
</style>

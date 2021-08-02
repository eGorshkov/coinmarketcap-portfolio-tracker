<script lang="ts">
  import { afterUpdate, beforeUpdate, onDestroy, onMount } from 'svelte';
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
  } from './stores';
  import { OVERLAY_CONTAINER_ID } from './constants/ui';
  import type { Active } from '../common/types';

  const memoryHistory = createHistory(createMemorySource());
  let isLoading = false;
  let sse: EventSource;

  onMount(async () => {
    const _transactions = await getTransactions();
    const _actives = await getActives();

    transactions.set(_transactions);
    prices.set(createPrices(_transactions));
    actives.set(_actives.map(createActive($prices)));

    sse = new EventSource('https://localhost:5000/stream');

    sse.addEventListener('get-prices', (e) => {
      const _prices = JSON.parse(e.data);
      prices.set(_prices);
      actives.update((state) => state.map(createActive(_prices)));
      isLoading = false;
    });
  });

  onDestroy(() => {
    sse?.close();
  });
</script>

<Router history={memoryHistory}>
  <header>
    <nav>
      <Link to="/">Home</Link>
      <Link to="transactions">Transactions</Link>
      <Link to="charts">Charts</Link>
    </nav>
  </header>
  <main>
    {#if isLoading}
      <div class="ui-overlay ui-overlay--dark preloader" />
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
  .preloader::before {
    content: 'Update prices...';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 48px;
    color: white;
  }

  :global(.ui-overlay) {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 900;
  }
  :global(.ui-overlay--dark) {
    background-color: rgba(0, 0, 0, 0.5);
  }

  :global(body.hidden) {
    overflow: hidden;
  }
</style>

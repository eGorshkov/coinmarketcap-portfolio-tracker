<script lang="ts">
  import modal from '../../components/Modal/modal';
  import FeaturesForm from './FeaturesForm.svelte';
  import type { Feature, Transaction } from '../../../common/types';
  import {
    prices,
    deleteFeatures,
    getFeatures,
    createFeature,
    features,
  } from '../../stores';

  export let row: Feature;
  export let props;

  async function onRemoveTransaction() {
    await deleteFeatures(row);
    updateTransactions();
  }

  async function updateTransactions() {
    const _features = await getFeatures();
    features.set(_features.map(createFeature($prices)));
  }
</script>

<button
  disabled={!props?.rights?.canUpdate}
  use:modal={{
    cnt: FeaturesForm,
    data: row,
    afterClosed: updateTransactions,
  }}
>
  ✎
</button>
<button disabled={!props?.rights?.canDelete} on:click={onRemoveTransaction}>
  ✕
</button>

<style>
  button {
    border: none;
    background-color: transparent;
    cursor: pointer;
  }
</style>

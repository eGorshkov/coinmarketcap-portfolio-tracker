<script lang="ts">
  import modal from '../../components/Modal/modal';
  import ActivesTransactionsForm from './ActivesTransactionsForm.svelte';
  import type { Active, UserRights } from '../../../common/types';

  export let row: Active;
  export let props: {rights: UserRights['actives']};
</script>

<button
  disabled={!props?.rights?.canView}
  use:modal={{
    cnt: ActivesTransactionsForm,
    data: row,
  }}
>
  ✎
</button>

<style>
  button {
    border: none;
    background-color: transparent;
    cursor: pointer;
  }
</style>

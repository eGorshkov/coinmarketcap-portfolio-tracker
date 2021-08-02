<script lang="ts">
    import modal from '../../components/Modal/modal';
    import ActivesTransactionsForm from './ActivesTransactionsForm.svelte';
    import type { Active } from '../../../common/types';
  
    export let row: Active;
  
  </script>
  
  <button
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
  
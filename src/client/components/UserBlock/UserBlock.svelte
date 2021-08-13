<script lang="ts">
  import { onMount } from 'svelte';
  import { loginUser, logoutUser, getUserData, user } from '../../stores';
  import Select from '../Select/Select.svelte';

  let options = [];

  async function updateUser() {
    const _user = await getUserData();
    user.set(_user);
  }

  async function handleLogin(ev) {
    const { login, password } = ev.target.children;

    const _user = await loginUser({
      login: login.value,
      password: password.value,
    });

    user.set(_user);
  }

  async function handleLogout() {
    await logoutUser();
    await updateUser();
  }

  onMount(updateUser);
</script>

<div class="user-block-container">
  {#if $user?.id}
    Hello, {$user.login}
    <button on:click={handleLogout}>LOGOUT</button>
  {:else}
    <form on:submit={handleLogin}>
      <input type="text" name="login" placehoplder="Login..." />
      <input type="text" name="password" placeholder="Password..." />
      <button type="submit">LOGIN</button>
    </form>
  {/if}
</div>

<style>
  .user-block-container {
    margin-left: auto;
  }
</style>

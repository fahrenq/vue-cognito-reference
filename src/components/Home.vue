<template>
  <div>
    <h1>Home</h1>
    <router-link :to="{ name: 'Sign In' }">Sign In</router-link>
    <br>
    <router-link :to="{ name: 'Sign Up' }">Sign Up</router-link>
  </div>
</template>

<script>
export default {
  name: 'Home',
};
</script>

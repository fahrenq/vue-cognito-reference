<template>
  <div id="app">
    <current-user-floating></current-user-floating>
    <router-link :to="{ name: 'Sign In' }">Sign In</router-link>
    |
    <router-link :to="{ name: 'Sign Up' }">Sign Up</router-link>
    |
    <router-link :to="{ name: 'Authenticated Only' }">Authenticated Only route</router-link>
    <router-view></router-view>
  </div>
</template>

<script>
import CurrentUserFloating from '@/components/CurrentUserFloating';

export default {
  name: 'App',
  components: {
    CurrentUserFloating,
  },
};
</script>

<style scoped>

</style>

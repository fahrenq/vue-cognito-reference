<template>
  <div id="app">
    <current-user-floating></current-user-floating>
    <router-view/>
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

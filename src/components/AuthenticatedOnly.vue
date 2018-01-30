<template>
  <div>
    You're authenticated as {{ user.attributes.email }}.
    That's good because you can see this page only if you're authenticated.
  </div>
</template>

<script>
export default {
  computed: {
    user() {
      return this.$store.getters.user;
    },
  },
};
</script>

<style scoped>

</style>

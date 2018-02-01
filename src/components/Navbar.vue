<template>
  <div>
    <div v-if="!user">Not authenticated</div>
    <div v-else>
      Authenticated as {{ user.attributes.email }}
      |
      <button @click="signOut">Sign out</button>
    </div>
    <hr>
    <router-link :to="{ name: 'Sign In' }">Sign In (not authenticated only)</router-link>
    |
    <router-link :to="{ name: 'Sign Up' }">Sign Up (not authenticated only)</router-link>
    |
    <router-link :to="{ name: 'Personal' }">Personal page (authenticated only)</router-link>
    <hr>

  </div>
</template>

<script>
export default {
  computed: {
    user() {
      return this.$store.getters.user;
    },
  },

  methods: {
    signOut() {
      this.$store
        .dispatch('signOut')
        .then(() => alert('Signed out successfully'));
    },
  },
};
</script>

<style scoped>

</style>

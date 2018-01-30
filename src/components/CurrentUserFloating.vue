<template>
  <div class="current-user">
    <h3 v-if="!user">Not authenticated</h3>
    <div v-else>
      <h3>Authenticated as {{ user.attributes.email }}</h3>
      <button @click="signOut">Sign out</button>
    </div>
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
.current-user {
  position: absolute;
  right: 20px;
  top: 20px;
  padding: 20px;
  background-color: #efefef;
  border-radius: 10px;
}
</style>

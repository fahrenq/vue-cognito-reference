import Vue from 'vue';
import Vuex from 'vuex';

// Importing modules
import user from './user';

Vue.use(Vuex);

// Using same export convention as in docs
// eslint-disable-next-line import/prefer-default-export
export const store = new Vuex.Store({
  modules: {
    user,
  },
});

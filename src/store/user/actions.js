import Cognito from '@/utils/cognito';

const cognito = new Cognito();

export default {
  refreshUser({ commit, dispatch }) {
    // rejection of this promise indicates
    // that user isn't logged in
    cognito
      .getCurrentUser()
      .then(({ constructedUser }) => {
        commit('setUser', constructedUser);
        dispatch('getUserAttributes');
      })
      .catch(e => console.log(e));
  },

  signIn({ commit, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      cognito
        .signIn(payload.username, payload.password)
        .then(({ constructedUser, userConfirmationNecessary }) => {
          // handle userConfirmationNecessary here
          console.log('User confirmation necessary: ', userConfirmationNecessary);
          commit('setUser', constructedUser);
          dispatch('getUserAttributes');
          resolve({ constructedUser, userConfirmationNecessary });
        })
        .catch(e => reject(e));
    });
  },

  // If signUp promise has been resolved - signed up successfully. We can't
  // authenticate user right after sign up, user needs to confirm email address.
  signUp(store, payload) {
    // store argument is unnecessary above and exists here as a placeholder to
    // accept 'payload'
    // payload format: { username, password, attributes: {}}
    return cognito.signUp(payload.username, payload.password, payload.attributes);
  },

  // Authenticated only
  getUserAttributes({ commit, getters }) {
    return new Promise((resolve, reject) => {
      // Make sure the user is authenticated
      if (getters.user === null || (getters.user && getters.user.tokens === null)) {
        reject({ message: 'User is unauthenticated' });
        return;
      }

      cognito
        .getUserAttributes(getters.user.username, getters.user.tokens)
        .then((attributes) => {
          commit('setUserAttributes', attributes);
          resolve(attributes);
        })
        .catch(e => reject(e));
    });
  },

  // Authenticated only
  updateAttributes({ dispatch, getters }, payload) {
    return new Promise((resolve, reject) => {
      // Make sure the user is authenticated
      if (getters.user === null || (getters.user && getters.user.tokens === null)) {
        reject({ message: 'User is unauthenticated' });
        return;
      }
      cognito
        .updateAttributes(getters.user.username, getters.user.tokens, payload)
        .then(() => {
          // We're updating whole user object here.
          // You can update only particular attributes in local user object like this:
          // const newAttributes = Object.assign({}, getters.user.attributes, payload);
          // commit('setUserAttributes', newAttributes);
          dispatch('refreshUser');
          resolve();
        })
        .catch(e => reject(e));
    });
  },

  signOut({ commit, getters }) {
    return new Promise((resolve, reject) => {
      // Make sure the user is authenticated
      if (getters.user === null || (getters.user && getters.user.tokens === null)) {
        reject({
          message: 'User is unauthenticated',
        });
        return;
      }

      cognito.signOut(getters.user.username);
      commit('clearUser');
      resolve();
    });
  },
};

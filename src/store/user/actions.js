import Cognito from '@/utils/cognito';

const cognito = new Cognito();

export default {
  refreshUser({ commit, dispatch }) {
    cognito
      .getCurrentUser()
      .then(({ constructedUser }) => {
        commit('setUser', constructedUser);
        dispatch('getUserAttributes');
      })
      .catch(e => console.error(e));
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

  // If signUp promise has been resolved - it means that user signed up
  // successfully. We can't authenticate user right after sign up, user
  // needs to confirm email address.
  signUp(store, payload) {
    // store argument is unnecessary above and exists here only to accept 'payload'
    // payload: { username, password, attributes: {} }
    return new Promise((resolve, reject) => {
      cognito
        .signUp(payload.username, payload.password, payload.attributes)
        .then(({ userConfirmationNecessary }) => resolve({ userConfirmationNecessary }))
        .catch(e => reject(e));
    });
  },

  getUserAttributes({ commit, getters }) {
    return new Promise((resolve, reject) => {
      // Make sure the user is authenticated
      if (getters.user === null || (getters.user && getters.user.tokens === null)) {
        reject({ message: 'User is unauthenticated' });
        return;
      }

      cognito
        .getUserAttributes(getters.user.username)
        .then((attributes) => {
          commit('setUserAttributes', attributes);
          resolve(attributes);
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

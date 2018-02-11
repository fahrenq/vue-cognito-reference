import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
  AuthenticationDetails,
} from 'amazon-cognito-identity-js';

// Store credentials in separate file
const UserPoolId = '<USER_POOL_ID>';
const ClientId = '<CLIENT_ID>';

export default class Cognito {
  constructor() {
    this.userPool = new CognitoUserPool({
      UserPoolId,
      ClientId,
    });
  }

  // This method will return a promise that resolves with user object
  getCurrentUser() {
    return new Promise((resolve, reject) => {
      const cognitoUser = this.userPool.getCurrentUser();

      if (!cognitoUser) {
        reject({ message: "User isn't logged in" });
        return;
      }

      cognitoUser.getSession((err, session) => {
        if (err) {
          reject(err);
          return;
        }

        // eslint-disable-next-line no-underscore-dangle
        const constructedUser = Cognito._constructUser(cognitoUser, session);
        resolve({ constructedUser });
      });
    });
  }

  signIn(username, password) {
    const authDetails = new AuthenticationDetails({
      Username: username,
      Password: password,
    });

    const cognitoUser = new CognitoUser({
      Pool: this.userPool,
      Username: username,
    });

    return new Promise((resolve, reject) =>
      cognitoUser.authenticateUser(authDetails, {
        onFailure: err => reject(err),
        onSuccess: (session, userConfirmationNecessary) => {
          // eslint-disable-next-line no-underscore-dangle
          const constructedUser = Cognito._constructUser(cognitoUser, session);
          resolve({ constructedUser, userConfirmationNecessary });
        },
      }),
    );
  }

  signUp(username, password, attributes) {
    const userAttributes = Object.keys(attributes || {}).map(
      key =>
        new CognitoUserAttribute({
          Name: key,
          Value: attributes[key],
        }),
    );

    return new Promise((resolve, reject) => {
      this.userPool.signUp(username, password, userAttributes, null, (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        resolve({ userConfirmationNecessary: !data.userConfirmed });
      });
    });
  }

  // Authenticated only
  getUserAttributes(username, tokens) {
    const cognitoUser = new CognitoUser({
      Pool: this.userPool,
      Username: username,
    });

    // Restore session without making an additional call to API
    cognitoUser.signInUserSession = cognitoUser.getCognitoUserSession(tokens);

    return new Promise((resolve, reject) => {
      cognitoUser.getUserAttributes((err, attributes) => {
        if (err) {
          reject(err);
          return;
        }

        // attributes looks like:
        // [{ Name: 'sex', Value: 'female' }, { Name: attrName, Value: attrValue }, ...]

        const formattedAttributes = {};
        (attributes || []).forEach((i) => {
          formattedAttributes[i.Name] = i.Value;
        });

        // formattedAttributes looks like:
        // { sex: 'female', attrName: attrValue, ... }

        resolve(formattedAttributes);
      });
    });
  }

  // Only for authenticated users
  updateAttributes(username, tokens, attributes) {
    return new Promise((resolve, reject) => {
      // Make sure the user is authenticated
      const cognitoUser = new CognitoUser({
        Pool: this.userPool,
        Username: username,
      });

      // Restore session without making an additional call to API
      cognitoUser.signInUserSession = cognitoUser.getCognitoUserSession(tokens);

      const newAttributes = Object.keys(attributes || {}).map(
        key =>
          new CognitoUserAttribute({
            Name: key,
            Value: attributes[key],
          }),
      );

      cognitoUser.updateAttributes(newAttributes, (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  }

  signOut(username) {
    const cognitoUser = new CognitoUser({
      Pool: this.userPool,
      Username: username,
    });

    cognitoUser.signOut();
    // There's no option to handle errors of this
    // signOut method
  }

  static _constructUser(cognitoUser, session) {
    return {
      username: cognitoUser.getUsername(),
      attributes: {},
      tokens: {
        IdToken: session.getIdToken().getJwtToken(),
        AccessToken: session.getAccessToken().getJwtToken(),
        RefreshToken: session.getRefreshToken().getToken(),
      },
    };
  }
}

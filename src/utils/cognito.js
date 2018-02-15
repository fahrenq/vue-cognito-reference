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
    // eslint-disable-next-line no-underscore-dangle
    const userAttributes = Cognito._attributesToAWSFormat(attributes);

    return new Promise((resolve, reject) => {
      const cb = (err, data) => {
        if (err) reject(err);
        else resolve({ userConfirmationNecessary: !data.userConfirmed });
      };

      this.userPool.signUp(username, password, userAttributes, null, cb);
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

        // eslint-disable-next-line no-underscore-dangle
        const formattedAttributes = Cognito._attributesFromAWSFormat(attributes);
        resolve(formattedAttributes);
      });
    });
  }

  // Only for authenticated users
  updateAttributes(username, tokens, attributes) {
    // Make sure the user is authenticated
    const cognitoUser = new CognitoUser({
      Pool: this.userPool,
      Username: username,
    });

    // Restore session without making an additional call to API
    cognitoUser.signInUserSession = cognitoUser.getCognitoUserSession(tokens);

    // eslint-disable-next-line no-underscore-dangle
    const newAttributes = Cognito._attributesToAWSFormat(attributes);

    return new Promise((resolve, reject) => {
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

  static _attributesToAWSFormat(attributes) {
    // { sex: 'female', attrName: attrValue, ... }
    // to
    // [{ Name: 'sex', Value: 'female' }, { Name: attrName, Value: attrValue }, ...]
    const keys = Object.keys(attributes || {});
    return keys.map(
      key =>
        new CognitoUserAttribute({
          Name: key,
          Value: attributes[key],
        }),
    );
  }

  static _attributesFromAWSFormat(attributes) {
    // [{ Name: 'sex', Value: 'female' }, { Name: attrName, Value: attrValue }, ...]
    // to
    // { sex: 'female', attrName: attrValue, ... }
    const a = [];
    (attributes || []).forEach((i) => {
      a[i.Name] = i.Value;
    });
    return a;
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

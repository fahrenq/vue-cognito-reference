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
}

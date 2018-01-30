import Cognito from '@/utils/cognito';

const cognito = new Cognito();

export default function (to, from, next) {
  cognito
    .getCurrentUser()
    // If user exists - proceed to 'next()' route
    .then(() => next())
    // If not - redirect to signIn
    .catch(() => next({ name: 'Sign In' }));
}

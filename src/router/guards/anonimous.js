import Cognito from '@/utils/cognito';

const cognito = new Cognito();

export default function (to, from, next) {
  cognito
    .getCurrentUser()
    // If user exists - redirect to 'home' route
    .then(() => next({ name: 'Home' }))
    // If not - proceed next()
    .catch(() => next());
}

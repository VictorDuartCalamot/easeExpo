import { Platform } from 'react-native';

const LoginScreen = Platform.select({
  web: () => require('./web/registerScreen.web').default,
  default: () => require('./movil/registerScreen.movil').default,
})();

export default LoginScreen;

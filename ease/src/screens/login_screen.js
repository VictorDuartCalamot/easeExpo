import LoginScreenMovil from './movil/loginScreen.movil';
import LoginScreenWeb from './web/loginScreen.web';
import { Platform } from 'react-native';

const LoginScreen = Platform.select({
  web: () => require('./web/loginScreen.web').default,
  default: () => require('./movil/loginScreen.movil').default,
})();

export default LoginScreen;

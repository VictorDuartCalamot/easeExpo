import { Platform } from 'react-native';

const homeScreen = Platform.select({
  web: () => require('./web/homeScreen.web').default,
  default: () => require('./movil/homeScreen.movil').default,
})();

export default homeScreen;
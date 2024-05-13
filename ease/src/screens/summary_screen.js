import { Platform } from 'react-native';

const summaryScreen = Platform.select({
  web: () => require('./web/summaryScreen.web').default,
  default: () => require('./movil/summaryScreen.movil').default,
})();

export default summaryScreen;
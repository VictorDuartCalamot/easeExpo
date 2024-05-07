import { Platform } from 'react-native';

const profileScreen = Platform.select({
  web: () => require('./web/profileScreen.web').default,
  default: () => require('./movil/profileScreen.movil').default,
})();

export default profileScreen;
import { Platform } from 'react-native';
import ProfileScreen from './web/profileScreen.web';

const profileScreen = Platform.select({
  web: () => require('./web/profileScreen.web').default,
  default: () => require('./movil/profileScreen.movil').default,
})();

export default profileScreen;
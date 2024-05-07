import { Platform } from 'react-native';

const Home_screen = Platform.select({
  web: () => require('./web/homeScreen.web').default,
  default: () => require('./movil/homeScreen.movil').default,
})();

export default Home_screen;

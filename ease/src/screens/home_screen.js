import { Platform } from 'react-native';
import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import PieChartComponent from '../components/pieChartComponent';
import AvatarUser from '../components/avatar_user';

const HomeScreen = Platform.select({
  web: () => require('./web/homeScreen.web').default,
  default: () => require('./movil/homeScreen.movil').default,
})();
export default HomeScreen;
  return (
    <View style={styles.container}>
      <PieChartComponent data={data}/>
    </View>
  );
}

const styles = StyleSheet.create ({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
  },
  header: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
});


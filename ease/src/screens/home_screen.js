import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import DrawerMenu from '../components/DrawerMenu';

function HomeScreen({ navigation }) {
  return (
    <DrawerMenu navigation={navigation}>
      <View style={styles.container}>
        <Text style={styles.title}>HomeScreen</Text>
      </View>
    </DrawerMenu>
  );
}

const styles = StyleSheet.create ({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#7FFF00',
  },
});

export default HomeScreen;
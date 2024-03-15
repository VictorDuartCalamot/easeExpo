import * as React from 'react';
import { Text, View, TouchableOpacity, DrawerLayoutAndroid, StyleSheet } from 'react-native';

function HomeScreen({ navigation }) {
  const drawerRef = React.useRef(null);

  const openDrawer = () => {
    drawerRef.current.openDrawer();
  }

  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <DrawerLayoutAndroid
      ref={drawerRef}
      drawerWidth={250}
      drawerPosition='left'
      renderNavigationView={() => (
        <View style={styles.drawer}>
          <Text style={styles.menuTitle}>Menú</Text>
        </View>
      )}
    >
      <View style={styles.container}>
        <TouchableOpacity onPress={openDrawer} style={styles.menuButton}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={navigateToLogin} style={styles.loginButton}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
      </View>
    </DrawerLayoutAndroid>
  );
}

const styles = StyleSheet.create ({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  drawer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  menuTitle: {
    fontSize: 20,
    marginBottom: 10,
  },
  menuButton: {
    position: 'absolute',
    left: 10,
    top: 10,
  },
  menuIcon: {
    fontSize: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  loginButton: {
    position: 'absolute',
    bottom: 20,
  },
  loginText: {
    fontSize: 18,
    color: 'blue',
  },
});

export default HomeScreen;
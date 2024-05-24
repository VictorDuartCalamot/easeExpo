import React, { useEffect, useState } from 'react';
import { View, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { StackActions } from '@react-navigation/native';

const SplashScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);

  // Simula una carga de datos asincrónica
  useEffect(() => {
    const loadData = async () => {
      // Simula una demora de 2 segundos
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Cuando la carga ha finalizado, cambiar isLoading a false
      setIsLoading(false);
      // Navega a la pantalla de inicio (Home)
      navigation.dispatch(StackActions.replace('Login'));
    };
    loadData();
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require("../pictures/logo.png")} // Ruta de tu imagen de logo
        style={styles.logo}
      />
      
      {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width:200,
    height:200,
    alignSelf:"center",
    borderRadius:50,
    marginBottom:30,
  },
});

export default SplashScreen;

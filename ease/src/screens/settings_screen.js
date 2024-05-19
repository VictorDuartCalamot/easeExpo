import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, ImageBackground } from 'react-native';

const SettingsScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleChangeEmail = () => {
    console.log('Cambiar correo electrónico:', email);
  };

  const handleChangePassword = () => {
    console.log('Cambiar contraseña:', password);
  };

  return (
    <ImageBackground 
      source={require('../pictures/fondo2.jpg')} 
      style={styles.imageBackground}
    >
      <View style={styles.container}>
        <Text style={styles.heading}>Configuración</Text>
        <Image 
          source={require('../pictures/logo.png')}
          style={styles.ImageLogo}
        />
        <View style={styles.section}>
          <Text style={styles.label}>Cambiar correo electrónico</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Nuevo correo electrónico"
          />
          <Button title="Guardar" onPress={handleChangeEmail} />
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Cambiar contraseña</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Nueva contraseña"
            secureTextEntry={true}
          />
          <Button title="Guardar" onPress={handleChangePassword} />
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Fondo semitransparente para el contenido
    margin: 20,
    borderRadius: 10,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 20,
  },
  section: {
    marginBottom: 20,
  },
  ImageLogo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    borderRadius: 30,
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default SettingsScreen;

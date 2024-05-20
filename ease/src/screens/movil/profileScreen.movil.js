import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image, ImageBackground } from 'react-native';
import axios from 'axios'; // Importa Axios

const SettingsScreen = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleChangePassword = async () => {
    try {
      // Realiza una solicitud POST a tu API para cambiar la contraseña
      const response = await axios.post('https://ease-backend-xsi2.onrender.com/cambiar-contrasena', { currentPassword, newPassword });
      console.log('Respuesta de la API:', response.data);

      // Muestra una alerta con el mensaje de éxito
      Alert.alert('Éxito', 'Contraseña cambiada correctamente');
    } catch (error) {
      // Captura y muestra cualquier error
      console.error('Error al cambiar contraseña:', error);
      Alert.alert('Error', 'No se pudo cambiar la contraseña. Por favor, intenta de nuevo.');
    }
  };

  return (
    <ImageBackground 
      source={require('../../pictures/fondo2.jpg')} 
      style={styles.imageBackground}
    >
      <View style={styles.container}>
        <Image source={require('../../pictures/logo.png')} style={styles.logo} />
        <Text style={styles.heading}>Configuración</Text>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Introducir contraseña actual</Text>
          <TextInput
            style={styles.input}
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="Introducir contraseña actual"
            secureTextEntry={true}
          />
        </View>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Nueva contraseña</Text>
          <TextInput
            style={styles.input}
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="Nueva contraseña"
            secureTextEntry={true}
          />
        </View>
        <Button title="Guardar" onPress={handleChangePassword} />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 30,
    marginBottom: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  formContainer: {
    width: '100%',
    maxWidth: 350,
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
    paddingHorizontal: 10,
  },
});

export default SettingsScreen;

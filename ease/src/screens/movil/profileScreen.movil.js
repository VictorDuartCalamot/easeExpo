import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ImageBackground, TouchableOpacity, Image, Alert } from 'react-native';
import axios from 'axios'; // Importa Axios

const SettingsScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleChangeEmail = async () => {
    try {
      // Realiza una solicitud POST a tu API para cambiar el correo electrónico
      const response = await axios.post('https://ease-backend-xsi2.onrender.com/cambiar-correo', { email });
      console.log('Respuesta de la API:', response.data);

      // Muestra una alerta con el mensaje de éxito
      Alert.alert('Éxito', 'Correo electrónico cambiado correctamente');
    } catch (error) {
      // Captura y muestra cualquier error
      console.error('Error al cambiar correo electrónico:', error);
      Alert.alert('Error', 'No se pudo cambiar el correo electrónico. Por favor, intenta de nuevo.');
    }
  };

  const handleChangePassword = async () => {
    try {
      // Realiza una solicitud POST a tu API para cambiar la contraseña
      const response = await axios.post('https://ease-backend-xsi2.onrender.com/cambiar-contrasena', { password });
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
        <View style={styles.innerContainer}>
          <Image source={require('../../pictures/logo.png')} style={styles.logo} />
          <Text style={styles.heading}>Configuración</Text>
          <View style={styles.formContainer}>
            <Text style={styles.label}>Cambiar correo electrónico</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Nuevo correo electrónico"
            />
            <TouchableOpacity onPress={handleChangeEmail} style={styles.button}>
              <Text style={styles.buttonText}>Guardar</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.formContainer}>
            <Text style={styles.label}>Cambiar contraseña</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Nueva contraseña"
              secureTextEntry={true}
            />
            <TouchableOpacity onPress={handleChangePassword} style={styles.button}>
              <Text style={styles.buttonText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom:100,
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    borderRadius: 30,
    marginTop: 15,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
  },
  formContainer: {
    width: '100%',
    maxWidth: 350,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    padding: 20,
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
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default SettingsScreen;

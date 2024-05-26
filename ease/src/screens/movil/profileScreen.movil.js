import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Image, ImageBackground } from 'react-native';
import { changePassword } from '../../services/api_authentication';

const logo = require('../../pictures/logo.png'); // Importar el logo desde tu carpeta de assets
const backgroundImage = require('../../pictures/fondo2.jpg'); // Importar el fondo de pantalla

const ChangePasswordScreen = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [message, setMessage] = useState(null); // Nuevo estado para el mensaje

  const handleChangePassword = async () => {
    try {
      if (newPassword !== confirmNewPassword) {
        throw new Error('Las contraseñas nuevas no coinciden');
      }

      await changePassword(currentPassword, newPassword);
      setMessage('¡Contraseña cambiada exitosamente!');
      // Limpiar los campos después de cambiar la contraseña
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error.message);
      setMessage(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
        <Image source={logo} style={styles.logo} />
        {message && <Text style={styles.message}>{message}</Text>}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Contraseña actual"
            secureTextEntry={true}
            value={currentPassword}
            onChangeText={setCurrentPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="Nueva contraseña"
            secureTextEntry={true}
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirmar nueva contraseña"
            secureTextEntry={true}
            value={confirmNewPassword}
            onChangeText={setConfirmNewPassword}
          />
          <Button title="Cambiar Contraseña" onPress={handleChangePassword} />
        </View>
      </ImageBackground>
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
    alignItems: 'center',
    width: '100%', // Asegura que el fondo ocupe toda la pantalla horizontalmente
    height: '100%', // Asegura que el fondo ocupe toda la pantalla verticalmente
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
    borderRadius: 50,
  },
  message: {
    marginBottom: 10,
    color: 'red',
  },
  inputContainer: {
    backgroundColor: 'white',
    padding: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'gray',
    width:"80%",
    
  },
  input: {
    height: 40,
    width: '100%',
    marginVertical: 5,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: 'white',
    alignSelf:"center"

  },
});

export default ChangePasswordScreen;
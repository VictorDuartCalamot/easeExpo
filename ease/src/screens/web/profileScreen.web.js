import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Image, Alert } from 'react-native';
import { changePassword } from '../../services/api_authentication';

const logo = require('../../pictures/logo.png'); // Importar el logo desde tu carpeta de assets

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
      <Image source={logo} style={styles.logo} /> {/* Mostrar el logo */}
      {message && <Text style={styles.message}>{message}</Text>} {/* Mostrar mensaje si existe */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={currentPassword}
          onChangeText={setCurrentPassword}
          placeholder="Contraseña Actual"
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="Nueva Contraseña"
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          value={confirmNewPassword}
          onChangeText={setConfirmNewPassword}
          placeholder="Confirmar Nueva Contraseña"
          secureTextEntry
        />
      </View>
      <Button title="Cambiar Contraseña" onPress={handleChangePassword} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
    borderRadius: 30,
  },
  inputContainer: {
    width: '40%',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    textAlign: 'center', // Centrar texto en las barras de entrada
  },
  message: {
    marginBottom: 10,
    color: 'green',
  },
});

export default ChangePasswordScreen;

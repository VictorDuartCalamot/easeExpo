import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Image, ImageBackground } from 'react-native';
import { changePassword } from '../../services/api_authentication';

const logo = require('../../pictures/logo.png'); // Importar el logo desde tu carpeta de assets

const profile_screenWeb = () => {
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
    <ImageBackground source={require('../../pictures/fondo2.jpg')} style={styles.background}>
      <View style={styles.container}>
        <View style={styles.box}> {/* Recuadro alrededor del logo y de la sección de cambio de contraseña */}
          <Image source={logo} style={styles.logo} /> {/* Mostrar el logo */}
          <Text style={styles.title}>Restart your password</Text> {/* Título */}
          {message && <Text style={styles.message}>{message}</Text>} {/* Mostrar mensaje si existe */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="Current password"
              secureTextEntry
            />
            <TextInput
              style={styles.input}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="New password"
              secureTextEntry
            />
            <TextInput
              style={styles.input}
              value={confirmNewPassword}
              onChangeText={setConfirmNewPassword}
              placeholder="Confirm new password"
              secureTextEntry
            />
          </View>
          <Button title="Change new password" onPress={handleChangePassword} />
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  box: {
    width: '35%', // Asegurarse de que el recuadro cubra el contenido
    padding: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#f9f9f9', // Fondo del recuadro
    alignContent:"center"
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
    borderRadius: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%', // Asegurarse de que las entradas ocupen todo el ancho del recuadro
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

export default profile_screenWeb;

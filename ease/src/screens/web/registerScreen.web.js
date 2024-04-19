import React, { useState } from 'react';
import { View, ImageBackground, TextInput, Image, Button, StyleSheet, Text, Alert, Platform } from 'react-native';
import { getUnmetPasswordRequirements } from '../../utils/passwordUtils';
import { l_R_styles } from '../../styles/js/l_R_styles';
import { registerUser } from '../../services/api_authentication';

const RegisterScreenWeb = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordRequirements, setPasswordRequirements] = useState([]);
  const [emailExistsMessage, setEmailExistsMessage] = useState('');

  const handleRegister = async () => {
    if (!email || !password || !username || !lastname || !confirmPassword) {
      Alert.alert('Rellene todos los campos');
      return;
    }

    try {
      const response = await registerUser(username, lastname, email, password);
      console.log(response);
      Alert.alert('Usuario creado');
      navigation.navigate('Login');
    } catch (error) {
      console.error(error);
      if (error.message === 'Correo ya existe en la base de datos') {
        setEmailExistsMessage('El correo ya existe en la base de datos');
      } else {
        setEmailExistsMessage('');
      }
    }
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    const requirements = getUnmetPasswordRequirements(text);
    setPasswordRequirements(requirements);
  };

  return (
    <View style={styles.container}>
      <View style={styles.errorMessageContainer}>
        <Text style={styles.errorMessage}>{emailExistsMessage}</Text>
      </View>
      <ImageBackground
        source={require('../../pictures/verde1.jpg')}
        style={styles.imageBackground}
      >
        <View style={styles.inputContainer}>
          <Image
            source={require('../../pictures/logo.png')}
            style={styles.imageLogo}
          />
          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              style={styles.input}
            />
          </View>
          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="Lastname"
              value={lastname}
              onChangeText={setLastname}
              style={styles.input}
            />
          </View>
          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="Enter Email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
            />
          </View>
          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="Enter Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              style={styles.input}
            />
          </View>
          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="Confirm password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              style={styles.input}
            />
          </View>

          {passwordRequirements.length > 0 && (
            <View style={l_R_styles.passwordRequirementsContainer}>
              {passwordRequirements.map((requirements, index) => (
                <Text key={index} style={l_R_styles.passwordRequirement}>
                  - {requirements}
                </Text>
              ))}
            </View>
          )}

          <Button title='Register' style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText} >Register</Text>
          </Button>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBackground: {
    height: '100%',
    width: 'auto',
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  errorMessageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 0, 0, 0.5)',
    padding: 10,
  },
  errorMessage: {
    color: 'red',
    textAlign: 'center',
  },
  inputContainer: {
    width: 350,
    backgroundColor: 'white',
    borderRadius: 40,
    justifyContent: 'center',
    marginTop: 110,
    paddingHorizontal: 60,
    paddingBottom: 20,
  },
  inputWrapper: {
    marginBottom: 15,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: 'gray',
    paddingVertical: 10,
  },
  inputLine: {
    height: 1,
    backgroundColor: 'gray',
  },
  imageLogo: {
    width: 90,
    height: 90,
    alignSelf: 'center',
    borderRadius: 30,
    marginTop: 20,
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorMessage: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default RegisterScreenWeb;

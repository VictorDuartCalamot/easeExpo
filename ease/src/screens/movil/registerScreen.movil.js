import React, { useState } from 'react';
import { View, ImageBackground, TextInput, Image, Button, StyleSheet, Text, Alert, Platform, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { getUnmetPasswordRequirements } from '../../utils/passwordUtils';
import { l_R_styles } from '../../styles/js/l_R_styles';
import { registerUser } from '../../services/api_authentication';

const RegisterScreenMovil = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordRequirements, setPasswordRequirements] = useState([]);

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
    }
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    const requirements = getUnmetPasswordRequirements(text);
    setPasswordRequirements(requirements);
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../pictures/verde1.jpg')}
        style={styles.ImageBackground}
      >
        <View style={styles.inputContainer}>
          <Image
            source={require('../../pictures/logo.png')}
            style={styles.ImageLogo}
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
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.goBackText}>Go back to login</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  ImageBackground: {
    height: '100%',
    width: 'auto',
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  inputContainer: {
    height: 600,
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 40,
    justifyContent: 'center',
    marginTop: 150,
    paddingHorizontal: 60,
  },
  inputWrapper: {
    marginBottom: 15,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: 'gray',
    paddingVertical: 8,
  },
  ImageLogo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    borderRadius: 30,
    marginBottom: 20,
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
  goBackText: {
    color: '#3498db',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default RegisterScreenMovil;

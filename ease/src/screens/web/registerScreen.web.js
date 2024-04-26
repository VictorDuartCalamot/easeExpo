
import React, { useState } from "react";
import { View, Text, StyleSheet, ImageBackground, TextInput, Image, Button, Alert, Platform, Dimensions } from "react-native";
import { registerUser } from "../../services/api_authentication";
import { useNavigation } from '@react-navigation/native';

const RegisterScreenWeb = ({ navigation }) => {
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

  const windowHeight = Dimensions.get('window').height;
  const windowWidth = Dimensions.get('window').width;

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../pictures/verde1.jpg')}
        style={styles.imageBackground}
      >
        <View style={[styles.inputContainer, { height: windowHeight * 0.8, width: windowWidth * 0.9 }]}>
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
            <View style={styles.passwordRequirementsContainer}>
              {passwordRequirements.map((requirements, index) => (
                <Text key={index} style={styles.passwordRequirement}>
                  - {requirements}
                </Text>
              ))}
            </View>
          )}

          <Button title='Register' onPress={handleRegister} color="#3498db" />
        </View>
      </ImageBackground>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputWrapper: {
    marginBottom: 15,
  },
  imageBackground: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    width: '90%',
    maxWidth: 350,
    backgroundColor: 'white',
    borderRadius: 40,
    justifyContent: 'center',
    paddingHorizontal: 60,
    paddingBottom: 20,
  },
  input: {
    width: '100%',
    borderBottomWidth: 1,
    borderColor: 'gray',
    paddingVertical: 12,
    paddingBottom: 10,
  },
  inputLine: {
    height: 1,
    backgroundColor: 'gray',
  },
  imageLogo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    borderRadius: 30,
    marginTop: 15,
  },
  linkText: {
    marginTop: 10,
    color: 'blue',
    fontSize: 12,
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default RegisterScreenWeb;
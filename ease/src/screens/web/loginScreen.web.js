import React, { useState } from "react";
import { View, Text, StyleSheet, ImageBackground, TextInput, Image, Button, Alert, Platform} from "react-native";
import { loginUser } from "../../services/api_authentication";
import { useNavigation } from '@react-navigation/native';

const LoginScreenWeb = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Rellene todos los campos');
      return;
    }
    try {
      const response = await loginUser(email, password, Platform.OS);
      if (response) {
        console.log('Login response', response);
        Alert.alert('Access');
        navigation.navigate('Home');
      } else {
        Alert.alert("User don't exists");
        Alert.alert("User doesn't exist.");
      }
    } catch (error) {
      console.error('Login error', error);
      Alert.alert(
        'Error',
        'Failed to log in. Please check your credentials and try again'
      );
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground 
        source={require('../../pictures/verde1.jpg')}
        style={styles.imageBackground}>
        <View style={styles.inputContainer}>
          <Image
            source={require('../../pictures/logo.png')}
            style={styles.imageLogo}
          />
          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="Enter Email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
            />
            <View style={styles.inputLine}/>
          </View>
          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              style={styles.input}
            />
            <View style={styles.inputLine} />
          </View>
          <Text
            style={{ marginTop: 15, color: 'blue'}}
            onPress={() => navigation.navigate('Register')}
          >
            Don't have an account?
          </Text>
          <Text 
            style={{ marginTop: 15, color: 'blue' }}
            onPress={() => navigation.navigate('Support')}
          >
            Don't remember your password?
          </Text>
          <Button title="Login" onPress={handleLogin} />
          <View style={styles.buttonContainer}>
            <Button
              title="Go to Home"
              onPress={() => navigation.navigate('HomeScreen.web')}
              style={styles.button}
            />
          </View>
        </View>
      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputWrapper: {
    marginBottom: 15,
  },
  imageBackground: {
    height: '100vh',
    width: '100%',
    paddingHorizontal: 20,
    alignItems: 'center',
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
  buttonContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
})

export default LoginScreenWeb;

import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, TextInput, Image, Button, Alert, Platform, Dimensions } from 'react-native';
import { loginUser } from "../../services/api_authentication";
import { useNavigation } from '@react-navigation/native';
import Support from ".././support_screen"

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
        if(response.is_superuser || response.is_staff) {
          navigation.navigate('UsersList');
        } else {
          navigation.navigate('Home');
        }
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

  const windowHeight = Dimensions.get('window').height;
  const windowWidth = Dimensions.get('window').width;

  const handleGoToHome = () => {
    navigation.navigate('Home'); // Asegúrate de que la ruta 'HomeScreen' coincide con la del StackNavigator
  };

  return (
    <View style={styles.container}>
      <ImageBackground 
        source={require('../../pictures/verde1.jpg')}
        style={styles.imageBackground}>
        <View style={[styles.inputContainer, { height: windowHeight * 0.6, width: windowWidth * 0.9 }]}>
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
            style={styles.linkText}
            onPress={() => navigation.navigate('Register')}
          >
            Don't have an account?
          </Text>
          <Text 
            style={styles.linkText}
            onPress={() => navigation.navigate('Support')}
          >
            Don't remember your password?
          </Text>
          <View style={styles.buttonContainer}>
            <Button title="Login" onPress={handleLogin} color="#3498db" />
          </View>
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
    height: '100%',
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

export default LoginScreenWeb;

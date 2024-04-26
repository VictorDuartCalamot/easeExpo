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
          <View>
        <Text style={styles.esloganText}>Optimiza tus recursos, potencia tu éxito: Gestión inteligente para empresas eficientes</Text>
            </View>
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
            style={{ marginTop: 10, color: 'blue',fontSize:12}}
            onPress={() => navigation.navigate('Register')}
          >
            Don't have an account?
          </Text>
          <Text 
            style={{ marginTop: 10, color: 'blue',fontSize:12 }}
            onPress={() => navigation.navigate('Support')}
          >
            Don't remember your password?
          </Text>
          <Text
            style={{ marginTop: 10, color: 'blue', fontSize: 12}}
            onPress={() => navigation.navigate('UsersList')}> 
            Admin view
          </Text>
          <View style={styles.buttonContainer}>
            <Button title="Login" onPress={handleLogin} style={styles.button} />
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
    justifyContent: 'center', // Centrar contenido verticalmente
  },
  inputContainer: {
    width: 350,
    height:450,
    backgroundColor: 'white',
    borderRadius: 40,
    justifyContent: 'center',
    paddingHorizontal: 60,
    paddingBottom: 20,
    marginRight:-1100,  },
  input: {
    borderBottomWidth: 1,
    borderColor: 'gray',
    paddingVertical: 12,
    paddingBottom:10,
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
  esloganText: {
    position: "relative",
    alignSelf:"center",
    fontSize: 25,
    fontStyle: 'italic',
    textAlign: 'left',
    color: 'white',
    marginRight:300,
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginTop: 20, // Añadimos margen arriba al botón
  },
  buttonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 50,
    alignItems: 'center',
  },
})

export default LoginScreenWeb;

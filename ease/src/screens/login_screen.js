import {Text, View, StyleSheet,ImageBackground,TextInput,Image,Button, TouchableOpacity,onp, Platform} from 'react-native'
import React, { useState } from 'react'
import { loginUser } from '../services/api_authentication';

const LoginScreen = ({navigation}) =>{
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await loginUser(email, password, Platform.OS);
      console.log(response);
      navigation.navigate('Home');
    }catch(error) {
      console.error(error);
    }
  };

  return(
    <View style={styles.container}>
      <ImageBackground source={require("../pictures/verde1.jpg")}
            style={styles.ImageBackground}>
      <View style={styles.inputContainer}>
        <Image source={require("../pictures/logo.png")}
          style={styles.ImageLogo}>
        </Image>
          <TextInput placeholder="Enter Email" value={email} onChangeText={setEmail}/>
          <View style={styles.border}/>
          <TextInput placeholder ="Password" secureTextEntry value={password} onChangeText={setPassword}/>
          <View style={styles.border}/>
          
          <Text style={{marginTop:15,color:"blue" }} onPress={() =>navigation.navigate('Register')}
          >Don't have an account?</Text>

          <Text style={{marginTop:15,color:"blue" }}>Don't remember your password?</Text>

          <Button title="Iniciar Sesion" style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Iniciar Sesión</Text>
          </Button>
      </View>
      </ImageBackground>
    </View>
  );
};

export default LoginScreen;
const styles = StyleSheet.create({
    container:{
      flex:1
    },
    ImageBackground:{
      height:"100%",
      width: "auto",
      paddingHorizontal: 20,
      alignItems:'center',
    },
    inputContainer:{
      height: 450,
      width:"85%",
      backgroundColor:"white",
      borderRadius:20,
      justifyContent:"center",
      marginTop: 170,
      paddingHorizontal:25,
    },
    border:{
      width:"100%",
      backgroundColor:"gray",
      height:1,
      alignSelf:"center",
    },
    ImageLogo:{
      width:100,
      height:100,
      alignSelf:"center",
      borderRadius:30,
      marginBottom:20,
    },
    button: {
      backgroundColor: '#3498db',
      paddingVertical: 15,
      paddingHorizontal: 30,
      borderRadius: 5,
      marginTop:15,
    },
    buttonText: {
      color: '#000000',
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
      top:25,
    }
  })
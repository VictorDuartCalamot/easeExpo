import React, { useState } from "react";
import { View, Text, StyleSheet, ImageBackground, TextInput, Image, Button, Alert, Platform } from "react-native";
import { loginUser } from "../../services/api_authentication";

const LoginScreenMovil = ({ navigation }) => {
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
}

export default LoginScreenMovil
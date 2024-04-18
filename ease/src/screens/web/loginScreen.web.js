import React, { useState } from "react";
import { View, Text, StyleSheet, ImageBackground, TextInput, Image, Button, Alert } from "react-native";
import { loginUser } from "../../services/api_authentication";
import {useNavigation} from '@react-navigation/native';

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
                source={require('../../pictures/fondo.png')}
                style={styles.imageBackground}
            >
                <View>
                    <Image
                        source={require('../../pictures/logo.png')}
                    />
                    <View>
                        <TextInput
                            placeholder="Enter Email"
                            value={email}
                            onChangeText={setEmail}
                        />
                        <View/>
                    </View>
                    <View>
                        <TextInput
                            placeholder="Password"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />
                        <View/>
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
                    <View>
                    <Button
                        title="Go to Home"
                        onPress={() => navigation.navigate('Home')}
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
    imageBackground: {
        height: '100%',
        width: 'auto',
        paddingHorizontal: 20,
        alignItems: 'center',
    },
})

export default LoginScreenWeb
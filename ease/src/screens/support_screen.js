import { View, TextInput, Button, StyleSheet, Text, Alert, ImageBackground, Image } from 'react-native';
import React, { useState } from 'react';

const ForgotPasswordScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');

    const handleResetPassword = () => {
        if (!email) {
            Alert.alert('Por favor, ingrese su correo electrónico');
            return;
        }

        // Simulación del envío del correo electrónico
        console.log(`Se ha enviado un correo de restablecimiento a: ${email}`);
        Alert.alert('Correo de restablecimiento de contraseña enviado', `Se ha enviado un correo a ${email} con las instrucciones para restablecer la contraseña.`);
        
        // Redirigir a la pantalla de login
        navigation.navigate('Login');
    };

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('../pictures/verde1.jpg')}
                style={styles.ImageBackground}
            >
                <View style={styles.inputContainer}>
                    <Image
                        source={require('../pictures/logo.png')}
                        style={styles.ImageLogo}
                    />
                    <Text style={styles.title}>Restablecer Contraseña</Text>
                    <TextInput
                        placeholder="Ingrese su correo electrónico"
                        value={email}
                        onChangeText={setEmail}
                        style={styles.input}
                    />
                    <Button title="Enviar" style={styles.button} onPress={handleResetPassword}>
                        <Text style={styles.buttonText}>Enviar</Text>
                    </Button>
                </View>
            </ImageBackground>
        </View>
    );
};

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
        width: 350,
        backgroundColor: 'white',
        borderRadius: 40,
        justifyContent: 'center',
        marginTop: 200,
        paddingHorizontal: 50,
        paddingBottom: 80,
        alignSelf: 'center'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderBottomWidth: 1,
        borderColor: 'gray',
        paddingVertical: 9,
        marginBottom: 15,
    },
    ImageLogo: {
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
});

export default ForgotPasswordScreen;

import { View, TextInput, StyleSheet, Text, Alert, ImageBackground, Image, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';

const ForgotPasswordScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [selectedOption, setSelectedOption] = useState(null);

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
    };

    const handleSubmit = () => {
        if (!email) {
            Alert.alert('Por favor, ingrese su correo electrónico');
            return;
        }

        switch (selectedOption) {
            case 'resetPassword':
                console.log(`Se ha enviado un correo de restablecimiento a: ${email}`);
                Alert.alert('Correo de restablecimiento de contraseña enviado', `Se ha enviado un correo a ${email} con las instrucciones para restablecer la contraseña.`);
                break;
            case 'changeEmail':
                console.log(`Se ha enviado un correo para cambiar el correo a: ${email}`);
                Alert.alert('Solicitud de cambio de correo enviada', `Se ha enviado un correo a ${email} para confirmar el cambio de correo.`);
                break;
            case 'contactSupport':
                console.log(`Solicitud de contacto con soporte desde el correo: ${email}`);
                Alert.alert('Contacto con soporte', 'Se ha enviado una solicitud de contacto con soporte. Nos pondremos en contacto contigo pronto.');
                break;
            default:
                break;
        }

        // Redirigir a la pantalla de login después de la acción
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
                    <Text style={styles.title}>Recuperar Cuenta</Text>
                    {!selectedOption ? (
                        <>
                            <TouchableOpacity style={styles.optionButton} onPress={() => handleOptionSelect('resetPassword')}>
                                <Text style={styles.optionButtonText}>Restablecer Contraseña</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.optionButton} onPress={() => handleOptionSelect('changeEmail')}>
                                <Text style={styles.optionButtonText}>Cambiar Correo</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.optionButton} onPress={() => handleOptionSelect('contactSupport')}>
                                <Text style={styles.optionButtonText}>Contactar con Soporte</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <TextInput
                                placeholder="Ingrese su correo electrónico"
                                value={email}
                                onChangeText={setEmail}
                                style={styles.input}
                            />
                            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                                <Text style={styles.submitButtonText}>Enviar Solicitud</Text>
                            </TouchableOpacity>
                        </>
                    )}
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
        alignSelf: 'center',
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
    optionButton: {
        backgroundColor: '#3498db',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        marginTop: 15,
        alignItems: 'center',
        width: '100%', // full width
    },
    optionButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    submitButton: {
        backgroundColor: '#2ecc71',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        marginTop: 20,
        alignItems: 'center',
        width: '100%', // full width
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default ForgotPasswordScreen;

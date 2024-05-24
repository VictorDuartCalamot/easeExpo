import { View, ImageBackground, TextInput, Image, Button, StyleSheet, Text, Alert, Platform} from 'react-native'
import React, {useState} from 'react'
import { getUnmetPasswordRequirements } from '../../utils/passwordUtils'
import { registerUser } from '../../services/api_authentication'

const RegisterScreenWeb = ({navigation}) => {
    const [username, setUsername] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordRequirements, setPasswordRequirements] = useState([]);
    const [error, setError] = useState('');

    const handleRegister = async () => {
        if (!email || !password || !username || !lastname || !confirmPassword ) {
            setError('Please fill in all fields.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        try {
            const response = await registerUser(username, lastname, email, password);
            console.log(response);
            Alert.alert('Usuario creado');
            navigation.navigate('Login');
        } catch(error) {
            console.error(error);
            if (error.response && error.response.status === 409) {
                setError('Email already exists.');
            } else {
                setError('Failed to register. Please try again.');
            }
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
                style={styles.imageBackground}>
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
                            onChangeText={handlePasswordChange}
                            style={styles.input}
                        />
                    </View>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            placeholder="Confirm password"
                            secureTextEntry
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
                    
                    {error ? <Text style={styles.errorText}>{error}</Text> : null}

                    <View style={styles.buttonContainer}>
                        <Button title="Register" onPress={handleRegister} color="#3498db" />
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
    inputWrapper: {
        marginBottom: 15,
    },
    input: {
        borderBottomWidth: 1,
        borderColor: 'gray',
        paddingVertical: 9,
    },
    inputLine: {
        height: 1,
        backgroundColor: 'gray',
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
    imageBackground: {
        flex: 1,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',  
    }, 
    buttonContainer: {
        marginTop: 15,
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 10,
    },
});

export default RegisterScreenWeb;

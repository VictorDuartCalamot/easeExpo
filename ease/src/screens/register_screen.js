import { View, ImageBackground, TextInput, Image, Button, StyleSheet, Text} from 'react-native'
import React, {useState} from 'react'
import { getUnmetPasswordRequirements } from '../utils/passwordUtils'
import { l_R_styles } from '../styles/js/l_R_styles'
import { registerUser } from '../services/api_authentication'

const RegisterScreen = ({navigation}) => {
    const [username, setUsername] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordRequirements, setPasswordRequirements] = useState([]);

    const handleRegister = async () => {
        try {
            const response = await registerUser(username, lastname, email, password);
            console.log(response);
            navigation.navigate('Login');
        }catch(error){
            console.error(error);
        }
    };

    const handlePasswordChange = (text) => {
        setPassword(text);
        const requirements = getUnmetPasswordRequirements(text);
        setPasswordRequirements(requirements);
    };

    return (
        <View style={styles.container}>
            <ImageBackground source={require("../pictures/verde1.jpg")}
                style={styles.ImageBackground}
            >
                <View style={styles.inputContainer}>
                    <Image source={require("../pictures/logo.png")} style={styles.ImageLogo}/>
                    <TextInput placeholder='Name' value={username} onChangeText={setUsername}/>
                    <View style={styles.border}/>
                    <TextInput placeholder='Last name' value={lastname} onChangeText={setLastname}/>
                    <View style={styles.border}/>
                    <TextInput placeholder='Email' value={email} onChangeText={setEmail} keyboardType='email-address'/>
                    <View style={styles.border}/>
                    <TextInput placeholder='Password' secureTextEntry value={password} onChangeText={handlePasswordChange}/>
                    <View style={styles.border}/>
                    <TextInput placeholder='Confirm password' secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword}/>
                    <View style={styles.border}/>

                    {passwordRequirements.length > 0 && (
                        <View style={l_R_styles.passwordRequirementsContainer}>
                            {passwordRequirements.map((requirements, index) => (
                                <Text key={index} style={l_R_styles.passwordRequirement}>
                                    - {requirements}
                                </Text>
                            ))}
                        </View>
                    )}

                    <Button title='Register' style={styles.button} onPress={handleRegister}>
                                <Text style={styles.buttonText}>Register</Text>
                    </Button>
                </View>
            </ImageBackground>
        </View>
    )
}

export default RegisterScreen;

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
      marginBottom: 20,
    },
    ImageLogo:{
      width:100,
      height:100,
      alignSelf:"center",
      borderRadius:30,
      marginBottom:15,
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
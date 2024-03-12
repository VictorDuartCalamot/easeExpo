import { View, ImageBackground, TextInput, Image, Button, TouchableOpacity} from 'react-native'
import React, {useState} from 'react'
import { getUnmetPasswordRequirements } from '../utils/passwordUtils'
import { l_R_styles } from '../styles/js/l_R_styles'

const RegisterScreen = () => {
    const [username, setUsername] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordRequirements, setPasswordRequirements] = useState([]);

    const handleRegister = () => {
        console.log('Registering...');
        console.log('Username:', username);
        console.log('LastName', lastname);
        console.log('Email:', email);
        console.log('Password:', password);
        console.log('confirm your password:', confirmPassword);
    };

    const handlePasswordChange = (text) => {
        setPassword(text);
        const requirements = getUnmetPasswordRequirements(text);
        setPasswordRequirements(requirements);
    };

    return (
        <View style={l_R_styles.container}>
            <ImageBackground source={require("../pictures/verde1.jpg")} style={l_R_styles.ImageBackground}>
                <View style={l_R_styles.inputContainer}>
                    <Image source={require("../pictures/logo.png")} style={l_R_styles.ImageLogo}/>
                    <TextInput placeholder='First Name' value={username} onChangeText={(text) => setUsername(text)} />
                    <View style={l_R_styles.border}/>
                    <TextInput placeholder='Last Name' value={lastname} onChangeText={(text) => setLastname(text)} />
                    <View style={l_R_styles.border}/>
                    <TextInput placeholder='Enter Email' value={email} onChangeText={(text) => setEmail(text)} keyboardType='email-address'/>
                    <View style={l_R_styles.border}/>
                    <TextInput placeholder='Password' secureTextEntry value={password} onChangeText={handlePasswordChange}/>
                    <View style={l_R_styles.border}/>
                    <TextInput placeholder='Confirm Password' secureTextEntry onChangeText={(text) => setConfirmPassword(text)}/>
                    <View style={l_R_styles.border}/>

                    {passwordRequirements.length > 0 && (
                        <View style={l_R_styles.passwordRequirementsContainer}>
                            {passwordRequirements.map((requirements, index) => (
                                <Text key={index} style={l_R_styles.passwordRequirement}>
                                    - {requirements}
                                </Text>
                            ))}
                        </View>
                    )}

                    <Text>ola</Text>
                </View>
            </ImageBackground>
        </View>
    )
}

export default RegisterScreen;
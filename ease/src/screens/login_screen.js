import { Text, View, ImageBackground, Image, TextInput } from "react-native";
import React from "react";
import { l_R_styles } from "../styles/js/l_R_styles";
import { MyButton } from "../components/MyButton";

const LoginScreen = () => {
    return (
        <View style={l_R_styles.container}>
            <ImageBackground source={require("../pictures/verde1.jpg")}
             style={l_R_styles.ImageBackground}>
                <View style={l_R_styles.inputContainer}>
                    <Image source={require("../pictures/logo.png")}
                     sytle={l_R_styles.ImageLogo} />
                    <TextInput placeholder="Enter Email or username"/>
                    <View style={l_R_styles.border}/>
                    <TextInput placeholder="Password" secureTextEntry/>
                    <View style={l_R_styles.border}/>
                    <Text style={l_R_styles.linkText}>
                        Don't have an account?
                    </Text>
                    <Text style={l_R_styles.linkText}>
                        Don't remember your password?
                    </Text>
                    <MyButton title={"Iniciar Sesion"}/>
                </View>
            </ImageBackground>
        </View>
    )
}

export default LoginScreen;
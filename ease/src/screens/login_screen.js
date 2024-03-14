import React from "react";
import { Text, View, ImageBackground, TextInput, Image, TouchableOpacity } from "react-native";

const LoginScreen = ({ navigation }) => {
    return (
        <View className="flex-1">
            <ImageBackground source={require('../pictures/verde1.jpg')} className="h-full px-20 items-center">
                <View className="h-450 w-full bg-white rounded-20 justify-center mt-170 px-25">
                    <Image source={require('../pictures/logo.png')} className="w-25 h-25 self-center rounded-30 mb-20" />
                    <TextInput placeholder="Enter Email or username" className="border-b-1 border-gray self-center w-full mb-4" />
                    <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                        <Text className="mt-4 text-blue">Don't have an account?</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Text className="mt-4 text-blue">Don't remember your password?</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                        <Text className="mt-4 text-blue">prueba home</Text>
                    </TouchableOpacity>
                    <Text className="mt-4 text-blue">Iniciar sesion</Text>
                </View>
            </ImageBackground>
        </View>
    );
};

export default LoginScreen;
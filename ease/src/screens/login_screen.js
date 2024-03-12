import { StyleSheet, Text, View, ImageBackground, Image, TextInput } from "react-native";
import React from "react";
import { MyButton } from "../components/MyButton";

const LoginScreen = () => {
    return (
        <View style={styles.container}>
            <ImageBackground source={require("../pictures/verde1.jpg")}
             style={styles.imageBackground}>
                <View style={styles.inputContainer}>
                    <Image source={require("../pictures/logo.png")}
                     style={styles.imageLogo} />
                    <TextInput placeholder="Enter Email or username"/>
                    <View style={styles.border}/>
                    <TextInput placeholder="Password" secureTextEntry/>
                    <View style={styles.border}/>
                    <Text style={styles.linkText}>
                        Don't have an account?
                    </Text>
                    <Text style={styles.linkText}>
                        Don't remember your password?
                    </Text>
                    <MyButton title={"Iniciar Sesion"}/>
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
    height: "100%",
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: "center",
    flex: 1,
  },
  inputContainer: {
    height: 450,
    width: "100%",
    backgroundColor: "white",
    borderRadius: 20,
    justifyContent: "center",
    marginTop: 170,
    paddingLeft: 25,
    paddingRight: 25,
  },
  imageLogo: {
    width: 100,
    height: 100,
    alignSelf: "center",
    borderRadius: 30,
    marginBottom: 20,
  },
  border: {
    width: "100%",
    backgroundColor: "gray",
    height: 1,
    alignSelf: "center",
  },
  linkText: {
    marginTop: 15,
    color: "blue",
  },
});

export default LoginScreen;
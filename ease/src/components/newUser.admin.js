import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Switch } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { registerNewUser } from "../services/api_authentication";

function NewUserAdmin() {
    const navigation = useNavigation();
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isStaff, setIsStaff] = useState(false);

    const handleCancel = () => {
        navigation.goBack();
    };

    const handleSave = async () => {
        try{
            const userData = {
                first_name: name,
                last_name: surname,
                email: email,
                password:  password,
                isStaff: isStaff,
            };
            await registerNewUser(userData);
            navigation.goBack();
        }catch(error){
            console.error("Error creating new user: ", error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>New User</Text>
            <TextInput
                style={styles.input}
                placeholder="Name"
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={styles.input}
                placeholder="Surname"
                value={surname}
                onChangeText={setSurname}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <View style={styles.checkboxContainer}>
                <Switch
                    value={isStaff}
                    onValueChange={setIsStaff}
                    style={styles.checkbox}
                />
                <Text style={styles.label}>Is Staff?</Text>
            </View>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    input: {
        width: "80%",
        height: 40,
        borderWidth: 1,
        borderColor: "gray",
        marginBottom: 20,
        paddingLeft: 10,
    },
    saveButton: {
        backgroundColor: "blue",
        width: 100,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
        borderRadius: 5,
    },
    cancelButton: {
        backgroundColor: "gray",
        width: 100,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
    },
    buttonText: {
        color: "white",
        fontSize: 16,
    },
    checkboxContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    checkbox: {
        marginRight: 10,
    },
    label: {
        fontSize: 16,
    },
});

export default NewUserAdmin;
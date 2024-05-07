import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, Button } from "react-native";
import { getOneUser, updateUser } from "../../services/api_authentication";

function UserData ({ route }) {
    const [userData, setUserData] = useState(null);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const id = route.params.userId;
                const userData = await getOneUser(id);
                setUserData(userData);
                setFirstName(userData.first_name);
                setLastName(userData.last_name);
            }catch(error) {
                console.error("Error fetching user data: ", error);
            }
        };
        fetchUserData();
    }, [route.params.userId]);

    const handleUpdateUser = async () => {
        try{
            await updateUser({
                first_name: firstName,
                last_name: lastName,
                is_staff: userData.is_staff,
                is_superuser: userData.is_superuser,
                is_active: userData.is_active
            }, userData.id);
        }catch(error){
            console.error("Error updating user data: ", error);
        }
    };

    if(!userData){
        return(
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text>ID: {userData.id}</Text>
            <TextInput
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="First Name"
            />
            <TextInput
                style={styles.input}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Last Name"
            />
            <Button title="Update User" onPress={handleUpdateUser} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        width: "80%",
        marginVertical: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
    },
})

export default UserData;
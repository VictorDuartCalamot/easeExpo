import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import Card from "../../components/card";
import { getusers } from "../../services/api_authentication";

function UsersList () {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const userData = await getusers();
                setUsers(userData);
            }catch (error) {
                console.error("Error fetching users: ", error);
            }
        };

        fetchUsers();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Users List</Text>
            <ScrollView style={styles.scrollView}>
                {users.map((user, index) => (
                    <Card key={index} user={user}/>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 24,
        marginBottom: 10,
    },
    scrollView: {
        width: "100%",
    },
});

export default UsersList;
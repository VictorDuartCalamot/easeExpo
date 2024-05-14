import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const Card = ({ user, onDelete, onUpdate, onActive, expanded, onPress }) => {
    const navigation = useNavigation();
    return (
        <TouchableOpacity onPress={onPress} style={styles.card}>
            <Text style={styles.userName}>{user.id}. {user.email}</Text>
            {expanded && (
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity onPress={onDelete} style={styles.button}>
                        <Text>Delete</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onUpdate(user.id)} style={styles.button}>
                        <Text>Update</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onActive(user.id, user.is_active)} style={styles.button}>
                        <Text>{user.is_active ? "Deactivate" : "Activate"}</Text>
                    </TouchableOpacity>
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        padding: 10,
        marginBottom: 10,
        backgroundColor: "#f0f0f0",
    },
    userName: {
        fontSize: 16,
    },
    buttonsContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 10,
    },
    button: {
        backgroundColor: "#ccc",
        padding: 5,
        borderRadius: 5,
    },
});

export default Card;
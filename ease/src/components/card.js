import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const Card = ({ user }) => {
    const [expanded, setExpanded] = useState(false);

    const toggleExpanded = () => {
        setExpanded(!expanded);
    };

    const handleDelete = () => {
        // falta codigo
    };

    const handleDelete = () => {
        // Enviar a una ventana para actualizar los usuarios
    };

    return (
        <TouchableOpacity onPress={toggleExpanded} style={styles.card}>
            <Text style={styles.userName}></Text>
        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    card: {
        padding: 10,
        marginBottom: 10,
        backgroundColor: "#f0f0f0",
    },
      userName: {
        fontSize: 18,
        fontWeight: "bold",
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
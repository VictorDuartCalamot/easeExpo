// ChatAdminMovil.js
import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from "@react-navigation/native";

function ChatAdminMovil() {
    const navigation = useNavigation();
    const [chats, setChats] = useState([
        { id: 1, name: "Cliente 1" },
        { id: 2, name: "Cliente 2" }
    ]); // Simula chats existentes

    const selectChat = (chatId) => {
        navigation.navigate('ChatDetail', { chatId });
    };

    return (
        <View style={styles.container}>
            {chats.map(chat => (
                <TouchableOpacity key={chat.id} onPress={() => selectChat(chat.id)} style={styles.chatItem}>
                    <Text>{chat.name}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20
    },
    chatItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc'
    }
});

export default ChatAdminMovil;
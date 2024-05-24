import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { getOneUser } from '../../../services/api_authentication';

function ChatAdminMovil() {
    const navigation = useNavigation();
    const [chats, setChats] = useState([]);

    useEffect(() => {
        loadChats();
    }, []);

    const loadChats = async () => {
        try {
            const token = await AsyncStorage.getItem('Token');
            if (!token) throw new Error('Token not found');
            const headers = {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json'
            };
            const response = await axios.get('https://easeapi.onrender.com/api/chats/chat/', { headers });
            const chatsData = response.data;

            if (Array.isArray(chatsData)) {
                const chatsWithUsernames = [];
                for (const chat of chatsData) {
                    if (chat.customer) {
                        const userData = await getOneUser(chat.customer);
                        chatsWithUsernames.push({ id: chat.id, username: userData.username });
                    } else {
                        console.error('Error: customer_id is undefined for chat:', chat);
                    }
                }
                setChats(chatsWithUsernames);
            }
        } catch (error) {
            console.error('Error loading chats:', error);
        }
    };

    const selectChat = (chatId) => {
        navigation.navigate('ChatDetail', { chatId });
    };

    return (
        <View style={styles.container}>
            {chats.map(chat => (
                <TouchableOpacity key={chat.id} onPress={() => selectChat(chat.id)} style={styles.chatItem}>
                    <Text>{chat.username}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        marginTop: 45,
    },
    chatItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc'
    }
});

export default ChatAdminMovil;
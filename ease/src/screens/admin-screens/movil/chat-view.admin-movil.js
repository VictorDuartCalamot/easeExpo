import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { getOneUser } from '../../../services/api_authentication';
import { useNavigation } from '@react-navigation/native';

function ChatAdminMovil() {
    const [chats, setChats] = useState([]);
    const navigation = useNavigation();

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
                const chatsWithUsernames = await Promise.all(chatsData.map(async (chat) => {
                    if (chat.customer) {
                        const userData = await getOneUser(chat.customer);
                        return { id: chat.id, username: userData.username };
                    } else {
                        console.error('Error: customer_id is undefined for chat:', chat);
                        return null;
                    }
                }));

                setChats(chatsWithUsernames.filter(chat => chat !== null));
            }
        } catch (error) {
            console.error('Error loading chats:', error);
        }
    };

    const selectChat = (chatId) => {
        navigation.navigate('ChatDetails', { chatId });
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => selectChat(item.id)} style={styles.chatItem}>
            <Text>{item.username}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={chats}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        marginTop: 50,
    },
    chatItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
});

export default ChatAdminMovil;
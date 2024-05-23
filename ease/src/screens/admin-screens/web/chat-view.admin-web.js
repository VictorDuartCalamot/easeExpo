import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { getOneUser } from '../../../services/api_authentication';

function ChatAdminWeb() {
    const [chats, setChats] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const websocketRef = useRef(null);

    useEffect(() => {
        loadChats();
    }, []);

    useEffect(() => {
        if (activeChat) {
            connectWebSocket(activeChat);
        }
    }, [activeChat]);

    const loadChats = async () => {
        try {
            const token = await AsyncStorage.getItem('Token');
            if (!token) throw new Error('Token not found');
            const headers = {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json'
            };
            const response = await axios.get('https://easeapi.onrender.com/api/chats/chat/', { headers });
            console.log('Response:', response);
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

    const connectWebSocket = async (chatId) => {
        if (websocketRef.current) {
            websocketRef.current.close();
        }

        try {
            const token = await AsyncStorage.getItem('Token');
            if (!token) throw new Error('Token not found or expired');
            const wsUrl = `wss://easeapi.onrender.com/ws/chat/${chatId}/?token=${token}`;
            websocketRef.current = new WebSocket(wsUrl);

            websocketRef.current.onopen = () => console.log('WebSocket Connected');
            websocketRef.current.onerror = error => console.error('WebSocket Error:', error);
            websocketRef.current.onclose = () => console.log('WebSocket Closed');
            websocketRef.current.onmessage = handleWebSocketMessages;
        } catch (error) {
            console.error('Error connecting to WebSocket:', error);
        }
    };

    const selectChat = (chatId) => {
        setActiveChat(chatId);
    };

    const onSend = useCallback((newMessages = []) => {
        if (websocketRef.current) {
            websocketRef.current.send(JSON.stringify(newMessages[0]));
        }
    }, []);

    const handleWebSocketMessages = event => {
        const message = JSON.parse(event.data);
        setMessages(previousMessages => GiftedChat.append(previousMessages, message));
    };

    return (
        <View style={styles.container}>
            <View style={styles.chatList}>
                {chats.map((chat, index) => (
                    <TouchableOpacity key={index} onPress={() => selectChat(chat.id)} style={styles.chatItem}>
                        <Text>{chat.username}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <View style={styles.chatArea}>
                <GiftedChat
                    messages={messages}
                    onSend={messages => onSend(messages)}
                    user={{
                        _id: 1,
                        name: "Admin"
                    }}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row'
    },
    chatList: {
        flex: 1,
        borderRightWidth: 1,
        borderColor: '#ccc',
        marginTop: 40,
    },
    chatArea: {
        flex: 3
    },
    chatItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc'
    }
});

export default ChatAdminWeb;
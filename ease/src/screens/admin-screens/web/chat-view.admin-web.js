import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

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
            const headers = {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json'
            };
            const response = await axios.get('https://easeapi.onrender.com/api/chats/chat/', { headers });
            console.log('Response:', response);
            const chatsData = response.data;

            if (Array.isArray(chatsData)) {
                setChats(chatsData);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const connectWebSocket = (chatId) => {
        if (websocketRef.current) {
            websocketRef.current.close();
        }

        const token = AsyncStorage.getItem('Token');
        const wsUrl = `wss://easeapi.onrender.com/ws/chat/${chatId}/?token=${token}`;
        websocketRef.current = new WebSocket(wsUrl);
        websocketRef.current.onopen = () => console.log('WebSocket Connected');
        websocketRef.current.onerror = error => console.log('WebSocket Error', error);
        websocketRef.current.onclose = () => console.log('WebSocket Closed');
        websocketRef.current.onmessage = handleWebSocketMessages;
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
                {chats.map(chat => (
                    <TouchableOpacity key={chat.id} onPress={() => selectChat(chat.id)} style={styles.chatItem}>
                        <Text>{chat.name}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <View style={styles.chatArea}>
                <GiftedChat
                    messages={messages}
                    onSend={newMessages => onSend(newMessages)}
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
        borderColor: '#ccc'
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
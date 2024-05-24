import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, TextInput, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { getOneUser } from '../../../services/api_authentication';

function ChatAdminWeb() {
    const [chats, setChats] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState({});
    const [inputMessage, setInputMessage] = useState('');
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
        try {
            const token = await AsyncStorage.getItem('Token');
            if (!token) throw new Error('Token not found or expired');
            const wsUrl = `wss://easeapi.onrender.com/ws/support/chat/${chatId}/?token=${token}`;

            // Solo cierra la conexión si no está activa para el chatId actual
            if (websocketRef.current && activeChat !== chatId) {
                websocketRef.current.close();
            }

            websocketRef.current = new WebSocket(wsUrl);

            websocketRef.current.onopen = () => console.log('WebSocket Connected');
            websocketRef.current.onerror = error => console.error('WebSocket Error:', error);
            websocketRef.current.onclose = () => console.log('WebSocket Closed');
            websocketRef.current.onmessage = event => handleWebSocketMessages(event, chatId);

        } catch (error) {
            console.error('Error connecting to WebSocket:', error);
        }
    };

    const selectChat = (chatId) => {
        setActiveChat(chatId);
    };

    const onSend = useCallback(async () => {
        if (!inputMessage.trim()) return;

        if (websocketRef.current) {
            const message = {
                text: inputMessage.trim(),
                timestamp: new Date().getTime(),
                user: 'Admin'
            };
            websocketRef.current.send(JSON.stringify(message));
            setInputMessage('');
        }
    }, [inputMessage]);

    const handleWebSocketMessages = (event, chatId) => {
        const rawMessages = JSON.parse(event.data);
    
        if (Array.isArray(rawMessages)) {
            const formattedMessages = rawMessages.map(rawMessage => ({
                _id: rawMessage.user ? rawMessage.user.toString() : new Date().getTime().toString(),
                text: rawMessage.message || "",
                createdAt: rawMessage.timestamp ? new Date(rawMessage.timestamp) : new Date(),
                user: {
                    _id: rawMessage.user || 'unknown',
                    name: rawMessage.user || 'Unknown',
                }
            }));
    
            setMessages(prevMessages => ({
                ...prevMessages,
                [chatId]: [...(prevMessages[chatId] || []), ...formattedMessages]
            }));
        } else {
            console.error(`Unexpected message format for chat ${chatId}:`, rawMessages);
        }
    };    

    const renderItem = ({ item }) => (
        <View style={styles.messageItem}>
            <Text>{item.user.name}: {item.text}</Text>
        </View>
    );

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
                {activeChat && (
                    <>
                        <FlatList
                            data={messages[activeChat] || []}
                            renderItem={renderItem}
                            keyExtractor={(item, index) => index.toString()}
                            inverted
                        />
                        <KeyboardAvoidingView
                            behavior={Platform.OS === "ios" ? "padding" : "height"}
                            style={styles.inputContainer}
                        >
                            <TextInput
                                style={styles.text}
                                placeholder="Escribe tu mensaje..."
                                value={inputMessage}
                                onChangeText={setInputMessage}
                            />
                            <TouchableOpacity style={styles.sendButton} onPress={onSend}>
                                <Text style={styles.sendButtonText}>Enviar</Text>
                            </TouchableOpacity>
                        </KeyboardAvoidingView>
                    </>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
    },
    chatList: {
        flex: 1,
        borderRightWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginTop: 45,
    },
    chatItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    chatArea: {
        flex: 3,
        padding: 10,
        justifyContent: 'space-between',
    },
    messageItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    text: {
        flex: 1,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginRight: 10,
    },
    sendButton: {
        backgroundColor: 'blue',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    sendButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default ChatAdminWeb;
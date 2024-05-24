import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, TextInput, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { getOneUser } from '../../../services/api_authentication';

function ChatPrueba() {
    const [chats, setChats] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState({});
    const [inputMessage, setInputMessage] = useState('');
    const websocketRef = useRef(null);
    const reconnectInterval = useRef(5000); // 5 seconds initial reconnection interval

    useEffect(() => {
        loadChats();
    }, []);

    useEffect(() => {
        if (activeChat) {
            connectWebSocket(activeChat);
        }

        return () => {
            if (websocketRef.current) {
                websocketRef.current.close();
            }
        };
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

    const connectWebSocket = async (chatId) => {
        try {
            const token = await AsyncStorage.getItem('Token');
            if (!token) throw new Error('Token not found or expired');
            const wsUrl = `wss://easeapi.onrender.com/ws/support/chat/${chatId}/?token=${token}`;

            if (websocketRef.current) {
                websocketRef.current.close();
            }

            websocketRef.current = new WebSocket(wsUrl);
            console.log("WebSocket URL: ", wsUrl);

            websocketRef.current.onopen = () => {
                console.log('WebSocket Connected');
                reconnectInterval.current = 5000; // Reset reconnection interval
            };
            websocketRef.current.onerror = error => console.error('WebSocket Error:', error);
            websocketRef.current.onmessage = event => handleWebSocketMessages(event, chatId);
            websocketRef.current.onclose = event => {
                console.log(`WebSocket Disconnected. Code: ${event.code}, Reason: ${event.reason}`);
                if (websocketRef.current && websocketRef.current.readyState !== WebSocket.CONNECTING) {
                    setTimeout(() => connectWebSocket(chatId), reconnectInterval.current);
                    reconnectInterval.current = Math.min(reconnectInterval.current * 2, 60000); // Increment interval up to 1 minute
                }
            };
        } catch (error) {
            console.error('Error connecting to WebSocket:', error);
        }
    };

    const selectChat = (chatId) => {
        setActiveChat(chatId);
    };

    const onSend = useCallback(() => {
        if (!inputMessage.trim()) return;
    
        if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
            try {
                const message = {
                    "message": inputMessage.trim(),
                };
                websocketRef.current.send(JSON.stringify(message));
                console.log('Message sent: ', websocketRef.current.send);
                setInputMessage('');
            } catch (error) {
                console.error('Error sending message: ', error);
            }
        } else {
            console.error('WebSocket is not open. Current state: ', websocketRef.current.readyState);
        }
    }, [inputMessage]);    

    const handleWebSocketMessages = (event, chatId) => {
        const rawMessages = JSON.parse(event.data);
        console.log('Received message: ', rawMessages);
        
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
        } else if (rawMessages.message) {
            const formattedMessage = {
                _id: rawMessages.user ? rawMessages.user.toString() : new Date().getTime().toString(),
                text: rawMessages.message || "",
                createdAt: rawMessages.timestamp ? new Date(rawMessages.timestamp) : new Date(),
                user: {
                    _id: rawMessages.user || 'unknown',
                    name: rawMessages.user || 'Unknown',
                }
            };
    
            setMessages(prevMessages => ({
                ...prevMessages,
                [chatId]: [...(prevMessages[chatId] || []), formattedMessage]
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

export default ChatPrueba;
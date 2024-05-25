import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, TextInput, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function ChatDetails({ route }) {
    const { chatId } = route.params;
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const websocketRef = useRef(null);

    useEffect(() => {
        connectWebSocket(chatId);

        return () => {
            if (websocketRef.current) {
                websocketRef.current.close();
            }
        };
    }, [chatId]);

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
            };
            websocketRef.current.onerror = error => console.error('WebSocket Error:', error);
            websocketRef.current.onmessage = event => handleWebSocketMessages(event, chatId);
            websocketRef.current.onclose = event => {
                console.log(`WebSocket Disconnected. Code: ${event.code}, Reason: ${event.reason}`);
            };
        } catch (error) {
            console.error('Error connecting to WebSocket:', error);
        }
    };

    const onSend = useCallback(() => {
        if (!inputMessage.trim()) return;
    
        if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
            try {
                const message = {
                    "message": inputMessage.trim(),
                };
                websocketRef.current.send(JSON.stringify(message));
                console.log('Message sent: ', message);
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

            setMessages(prevMessages => [...prevMessages, ...formattedMessages]);
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

            setMessages(prevMessages => [...prevMessages, formattedMessage]);
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
            <FlatList
                data={messages}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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

export default ChatDetails;
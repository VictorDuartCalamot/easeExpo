import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

function ChatDetail({ route }) {
    const { chatId } = route.params;
    const [messages, setMessages] = useState([]);
    const websocketRef = useRef(null);

    useEffect(() => {
        loadMessages();
        connectWebSocket();

        return () => {
            if (websocketRef.current) {
                websocketRef.current.close();
            }
        };
    }, [chatId]);

    const loadMessages = async () => {
        try {
            const token = await AsyncStorage.getItem('Token');
            if (!token) throw new Error('Token not found');
            const headers = {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json'
            };

            const response = await axios.get(`https://easeapi.onrender.com/api/chats/chat/${chatId}/messages/`, { headers });
            const messagesData = response.data;

            const formattedMessages = messagesData.map(msg => ({
                _id: msg.id,
                text: msg.message,
                createdAt: new Date(msg.timestamp),
                user: {
                    _id: msg.user,
                    name: msg.user_name,
                    avatar: 'https://placeimg.com/140/140/any',
                },
            }));

            setMessages(formattedMessages);
        } catch (error) {
            console.error('Error loading messages:', error);
        }
    };

    const connectWebSocket = async () => {
        try {
            const token = await AsyncStorage.getItem('Token');
            if (!token) throw new Error('Token not found');
            const wsUrl = `wss://easeapi.onrender.com/ws/support/chat/${chatId}/?token=${token}`;
            websocketRef.current = new WebSocket(wsUrl);

            websocketRef.current.onopen = () => console.log('WebSocket Connected');
            websocketRef.current.onerror = error => console.error('WebSocket Error:', error);
            websocketRef.current.onclose = () => console.log('WebSocket Closed');
            websocketRef.current.onmessage = event => handleWebSocketMessages(event);
        } catch (error) {
            console.error('Error connecting to WebSocket:', error);
        }
    };

    const handleWebSocketMessages = (event) => {
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

            setMessages(prevMessages => GiftedChat.append(prevMessages, formattedMessages));
        } else {
            console.error(`Unexpected message format:`, rawMessages);
        }
    };

    const onSend = useCallback(async (newMessages = []) => {
        try {
            const token = await AsyncStorage.getItem('Token');
            if (!token) throw new Error('Token not found');
            const headers = {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json'
            };

            const url = `https://easeapi.onrender.com/api/chats/chat/${chatId}/messages/`;

            const messageData = newMessages[0];

            const response = await axios.post(url, {
                message: messageData.text,
                timestamp: new Date().getTime(),
                user: 'Admin'
            }, { headers });

            setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }, [chatId]);

    return (
        <GiftedChat
            messages={messages}
            onSend={newMessages => onSend(newMessages)}
            user={{
                _id: 1,
                name: "Admin"
            }}
        />
    );
}

export default ChatDetail;
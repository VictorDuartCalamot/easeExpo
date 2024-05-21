import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { getOrCreateChat } from '../../../services/api_chat';

function ChatAdminWeb() {
    const [chats, setChats] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const websocketRef = useRef(null);

    useEffect(() => {
        loadChats();

        return () => {
            if (websocketRef.current) {
                websocketRef.current.close(); // Limpiar el WebSocket al desmontar el componente
            }
        };
    }, []);

    useEffect(() => {
        if (activeChat) {
            const wsUrl = `wss://easeapi.onrender.com/ws/chat/${activeChat}/`; // Nota: Asegúrate de que la URL sea 'wss' para WebSocket seguro.
            websocketRef.current = new WebSocket(wsUrl);
            websocketRef.current.onmessage = handleWebSocketMessages;
            websocketRef.current.onopen = () => console.log('WebSocket Connected');
            websocketRef.current.onerror = error => console.log('WebSocket Error', error);
            websocketRef.current.onclose = () => console.log('WebSocket Closed');
        }
    }, [activeChat]);

    const loadChats = async () => {
        const chatsData = await getOrCreateChat();
        if (chatsData) {
            setChats(chatsData);
            selectChat(chatsData[0].id);
        }
    };

    const selectChat = (chatId) => {
        setActiveChat(chatId);
        loadMessages(chatId);
    };

    const loadMessages = (chatId) => {
        const newMessages = [
            {
                _id: Math.random(),
                text: `Mensaje inicial para el chat con ID ${chatId}`,
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: "Cliente",
                    avatar: 'https://placeimg.com/140/140/any',
                },
            }
        ];
        setMessages(newMessages);
    };

    const onSend = useCallback((newMessages = []) => {
        if (websocketRef.current) {
            websocketRef.current.send(JSON.stringify(newMessages[0]));
        }
        setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
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
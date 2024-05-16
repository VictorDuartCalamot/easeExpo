// ChatAdminWeb.js
import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';

function ChatAdminWeb() {
    const [chats, setChats] = useState([
        { id: 1, name: "Cliente 1" },
        { id: 2, name: "Cliente 2" }
    ]);  // Simula lista de chats
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if (chats.length > 0) {
            selectChat(chats[0].id);  // Establece el primer chat como activo por defecto
        }
    }, [chats]);

    const selectChat = (chatId) => {
        setActiveChat(chatId);
        // Simulación de la carga de mensajes para el chat seleccionado
        const newMessages = [
            {
                _id: Math.random(),
                text: `Mensaje de ejemplo para ${chats.find(chat => chat.id === chatId).name}`,
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: chats.find(chat => chat.id === chatId).name,
                    avatar: 'https://placeimg.com/140/140/any',
                },
            }
        ];
        setMessages(newMessages);
    };

    const onSend = useCallback((newMessages = []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
    }, []);

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
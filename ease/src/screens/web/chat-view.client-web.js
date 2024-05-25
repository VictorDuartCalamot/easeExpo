import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet } from 'react-native';
import { getOrCreateChat } from '../../services/api_chat';

function ChatClientWeb() {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        setMessages([
            {
                _id: 1,
                text: 'Bienvenido al chat de soporte, ¿en qué puedo ayudarte?',
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: 'Admin',
                    avatar: 'https://placeimg.com/140/140/any',
                },
            },
        ]);
    }, []);

  const initializeChat = async () => {
    try {
      const chatDetails = await getOrCreateChat();
      console.log('Chat initialized:', chatDetails);
      // Envía el mensaje inicial automáticamente al abrir el chat
      handleMessageReceived({ text: '¿Qué necesitas?', sender: 'bot' });
    } catch (error) {
      console.error('Error initializing chat:', error);
    }
  };

  const handleMessageReceived = (message) => {
    setMessages(prevMessages => [...prevMessages, message]);
  };

  const handleSendMessage = () => {
    const message = { text: inputMessage, sender: 'me' };
    handleMessageReceived(message);
    setInputMessage('');
  };

    return (
        <View style={styles.container}>
            <GiftedChat
                messages={messages}
                onSend={newMessages => onSend(newMessages)}
                user={{
                    _id: 1,
                    name: "Cliente"
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default ChatClientWeb;
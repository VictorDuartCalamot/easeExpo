import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet } from 'react-native';
import { getOrCreateChat } from '../../services/api_chat';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  useEffect(() => {
    initializeChat();
  }, []);

  const initializeChat = async () => {
    try {
      const chatDetails = await getOrCreateChat();
      console.log('Chat initialized:', chatDetails);
      // Cargar mensajes guardados localmente al iniciar el chat
      const savedMessages = await AsyncStorage.getItem('messages');
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      }
    } catch (error) {
      console.error('Error initializing chat:', error);
    }
  };

  const saveMessage = async (message) => {
    try {
      const newMessages = [...messages, message];
      setMessages(newMessages);
      // Guardar mensajes localmente
      await AsyncStorage.setItem('messages', JSON.stringify(newMessages));
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };

  const handleSendMessage = async () => {
    try {
      // Enviar el mensaje utilizando la API
      // Aquí simulamos el envío del mensaje y lo guardamos localmente
      saveMessage({ text: inputMessage, sender: 'me' });
      setInputMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <ScrollView contentContainerStyle={styles.messageContainer}>
        {messages.map((message, index) => (
          <View key={index} style={[styles.messageBubble, message.sender === 'me' ? styles.sentMessage : styles.receivedMessage]}>
            <Text style={styles.messageText}>{message.text}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={{ flexDirection: 'row', marginTop: 20 }}>
        <TextInput
          style={{ flex: 1, marginRight: 10, borderWidth: 1, padding: 10 }}
          value={inputMessage}
          onChangeText={setInputMessage}
          placeholder="Escribe tu mensaje aquí"
        />
        <Button title="Enviar" onPress={handleSendMessage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    paddingBottom: 20,
  },
  messageBubble: {
    maxWidth: '70%',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#5DADE2',
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#EAEAEA',
  },
  messageText: {
    color: 'white',
  },
});

export default ChatScreen;

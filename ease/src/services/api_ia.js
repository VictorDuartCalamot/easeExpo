import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, Button, Text, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_KEY } from '@env';

const OpenIAChat = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const scrollViewRef = useRef();
  const intervalRef = useRef();

  const fetchResponse = async (input) => {
    const cachedResponse = await AsyncStorage.getItem(input);
    const timestamp = new Date().toLocaleTimeString();
    if (cachedResponse) {
      setMessages(prevMessages => [
        ...prevMessages, 
        { role: 'user', content: input, timestamp }, 
        { role: 'ai', content: cachedResponse, timestamp }
      ]);
    } else {
      try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
          model: "gpt-4o",
          messages: [
            { role: "system", content: "You are a helpful financial assistant." },
            { role: "user", content: input }
          ],
          max_tokens: 150,
          temperature: 0.7
        }, {
          headers: {
            'Authorization': `Bearer ${API_KEY}`
          }
        });

        const textResponse = response.data.choices[0].message.content.trim();
        await AsyncStorage.setItem(input, textResponse);
        setMessages(prevMessages => [
          ...prevMessages, 
          { role: 'user', content: input, timestamp }, 
          { role: 'ai', content: textResponse, timestamp }
        ]);
      } catch (error) {
        console.error("Error fetching from OpenAI:", error.response ? error.response.data : error.message);
        if (error.response && error.response.status === 429) {
          console.error("Retry after some time as quota is exceeded");
        }
      }
    }
  };

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (input) {
        fetchResponse(input);
      }
    }, 300000);

    return () => clearInterval(intervalRef.current);
  }, [input]);

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <View style={styles.innerContainer}>
        <ScrollView
          style={styles.scrollView}
          ref={scrollViewRef}
          onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
        >
          {messages.map((message, index) => (
            <View key={index} style={[styles.messageContainer, message.role === 'user' ? styles.userMessageContainer : styles.aiMessageContainer]}>
              <Text style={styles.timestamp}>{message.timestamp}</Text>
              <Text style={[styles.message, message.role === 'user' ? styles.userMessage : styles.aiMessage]}>{message.content}</Text>
            </View>
          ))}
        </ScrollView>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            onChangeText={setInput}
            value={input}
            placeholder="Escribe tu mensaje aquí..."
          />
          <Button
            onPress={() => fetchResponse(input)}
            title="Enviar"
            color="rgb(34, 139, 34)"
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  scrollView: {
    flex: 1,
  },
  messageContainer: {
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 10,
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgb(209, 252, 211)',
  },
  aiMessageContainer: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgb(240, 240, 240)',
  },
  message: {
    padding: 10,
  },
  userMessage: {
    textAlign: 'right',
  },
  aiMessage: {
    textAlign: 'left',
  },
  timestamp: {
    fontSize: 10,
    color: 'gray',
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginRight: 10,
    paddingHorizontal: 10,
  }
});

export default OpenIAChat;
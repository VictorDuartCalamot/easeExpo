import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ScrollView, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';

const ChatBot = () => {
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);
    const [lastUpdateId, setLastUpdateId] = useState(0);

    const botToken = '7058959630:AAFaSxPjntfhimji3YQLR0tjCPVgdrP7gMg';
    const chatId = '6742668375';

    const sendMessage = async () => {
        if (message.trim()) {
            const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}`;
            await fetch(url, { method: 'GET' });
            setChat([...chat, { text: message, from: 'user' }]);
            setMessage('');
        }
    };

    const fetchMessages = async () => {
        const url = `https://api.telegram.org/bot${botToken}/getUpdates?offset=${lastUpdateId + 1}`;
        const response = await fetch(url);
        const data = await response.json();
        if (data.result.length > 0) {
            const newMessages = data.result.map(update => ({
                text: update.message.text,
                from: 'bot'
            }));
            setLastUpdateId(data.result[data.result.length - 1].update_id);
            setChat(prevChat => [...prevChat, ...newMessages]);
        }
    };

    useEffect(() => {
        const interval = setInterval(fetchMessages, 3000);
        return () => clearInterval(interval);
    }, [lastUpdateId]);

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
            <ScrollView style={styles.scrollView}>
                {chat.map((msg, index) => (
                    <Text key={index} style={{ color: msg.from === 'bot' ? 'blue' : 'black', margin: 10 }}>
                        {msg.from === 'bot' ? 'Bot: ' : 'You: '}{msg.text}
                    </Text>
                ))}
            </ScrollView>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={message}
                    onChangeText={setMessage}
                    placeholder="Type your message here..."
                />
                <Button title="Send" onPress={sendMessage}/>
            </View>
        </KeyboardAvoidingView>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    scrollView: {
        flex: 1,
        width: '100%',
        backgroundColor: '#f0f0f0'
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 10
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: 'gray',
        marginRight: 10,
        padding: 10
    }
});

export default ChatBot;
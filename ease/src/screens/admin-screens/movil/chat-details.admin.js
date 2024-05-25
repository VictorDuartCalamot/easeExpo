// ChatDetail.js
import React, { useState, useEffect, useCallback } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';

function ChatDetail({ route }) {
    const { chatId } = route.params;
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        setMessages([
            {
                _id: 1,
                text: 'Este es el comienzo de tu chat con el cliente.',
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: 'Cliente',
                    avatar: 'https://placeimg.com/140/140/any',
                },
            }
        ]);
    }, []);

    const onSend = useCallback((newMessages = []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
    }, []);

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
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
const BASE_URL = 'https://easeapi.onrender.com/api';

export const getOrCreateChat = async () => {
    try {
        const token = await AsyncStorage.getItem('Token');
        if (!token) throw new Error('Token not found');

        const headers = {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
        };

        const response = await axios.post(`${BASE_URL}/chats/get-or-create/`, {}, { headers });

        if (response.status === 200) {
            console.log('Chat found or created successfully:', response.data);
            return response.data;
        } else {
            console.error('Failed to get or create chat:', response.status);
            return null;
        }
    } catch (error) {
        console.error('Error fetching or creating chat:', error);
        return null;
    }
};
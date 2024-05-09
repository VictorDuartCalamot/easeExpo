import React, {useState, useEffect} from "react";
import { View, StyleSheet, Text, TextInput, TouchableOpacity, FlatList } from "react-native"; // Aquí corregí "StyleShee"

const Chat = ({ currentUser, messages, sendMessage }) => {
    const [newMessage, setNewMessage] = useState('');

    const handleSendMessage = () => {
        if(newMessage.trim() !== ""){
            sendMessage(newMessage);
            setNewMessage("");
        }
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={messages}
                renderItem={({ item }) => (
                    <View style={styles.messageContainer}>
                        <Text style={styles.sender}>{item.sender}</Text>
                        <Text style={styles.messageText}>{item.text}</Text>
                    </View>
                )}
                keyExtractor={(item) => item.id.toString()}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="Escribe tu mensaje..."
                    style={styles.input}
                    value={newMessage}
                    onChangeText={setNewMessage}
                />
                <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
                    <Text style={styles.sendButtonText}>Enviar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const AssistanceScreen = ({ navigation }) => {
    const [messages, setMessages] = useState([]);
    const [adviser, setAdviser] = useState(null);
    const [userType, setUserType] = useState('');

    const sendMessage = (message) => {
        const newMessageObj = { id: messages.length + 1, sender: userType === 'admin' ? "Admin" : "Cliente", text: message };
        setMessages([...messages, newMessageObj]);
    };

    const assignAdviser = (admin) => {
        setAdviser(admin);
    };

    useEffect(() => {
        const receivedMessages = [
            { id: 1, sender: "Admin 1", text: "¡Hola! Soy tu asesor. ¿En qué puedo ayudarte?"},
            { id: 2, sender: "Cliente", text: "Necesito ayuda con mi cuenta."},
        ];
        setMessages(receivedMessages);
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Asistencia</Text>
            {/* Mostrar el chat correspondiente según el tipo de usuario */}
            {userType === 'admin' ? (
                <Chat currentUser="Admin" messages={messages} sendMessage={sendMessage} />
            ) : (
                <Chat currentUser="Cliente" messages={messages} sendMessage={sendMessage} />
            )}
            {adviser ? (
                <Text style={styles.adviserText}>Tu asesor: {adviser}</Text>
            ) : (
                <TouchableOpacity onPress={() => assignAdviser("Admin 1")}>
                    <Text style={styles.assignAdviserButton}>Asignar Asesor</Text>
                </TouchableOpacity>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 50,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20,
    },
    messageContainer: {
        padding: 10,
        borderBottomWidth: 1,
        borderColor: "#ccc",
    },
    sender: {
        fontWeight: "bold",
    },
    messageText: {
        marginTop: 5,
    },
    inputContainer: {
        flexDirection: "row",
        marginTop: 20,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
    },
    sendButton: {
        backgroundColor: "blue",
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
        justifyContent: "center",
    },
    sendButtonText: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },
    adviserText: {
        marginTop: 20,
        fontWeight: "bold",
    },
    assignAdviserButton: {
        marginTop: 20,
        marginBottom: 20,
        color: "blue",
        fontWeight: "bold",
    },
});

export default AssistanceScreen;
import React, { useState, useEffect } from "react";
import { View, StyleSheet, Modal, TextInput, Button, Alert, TouchableOpacity, Text } from "react-native";
import { createIncome, getCategories } from "../services/api_management";
import RNPickerSelect from "react-native-picker-select";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const AddIncomeTextInputWeb = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await getCategories();
            const expenseCategories = response.filter(category => category.type === 'income');
            setCategories(expenseCategories);
        } catch (error) {
            console.error("Error fetching categories: ", error);
        }
    };

    const newIncome = async () => {
        const numericAmount = parseFloat(amount.replace(/,/g, '.'));

        if (!numericAmount || isNaN(numericAmount) || numericAmount <= 0) {
            Alert.alert('Invalid Amount', 'Amount must be greater than zero');
            return;
        };

        const date = new Date();
        const newTime = date.toISOString().substring(11, 19);
        const newDate = date.toISOString().substring(0, 10);
        const incomeData = {
            title: title,
            description: description,
            amount: numericAmount,
            creation_date: newDate,
            creation_time: newTime,
            category: category,
        };

        console.log('Sending income data: ', incomeData);

        try {
            const response = await createIncome(incomeData);
            console.log('Income created', response);
            setModalVisible(false);
        } catch (error) {
            console.error('Error creating income:', error);
        }
    };

    const handleCategoryChange = (categoryId) => {
        setCategory(categoryId);
    };

    const handleAddIncome = () => {
        setModalVisible(true);
    };

    return (
        <View>
            <TouchableOpacity style={styles.addIncomeButton} onPress={handleAddIncome}>
                <MaterialCommunityIcons name="card-plus-outline" size={24} color="blue" />
                <Text style={styles.addText}>Add Income</Text>
            </TouchableOpacity>
            <Modal
                animationType="slide"
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                }}
                transparent={true} // Establecer el modal como transparente
            >
                <View style={styles.modalContainer}>
                    <View style={styles.inputContainer}>
                        <View style={styles.formContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Title"
                                onChangeText={setTitle}
                                value={title}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Description"
                                onChangeText={setDescription}
                                value={description}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Amount"
                                keyboardType="numeric"
                                onChangeText={setAmount}
                                value={amount}
                            />
                            <View style={styles.pickerContainer}>
                                <RNPickerSelect
                                    onValueChange={(value) => handleCategoryChange(value)}
                                    items={categories.map(category => ({ label: category.name, value: category.id }))}
                                />
                            </View>
                            <View style={styles.buttonContainer}>
                                <Button title="Add Income" onPress={newIncome} color="blue" />
                            </View>
                            <View style={styles.buttonContainer}>
                                <Button title="Cancel" onPress={() => setModalVisible(false)} color="blue" />
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    addIncomeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo negro transparente
    },
    inputContainer: {
        backgroundColor: 'transparent', // Fondo transparente
        alignItems: 'center', // Centrar elementos horizontalmente
    },
    formContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
    },
    input: {
        height: 40,
        width: 300,
        margin: 12,
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',

    },
    pickerContainer: {
        width: 300,
        marginVertical: 10,
        alignSelf:"center",
    },
    buttonContainer: {
        marginBottom: 5,
        marginTop: 5,
        width: 300,
        alignSelf:"center"
    },
    addText: {
        color: 'blue',
        marginLeft: 5,
    },
});

export default AddIncomeTextInputWeb;

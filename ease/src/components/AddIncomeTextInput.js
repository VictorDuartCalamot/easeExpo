import React, { useState, useEffect } from "react";
import { View, StyleSheet, Modal, TextInput, Button, Alert } from "react-native";
import { createIncome, getCategories } from "../services/api_management";
import RNPickerSelect from "react-native-picker-select";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const AddIncomeTextInput = () => {
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
            setCategories(response);
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
            <MaterialCommunityIcons name="card-plus-outline" size={24} color="black" onPress={handleAddIncome} />
            <Modal
                animationType="slide"
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                }}
            >
                <View style={styles.modalContainer}>
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
                        <Button title="Add Income" onPress={newIncome} />
                    </View>
                    <View style={styles.buttonContainer}>
                        <Button title="Cancel" onPress={() => setModalVisible(false)} />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    input: {
        height: 40,
        width: '80%',
        margin: 12,
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
    },
    pickerContainer: {
        width: '80%',
        marginVertical: 10,
    },
    buttonContainer: {
        marginBottom: 5,
        marginTop: 5,
    },
});

export default AddIncomeTextInput;
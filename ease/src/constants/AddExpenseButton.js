import React, { useState, useEffect } from "react";
import { View, StyleSheet, Modal, TextInput, Button, Alert, Text, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { createExpense, getCategories, getSubCategories } from "../services/api_management";
import { AntDesign } from "@expo/vector-icons";
import RNPickerSelect from "react-native-picker-select";

const AddExpenseButton = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [subCategory, setSubCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await getCategories();
            const expenseCategories = response.filter(category => category.type === 'expense');
            setCategories(expenseCategories);
        } catch (error) {
            console.error("Error fetching categories: ", error);
        }
    };

    const fetchSubCategories = async (categoryId) => {
        try {
            const response = await getSubCategories({ category_id: categoryId });
            setSubCategories(response);
        } catch (error) {
            console.error("Error fetching subcategories: ", error);
        }
    };

    const newExpense = async () => {
        const numericAmount = parseFloat(amount.replace(/,/g, '.'));

        if (!numericAmount || isNaN(numericAmount) || numericAmount <= 0) {
            Alert.alert('Invalid Amount', 'Amount must be greater than zero');
            return;
        }

        const date = new Date();
        const newTime = date.toISOString().substring(11, 19).toString();
        const newDate = date.toISOString().substring(0, 10).toString();
        const expenseData = {
            title: title,
            description: description,
            amount: numericAmount,
            creation_date: newDate,
            creation_time: newTime,
            category: category,
            subcategory: subCategory,
        };

        console.log('Sending expense data:', expenseData);

        try {
            const response = await createExpense(expenseData);
            console.log('Expense created:', response);
            setModalVisible(false);
        } catch (error) {
            console.error('Error creating expense:', error.response.data);
        }
    };

    const handleCategoryChange = (categoryId) => {
        setCategory(categoryId);
        fetchSubCategories(categoryId);
    };

    const handleAddExpense = () => {
        setModalVisible(true);
    };

    return (
        <View>
            <TouchableOpacity style={styles.addButton} onPress={handleAddExpense}>
                <AntDesign name="pluscircleo" size={24} color="black" />
                <Text style={styles.addButtonText}>Add Expense</Text>
            </TouchableOpacity>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                    <View style={styles.modalBackground}>
                        <TouchableWithoutFeedback>
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
                                {subCategories.length > 0 && (
                                    <View style={styles.pickerContainer}>
                                        <RNPickerSelect
                                            onValueChange={(value) => setSubCategory(value)}
                                            items={subCategories.map(subCategory => ({ label: subCategory.name, value: subCategory.id }))}
                                        />
                                    </View>
                                )}
                                <View style={styles.buttonContainer}>
                                    <Button title="Add Expense" onPress={newExpense} />
                                </View>
                                <View style={styles.buttonContainer}>
                                    <Button title="Cancel" onPress={() => setModalVisible(false)} />
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    )
};

const styles = StyleSheet.create({
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    addButtonText: {
        marginLeft: 5,
        fontSize: 16,
        color: 'black',
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '80%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
    },
    input: {
        height: 40,
        width: '100%',
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

export default AddExpenseButton;
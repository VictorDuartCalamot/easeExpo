import React, { useState, useEffect } from "react";
import { View, StyleSheet, Modal, TextInput, Button, Alert, Text, TouchableOpacity, } from "react-native";
import { createExpense, getCategories, getSubCategories } from "../services/api_management";
import { AntDesign } from "@expo/vector-icons";
import RNPickerSelect from "react-native-picker-select";

const AddExpenseButtonWeb = () => {
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
                <AntDesign name="pluscircleo" size={24} color="blue" />
                <Text style={styles.addText}>  Add Expense</Text>
            </TouchableOpacity>
            <Modal
                animationType="slide"
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                }}
                transparent={true}
            >
                <View style={[styles.modalContainer, styles.modalContent]}>
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
                        {subCategories.length > 0 && (
                            <View style={styles.pickerContainer}>
                                <RNPickerSelect
                                    onValueChange={(value) => setSubCategory(value)}
                                    items={subCategories.map(subCategory => ({ label: subCategory.name, value: subCategory.id }))}
                                />
                            </View>
                        )}
                        <View style={styles.buttonGroup}>
                            <Button title="Add Expense" onPress={newExpense} color="blue" />
                            <Button title="Cancel" onPress={() => setModalVisible(false)} color="blue" />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'transparent',
        padding: 10,
    },
    addText: {
        color: 'blue',
        marginRight: 5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    modalContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo negro transparente
    },
    formContainer: {
        backgroundColor: 'white', // Fondo blanco
        padding: 20, // Ajustar el padding según sea necesario
        borderRadius: 10, // Bordes redondeados
    },
    input: {
        height: 30,
        width: 300, // Modificar el ancho para que ocupe todo el contenedor
        marginVertical: 6, // Ajustar el margen vertical
        padding: 8,
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
    },
    pickerContainer: {
        width: 300, // Modificar el ancho para que ocupe todo el contenedor
        marginVertical: 8,
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        width: 300, // Modificar el ancho para que ocupe todo el contenedor
    },
});

export default AddExpenseButtonWeb;
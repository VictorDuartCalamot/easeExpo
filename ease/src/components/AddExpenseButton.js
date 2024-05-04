import React, { useState, useEffect } from "react";
import { View, StyleSheet, Modal, TextInput, Button, Alert } from "react-native";
import { createExpense, getCategories, getSubCategories } from "../services/api_management";
import { AntDesign } from "@expo/vector-icons";
import SelectedOptionPicker from "selected-option-picker";

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
        try{
            const response = await getCategories();
            setCategories(response.data);
        }catch(error){
            console.error("Error fetching categories: ", error);
        }
    };

    const fetchSubCategories = async (categoryId) => {
        try{
            const response = await getSubCategories({ category: categoryId });
            setSubCategories(response.data);
        }catch(error){
            console.error("Error fetching subcategories: ", error);
        }
    };

    const newExpense = async () => {
        if(parseFloat(amount) <= 0){
            Alert.alert('Invalid Amount', 'Amount must be greater than zero');
            return;
        }

        const date = new Date();
        const newTime = date.toISOString().substring(11, 19).toString();
        const newDate = date.toISOString().substring(0, 10).toString();
        createExpense({ 
            title:title, 
            descriptio:description, 
            amount:amount, 
            category:category, 
            subCategory: subCategory,
            newDate:newDate, 
            newTime:newTime
        });
        setModalVisible(false);
        console.log('New Expense Added: ');
        console.log('Title:', title);
        console.log('Description:', description);
        console.log('Amount:', amount);
        console.log('Category:', category);
        console.log('Subcategory:', subCategory);
        console.log('Date:', newDate);
        console.log('Time:', newTime);
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
            <AntDesign name="pluscircleo" size={24} color="black" onPress={handleAddExpense}/>
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
                        <Button title="Select Category" onPress={() => setShowCategoryPicker(true)} />
                        <SelectedOptionPicker
                            data={categories}
                            showPicker={showCategoryPicker}
                            onDonePress={() => setShowCategoryPicker(false)}
                            onCancelPress={() => setShowCategoryPicker(false)}
                            onItemChange={(option) => handleCategoryChange(option.value)}
                        />
                    </View>
                    <View style={styles.pickerContainer}>
                        <Button title="Select Subcategory" onPress={() => setShowSubCategoryPicker(true)} />
                        <SelectedOptionPicker
                            data={subCategories}
                            showPicker={showSubCategoryPicker}
                            onDonePress={() => setShowSubCategoryPicker(false)}
                            onCancelPress={() => setShowSubCategoryPicker(false)}
                            onItemChange={(option) => setSubCategory(option.value)}
                        />
                    </View>
                    <View style={styles.buttonContainer}>
                        <Button title="Add Expense" onPress={newExpense}/>
                    </View>
                    <View style={styles.buttonContainer}>
                        <Button title="Cancel" onPress={() => setModalVisible(false)}/>
                    </View>
                </View>
            </Modal>
        </View>
    )
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

export default AddExpenseButton;
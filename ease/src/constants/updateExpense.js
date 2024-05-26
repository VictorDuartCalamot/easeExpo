import React, {useState, useEffect} from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Button } from "react-native";
import { getOneExpense, updateExpense, getCategories, getSubCategories } from "../services/api_management";
import { MaterialIcons } from "@expo/vector-icons";
import RNPickerSelect from "react-native-picker-select";

const UpdateExpense = ({idExpense}) => {
    const [expense, setExpense] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [subCategory, setSubCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        fetchExpense();
        fetchCategories();
    }, []);

    const fetchExpense = async () => {
        try{
            const response = await getOneExpense(idExpense);
            setExpense(response);
        }catch(error){
            console.error("Error fetching expense:", error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await getCategories();
            const expenseCategories = response.filter(category => category.type == 'expense');
            setCategories(expenseCategories);
        }catch(error){
            console.error("Error fetching category:", error);
        }
    };

    const fetchSubCategories = async (categoryId) => {
        try{
            const response = await getSubCategories({ category_id: categoryId});
            setSubCategories(response);
        }catch(error){
            console.error("Error fetching subcategory:", error);
        }
    };

    const updateExpenses = async () => {
        const numericAmount = parseFloat(amount.replace(/,/g, '.'));

        if(!numericAmount || isNaN(numericAmount) || numericAmount <= 0){
            Alert.alert('Invalid Amount', 'Amount must be greater than zero');
            return;
        };

        const date = new Date();
        const newTime = date.toISOString().substring(11, 19).toString();
        const newDate = date.toISOString().substring(0, 10).toString();
        const newExpenseData = {
            title: title,
            description: description,
            amount: numericAmount,
            creation_date: newDate,
            creation_time: newTime,
            category: category,
            subcategory: subCategory,
        };
        console.log('Sending new expense data:', newExpenseData);

        try{
            const response = await updateExpense(newExpenseData, idExpense);
            console.log('Expense update:', response);
            setModalVisible(false);
        }catch(error){
            console.error('Error updating expense:', error.response.data);
        }
    };

    const handleCategoryChange = (categoryId) => {
        setCategory(categoryId)
        fetchSubCategories(categoryId);
    };

    const handleUpdateExpense = () => {
        setModalVisible(true);
    };

    return (
        <View>
            <TouchableOpacity style={styles.updateButton} onPress={handleUpdateExpense}>
                <MaterialIcons name="update" size={24} color={blue}/>
                <Text style={styles.updateText}>Update Expense</Text>
            </TouchableOpacity>
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
                        placeholder={expense.title}
                        onChangeText={setTitle}
                        value={title}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder={expense.description}
                        onChangeText={setDescription}
                        value={description}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder={expense.amount}
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
                        <Button title="Update Expense" onPress={updateExpenses}/>
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
    updateText: {
        color: 'blue',
        marginRight: 5,
    },
    updateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'transparent',
        padding: 10,
    },
});

export default UpdateExpense;
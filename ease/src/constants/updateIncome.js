import React, {useState, useEffect} from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Button } from "react-native";
import { getOneIncome, updateIncome, getCategories } from "../services/api_management";
import { MaterialIcons } from "@expo/vector-icons";
import RNPickerSelect from "react-native-picker-select";

const UpdateIncome = ({idIncome}) => {
    const [income, setIncome] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        fetchIncome();
        fetchCategories();
    }, []);

    const fetchIncome = async () => {
        try {
            const response = await getOneIncome(idIncome);
            setIncome(response);
        }catch(error){
            console.error("Error fetching income:", error)
        }
    }

    const fetchCategories = async () => {
        try {
            const response = await getCategories();
            const expenseCategories = response.filter(category => category.type === 'income');
            setCategories(expenseCategories);
        } catch (error) {
            console.error("Error fetching categories: ", error);
        }
    };

    const updateIncomes = async () => {
        const numericAmount = parseFloat(amount.replace(/,/g, '.'));

        if (!numericAmount || isNaN(numericAmount) || numericAmount <= 0) {
            Alert.alert('Invalid Amount', 'Amount must be greater than zero');
            return;
        };

        const date = new Date();
        const newTime = date.toISOString().substring(11, 19);
        const newDate = date.toISOString().substring(0, 10);
        const updateIncomeData = {
            title: title,
            description: description,
            amount: numericAmount,
            creation_date: newDate,
            creation_time: newTime,
            category: category,
        };

        console.log('Sending income data: ', updateIncomeData);

        try {
            const response = await updateIncome(updateIncomeData, idIncome);
            console.log('Income updated', response);
            setModalVisible(false);
        }catch(error){
            console.error('Error updating income:', error);
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
            <TouchableOpacity style={styles.updateIncomeButton} onPress={handleAddIncome}>
                <MaterialIcons name="update" size={24} color="blue" />
                <Text style={styles.updateText}>Add Income</Text>
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
                        placeholder={income.title}
                        onChangeText={setTitle}
                        value={title}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder={income.description}
                        onChangeText={setDescription}
                        value={description}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder={income.amount}
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
                        <Button title="Update Income" onPress={updateIncomes} />
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
    updateIncomeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
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
        marginLeft: 5,
    },
});

export default UpdateIncome;
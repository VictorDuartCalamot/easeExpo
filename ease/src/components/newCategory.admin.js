import React, {useState} from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { createCategory } from "../services/api_management";
import { useNavigation } from "@react-navigation/native";
import RNPickerSelect from 'react-native-picker-select';

const typeOptions = [
    { label: 'Ocio', value: 'ocio' },
    { label: 'Trabajo', value: 'trabajo' },
    { label: 'Personal', value: 'personal' },
];

const colorOptions = [
    { label: 'Rojo', value: '#FF0000' },
    { label: 'Verde', value: '#00FF00' },
    { label: 'Azul', value: '#0000FF' },
    { label: 'Amarillo', value: '#FFFF00' },
    { label: 'Naranja', value: '#FFA500' },
    { label: 'Violeta', value: '#EE82EE' },
    { label: 'Negro', value: '#000000' },
    { label: 'Blanco', value: '#FFFFFF' },
];

const NewCategory = () => {
    const navigation = useNavigation();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('');
    const [color, setColor] = useState('');

    const handleCancel = () => {
        navigation.goBack();
    };

    const handleSave = async () => {
        try {
            const categoryData = {
                name: name,
                description: description,
                type: type,
                hexColor: color,
            };
            await createCategory(categoryData);
            navigation.goBack();
        }catch(error){
            console.error("Error creating new category: ", error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>New Category</Text>
            <TextInput
                style={styles.input}
                placeholder="Name"
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={styles.input}
                placeholder="Description"
                value={description}
                onChangeText={setDescription}
            />
            <RNPickerSelect
                onValueChange={(value)=>setType(value)}
                items={typeOptions}
                placeholder={{ label: 'Select a type...', value: null}}
                style={pickerSelectStyles}
            />
            <RNPickerSelect
                onValueChange={(value)=>setColor(value)}
                items={colorOptions}
                placeholder={{ label: 'Select a color...', value: null}}
                style={pickerSelectStyles}
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    input: {
        width: "80%",
        height: 40,
        borderWidth: 1,
        borderColor: "gray",
        marginBottom: 20,
        paddingLeft: 10,
        fontSize: 16,
    },
    colorPicker: {
        width: "80%",
        height: 150,
        marginBottom: 20,
    },
    saveButton: {
        backgroundColor: "blue",
        width: 100,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
        borderRadius: 5,
    },
    cancelButton: {
        backgroundColor: "gray",
        width: 100,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
    },
    buttonText: {
        color: "white",
        fontSize: 16,
    },
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
        backgroundColor: 'white',
        marginBottom: 20,
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        borderColor: 'purple',
        borderRadius: 8,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
        backgroundColor: 'white',
        marginBottom: 20,
    },
})

export default NewCategory;
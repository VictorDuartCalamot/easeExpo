import React, {useState, useEffect} from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { createSubCategory, getCategories } from "../services/api_management";
import { useNavigation } from "@react-navigation/native";
import RNPickerSelect from 'react-native-picker-select';

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

const NewSubCategory = () => {
    const navigation = useNavigation();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [color, setColor]  = useState('');
    const [category, setCategory] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categoryData = await getCategories();
                if (!Array.isArray(categoryData)) {
                    // Si los datos no son un array, muestra un mensaje de error
                    console.error("Error: los datos de categoría no son un array");
                    return; // Detiene la ejecución de la función
                }
                setCategory(categoryData); // Establece los datos de categoría en el estado
            } catch(error) {
                // Maneja el error de la solicitud
                console.error("Error fetching categories: ", error);
                // Podrías mostrar un mensaje de error o tomar otras acciones según lo necesites
            }
        };        

        fetchCategories();
    }, []);

    const handleCancel = () => {
        navigation.goBack();
    };

    const handleSave = async () => {
        try {
            const subCategoryData = {
                name: name,
                description: description,
                hexColor: color,
                category: selectedCategory,
            };
            await createSubCategory(subCategoryData);
            navigation.goBack();
        }catch(error){
            console.error("Error creating new subcategory: ", error);
        };
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>New Subcategory</Text>
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
                onValueChange={(value)=>setColor(value)}
                items={colorOptions}
                placeholder={{label: 'select a color...', value: null}}
                style={pickerSelectStyles}
            />
            <RNPickerSelect
                onValueChange={(value) => setSelectedCategory(value)}
                items={category.map(cat => ({ label: cat.name, value: cat.id }))}
                placeholder={{ label: 'select a category...', value: null }}
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

};

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

export default NewSubCategory;
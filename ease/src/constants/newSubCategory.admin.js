import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ImageBackground } from "react-native";
import { createSubCategory, getCategories } from "../services/api_management";
import { useNavigation } from "@react-navigation/native";
import RNPickerSelect from 'react-native-picker-select';

const isValidHexColor = (hex) => {
    const hexRegex = /^#?([A-Fa-f0-9]{6})$/;
    return hexRegex.test(hex);
};

const NewSubCategory = () => {
    const navigation = useNavigation();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [color, setColor] = useState('');
    const [category, setCategory] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categoryData = await getCategories();
                if (!Array.isArray(categoryData)) {
                    console.error("Error: los datos de categoría no son un array");
                    return;
                }
                setCategory(categoryData);
            } catch (error) {
                console.error("Error fetching categories: ", error);
            }
        };

        fetchCategories();
    }, []);

    const handleCancel = () => {
        navigation.goBack();
    };

    const handleSave = async () => {
        try {
            if (!isValidHexColor(color)) {
                Alert.alert("Invalid Color", "Please enter a valid hex color code.");
                return;
            }

            const hexColor = color.startsWith('#') ? color : `#${color}`;

            const subCategoryData = {
                name: name,
                description: description,
                hexColor: hexColor,
                category: selectedCategory,
            };
            await createSubCategory(subCategoryData);
            navigation.goBack();
        } catch (error) {
            console.error("Error creating new subcategory: ", error);
        }
    };

    return (
        <ImageBackground source={require('../pictures/fondo2.jpg')} style={styles.background}>
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
            <TextInput
                style={styles.input}
                placeholder="Hex Color (e.g., FFFFFF)"
                value={color}
                onChangeText={setColor}
                maxLength={6}
            />
            <View style={styles.pickerContainer}>
                <RNPickerSelect
                    onValueChange={(value) => setSelectedCategory(value)}
                    items={category.map(cat => ({ label: cat.name, value: cat.id }))}
                    placeholder={{ label: 'Select a category...', value: null }}
                />
            </View>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
        </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
    },
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
    pickerContainer: {
        width: '80%',
        marginVertical: 10,
    },
});

export default NewSubCategory;
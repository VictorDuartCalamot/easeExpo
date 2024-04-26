import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Menu = () => {
    const navigation = useNavigation();
    const [menuVisible, setMenuVisible] = useState(false);

    const toggleMenu = () => {
        setMenuVisible(!menuVisible);
    }

    const handleHomePress = () => {
        navigation.navigate('Home');
        console.log('Go to Categories');
    }

    const handleSummaryPress = () => {
        navigation.navigate('Summary')
        console.log('Go to Summary');
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={toggleMenu} style={styles.avatar}>
                <Ionicons name="menu" size={40} color="black"/>
            </TouchableOpacity>
            {menuVisible && (
                <View style={styles.menu}>
                    <TouchableOpacity style={styles.menuItem} onPress={handleHomePress}>
                        <MaterialIcons name="data-usage" size={24} color="black"/>
                        <Text style={styles.menuItemText}>Categories</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem} onPress={handleSummaryPress}>
                        <MaterialIcons name="description" size={24} color="black"/>
                        <Text style={styles.menuItemText}>Summary</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        marginTop: 20,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    menu: {
        position: 'absolute',
        top: 70,
        right: 0,
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
        elevation: 3,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    menuItemText: {
        marginLeft: 10,
    },
});

export default Menu;
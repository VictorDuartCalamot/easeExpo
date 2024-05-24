import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { EvilIcons, MaterialIcons } from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';

const AvatarUser = () => {
    const navigation = useNavigation();
    const [menuVisible, setMenuVisible] = useState(false);

    const toggleMenu = () => {
        setMenuVisible(!menuVisible);
    }

    const handleAccountPress = () => {
        navigation.navigate('Profile');
        console.log('Go to Account');
    }

    const handleLogoutPress = () => {
        navigation.navigate('Login');
        console.log('Logout')
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={toggleMenu} style={styles.avatar}>
                <EvilIcons name="user" size={40} color="black"/>
            </TouchableOpacity>
            {menuVisible && (
                <View style={styles.menu}>
                    <TouchableOpacity style={styles.menuItem} onPress={handleAccountPress}>
                        <MaterialIcons name="account-circle" size={24} color="black"/>
                        <Text style={styles.menuItemText}>Account</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem} onPress={handleLogoutPress}>
                        <MaterialIcons name="exit-to-app" size={24} color="black"/>
                        <Text style={styles.menuItemText}>Logout</Text>
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

export default AvatarUser;

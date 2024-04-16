import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { EvilIcons, MaterialIcons } from '@expo/vector-icons';

const AvatarUser = ({navigation}) => {
    const [menuVisible, setMenuVisible] = useState(false);

    const toggleMenu = () => {
        setMenuVisible(!menuVisible);
    };

    const handleAccountPress = () => {
        navigation.navigate('Profile');
        console.log('Go to Account');
    };

    const handleLogoutPress = () => {
        navigation.navigate('Login');
        console.log('Logout')
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={toggleMenu} style={styles.avatar}>
                <EvilIcons name="user" size={24} color="black"/>
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
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    menu: {
        position: 'absolute',
        top: 50,
        right: 0,
        backgroundColor: 'white',
        padding: 5,
        borderRadius: 5,
        elevation: 3,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
        paddingHorizontal: 10,
    },
    menuItemText: {
        marginLeft: 10,
    },
});

export default AvatarUser;

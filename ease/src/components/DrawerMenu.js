import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { DrawerLayoutAndroid } from "react-native";

const DrawerMenu = ({ navigation, children }) => {
    const drawerRef = React.useRef(null);

    const openDrawer = () => {
        drawerRef.current.openDrawer();
    };

    const navigateToScreen = (screenName) => {
        navigation.navigate(screenName);
        drawerRef.current.closeDrawer();
    };

    const navigationView = (
        <View style={styles.drawer}>
            <Text style={styles.menuItem} onPress={() => navigateToScreen('Home')}>Home</Text>
            <Text style={styles.menuItem} onPress={() => navigateToScreen('Profile')}>Profile</Text>
            <Text style={styles.menuItem} onPress={() => navigateToScreen('Settings')}>Settings</Text>
            <Text style={styles.menuItem} onPress={() => navigateToScreen('Login')}>Logout</Text>
        </View>
    );

    return (
        <DrawerLayoutAndroid
            ref={drawerRef}
            drawerWidth={300}
            drawerPosition="left"
            renderNavigationView={() => navigationView}
        >
            <TouchableOpacity onPress={openDrawer} style={styles.menuButton}>
                <Text style={styles.menuButtonText}>☰</Text>
            </TouchableOpacity>
            {children}
        </DrawerLayoutAndroid>
    )

}

const styles = StyleSheet.create({
    drawer: {
        flex: 1,
        padding: 15,
    },
    menuItem: {
        fontSize: 18,
        padding: 10,
        borderBottomWidth: 1,
    },
    menuButton: {
        position: 'absolute',
        top: 10,
        left: 10,
        zIndex: 10,
    },
    menuButtonText: {
        fontSize: 24,
        color: 'black'
    },
});

export default DrawerMenu;
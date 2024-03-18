import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { DrawerLayoutAndroid } from "react-native";

const DrawerMenuAdmin = ({ navigation, children }) => {
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
            <Text style={styles.menuItem} onPress={() => navigateToScreen('usersList')}>Users List</Text>
            <Text style={styles.menuItem} onPress={() => navigateToScreen('userData')}>User Data</Text>
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

export default DrawerMenuAdmin;
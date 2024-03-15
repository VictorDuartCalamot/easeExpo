import React from "react";
import { View, Text, StyleSheet } from "react-native";
import DrawerMenu from "../components/DrawerMenu";

function ProfileScreen({navigation}) {
    return (
        <DrawerMenu navigation={navigation}>
            <View style={styles.container}>
                <Text style={styles.title}>ProfileScreen</Text>
            </View>
        </DrawerMenu>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
      fontSize: 24,
    },
})

export default ProfileScreen;
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import DrawerMenu from "../components/DrawerMenu";
import { View, Text, StyleSheet, Settings } from "react-native";
import DrawerMenu from "../components/DrawerMenu";

function SettingScreen({ navigation }) {
function SettingsScreen({navigation}) {
    return (
        <DrawerMenu navigation={navigation}>
            <View style={styles.container}>
                <Text style={styles.title}>Setting Screen</Text>
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

export default SettingScreen;

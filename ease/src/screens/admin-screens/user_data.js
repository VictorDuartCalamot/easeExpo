import React from "react";
import { View, Text, StyleSheet } from "react-native";

function UserData ({ navigation }) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>User Data</Text>
        </View>
    )
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

export default UserData;
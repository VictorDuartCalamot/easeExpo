import React from "react";
import { View, Text, StyleSheet } from "react-native";

function AdminScreen({navigation}) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>AdminScreen</Text>
        </View>
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

export default AdminScreen;
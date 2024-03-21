import React from "react";
import { View, Text, StyleSheet } from "react-native";

function SummaryScreen() {
    return(
        <View style={styles.container}>
            <Text style={styles.title}>Summary Screen</Text>
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

export default SummaryScreen;
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import OptionSupport from "../components/optionSelectedSupport";

function SupportScreen() {
    return(
        <View style={styles.container}>
            <Text style={styles.title}>Support Screen</Text>
            <OptionSupport/>
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

export default SupportScreen;
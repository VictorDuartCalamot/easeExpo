import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import COLORS from "../styles/js/colors";

const Button = (props) => {
    const filledBgColor = props.color || COLORS.primary;
    const outlineColor = COLORS.white;
    const bgColor = props.filled ? filledBgColor : outlineColor;
    const textColor = props.filed? COLORS.white : COLORS.primary;
    return (
        <TouchableOpacity 
            style={{
                ...styles.button
            }}
            onPress={props.onPress}
        >
            <Text style={{fontSize: 18, ... { color: textColor } }}>{props.title}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button:{
        paddingBottom: 10,
        paddingVertical: 10,
        borderColor: COLORS.primary,
        borderWidth: 2,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default Button
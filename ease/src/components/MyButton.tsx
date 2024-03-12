import React, { FC } from "react";
import { Text, TouchableOpacity } from 'react-native';
import { myButtonStyles } from "../styles/js/myButtonStyles";

interface Props {
    title: String
}

export const MyButton:  FC<Props> = ({title}) => {
    return (
        <TouchableOpacity style={myButtonStyles.container}>
            <Text style={myButtonStyles.title}>{title}</Text>
        </TouchableOpacity>
    )
}
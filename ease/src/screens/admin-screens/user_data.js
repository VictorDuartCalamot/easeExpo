import React from "react";
import { View, Text } from "react-native";
import DrawerMenuAdmin from "../../components/DrawerMenu-admin";

const userData = ({ navigation }) => {
    return (
        <DrawerMenuAdmin navigation={navigation}>
            <View>
                <Text>User Data</Text>
            </View>
        </DrawerMenuAdmin>
    )
}

export default userData;
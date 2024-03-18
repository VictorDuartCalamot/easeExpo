import React from "react";
import { View, Text } from "react-native";
import DrawerMenuAdmin from "../../components/DrawerMenu-admin";

const usersList = ({ navigation }) => {
    return (
        <DrawerMenuAdmin navigation={navigation}>
            <View>
                <Text>Users List</Text>
            </View>
        </DrawerMenuAdmin>
    )
}

export default usersList;
import React from "react";
import { View, Text } from "react-native";
import DrawerMenuAdmin from "../components/DrawerMenu-admin";

function AdminScreen({navigation}) {
    return (
        <DrawerMenuAdmin navigation={navigation}>
            <View>
                <Text>AdminScreen</Text>
            </View>
        </DrawerMenuAdmin>
    );
}

export default AdminScreen;
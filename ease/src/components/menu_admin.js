import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { Platform, View, StyleSheet } from "react-native";
import UserData from "../screens/admin-screens/user_data";
import UsersList from "../screens/admin-screens/users_list";
import AdminScreen from "../screens/admin_screen";

const Tab = Platform.OS === 'web' ? createMaterialTopTabNavigator() : createBottomTabNavigator();

const MenuAdmin = () => {
    return(
        <View style={styles.container}>
            <Tab.Navigator>
                <Tab.Screen
                    name="Admin"
                    component={AdminScreen}
                    options={{
                        tabBarLabel: 'Admin',
                        tabBarIcon: ({ color, size }) => (
                            <MaterialIcons name="admin-panel-settings" size={size} color={color}/>
                        ),
                        headerShown: false
                    }}
                />
                <Tab.Screen
                    name="User Data"
                    component={UserData}
                    options={{
                        tabBarLabel: 'User Data',
                        tabBarIcon: ({ color, size }) => (
                            <FontAwesome5 name="user-edit" size={size} color={color}/>
                        ),
                        headerShown: false
                    }}
                />
                <Tab.Screen
                    name="Users List"
                    component={UsersList}
                    options={{
                        tabBarLabel: 'Users List',
                        tabBarIcon: ({ color, size }) => (
                            <FontAwesome5 name="users" size={size} color={color}/>
                        ),
                        headerShown: false
                    }}
                />
            </Tab.Navigator>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
    },
});

export default MenuAdmin
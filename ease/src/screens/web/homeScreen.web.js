import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer"; // Importamos createDrawerNavigator
import { MaterialIcons } from "@expo/vector-icons";
import { Platform, View, StyleSheet } from "react-native";
import HomeScreen from "./adminScreen.web";
import SettingsScreen from "./settingsScreen.web";
import SummaryScreen from "./summaryScreen.web";

const Tab = Platform.OS === 'web' ? createMaterialTopTabNavigator() : createBottomTabNavigator();
const Drawer = createDrawerNavigator(); // Creamos el Drawer Navigator

const Menu = () => {
    return(
        <Drawer.Navigator initialRouteName="Category"> 
            <Drawer.Screen
                name="Category"
                component={TabNavigator}
                options={{
                    drawerLabel: 'Category',
                    drawerIcon: ({ color, size }) => ( 
                        <MaterialIcons name="data-usage" size={size} color={color}/>
                    ),
                }}
            />
            <Drawer.Screen
                name="Setting"
                component={SettingsScreen}
                options={{
                    drawerLabel: 'Setting',
                    drawerIcon: ({ color, size }) => (
                        <MaterialIcons name="settings" size={size} color={color}/>
                    ),
                }}
            />
            <Drawer.Screen
                name="Summary"
                component={SummaryScreen}
                options={{
                    drawerLabel: 'Summary',
                    drawerIcon: ({ color, size }) => (
                        <MaterialIcons name="description" size={size} color={color}/>
                    ),
                }}
            />
        </Drawer.Navigator>
    )
};

const TabNavigator = () => (
    <Tab.Navigator>
        <Tab.Screen
            name="Category"
            component={HomeScreen}
            options={{
                tabBarLabel: 'Category',
                tabBarIcon: ({ color, size }) => (
                    <MaterialIcons name="data-usage" size={size} color={color}/>
                ),
                headerShown: false,
            }}
        />
        <Tab.Screen
            name="Setting"
            component={SettingsScreen}
            options={{
                tabBarLabel: 'Setting',
                tabBarIcon: ({ color, size }) => (
                    <MaterialIcons name="settings" size={size} color={color}/>
                ),
                headerShown: false
            }}
        />
        <Tab.Screen
            name="Summary"
            component={SummaryScreen}
            options={{
                tabBarLabel: 'Summary',
                tabBarIcon: ({ color, size }) => (
                    <MaterialIcons name="description" size={size} color={color}/>
                ),
                headerShown: false
            }}
        />
    </Tab.Navigator>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
    },
});

export default Menu;

import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { MaterialIcons } from "@expo/vector-icons";
import { Platform, View, StyleSheet } from "react-native";
import HomeScreen from "../screens/home_screen";
import SettingsScreen from "../screens/settings_screen";
import SummaryScreen from "../screens/summary_screen";

const Tab = Platform.OS === 'web' ? createMaterialTopTabNavigator() : createBottomTabNavigator();

const Menu = () => {
    return(
        <View style={styles.container}>
            <Tab.Navigator>
                <Tab.Screen
                    name="Category"
                    component={HomeScreen}
                    options={{
                        tabBarLabel: 'Category',
                        tabBarIcon: ({ color, size }) => (
                            <MaterialIcons name="data-usage" size={size} color={color}/>
                        ),
                        headerShown: false
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
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
    },
});

export default Menu;
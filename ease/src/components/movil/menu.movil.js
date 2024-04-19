import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";
import { View, StyleSheet } from "react-native";
import HomeScreenMovil from "../../screens/movil/homeScreen.movil";
import SettingsScreenMovil from "../../screens/movil/settingsScreen.movil";
import SummaryScreenMovil from "../../screens/movil/summaryScreen.movil";
import AvatarUser from "../avatar_user";

const Tab = createBottomTabNavigator();

const MenuMovil = () => {
    return (
        <View style={styles.container}>
          <Tab.Navigator>
            <Tab.Screen
              name="Home"
              component={HomeScreenMovil}
              options={{
                tabBarLabel: "Home",
                tabBarIcon: ({ color, size }) => (
                  <MaterialIcons name="home" size={size} color={color} />
                ),
                headerRight: AvatarUser,
              }}
            />
            <Tab.Screen
              name="Settings"
              component={SettingsScreenMovil}
              options={{
                tabBarLabel: "Settings",
                tabBarIcon: ({ color, size }) => (
                  <MaterialIcons name="settings" size={size} color={color} />
                ),
                headerRight: AvatarUser,
              }}
            />
            <Tab.Screen
              name="Summary"
              component={SummaryScreenMovil}
              options={{
                tabBarLabel: "Summary",
                tabBarIcon: ({ color, size }) => (
                  <MaterialIcons name="description" size={size} color={color} />
                ),
                headerRight: AvatarUser,
              }}
            />
          </Tab.Navigator>
        </View>
      );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "flex-end",
    },
});

export default MenuMovil
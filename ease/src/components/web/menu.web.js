import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { View, StyleSheet } from "react-native";
import HomeScreenWeb from "../../screens/web/homeScreen.web";
import SettingsScreenWeb from "../../screens/web/settingsScreen.web";
import SummaryScreenWeb from "../../screens/movil/summaryScreen.movil";
import AvatarUser from "../avatar_user";

const Drawer = createDrawerNavigator();

const MenuWeb = () => {
    return (
        <View style={styles.container}>
          <Drawer.Navigator>
            <Drawer.Screen
              name="Home"
              component={HomeScreenWeb}
              options={{
                drawerLabel: "Home",
                drawerIcon: ({ color, size }) => (
                  <MaterialIcons name="home" size={size} color={color} />
                ),
                headerRight: AvatarUser,
              }}
            />
            <Drawer.Screen
              name="Settings"
              component={SettingsScreenWeb}
              options={{
                drawerLabel: "Settings",
                drawerIcon: ({ color, size }) => (
                  <MaterialIcons name="settings" size={size} color={color} />
                ),
                headerRight: AvatarUser,
              }}
            />
            <Drawer.Screen
              name="Summary"
              component={SummaryScreenWeb}
              options={{
                drawerLabel: "Summary",
                drawerIcon: ({ color, size }) => (
                  <MaterialIcons name="description" size={size} color={color} />
                ),
                headerRight: AvatarUser,
              }}
            />
          </Drawer.Navigator>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "row",
    },
});

export default MenuWeb
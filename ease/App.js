import React, { useState } from 'react';
import LoginScreen  from './src/screens/login_screen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RegisterScreen from './src/screens/register_screen';
import HomeScreen from './src/screens/home_screen';
import SettingScreen from './src/screens/settings_screen';
import ProfileScreen from './src/screens/profile_screen';
import AdminScreen from './src/screens/admin_screen';
import UsersList from './src/screens/admin-screens/users_list';
import UserData from './src/screens/admin-screens/user_data';

const Stack = createNativeStackNavigator();

export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        <Stack.Screen name='Login' component={LoginScreen} options={{headerShown:false}}/>
        <Stack.Screen name='Home'component={HomeScreen} options={{headerShown:false}}/>
        <Stack.Screen name='Register' component={RegisterScreen} options={{headerShown:false}}/>
        <Stack.Screen name='Setting' component={SettingScreen} options={{headerShown:false}}/>
        <Stack.Screen name='Admin' component={AdminScreen} options={{headerShown:false}}/>
        <Stack.Screen name='UsersList' component={UsersList} options={{headerShown:false}}/>
        <Stack.Screen name='UserData' component={UserData} options={{headerShown:false}}/>
        <Stack.Screen name='Profile' component={ProfileScreen} options={{headerShown:false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
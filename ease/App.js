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
import SummaryScreen from './src/screens/summary_screen';
import Menu from './src/components/menu';
import MenuAdmin from './src/components/menu_admin';
import SupportScreen from './src/screens/support_screen';
import SplashScreen from './src/screens/splash_screen';
import AvatarUser from './src/components/avatar_user';
import MenuMovil from './src/components/movil/menu.movil';
import MenuWeb from './src/components/web/menu.web';
import { isMobile } from 'react-device-detect'
import HomeScreenWeb from './src/screens/web/homeScreen.web';
import HomeScreenMovil from './src/screens/movil/homeScreen.movil';

const Stack = createNativeStackNavigator();

export default function App() {
  const MenuComponent = isMobile ? MenuMovil : MenuWeb;

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Splash'>
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name='Login' component={LoginScreen} options={{headerShown:false}}/>
        <Stack.Screen name='Home'component={Menu} options={{headerShown:false}}/>
        <Stack.Screen name='Register' component={RegisterScreen} options={{headerShown:false}}/>
        <Stack.Screen name='Setting' component={SettingScreen} options={{headerShown:false}}/>
        <Stack.Screen name='Admin' component={MenuAdmin} options={{headerShown:false}}/>
        <Stack.Screen name='UsersList' component={UsersList} options={{headerShown:false}}/>
        <Stack.Screen name='UserData' component={UserData} options={{headerShown:false}}/>
        <Stack.Screen name='Profile' component={ProfileScreen} options={{ headerRight: AvatarUser }}/>
        <Stack.Screen name='Summary' component={SummaryScreen} options={{headerShown:false}}/>
        <Stack.Screen name='Support' component={SupportScreen} options={{headerShown:false}}/>
        <Stack.Screen name='Menu' component={MenuComponent} options={{ headerShown: false }}/>
        <Stack.Screen name='HomeWeb' component={MenuMovil} options={{headerShown:false}}/>
        <Stack.Screen name='HomeMovil' component={HomeScreenMovil} options={{headerShown:false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
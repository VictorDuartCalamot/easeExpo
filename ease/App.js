import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './src/screens/login_screen';
import HomeScreenWeb from './src/screens/web/homeScreen.web';
import HomeScreenMovil from './src/screens/movil/homeScreen.movil';
import RegisterScreen from './src/screens/register_screen';
import HomeScreen from './src/screens/home_screen';
import SettingScreen from './src/screens/settings_screen';
import ProfileScreen from './src/screens/profile_screen';
import AdminScreen from './src/screens/admin_screen';
import UsersList from './src/screens/admin-screens/users_list';
import UserData from './src/screens/admin-screens/user_data';
import SummaryScreen from './src/screens/summary_screen';
import SupportScreen from './src/screens/support_screen';
import SplashScreen from './src/screens/splash_screen';
import AvatarUser from './src/components/avatar_user';
import NewUserAdmin from './src/components/newUser.admin';
import NewCategory from './src/components/newCategory.admin';
import NewSubCategory from './src/components/newSubCategory.admin';
import ChatBot from './src/services/chatBot';
import ChatViewAdmin from './src/screens/admin-screens/chat-view.admin';
import ChatViewClient from './src/screens/chat-view.client';
import ChatDetail from './src/screens/admin-screens/movil/chat-details.admin';
import OpenIAChat from './src/services/api_ia';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='ChatIA'>
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerTransparent: true }} />
        <Stack.Screen name="ChatBot" component={ChatBot} options={{ headerTransparent: true }} />
        <Stack.Screen name="ChatIA" component={OpenIAChat} options={{ headerTransparent: true }} />
        <Stack.Screen name="ChatAdmin" component={ChatViewAdmin} options={{ headerTransparent: true }} />
        <Stack.Screen name="ChatDetail" component={ChatDetail} options={{ headerTransparent: true }} />
        <Stack.Screen name="ChatClient" component={ChatViewClient} options={{ headerTransparent: true }} />
        <Stack.Screen name='Login' component={LoginScreen} options={{ headerTransparent: true }} />
        <Stack.Screen name='Home' component={HomeScreen} options={{ headerTransparent: true }} />
        <Stack.Screen name='HomeWeb' component={HomeScreenWeb} options={{ headerTransparent: true }} />
        <Stack.Screen name='HomeMovil' component={HomeScreenMovil} options={{ headerTransparent: true }} />
        <Stack.Screen name='Register' component={RegisterScreen} options={{ headerTransparent: true }} />
        <Stack.Screen name='Setting' component={SettingScreen} options={{ headerTransparent: true }} />
        <Stack.Screen name='Admin' component={AdminScreen} options={{ headerTransparent: true }} />
        <Stack.Screen name='UsersList' component={UsersList} options={{ headerTransparent: true }} />
        <Stack.Screen name='UserData' component={UserData} options={{ headerTransparent: true }} />
        <Stack.Screen name='Profile' component={ProfileScreen} options={{ headerTransparent: true }} />
        <Stack.Screen name='Summary' component={SummaryScreen} options={{ headerTransparent: true }} />
        <Stack.Screen name='Support' component={SupportScreen} options={{ headerTransparent: true}} />
        <Stack.Screen name='NewUserAdmin' component={NewUserAdmin} options={{ headerTransparent: true }} />
        <Stack.Screen name='NewCategory' component={NewCategory} options={{ headerTransparent: true }} />
        <Stack.Screen name='NewSubCategory' component={NewSubCategory} options={{ headerTransparent: true }} />
        <Stack.Screen name='Chat' component={Chat} options={{ headerTransparent: true }} />

        
      </Stack.Navigator>
    </NavigationContainer>
  );
}

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
import MenuAdmin from './src/components/menu_admin';
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

const Stack = createNativeStackNavigator();

export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='ChatAdmin'>
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ChatBot" component={ChatBot} options={{ headerShown: false }} />
        <Stack.Screen name="ChatAdmin" component={ChatViewAdmin} options={{ headerShown: false }} />
        <Stack.Screen name="ChatDetail" component={ChatDetail} options={{ headerShown: false }} />
        <Stack.Screen name="ChatClient" component={ChatViewClient} options={{ headerShown: false }} />
        <Stack.Screen name='Login' component={LoginScreen} options={{headerShown:false}}/>
        <Stack.Screen name='Home'component={HomeScreen} options={{ headerShow: false}}/>
        <Stack.Screen name='Register' component={RegisterScreen} options={{headerShown:false}}/>
        <Stack.Screen name='Setting' component={SettingScreen} options={{headerShown:false}}/>
        <Stack.Screen name='Admin' component={MenuAdmin} options={{headerShown:false}}/>
        <Stack.Screen name='UsersList' component={UsersList} options={{headerRight: AvatarUser}}/>
        <Stack.Screen name='UserData' component={UserData} options={{headerRight: AvatarUser}}/>
        <Stack.Screen name='Profile' component={ProfileScreen} options={{ headerRight: AvatarUser }}/>
        <Stack.Screen name='Summary' component={SummaryScreen} options={{ headerRight: AvatarUser}}/>
        <Stack.Screen name='Support' component={SupportScreen} options={{headerShown:false}}/>
        <Stack.Screen name='HomeScreen' component={HomeScreen} options={{headerShown:false}}/>
        <Stack.Screen name='NewUserAdmin' component={NewUserAdmin} options={{headerShown:false}}/>
        <Stack.Screen name='NewCategory' component={NewCategory} options={{headerShown:false}}/>
        <Stack.Screen name='NewSubCategory' component={NewSubCategory} options={{headerShown:false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
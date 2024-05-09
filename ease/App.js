import React, { useState } from 'react';
import LoginScreen  from './src/screens/login_screen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
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
import MenuAdmin from './src/components/menu_admin';
import SupportScreen from './src/screens/support_screen';
import SplashScreen from './src/screens/splash_screen';
import AvatarUser from './src/components/avatar_user';
import NewUserAdmin from './src/components/newUser.admin';
import AssistanceScreen from './src/components/chat';
import IAScreen from './src/services/apiTest_chatIA';

const Stack = createNativeStackNavigator();

export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Splash'>
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="IAScreen" component={IAScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Assistant" component={AssistanceScreen} options={{ headerShown: false }}/>
        <Stack.Screen name='Login' component={LoginScreen} options={{headerShown:false}}/>
        <Stack.Screen name='Home'component={HomeScreen} options={{ headerShown: false}}/>
        <Stack.Screen name='HomeWeb'component={HomeScreenWeb} options={{ headerShown: false}}/>
        <Stack.Screen name='HomeMovil'component={HomeScreenMovil} options={{ headerShown: false}}/>
        <Stack.Screen name='Register' component={RegisterScreen} options={{headerShown:false}}/>
        <Stack.Screen name='Setting' component={SettingScreen} options={{headerShown:false}}/>
        <Stack.Screen name='Admin' component={MenuAdmin}  />
        <Stack.Screen name='UsersList' component={UsersList}/>
        <Stack.Screen name='UserData' component={UserData} />
        <Stack.Screen name='Profile' component={ProfileScreen}/>
        <Stack.Screen name='Summary' component={SummaryScreen}/>
        <Stack.Screen name='Support' component={SupportScreen} options={{headerShown:false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
import LoginScreen  from './src/screens/login_screen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RegisterScreen from './src/screens/register_screen';
import HomeScreen from './src/screens/home_screen';
import SettingScreen from './src/screens/settings_screen';
import ProfileScreen from './src/screens/profile_screen';
import AdminScreen from './src/screens/admin_screen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        <Stack.Screen name='Login' component={LoginScreen}/>
        <Stack.Screen name='Register' component={RegisterScreen}/>
        <Stack.Screen name='Home' component={HomeScreen}/>
        <Stack.Screen name='Setting' component={SettingScreen}/>
        <Stack.Screen name='Profile' component={ProfileScreen}/>
        <Stack.Screen name='Admin' component={AdminScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
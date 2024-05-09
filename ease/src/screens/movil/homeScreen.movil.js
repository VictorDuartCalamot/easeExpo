import React, { useState } from 'react';
import { View, StyleSheet, Modal, TextInput, Button, Alert, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons';
    import React, { useState } from 'react';
    import { View, StyleSheet, Modal, TextInput, Button, Alert, TouchableOpacity,Text } from 'react-native';
    import { createStackNavigator } from '@react-navigation/stack';
    import { AntDesign, MaterialIcons } from '@expo/vector-icons';
    import AddExpenseButton from '../../components/AddExpenseButton';

import SummaryScreen from '../summary_screen';
import SettingsScreen from '../settings_screen';
import ProfileScreen from '../profile_screen'; // Importa la pantalla de perfil
import { createExpense } from '../../services/api_management';

const Stack = createStackNavigator();

const HomeScreenMovil= ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);

  const newExpense = async () => {
    if (parseFloat(amount) <= 0) {
      Alert.alert('Invalid Amount', 'Amount must be greater than zero');
      return;
    }

    const date = new Date();
    const newTime = date.toISOString().substring(11, 19).toString();
    const newDate = date.toISOString().substring(0, 10).toString();
    createExpense({ title: title, description: description, amount: amount, category: category, newDate: newDate, newTime });
    setModalVisible(false);
    console.log('New Expense Added:');
    console.log('Title:', title);
    console.log('Description:', description);
    console.log('Amount:', amount);
    console.log('Category:', category);
    console.log('Date:', newDate);
    console.log('Time:', newTime);
  };
    const HomeScreen = ({ navigation }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [showAvatarMenu, setShowAvatarMenu] = useState(false);

  const handleLogout = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <MaterialIcons name="home" size={32} color="black" onPress={() => setShowMenu(!showMenu)} style={styles.menuIcon} />
      {showMenu && (
        <View style={styles.menu}>
        <View style={styles.menuItem}>
          <MaterialIcons name="description" size={28} color="black" />
          <Text style={styles.menuText} onPress={() => { navigation.navigate('Summary'); setShowMenu(false); }}>Summary</Text>
        </View>
        </View>
      )}
      <View style={styles.avatarContainer}>
        <MaterialIcons name="person" size={32} color="black" onPress={() => setShowAvatarMenu(!showAvatarMenu)} style={styles.avatarIcon} />
        {showAvatarMenu && (
          <View style={styles.menu1}>
            <View style={styles.menuItem}>
              <MaterialIcons name="person" size={28} color="black" />
              <Text style={styles.menuText} onPress={() => { navigation.navigate('Profile'); setShowMenu(false); }}>Profile</Text>
            </View>
            <View style={styles.menuItem}>
              <MaterialIcons name="exit-to-app" size={29} color="black" onPress={handleLogout} />
              <Text style={styles.menuText} onPress={handleLogout}>Logout</Text>
            </View>
          </View>
        )}
      </View>
      <Button title="Add Expense" onPress={() => setModalVisible(true)} />
      <Modal
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <TextInput
            style={styles.input}
            placeholder="Title"
            onChangeText={(text) => setTitle(text)}
            value={title}
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            onChangeText={(text) => setDescription(text)}
            value={description}
          />
          <TextInput
            style={styles.input}
            placeholder="Amount"
            keyboardType="numeric"
            onChangeText={(text) => setAmount(text)}
            value={amount}
          />
          <TextInput
            style={styles.input}
            placeholder="Category"
            onChangeText={(text) => setCategory(text)}
            value={category}
          />
          <View style={styles.buttonContainer}>
            <Button title="Add Expense" onPress={newExpense} />
          </View>
          <View style={styles.buttonContainer}>
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};
      <TouchableOpacity onPress={() => setShowAvatarMenu(!showAvatarMenu)} style={styles.avatarIcon}>
        <MaterialIcons name="person" size={35} color="black" />
      </TouchableOpacity>
      {showAvatarMenu && (
        <View style={styles.menu1}>
          <TouchableOpacity onPress={() => { navigation.navigate('Profile'); setShowAvatarMenu(false); }}>
            <Text>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout}>
            <Text>Logout</Text>
          </TouchableOpacity>
        </View>
      )}
          <AddExpenseButton/>      
        </View>
    );
    };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  input: {
    height: 40,
    width: '80%',
    margin: 12,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
  },
  buttonContainer: {
    marginBottom: 5,
    marginTop: 5,
  },
  menuIcon: {
    position: 'absolute',
    top: 20,
    left: 20,
    marginTop:40
  },
  menu: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    zIndex: 1,
    marginTop:60
  },
  menu1: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    zIndex: 1,
  },
  avatarContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    flexDirection: 'column',
    alignItems: 'center',
    marginTop:40
  },
  avatarIcon: {
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal:10,
  },
  menuText: {
    marginTop: 5,
    fontSize: 16,
  },
});

export default HomeScreenMovil;

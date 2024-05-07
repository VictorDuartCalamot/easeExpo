import React, { useState } from 'react';
import { View, StyleSheet, Modal, TextInput, Button, Alert } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';

import SummaryScreen from '../summary_screen';
import SettingsScreen from '../settings_screen';
import ProfileScreen from '../profile_screen'; // Importa la pantalla de perfil
import { createExpense } from '../../services/api_management';

const Stack = createStackNavigator();

const HomeScreen = ({ navigation }) => {
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

  const handleLogout = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <MaterialIcons name="home" size={24} color="black" onPress={() => setShowMenu(!showMenu)} style={styles.menuIcon} />
      {showMenu && (
        <View style={styles.menu}>
          <Button title="Summary" onPress={() => { navigation.navigate('Summary'); setShowMenu(false); }} />
          <Button title="Settings" onPress={() => { navigation.navigate('Settings'); setShowMenu(false); }} />
        </View>
      )}
      <MaterialIcons name="person" size={24} color="black" onPress={() => setShowAvatarMenu(!showAvatarMenu)} style={styles.avatarIcon} />
      {showAvatarMenu && (
        <View style={styles.menu1}>
          <Button title="Profile" onPress={() => { navigation.navigate('Profile'); setShowAvatarMenu(false); }} />
          <Button title="Logout" onPress={handleLogout} />
        </View>
      )}
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
  },
  menu: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    zIndex: 1,
  },
  menu1: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    zIndex: 1,
  },
  avatarIcon: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
});

export default HomeScreen;

import React, { useState } from 'react';
import { View, StyleSheet, Modal, TextInput, Button } from 'react-native';
import PieChartComponent from '../../components/pieChartComponent';
import { createExpense } from '../../services/api_management';
import { AntDesign } from '@expo/vector-icons';

const HomeScreen = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const newExpense = async () => {
    if (parseFloat(amount) <= 0) {
      Alert.alert('Invalid Amount', 'Amount must be greater than zero');
      return;
    }

    const date = new Date();
    const newTime = date.toISOString().substring(11, 19).toString();
    const newDate = date.toISOString().substring(0, 10).toString();
    createExpense({ title:title, descriptio:description, amount:amount, category:category, newDate:newDate, newTime });
    setModalVisible(false);
    console.log('New Expense Added:');
    console.log('Title:', title);
    console.log('Description:', description);
    console.log('Amount:', amount);
    console.log('Category:', category);
    console.log('Date:', newDate);
    console.log('Time:', newTime);
  };

  return (
    <View style={styles.container}>
      <AntDesign name="pluscircleo" size={24} color="black" onPress={() => setModalVisible(true)} />
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
            <Button title="Add Expense"
              onPress={newExpense}/>
          </View>
          <View style={styles.buttonContainer}>
            <Button title="Cancel" 
              onPress={() => setModalVisible(false)}/>
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
  buttonContainer : {
    marginBottom: 5,
    marginTop: 5,
  },
});

export default HomeScreen;

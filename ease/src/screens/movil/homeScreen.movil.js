import React, { useState } from 'react';
import { View, StyleSheet, Modal, TextInput, Button } from 'react-native';
import AddExpenseButton from '../../components/AddExpenseButton';

const HomeScreen = () => {
  return (
    <AddExpenseButton/>
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

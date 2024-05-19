import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ImageBackground } from 'react-native';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { getExpenses } from '../../services/api_management';

const SummaryScreenWeb = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [userExpenses, setUserExpenses] = useState([]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const obtenerGastosUsuario = async (date) => {
    try {
      const expenses = await getExpenses(date);
      setUserExpenses(expenses);
    } catch (error) {
      console.error('Error obteniendo gastos del usuario:', error);
    }
  };

  useEffect(() => {
    obtenerGastosUsuario(selectedDate);
  }, []);

  const obtenerGastosHoy = async () => {
    const todayExpenses = await getExpenses(new Date());
    setUserExpenses(todayExpenses);
  };

  return (
    <ImageBackground 
      source={require('../../pictures/fondo2.jpg')} 
      style={styles.imageBackground}
    >
      <View style={styles.container}>
        <Calendar
          value={selectedDate}
          onChange={handleDateChange}
        />
        <Button title="Mostrar gastos del usuario logeado" onPress={() => obtenerGastosUsuario(selectedDate)} />
        <Button title="Mostrar gastos de hoy" onPress={obtenerGastosHoy} />
        {userExpenses.length > 0 && (
          <View style={styles.expensesContainer}>
            <Text>Gastos del usuario logeado en {selectedDate.toLocaleDateString()}:</Text>
            {userExpenses.map((expense) => (
              <Text key={expense.id}>
                {expense.date}: ${expense.amount}
              </Text>
            ))}
          </View>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    alignItems: 'center',
    padding: 20,
  },
  expensesContainer: {
    marginTop: 20,
  },
});

export default SummaryScreenWeb;

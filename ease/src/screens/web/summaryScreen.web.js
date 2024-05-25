import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, TouchableOpacity } from 'react-native';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { getExpenses, getCategories, getSubCategories, deleteExpense, modifyExpense } from '../../services/api_management';
import { FontAwesome5 } from '@expo/vector-icons'; // Importa los iconos necesarios

const SummaryScreenWeb = () => {
  const [selectedStartDate, setSelectedStartDate] = useState(new Date());
  const [selectedEndDate, setSelectedEndDate] = useState(new Date());
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState({});
  const [subCategories, setSubCategories] = useState({});

  const handleDateChange = (date) => {
    if (Array.isArray(date)) {
      setSelectedStartDate(date[0]);
      setSelectedEndDate(date[1] || date[0]);
    } else {
      setSelectedStartDate(date);
      setSelectedEndDate(date);
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    try {
      await deleteExpense(expenseId);
      const updatedExpenses = expenses.filter(expense => expense.id !== expenseId);
      setExpenses(updatedExpenses);
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const handleModifyExpense = async (expenseId, newData) => {
    try {
      await modifyExpense(expenseId, newData);
      const updatedExpenses = expenses.map(expense => {
        if (expense.id === expenseId) {
          return { ...expense, ...newData };
        }
        return expense;
      });
      setExpenses(updatedExpenses);
    } catch (error) {
      console.error('Error modifying expense:', error);
    }
  };

  useEffect(() => {
    const fetchExpenses = async () => {
      const startDateString = selectedStartDate.toISOString().split('T')[0];
      const endDateString = selectedEndDate.toISOString().split('T')[0];

      try {
        const expenseData = await getExpenses({ start_date: startDateString, end_date: endDateString });
        setExpenses(expenseData);
      } catch (error) {
        console.error('Error fetching expenses:', error);
      }
    };

    fetchExpenses();
  }, [selectedStartDate, selectedEndDate]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getCategories();
        const categoriesMap = {};
        categoriesData.forEach(category => {
          categoriesMap[category.id] = { name: category.name, color: category.HexColor };
        });
        setCategories(categoriesMap);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        if (categoryId) {
          const response = await getSubCategories({ category: categoryId });
          setSubCategories(response);
        } else {
          setSubCategories({});
        }
      } catch (error) {
        console.error('Error fetching subcategories:', error);
      }
    };

    fetchSubCategories();
  }, []);

  return (
    <ImageBackground source={require('../../pictures/fondo2.jpg')} style={styles.background}>
      <ScrollView contentContainerStyle={styles.container}>
        <Calendar
          selectRange
          value={[selectedStartDate, selectedEndDate]}
          onChange={handleDateChange}
        />
        {expenses.length > 0 && (
          <View style={styles.expensesContainer}>
            <Text style={styles.expensesTitle}>
              Gastos entre {selectedStartDate.toLocaleDateString()} y {selectedEndDate.toLocaleDateString()}:
            </Text>
            <View style={styles.columnsContainer}>
              {expenses.map((expense, index) => (
                <View key={expense.id} style={[styles.expenseItem, index % 4 === 0 && styles.newColumn]}>
                  <View style={styles.iconContainer}>
                    <TouchableOpacity onPress={() => handleDeleteExpense(expense.id)}>
                      <FontAwesome5 name="trash-alt" size={20} color="red" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleModifyExpense(expense.id)}>
                      <FontAwesome5 name="edit" size={20} color="blue" />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.blueText}>Title:</Text>
                  <Text>{expense.title}</Text>
                  <Text style={styles.blueText}>Descripción:</Text>
                  <Text>{expense.description}</Text>
                  <Text style={styles.blueText}>Monto:</Text>
                  <Text>€{expense.amount}</Text>
                  <Text style={styles.blueText}>Fecha:</Text>
                  <Text>{expense.creation_date}</Text>
                  <Text style={styles.blueText}>Hora:</Text>
                  <Text>{expense.creation_time}</Text>
                  <View style={styles.categoryContainer}>
                    <Text style={[styles.blueText, styles.redText]}>
                      Categoría: {categories[expense.category]?.name || 'no data'}
                    </Text>
                    {categories[expense.category]?.color && (
                      <View 
                        style={[
                          styles.colorCircle, 
                          { backgroundColor: categories[expense.category].color }
                        ]} 
                      />
                    )}
                  </View>
                  <Text style={styles.redText}>
                    Subcategoría: {subCategories[expense.subcategory]?.name || 'no data'}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    flexGrow: 1,
  },
  expensesContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  expensesTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  columnsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  expenseItem: {
    marginBottom: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
    padding: 10,
    borderRadius: 10,
    width: 350,
    marginRight: 20,
    position: 'relative', // Para posicionar los iconos correctamente
  },
  newColumn: {
    marginLeft: 10,
  },
  redText: {
    color: 'red',
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorCircle: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    marginLeft: 5,
  },
    iconContainer: {
    position: 'absolute',
    top: 5,
    right: 5,
    flexDirection: 'row',
  },
});

export default SummaryScreenWeb;

 

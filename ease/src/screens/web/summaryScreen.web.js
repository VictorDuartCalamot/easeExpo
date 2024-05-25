import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, TouchableOpacity, TextInput } from 'react-native';
import { getExpenses, getCategories, getSubCategories, deleteExpense, modifyExpense } from '../../services/api_management';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { FontAwesome5 } from '@expo/vector-icons';

const SummaryScreenWeb = () => {
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState({});
  const [subCategories, setSubCategories] = useState({});
  const [dataLoaded, setDataLoaded] = useState(false); // Track if categories and subcategories are loaded

  const fetchCategoriesAndSubCategories = async () => {
    try {
      const [categoriesData, subCategoriesData] = await Promise.all([getCategories(), getSubCategories()]);
      
      const categoriesMap = {};
      categoriesData.forEach(category => {
        categoriesMap[category.id] = { name: category.name, color: category.hexColor };
      });
      
      const subCategoriesMap = {};
      subCategoriesData.forEach(subCategory => {
        subCategoriesMap[subCategory.id] = { name: subCategory.name, color: subCategory.hexColor };
      });

      setCategories(categoriesMap);
      setSubCategories(subCategoriesMap);
      setDataLoaded(true); // Set dataLoaded to true once data is fetched
    } catch (error) {
      console.error('Error fetching categories or subcategories:', error);
    }
  };

  useEffect(() => {
    fetchCategoriesAndSubCategories();
  }, []);

  const handleFetchExpenses = async () => {
    try {
      const [startDate, endDate] = dateRange;
      const expenseData = await getExpenses({ start_date: startDate.toISOString().slice(0, 10), end_date: endDate.toISOString().slice(0, 10) });
      const enrichedExpenses = expenseData.map(expense => ({
        ...expense,
        categoryName: categories[expense.category]?.name || 'no data',
        categoryColor: categories[expense.category]?.color || 'no data',
        subCategoryName: subCategories[expense.subcategory]?.name || 'no data',
        subCategoryColor: subCategories[expense.subcategory]?.color || 'no data',
      }));
      setExpenses(enrichedExpenses.reverse());
    } catch (error) {
      console.error('Error fetching expenses:', error);
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

  const handleSearch = () => {
    if (dataLoaded && dateRange[0] && dateRange[1]) {
      handleFetchExpenses();
    } else {
      console.warn('Please select both start and end dates.');
    }
  };

  return (
    <ImageBackground source={require('../../pictures/fondo2.jpg')} style={styles.background}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.calendarContainer}>
          <Calendar
            selectRange
            onChange={setDateRange}
            value={dateRange}
            className="calendar"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Fecha de inicio:</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            onChangeText={text => setDateRange([new Date(text), dateRange[1]])}
            value={dateRange[0].toISOString().slice(0, 10)}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Fecha de fin:</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            onChangeText={text => setDateRange([dateRange[0], new Date(text)])}
            value={dateRange[1].toISOString().slice(0, 10)}
          />
        </View>
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Buscar</Text>
        </TouchableOpacity>
        {expenses.length > 0 && (
          <View style={styles.expensesContainer}>
            <Text style={styles.expensesTitle}>
              Gastos entre {dateRange[0].toISOString().slice(0, 10)} y {dateRange[1].toISOString().slice(0, 10)}:
            </Text>
            <View style={styles.gridContainer}>
              {expenses.map((expense) => (
                <View key={expense.id} style={styles.expenseItem}>
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
                      Categoría: {expense.categoryName}
                    </Text>
                    {expense.categoryColor && (
                      <View 
                        style={[
                          styles.colorCircle, 
                          { backgroundColor: expense.categoryColor }
                        ]} 
                      />
                    )}
                  </View>
                  <View style={styles.categoryContainer}>
                    <Text style={styles.redText}>
                      Subcategoría: {expense.subCategoryName}
                    </Text>
                    {expense.subCategoryColor && (
                      <View 
                        style={[
                          styles.colorCircle, 
                          { backgroundColor: expense.subCategoryColor }
                        ]} 
                      />
                    )}
                  </View>
                  <View style={styles.iconContainer}>
                    <TouchableOpacity onPress={() => handleDeleteExpense(expense.id)}>
                      <FontAwesome5 name="trash-alt" size={20} color="red" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleModifyExpense(expense.id, { /* your new data here */ })}>
                      <FontAwesome5 name="edit" size={20} color="blue" />
                    </TouchableOpacity>
                  </View>
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
    marginTop: 40,
    padding: 20,
    paddingTop: 50,
    flexGrow: 1,
  },
  calendarContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 10,
    width: '100%',
    maxWidth: 600,
  },
  label: {
    marginBottom: 5,
    color: '#FFFFFF',
  },
  input: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 5,
    width: '100%',
  },
  searchButton: {
    backgroundColor: '#50cebb',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'center',
    marginVertical: 10,
  },
  searchButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  expensesContainer: {
    marginTop: 20,
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  expensesTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FFFFFF',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  expenseItem: {
    margin: 10,
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
    padding: 10,
    borderRadius: 10,
    width: 300,
    maxHeight: 280,
    overflow: 'hidden',
    position: 'relative',
  },
  redText: {
    color: 'red',
  },
  blueText: {
    color: 'blue',
    fontWeight: 'bold',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
});

export default SummaryScreenWeb;
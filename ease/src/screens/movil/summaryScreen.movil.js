import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, TouchableOpacity, TextInput } from 'react-native';
import { getExpenses, getCategories, getSubCategories, deleteExpense} from '../../services/api_management';
import CalendarPicker from 'react-native-calendar-picker';
import { FontAwesome5 } from '@expo/vector-icons';
import UpdateExpense from '../../constants/updateExpense';
import UpdateIncome from '../../constants/updateIncome';

const SummaryScreenMobile = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState({});
  const [subCategories, setSubCategories] = useState({});

  const handleFetchExpenses = async () => {
    try {
      const expenseData = await getExpenses({ start_date: startDate, end_date: endDate });
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

  useEffect(() => {
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
      } catch (error) {
        console.error('Error fetching categories or subcategories:', error);
      }
    };

    fetchCategoriesAndSubCategories();
  }, []);

  const handleSearch = () => {
    if (startDate && endDate) {
      handleFetchExpenses();
    } else {
      console.warn('Please select both start and end dates.');
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

  return (
    <ImageBackground source={require('../../pictures/fondo2.jpg')} style={styles.background}>
      <ScrollView contentContainerStyle={styles.container}>
        <CalendarPicker
          allowRangeSelection={true}
          selectedStartDate={startDate}
          selectedEndDate={endDate}
          onDateChange={(date, type) => {
            if (date) {
              const formattedDate = date.toISOString().slice(0, 10);
              if (!startDate && !endDate) {
                setStartDate(formattedDate);
                setEndDate(formattedDate);
              } else if (type === 'START_DATE') {
                setStartDate(formattedDate);
                setEndDate(null);
              } else if (type === 'END_DATE') {
                setEndDate(formattedDate);
              } else if (startDate && endDate) {
                setStartDate(formattedDate);
                setEndDate(formattedDate);
              }
              console.log(formattedDate, type);
            }
          }}
          todayBackgroundColor="#f2e6ff"
          selectedDayColor="#7300e6"
          selectedDayTextColor="#FFFFFF"
          onMonthChange={(date) => {
            console.log('month changed', date);
          }}
          style={{marginTop: 20}} // Ajustado marginTop para el calendario
        />
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Fecha de inicio:</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            onChangeText={text => setStartDate(text)}
            value={startDate}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Fecha de fin:</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            onChangeText={text => setEndDate(text)}
            value={endDate}
          />
        </View>
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Buscar</Text>
        </TouchableOpacity>
        {expenses.length > 0 && (
          <View style={styles.expensesContainer}>
            <Text style={styles.expensesTitle}>
              Gastos entre {startDate} y {endDate}:
            </Text>
            <View style={styles.columnsContainer}>
              {expenses.map((expense, index) => (
                <View key={expense.id} style={[styles.expenseItem, index % 2 !== 0 && styles.newRow]}>
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
  inputContainer: {
    marginBottom: 10,
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
    marginBottom:20,
  },
  expensesTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FFFFFF',
  },
  columnsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  expenseItem: {
    marginBottom: 20,
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
  newRow: {
    marginTop: 20,
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
  icon: {
    marginRight: 10,
    marginTop: 10,
  },
  
});

export default SummaryScreenMobile;
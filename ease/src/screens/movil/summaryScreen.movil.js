import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, TouchableOpacity, TextInput } from 'react-native';
import { getExpenses, getCategories, getSubCategories } from '../../services/api_management';
import CalendarPicker from 'react-native-calendar-picker';

const SummaryScreenMobile = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState({});
  const [subCategories, setSubCategories] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleFetchExpenses = async () => {
    try {
      const expenseData = await getExpenses({ start_date: startDate, end_date: endDate });
      setExpenses(expenseData);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getCategories();
        const categoriesMap = {};
        categoriesData.forEach(category => {
          categoriesMap[category.id] = { name: category.name, color: category.hexColor };
        });
        setCategories(categoriesMap);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchSubCategories = async (categoryId) => {
      try {
        if (categoryId) {
          const response = await getSubCategories({ category: categoryId });
          setSubCategories(response);
        } else {
          setSubCategories({});
        }
      } catch (error) {
        console.error("Error fetching subcategories: ", error);
      }
    };

    fetchSubCategories(selectedCategory);
  }, [selectedCategory]);

  const handleSearch = () => {
    if (startDate && endDate) {
      handleFetchExpenses();
    } else {
      console.warn('Please select both start and end dates.');
    }
  };

  return (
    <ImageBackground source={require('../../pictures/fondo2.jpg')} style={styles.background}>
      <ScrollView contentContainerStyle={styles.container}>
        <CalendarPicker
          onDateChange={(date, type) => {
            console.log(date);
          }}
          todayBackgroundColor="#f2e6ff"
          selectedDayColor="#7300e6"
          selectedDayTextColor="#FFFFFF"
          onMonthChange={(date) => {
            console.log('month changed', date);
          }}
          style={{marginTop: 20}} // Adjusted marginTop for calendar
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
    width: '47%', // Establecer un ancho fijo
    maxHeight: 250, // Establecer una altura máxima
    overflow: 'hidden', // Ocultar contenido que supere la altura máxima
  },
  
  newRow: {
    marginTop: 20, // Margin between rows
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
});

export default SummaryScreenMobile;

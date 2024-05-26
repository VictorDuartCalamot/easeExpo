import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, TouchableOpacity, TextInput } from 'react-native';
import { getExpenses, getCategories, getSubCategories, getIncomes, deleteExpense, modifyExpense, deleteIncome } from '../../services/api_management';
import CalendarPicker from 'react-native-calendar-picker';
import { FontAwesome5 } from '@expo/vector-icons';
import UpdateExpense from '../../constants/updateExpense';
import UpdateIncome from '../../constants/updateIncome';

const SummaryScreenMobile = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState({});
  const [subCategories, setSubCategories] = useState({});

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

  useEffect(() => {
    fetchCategoriesAndSubCategories();
  }, []);

  const handleFetchItems = async () => {
    try {
      const [expenseData, incomeData] = await Promise.all([
        getExpenses({ start_date: startDate, end_date: endDate }),
        getIncomes({ start_date: startDate, end_date: endDate })
      ]);

      const enrichedExpenses = expenseData.map(expense => ({
        ...expense,
        categoryName: categories[expense.category]?.name || 'no data',
        categoryColor: categories[expense.category]?.color || 'no data',
        subCategoryName: subCategories[expense.subcategory]?.name || 'no data',
        subCategoryColor: subCategories[expense.subcategory]?.color || 'no data',
        type: 'expense'
      }));

      const enrichedIncomes = incomeData.map(income => ({
        ...income,
        categoryName: categories[income.category]?.name || 'no data',
        categoryColor: categories[income.category]?.color || 'no data',
        type: 'income'
      }));

      const combinedData = [...enrichedExpenses, ...enrichedIncomes].sort((a, b) => {
        const dateComparison = new Date(a.creation_date) - new Date(b.creation_date);
        if (dateComparison !== 0) return dateComparison;
        return a.creation_time.localeCompare(b.creation_time);
      }).reverse();

      setItems(combinedData);
    } catch (error) {
      console.error('Error fetching expenses or incomes:', error);
    }
  };

  const handleSearch = () => {
    if (startDate && endDate) {
      handleFetchItems();
    } else {
      console.warn('Please select both start and end dates.');
    }
  };

  const handleDeleteExpense = async (itemId, itemType) => {
    try {
      if (itemType === 'expense') {
        await deleteExpense(itemId);
      } else {
        await deleteIncome(itemId);
      }
      const updatedItems = items.filter(item => item.id !== itemId);
      setItems(updatedItems);
    } catch (error) {
      console.error(`Error deleting ${itemType}:`, error);
    }
  };

  const handleDeleteIncome = async (incomeId) => {
    try {
      await deleteIncome(incomeId);
      const updatedIncome = items.filter(income => income.id !== incomeId);
      setItems(updatedIncome);
    } catch (error) {
      console.error('Error deleting expense:', error);
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
            }
          }}
          todayBackgroundColor="#f2e6ff"
          selectedDayColor="#7300e6"
          selectedDayTextColor="#FFFFFF"
          onMonthChange={(date) => {
            console.log('month changed', date);
          }}
          style={{ marginTop: 20 }}
        />
        <View style={styles.inputWrapper}>
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
        </View>
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Buscar</Text>
        </TouchableOpacity>
        {items.length > 0 && (
          <View style={styles.expensesContainer}>
            <Text style={styles.expensesTitle}>
              Gastos e ingresos entre {startDate} y {endDate}:
            </Text>
            <View style={styles.columnsContainer}>
              {items.map((item, index) => (
                <View key={item.id} style={[styles.expenseItem, index % 2 !== 0 && styles.newRow, { borderColor: item.type === 'expense' ? 'red' : 'green' }]}>
                  <Text style={styles.itemTypeText}>
                    {item.type === 'expense' ? 'Gasto' : 'Ingreso'}
                  </Text>
                  <Text style={styles.blueText}>Titulo:</Text>
                  <Text>{item.title}</Text>
                  <Text style={styles.blueText}>Descripción:</Text>
                  <Text>{item.description}</Text>
                  <Text style={styles.blueText}>Total:</Text>
                  <Text>€{item.amount}</Text>
                  <Text style={styles.blueText}>Fecha:</Text>
                  <Text>{item.creation_date}</Text>
                  <Text style={styles.blueText}>Hora:</Text>
                  <Text>{item.creation_time}</Text>
                  <View style={styles.categoryContainer}>
                    <Text style={styles.blueText}>
                      Categoría: {item.categoryName}
                    </Text>
                    {item.categoryColor && (
                      <View 
                        style={[
                          styles.colorCircle, 
                          { backgroundColor: item.categoryColor }
                        ]} 
                      />
                    )}
                  </View>
                  {item.type === 'expense' && (
                    <View style={styles.categoryContainer}>
                      <Text style={styles.blueText}>
                        Subcategoría: {item.subCategoryName}
                      </Text>
                      {item.subCategoryColor && (
                        <View 
                          style={[
                            styles.colorCircle, 
                            { backgroundColor: item.subCategoryColor }
                          ]} 
                        />
                      )}
                    </View>
                  )}
                  <View style={styles.iconContainer}>
                  <TouchableOpacity onPress={() => { item.type === 'expense' ? handleDeleteExpense(item.id) : handleDeleteIncome(item.id)}}>
                      <FontAwesome5 name="trash-alt" size={20} color="red" />
                    </TouchableOpacity>
                    {item.type === 'expense' ? <UpdateExpense id={item.id} /> : <UpdateIncome id={item.id} />}
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
  inputWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  inputContainer: {
    width: '35%', // Ensure the input containers have the same width
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    width: '100%',
    textAlign: 'center',
  },
  label: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchButton: {
    backgroundColor: '#2E86C1',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  searchButtonText: {
    color: 'white',
    fontSize: 18,
  },
  expensesContainer: {
    marginTop: 30,
    backgroundColor: '',
    padding: 20,
    borderRadius: 10,
    width: '100%',
  },
  expensesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2E86C1',
  },
  columnsContainer: {
    flexDirection: 'column',
  },
  expenseItem: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: 'white',
  },
  newRow: {
    marginTop: 10,
  },
  blueText: {
    color: '#2E86C1',
    fontWeight: 'bold',
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginLeft: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  itemTypeText: {
    fontWeight: 'bold',
    marginBottom: 5,
  }
});

export default SummaryScreenMobile;

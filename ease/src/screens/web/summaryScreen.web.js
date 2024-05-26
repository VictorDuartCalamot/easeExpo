import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, TouchableOpacity, TextInput } from 'react-native';
import { getExpenses, getCategories, getSubCategories, deleteExpense, modifyExpense, getIncomes, deleteIncome,modifyIncome } from '../../services/api_management';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { FontAwesome5 } from '@expo/vector-icons';
import UpdateExpense from '../../constants/updateExpense';
import UpdateIncome from '../../constants/updateIncome';

const SummaryScreenWeb = () => {
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState({});
  const [subCategories, setSubCategories] = useState({});
  const [dataLoaded, setDataLoaded] = useState(false);

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
      setDataLoaded(true);
    } catch (error) {
      console.error('Error fetching categories or subcategories:', error);
    }
  };

  useEffect(() => {
    fetchCategoriesAndSubCategories();
  }, []);

  const handleFetchItems = async () => {
    try {
      const [startDate, endDate] = dateRange;
      const [expenseData, incomeData] = await Promise.all([
        getExpenses({ start_date: startDate.toISOString().slice(0, 10), end_date: endDate.toISOString().slice(0, 10) }),
        getIncomes({ start_date: startDate.toISOString().slice(0, 10), end_date: endDate.toISOString().slice(0, 10) })
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

  const handleDeleteExpense = async (expenseId) => {
    try {
      await deleteExpense(expenseId);
      const updatedExpenses = items.filter(expense => expense.id !== expenseId);
      setItems(updatedExpenses);
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };
  
  const handleModifyExpense = async (expenseId, newData) => {
    try {
      await modifyExpense(expenseId, newData);
      const updatedExpenses = items.map(expense => {
        if (expense.id === expenseId) {
          return { ...expense, ...newData };
        }
        return expense;
      });
      setItems(updatedExpenses);
    } catch (error) {
      console.error('Error modifying expense:', error);
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
  //TODO: Modificación del income
  const handleModifyIncome = async (incomeId) => {
    try {
      await modifyIncome(incomeId);
      const updatedIncome = items.filter(income => income.id !== incomeId);
      setItems(updatedIncome);
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };


  const handleSearch = () => {
    if (dataLoaded && dateRange[0] && dateRange[1]) {
      handleFetchItems();
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
        {items.length > 0 && (
          <View style={styles.expensesContainer}>
            <Text style={styles.expensesTitle}>
              Gastos e ingresos entre {dateRange[0].toISOString().slice(0, 10)} y {dateRange[1].toISOString().slice(0, 10)}:
            </Text>
            <View style={styles.gridContainer}>
              {items.map((item) => (
                <View
                  key={item.id}
                  style={[
                    styles.expenseItem,
                    { borderColor: item.type === 'expense' ? 'red' : 'green' }
                  ]}
                >
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
                  <View style={styles.flexGrow} />
                  <View style={styles.iconContainer}>
                    <TouchableOpacity onPress={() => { item.type === 'expense' ? handleDeleteExpense(item.id) : handleDeleteIncome(item.id)}}>
                      <FontAwesome5 name="trash-alt" size={20} color="red" />
                    </TouchableOpacity>
                    {item.type === 'expense' ? <UpdateExpense idExpense={item.id} /> : <UpdateIncome idIncome={item.id} />}
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
    padding: 10,
    borderRadius: 10,
    width: 300,
    maxHeight: 310,
    overflow: 'hidden',
    position: 'relative',
  },
  itemTypeText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
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
  flexGrow: {
    flexGrow: 1,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
    position: 'relative',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default SummaryScreenWeb;

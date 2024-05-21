import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground } from 'react-native';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { getExpenses, getCategories, getSubCategories } from '../../services/api_management';

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
        const subCategoriesData = await getSubCategories();
        const subCategoriesMap = {};
        subCategoriesData.forEach(subCategory => {
          subCategoriesMap[subCategory.id] = subCategory.name;
        });
        setSubCategories(subCategoriesMap);
      } catch (error) {
        console.error('Error fetching subcategories:', error);
      }
    };

    fetchSubCategories();
  }, []);

  return (
    <View style={styles.container}>
      <Calendar
        selectRange
        value={[selectedStartDate, selectedEndDate]}
        onChange={handleDateChange}
      />
      {expenses.length > 0 && (
        <ScrollView style={styles.scrollView}>
          <View style={styles.expensesContainer}>
            <Text style={styles.expensesTitle}>
              Gastos entre {selectedStartDate.toLocaleDateString()} y {selectedEndDate.toLocaleDateString()}:
            </Text>
            {expenses.map((expense) => (
              <View key={expense.id} style={styles.expenseItem}>
                <Text>title: {expense.title}</Text>
                <Text>Descripción: {expense.description}</Text>
                <Text>Monto: ${expense.amount}</Text>
                <View style={styles.categoryContainer}>
                  <Text style={styles.redText}>
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
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
    top: 50,
  },
  scrollView: {
    maxHeight: '70%', // Establece la altura máxima del ScrollView
  },
  expensesContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  expensesTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  expenseItem: {
    marginBottom: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
    padding: 10,
    borderRadius: 10,
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
});

export default SummaryScreenWeb;

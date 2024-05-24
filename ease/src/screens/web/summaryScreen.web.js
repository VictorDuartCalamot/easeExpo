import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { getExpenses, getCategories, getSubCategories } from '../../services/api_management';

const SummaryScreenWeb = () => {
  const [selectedStartDate, setSelectedStartDate] = useState(new Date());
  const [selectedEndDate, setSelectedEndDate] = useState(new Date());
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState({});
  const [subCategories, setSubCategories] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);

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
          // Si no hay categoría seleccionada, borramos las subcategorías
          setSubCategories({});
        }
      } catch (error) {
        console.error("Error fetching subcategories: ", error);
      }
    };

    fetchSubCategories(selectedCategory);
  }, [selectedCategory]);

  return (
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
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
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
    flexWrap: 'wrap', // Permitir que los elementos se envuelvan a una nueva fila
    justifyContent: 'center',
  },
  
  expenseItem: {
    marginBottom: 20,
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
    padding: 10,
    borderRadius: 10,
    width: 350, // Ancho fijo para cada elemento de gasto (por ejemplo, 200 píxeles)
    marginRight: 20, // Espacio entre gastos  
  },
  newColumn: {
    marginLeft: 10, // Espacio entre columnas
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

export default SummaryScreenWeb;
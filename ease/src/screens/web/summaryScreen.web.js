import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, TouchableOpacity, TextInput, Modal, Button } from 'react-native';
import { getExpenses, getCategories, getSubCategories, deleteExpense, updateExpense, updateIncome, getIncomes } from '../../services/api_management';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { FontAwesome5 } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';

const SummaryScreenWeb = () => {
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [categories, setCategories] = useState({});
  const [items, setItems] = useState([]);
  const [subCategories, setSubCategories] = useState({});
  const [dataLoaded, setDataLoaded] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [updateForm, setUpdateForm] = useState({ title: '', description: '', amount: '', category: '', subcategory: '', type: '' });
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);

  const fetchCategoriesAndSubCategories = async () => {
    try {
      const [categoriesData, subCategoriesData] = await Promise.all([getCategories(), getSubCategories()]);
      
      const categoriesMap = {};
      categoriesData.forEach(category => {
        categoriesMap[category.id] = { name: category.name, color: category.hexColor, type: category.type };
      });
      
      const subCategoriesMap = {};
      subCategoriesData.forEach(subCategory => {
        subCategoriesMap[subCategory.id] = { name: subCategory.name, color: subCategory.hexColor, category: subCategory.category };
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

  const handleDeleteItem = async (itemId, itemType) => {
    try {
      if (itemType === 'expense') {
        await deleteExpense(itemId);
      } else {
        await deleteIncome(itemId);
      }
      const updatedItems = items.filter(item => item.id !== itemId);
      setItems(updatedItems);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleModifyItem = (item) => {
    setSelectedItem(item);
    setUpdateForm({
      title: item.title,
      description: item.description,
      amount: item.amount.toString(),
      category: item.category || '',
      subcategory: item.subcategory || ''
    });
    setIsUpdateModalVisible(true);

    // Actualizar subcategorías filtradas
    if (item.category) {
      handleCategoryChange(item.category);
    }
  };

  const handleCategoryChange = (value) => {
    setUpdateForm({ ...updateForm, category: value, subcategory: '' });

    if (value) {
      const filtered = Object.keys(subCategories)
        .filter(key => subCategories[key].category === value)
        .map(key => ({ label: subCategories[key].name, value: key }));
      setFilteredSubCategories(filtered);
    } else {
      setFilteredSubCategories([]);
    }
  };

  const handleUpdateItem = async () => {
    try {
      const updatedItem = {
        ...selectedItem,
        title: updateForm.title,
        description: updateForm.description,
        amount: parseFloat(updateForm.amount),
        category: updateForm.category,
        subcategory: updateForm.subcategory
      };

      if (selectedItem.type === 'expense') {
        await updateExpense(updatedItem, updatedItem.id);
      } else {
        await updateIncome(updatedItem, updatedItem.id);
      }

      const updateItems = items.map(expense => expense.id === updatedItem.id ? updatedItem : expense);
      setItems(updateItems);
      setIsUpdateModalVisible(false);
    } catch (error) {
      console.error('Error updating item:', error);
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
          <Text style={styles.label}>Start date:</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            onChangeText={text => setDateRange([new Date(text), dateRange[1]])}
            value={dateRange[0].toISOString().slice(0, 10)}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Ending date:</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            onChangeText={text => setDateRange([dateRange[0], new Date(text)])}
            value={dateRange[1].toISOString().slice(0, 10)}
          />
        </View>
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
        {items.length > 0 && (
          <View style={styles.expensesContainer}>
            <Text style={styles.expensesTitle}>
              Expense and Income between {dateRange[0].toISOString().slice(0, 10)} y {dateRange[1].toISOString().slice(0, 10)}:
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
                    {item.type === 'expense' ? 'Expense' : 'Income'}
                  </Text>
                  <Text style={styles.blueText}>Title:</Text>
                  <Text>{item.title}</Text>
                  <Text style={styles.blueText}>Description:</Text>
                  <Text>{item.description}</Text>
                  <Text style={styles.blueText}>Total:</Text>
                  <Text>€{item.amount}</Text>
                  <Text style={styles.blueText}>Date:</Text>
                  <Text>{item.creation_date}</Text>
                  <Text style={styles.blueText}>Hour:</Text>
                  <Text>{item.creation_time}</Text>
                  <View style={styles.categoryContainer}>
                    <Text style={styles.blueText}>
                        Category: {item.categoryName}
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
                        Subcategory: {item.subCategoryName}
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
                    <TouchableOpacity onPress={() => handleDeleteExpense(item.id, item.type)}>
                      <FontAwesome5 name="trash-alt" size={20} color="red" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleModifyItem(item)}>
                      <FontAwesome5 name="edit" size={20} color="blue" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
       <Modal
          visible={isUpdateModalVisible}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {selectedItem?.type === 'expense' ? 'Update expense' : 'Update income'}
              </Text>
              <TextInput
                style={styles.modalInput}
                placeholder={selectedItem ? selectedItem.title : "Title"}
                value={updateForm.title}
                onChangeText={text => setUpdateForm({ ...updateForm, title: text })}
              />
              <TextInput
                style={styles.modalInput}
                placeholder={selectedItem ? selectedItem.description : "Description"}
                value={updateForm.description}
                onChangeText={text => setUpdateForm({ ...updateForm, description: text })}
              />
              <TextInput
                style={styles.modalInput}
                placeholder={selectedItem ? selectedItem.amount.toString() : "Amount"}
                value={updateForm.amount}
                onChangeText={text => setUpdateForm({ ...updateForm, amount: text })}
                keyboardType="numeric"
              />
              <RNPickerSelect
                onValueChange={handleCategoryChange}
                items={Object.keys(categories).map(key => ({
                  label: categories[key].name,
                  value: key,
                }))}
                value={updateForm.category}
                placeholder={{ label: "Select a category...", value: null }}
                style={pickerSelectStyles}
              />
              <RNPickerSelect
                onValueChange={value => setUpdateForm({ ...updateForm, subcategory: value })}
                items={filteredSubCategories}
                value={updateForm.subcategory}
                placeholder={{ label: "Select a subcategory...", value: null }}
                style={pickerSelectStyles}
              />
              <View style={styles.buttonContainer}>
                <Button title="Update" onPress={handleUpdateItem} />
              </View>
              <View style={styles.buttonContainer}>
                <Button title="Cancel" onPress={() => setIsUpdateModalVisible(false)} />
              </View>
            </View>
          </View>
        </Modal>
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
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
  },
  calendarContainer: {
    marginBottom: 20,
  },
  inputContainer: {
    width: '80%',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    color: '#fff',
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  searchButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  expensesContainer: {
    width: '100%',
    marginTop: 20,
  },
  expensesTitle: {
    fontSize: 18,
    color: "black",
    marginBottom: 10,
    alignSelf: "center",
  },
  gridContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expenseItem: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  blueText: {
    color: '#007BFF',
  },
  redText: {
    color: '#FF4136',
  },
  categoryContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  colorCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginLeft: 5,
  },
  iconContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    borderRadius: 10,
    width: 400,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
    alignSelf: "center",
  },
  modalInput: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
  },
  buttonContainer: {
    marginBottom: 10, // Espacio entre botones
  },
});
const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
    marginBottom: 20, // Espacio entre selectores
    padding: 20,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
    marginBottom: 20, // Espacio entre selectores
  },
};

export default SummaryScreenWeb;
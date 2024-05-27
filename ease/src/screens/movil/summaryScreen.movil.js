import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, TouchableOpacity, TextInput, Modal, Button, Alert } from 'react-native';
import { getExpenses, getCategories, getSubCategories, getIncomes, deleteExpense, deleteIncome, updateExpense, updateIncome } from '../../services/api_management';
import CalendarPicker from 'react-native-calendar-picker';
import { FontAwesome5 } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';

const SummaryScreenMobile = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState({});
  const [subCategories, setSubCategories] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [updateForm, setUpdateForm] = useState({ title: '', description: '', amount: '', category: '', subcategory: '' });
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

      const updatedItems = items.map(item => item.id === updatedItem.id ? updatedItem : item);
      setItems(updatedItems);
      setIsUpdateModalVisible(false);
    } catch (error) {
      console.error('Error updating item:', error);
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
            <Text style={styles.label}>Start date:</Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              onChangeText={text => setStartDate(text)}
              value={startDate}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Ending date:</Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              onChangeText={text => setEndDate(text)}
              value={endDate}
            />
          </View>
        </View>
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
        {items.length > 0 && (
          <View style={styles.expensesContainer}>
            <Text style={styles.expensesTitle}>
              Expenses and income between {startDate} y {endDate}:
            </Text>
            <View style={styles.columnsContainer}>
              {items.map((item, index) => (
                <View key={item.id} style={[styles.expenseItem, index % 2 !== 0 && styles.newRow, { borderColor: item.type === 'expense' ? 'red' : 'green' }]}>
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
                  <View style={styles.iconContainer}>
                    <TouchableOpacity onPress={() => handleDeleteItem(item.id, item.type)}>
                      <FontAwesome5 name="trash" size={20} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleModifyItem(item)}>
                      <FontAwesome5 name="edit" size={20} color="black" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
        <Modal visible={isUpdateModalVisible} animationType="slide">
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {selectedItem?.type === 'expense' ? 'Update expense' : 'Update income'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder={selectedItem?.title || 'Title'}
              value={updateForm.title}
              onChangeText={(text) => setUpdateForm({ ...updateForm, title: text })}
            />
            <TextInput
              style={styles.input}
              placeholder={selectedItem?.description || 'Description'}
              value={updateForm.description}
              onChangeText={(text) => setUpdateForm({ ...updateForm, description: text })}
            />
            <TextInput
              style={styles.input}
              placeholder={selectedItem?.amount.toString() || 'Amount'}
              value={updateForm.amount}
              onChangeText={(text) => setUpdateForm({ ...updateForm, amount: text })}
              keyboardType="numeric"
            />
            <RNPickerSelect
              onValueChange={handleCategoryChange}
              items={Object.keys(categories)
                .filter(key => categories[key].type === selectedItem?.type)
                .map((key) => ({ label: categories[key].name, value: key }))}
              placeholder={{ label: selectedItem?.categoryName || 'Select a category...', value: null }}
              style={pickerSelectStyles}
              value={updateForm.category}
            />
            {selectedItem?.type === 'expense' && (
              <RNPickerSelect
                onValueChange={(value) => setUpdateForm({ ...updateForm, subcategory: value })}
                items={filteredSubCategories}
                placeholder={{ label: selectedItem?.subCategoryName || 'Select a subcategory...', value: null }}
                style={pickerSelectStyles}
                value={updateForm.subcategory}
              />
            )}
            <View style={styles.buttonContainer}>
              <Button title="Cancel" onPress={() => setIsUpdateModalVisible(false)} />
              <Button title="Update" onPress={handleUpdateItem} />
            </View>
          </View>
        </Modal>
      </ScrollView>
    </ImageBackground>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
    marginVertical: 10,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
    marginVertical: 10,
  },
});

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  inputContainer: {
    flex: 1,
    marginHorizontal: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    backgroundColor: '#fff',
  },
  searchButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  expensesContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 20,
    borderRadius: 8,
  },
  expensesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  columnsContainer: {
    flexDirection: 'column',
  },
  expenseItem: {
    borderBottomWidth: 2,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
    marginBottom: 10,
  },
  newRow: {
    marginTop: 20,
  },
  itemTypeText: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  blueText: {
    color: 'blue',
  },
  colorCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginLeft: 10,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  currentDataContainer: {
    marginTop: 20,
  },
  currentDataTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default SummaryScreenMobile;
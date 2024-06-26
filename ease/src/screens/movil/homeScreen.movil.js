import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Dimensions, ImageBackground, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { PieChart } from 'react-native-chart-kit';
import { getExpenses, getIncomes, getCategories } from '../../services/api_management';
import AddExpenseButton from '../../constants/AddExpenseButton';
import AddIncomeTextInput from '../../constants/AddIncomeTextInput';

const screenWidth = Dimensions.get("window").width;

const HomeScreenMovil = ({ navigation }) => {
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [categories, setCategories] = useState({});
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const fetchCategories = async () => {
    try {
      const categoriesData = await getCategories();
      const categoriesMap = {};
      categoriesData.forEach(category => {
        categoriesMap[category.id] = { name: category.name, color: category.hexColor };
      });
      setCategories(categoriesMap);
      setDataLoaded(true);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const groupDataByCategory = (data) => {
    const groupedData = data.reduce((acc, item) => {
      const category = categories[item.category] || { name: 'Sin categoría', color: '#000000' };
      if (!acc[category.name]) {
        acc[category.name] = {
          name: category.name,
          population: 0,
          color: category.color,
          legendFontColor: "#7F7F7F",
          legendFontSize: 15
        };
      }
      acc[category.name].population += parseFloat(item.amount);
      return acc;
    }, {});
    return Object.values(groupedData);
  };

  const fetchExpenses = async (date) => {
    try {
      const dateString = date.toISOString().split('T')[0];
      const expenseData = await getExpenses({ start_date: dateString, end_date: dateString, start_time: '', end_time: '' });
      if (!Array.isArray(expenseData)) {
        console.error("Error: los datos de expense no son un array");
        return;
      }
      const groupedExpenses = groupDataByCategory(expenseData);
      setExpenses(groupedExpenses);
    } catch (error) {
      console.error("Error fetching expenses: ", error);
    }
  };

  const fetchIncomes = async (date) => {
    try {
      const dateString = date.toISOString().split('T')[0];
      const incomeData = await getIncomes({ start_date: dateString, end_date: dateString, start_time: '', end_time: '' });
      if (!Array.isArray(incomeData)) {
        console.error("Error: los datos de income no son un array");
        return;
      }
      const groupedIncomes = groupDataByCategory(incomeData);
      setIncomes(groupedIncomes);
    } catch (error) {
      console.error('Error fetching income:', error);
    }
  };

  const fetchAllData = async (date) => {
    await fetchExpenses(date);
    await fetchIncomes(date);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (dataLoaded) {
      fetchAllData(currentDate);
    }
  }, [currentDate, dataLoaded]);

  useEffect(() => {
    setChartData([...expenses, ...incomes]);
  }, [expenses, incomes]);

  const handleLogout = () => {
    navigation.navigate('Login');
  };

  const handlePrevDay = () => {
    const prevDay = new Date(currentDate);
    prevDay.setDate(prevDay.getDate() - 1);
    setCurrentDate(prevDay);
  };

  const handleNextDay = () => {
    const nextDay = new Date(currentDate);
    nextDay.setDate(nextDay.getDate() + 1);
    setCurrentDate(nextDay);
  };

  const handleMenuItemPress = (screen) => {
    navigation.navigate(screen);
    setIsMenuOpen(false);
  };

  return (
    <ImageBackground source={require('../../pictures/fondo2.jpg')} style={styles.background}>
      <View>
        <Image source={require('../../pictures/logo.png')} style={styles.logo} />
      </View>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => setIsMenuOpen(!isMenuOpen)} style={styles.menuButton}>
          <MaterialIcons name="menu" size={24} color="black" />
        </TouchableOpacity>
        {isMenuOpen && (
          <View style={styles.menuDropdown}>
            <TouchableOpacity onPress={() => handleMenuItemPress('Summary')}>
              <View style={styles.menuItem}>
                <MaterialIcons name="description" size={24} color="black" />
                <Text style={styles.menuText}>Summary</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleMenuItemPress('Profile')}>
              <View style={styles.menuItem}>
                <MaterialIcons name="person" size={24} color="black" />
                <Text style={styles.menuText}>Profile</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleMenuItemPress('ChatClient')}>
              <View style={styles.menuItem}>
                <MaterialIcons name="chat" size={24} color="black" />
                <Text style={styles.menuText}>Chat</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleMenuItemPress('Financer Asistant')}>
              <View style={styles.menuItem}>
                <MaterialIcons name="assistant" size={24} color="black" />
                <Text style={styles.menuText}>Financer Asistant</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout}>
              <View style={styles.menuItem}>
                <MaterialIcons name="exit-to-app" size={24} color="red" />
                <Text style={[styles.menuText, { color: 'red' }]}>Logout</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.chartContainer}>
          <Text style={[styles.chartTitle, { textAlign: 'center' }]}>Incomes and expenses</Text>
          <View style={styles.dateContainer}>
            <TouchableOpacity style={styles.dateButton} onPress={handlePrevDay}>
              <MaterialIcons name="keyboard-arrow-left" size={24} color="black" />
            </TouchableOpacity>
            <Text style={[styles.dateText, { textAlign: 'center' }]}>{currentDate.toDateString()}</Text>
            <TouchableOpacity style={styles.dateButton} onPress={handleNextDay}>
              <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />
            </TouchableOpacity>
          </View>
          {chartData.length > 0 ? (
            <View style={styles.chartBackground}>
              <PieChart
                data={chartData}
                width={screenWidth - 40}
                height={220}
                chartConfig={{
                  backgroundColor: "#ffffff",
                  backgroundGradientFrom: "#ffffff",
                  backgroundGradientTo: "#ffffff",
                  decimalPlaces: 2,
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                accessor={"population"}
                backgroundColor={"transparent"}
                paddingLeft={"15"}
                center={[0, 0]}
                absolute={false}
              />
            </View>
          ) : (
            <View style={[styles.chartBackground, { alignItems: 'center' }]}>
              <Text>No expenses or incomes available</Text>
            </View>
          )}
        </View>
        <View style={styles.buttonsContainer}>
          {chartData.length > 0 ? (
            <>
              <AddExpenseButton onPress={() => { }} />
              <AddIncomeTextInput onPress={() => { }} />
            </>
          ) : (
            <View style={{ alignItems: 'center', flexDirection: "row" }}>
              <AddExpenseButton onPress={() => { }} />
              <AddIncomeTextInput onPress={() => { }} />
            </View>
          )}
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    position: 'relative',
  },
  menuButton: {
    position: 'absolute',
    marginTop: 37,
    left: 0,
    zIndex: 2,
    padding: 10,
  },
  menuDropdown: {
    position: 'absolute',
    left: 0,
    top: 78,
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 10,
    zIndex: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  menuText: {
    marginLeft: 10,
    fontSize: 16,
  },
  chartContainer: {
    position: "absolute",
    flex: 1,
    padding: 5,
    justifyContent: 'center',
    marginTop: 250,
    width: '100%',
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  dateButton: {
    paddingHorizontal: 10,
  },
  dateText: {
    fontSize: 16,
  },
  chartBackground: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 4,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 230,
    width: '100%',
  },
  logo: {
    position: "absolute",
    width: 100,
    height: 100,
    alignSelf: 'center',
    borderRadius: 30,
    marginTop: 105,
  },
});

export default HomeScreenMovil;
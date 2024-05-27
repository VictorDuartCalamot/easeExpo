import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Dimensions, Image, ImageBackground, TouchableOpacity, Button } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { PieChart } from 'react-native-chart-kit';
import { getExpenses, getIncomes, getCategories } from '../../services/api_management';
import AddExpenseButtonWeb from '../../constants/AddExpenseButtonWeb';
import AddIncomeTextInputWeb from '../../constants/AddIncomeTextInputWeb';

const screenWidth = Dimensions.get("window").width;

const HomeScreenWeb = ({ navigation }) => {
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [categories, setCategories] = useState({});
  const [dataLoaded, setDataLoaded] = useState(false);

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

  const fetchExpenses = async (date) => {
    try {
      const dateString = date.toISOString().split('T')[0];
      const expenseData = await getExpenses({ start_date: dateString, end_date: dateString, start_time: '', end_time: '' });
      if (!Array.isArray(expenseData)) {
        console.error("Error: los datos de expense no son un array");
        return;
      }
      const cleanedExpenseData = expenseData.map((exp) => ({
        name: categories[exp.category]?.name || 'Sin categoría',
        population: parseFloat(exp.amount),
        color: categories[exp.category]?.color || '#000000',
        legendFontColor: "#7F7F7F",
        legendFontSize: 15
      }));
      setExpenses(cleanedExpenseData);
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
      const cleanedIncomeData = incomeData.map((inc) => ({
        name: categories[inc.category]?.name || 'Sin categoría',
        population: parseFloat(inc.amount),
        color: categories[inc.category]?.color || '#000000',
        legendFontColor: "#7F7F7F",
        legendFontSize: 15
      }));
      setIncomes(cleanedIncomeData);
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

  return (
    <ImageBackground source={require('../../pictures/fondo2.jpg')} style={styles.background}>
      <View style={styles.container}>
        <View style={styles.menuContainer}>
          <Image source={require('../../pictures/logo.png')} style={styles.logo} />
          <View style={styles.iconColumn}>
            <TouchableOpacity style={styles.iconItem} onPress={() => navigation.navigate('Summary')}>
              <MaterialIcons name="description" size={24} color="black" />
              <Text style={styles.menuText}>Summary</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconItem} onPress={() => navigation.navigate('Profile')}>
              <MaterialIcons name="person" size={24} color="black" />
              <Text style={styles.menuText}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconItem} onPress={() => navigation.navigate('ChatClient')}>
              <MaterialIcons name="chat" size={24} color="black" />
              <Text style={styles.menuText}>Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconItem} onPress={() => navigation.navigate('Financer Asistant')}>
              <MaterialIcons name="assistant" size={24} color="black" />
              <Text style={styles.menuText}>Financer Assistant</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.logoutContainer}>
            <TouchableOpacity style={styles.iconItem} onPress={handleLogout}>
              <MaterialIcons name="exit-to-app" size={24} color="red" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
        {chartData.length > 0 ? (
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Incomes and expenses</Text>
            <View style={styles.dateContainer}>
              <TouchableOpacity style={styles.dateButton} onPress={handlePrevDay}>
                <MaterialIcons name="keyboard-arrow-left" size={24} color="black" />
              </TouchableOpacity>
              <Text style={styles.dateText}>{currentDate.toDateString()}</Text>
              <TouchableOpacity style={styles.dateButton} onPress={handleNextDay}>
                <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />
              </TouchableOpacity>
            </View>
            <View style={styles.chartBackground}>
              <PieChart
                data={chartData}
                width={screenWidth * 0.7}
                height={360}
                chartConfig={{
                  backgroundColor: "#ffffff",
                  backgroundGradientFrom: "#ffffff",
                  backgroundGradientTo: "#ffffff",
                  decimalPlaces: 2,
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                accessor={"population"}
                backgroundColor={"transparent"}
                paddingLeft={"20"}
                center={[0, 0]}
                absolute={false}
              />
            </View>
            <View style={styles.centeredButtonsContainer}>
              <AddExpenseButtonWeb onPress={() => {}} />
              <View style={{ width: 10 }} />
              <View style={{ width: 20, marginTop: 330 }} />
              <AddIncomeTextInputWeb onPress={() => {}} />
              <View style={{ width: 10 }} />
            </View>
          </View>
        ) : (
          <View style={styles.emptyStateContainer}>
            <View style={styles.dateContainer}>
              <TouchableOpacity style={styles.dateButton} onPress={handlePrevDay}>
                <MaterialIcons name="keyboard-arrow-left" size={24} color="black" />
              </TouchableOpacity>
              <Text style={styles.dateText}>{currentDate.toDateString()}</Text>
              <TouchableOpacity style={styles.dateButton} onPress={handleNextDay}>
                <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />
              </TouchableOpacity>
            </View>
            <AddExpenseButtonWeb />
            <AddIncomeTextInputWeb />
          </View>
        )}
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
    flexDirection: 'row', // To align menu and content side by side
  },
  menuContainer: {
    flex: 0.1,  // Adjusted width of the menu container
    backgroundColor: 'white',
    padding: 10,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    elevation: 5, // For Android shadow
    shadowColor: '#000', // For iOS shadow
    shadowOffset: { width: 0, height: 2 }, // For iOS shadow
    shadowOpacity: 0.8, // For iOS shadow
    shadowRadius: 2, // For iOS shadow
    justifyContent: 'space-between', // Align items and logout button
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateButton: {
    padding: 10,
  },
  dateText: {
    fontSize: 18,
    marginHorizontal: 10,
  },
  chartContainer: {
    flex: 0.9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartBackground: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    elevation: 5, // For Android shadow
    shadowColor: '#000', // For iOS shadow
    shadowOffset: { width: 0, height: 2 }, // For iOS shadow
    shadowOpacity: 0.8, // For iOS shadow
    shadowRadius: 2, // For iOS shadow
  },
  chartTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 60,
  },
  centeredButtonsContainer: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    justifyContent: 'center', // Alineación horizontal centrada
    alignItems: "center"
  },
  buttonsContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconColumn: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  iconItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  menuText: {
    marginLeft: 5,
    fontSize: 16,
    alignItems: "center",
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginBottom: 20,
    alignSelf: "center",
  },
  logoutContainer: {
    marginTop: 'auto',
    marginBottom: 10,
  },
  logoutText: {
    marginLeft: 5,
    fontSize: 16,
    color: 'red',
  },
});

export default HomeScreenWeb;

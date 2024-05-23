import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Dimensions, Image, ImageBackground, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { PieChart } from 'react-native-chart-kit';
import { getExpenses, getIncomes } from '../../services/api_management';
import AddExpenseButton from '../../components/AddExpenseButton';
import AddIncomeTextInput from '../../components/AddIncomeTextInput';

const screenWidth = Dimensions.get("window").width;

const HomeScreenWeb = ({ navigation }) => {
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const expenseData = await getExpenses({ start_date: '2024-05-20', end_date: '2024-05-20', start_time: '', end_time: '' });
        if (!Array.isArray(expenseData)) {
          console.error("Error: los datos de expense no son un array");
          return;
        }
        const cleanedExpenseData = expenseData.map((exp, index) => ({
          name: exp.title,
          population: parseFloat(exp.amount),
          color: `hsl(${index * 360 / expenseData.length}, 70%, 70%)`,
          legendFontColor: "#7F7F7F",
          legendFontSize: 15
        }));
        setExpenses(cleanedExpenseData);
      } catch (error) {
        console.error("Error fetching expenses: ", error);
      }
    };

    const fetchIncomes = async () => {
      try {
        const incomeData = await getIncomes({ start_date: '2024-05-20', end_date: '2024-05-20', start_time: '', end_time: '' });
        if (!Array.isArray(incomeData)) {
          console.error("Error: los datos de income no son un array");
          return;
        }
        const cleanedIncomeData = incomeData.map((inc, index) => ({
          name: inc.title,
          population: parseFloat(inc.amount),
          color: `hsl(${(index + expenses.length) * 360 / incomeData.length}, 70%, 70%)`,
          legendFontColor: "#7F7F7F",
          legendFontSize: 15
        }));
        setIncomes(cleanedIncomeData);
      } catch (error) {
        console.error('Error fetching income:', error);
      }
    };

    const fetchAllData = async () => {
      await fetchExpenses();
      await fetchIncomes();
    };

    fetchAllData();
  }, [refresh]);

  useEffect(() => {
    setChartData([...expenses, ...incomes]);
  }, [expenses, incomes]);

  const handleLogout = () => {
    navigation.navigate('Login');
  };

  const handleAddExpense = () => {
    setRefresh(!refresh);
  };

  const handleAddIncome = () => {
    setRefresh(!refresh);
  };

  return (
    <ImageBackground source={require('../../pictures/fondo2.jpg')} style={styles.background}>
      <View style={styles.container}>
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
          <TouchableOpacity style={styles.iconItem} onPress={() => navigation.navigate('ChatIA')}>
            <MaterialIcons name="assistant" size={24} color="black" />
            <Text style={styles.menuText}>Financer Assistant</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconItem} onPress={handleLogout}>
            <MaterialIcons name="exit-to-app" size={24} color="black" />
            <Text style={styles.menuText}>Logout</Text>
          </TouchableOpacity>
        </View>
        {chartData.length > 0 ? (
          <>
            <View style={styles.chartContainer}>
              <PieChart
                data={chartData}
                width={screenWidth * 0.8}
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
            <View style={styles.buttonsContainer}>
              <AddExpenseButton onPress={handleAddExpense} />
              <AddIncomeTextInput onPress={handleAddIncome} />
            </View>
          </>
        ) : (
          <View style={styles.buttonsContainer}>
            <AddExpenseButton onPress={handleAddExpense} />
            <AddIncomeTextInput onPress={handleAddIncome} />
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
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1, // Ensuring the main container is on top
  },
  chartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0,
  },
  buttonsContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'column',
    alignItems: 'flex-end',
    zIndex: 2,
  },
  iconColumn: {
    flexDirection: 'column',
    position: 'absolute',
    left: 35,
    top: 105,
    alignItems: 'flex-start',
    zIndex: 2,
  },
  iconItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  menuText: {
    marginLeft: 5,
    fontSize: 16,
  },
  logo: {
    position: 'absolute',
    top: 40,
    left: 35,
    width: 50,
    height: 50,
    borderRadius: 10,
    zIndex: 2,
  },
});

export default HomeScreenWeb;

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Dimensions, Image, ImageBackground } from 'react-native';
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
      const today = new Date();
      const dateString = today.toISOString().split('T')[0];

      try {
        const expenseData = await getExpenses({ start_date: dateString, end_date: dateString, start_time: '', end_time: '' });
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
      const today = new Date();
      const dateString = today.toISOString().split('T')[0];

      try {
        const incomeData = await getIncomes({ start_date: dateString, end_date: dateString, start_time: '', end_time: '' });
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
          <View style={styles.iconItem}>
            <MaterialIcons name="description" size={24} color="black" />
            <Text style={styles.menuText} onPress={() => navigation.navigate('Summary')}>Summary</Text>
          </View>
          <View style={styles.iconItem}>
            <MaterialIcons name="person" size={24} color="black" />
            <Text style={styles.menuText} onPress={() => navigation.navigate('Profile')}>Profile</Text>
          </View>
          <View style={styles.iconItem}>
            <MaterialIcons name="exit-to-app" size={24} color="black" onPress={handleLogout} />
            <Text style={styles.menuText} onPress={handleLogout}>Logout</Text>
          </View>
        </View>
        {chartData.length > 0 ? (
          <>
            <View style={styles.chartContainer}>
              <PieChart
                data={chartData}
                width={screenWidth}
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
  },
  chartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonsContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  iconColumn: {
    flexDirection: 'column',
    position: 'absolute',
    left: 350,
    top: 100,
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
  },
  logo: {
    position: 'absolute',
    top: 45,
    left: 350,
    width: 50,
    height: 50,
    borderRadius: 10,
  },
});

export default HomeScreenWeb;

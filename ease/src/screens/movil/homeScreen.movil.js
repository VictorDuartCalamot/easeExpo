import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Dimensions, Image, ImageBackground, TouchableOpacity } from 'react-native';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import { PieChart } from 'react-native-chart-kit';
import { getExpenses, getIncomes } from '../../services/api_management';
import AddExpenseButton from '../../constants/AddExpenseButton';
import AddIncomeTextInput from '../../constants/AddIncomeTextInput';

const screenWidth = Dimensions.get("window").width;

const HomeScreenMovil = ({ navigation }) => {
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

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
          color: getRandomColor(),
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
          color: getRandomColor(),
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
          <TouchableOpacity style={styles.iconItem} onPress={() => navigation.navigate('ChatIA')}>
            <MaterialIcons name="assistant" size={24} color="black" />
            <Text style={styles.menuText}>Financer Assistant</Text>
          </TouchableOpacity> 
          <TouchableOpacity style={styles.iconItem}>
              <AntDesign name="wechat" size={24} color="black"/>
              <Text style={styles.menuText} onPress={() => navigation.navigate('ChatClient')}>Chat</Text>
          </TouchableOpacity>
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
    left: 35,
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
    left: 35,
    width: 50,
    height: 50,
    borderRadius: 10,
  },
});

export default HomeScreenMovil;
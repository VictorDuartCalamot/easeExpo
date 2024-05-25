import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Dimensions, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { PieChart } from 'react-native-chart-kit';
import { getExpenses, getIncomes } from '../../services/api_management';
import AddExpenseButton from '../../components/AddExpenseButton';
import AddIncomeTextInput from '../../components/AddIncomeTextInput';

const screenWidth = Dimensions.get("window").width;

const HomeScreenMobile = ({ navigation }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchExpenses = async () => {
      const today = new Date();
      const dateString = today.toISOString().split('T')[0];

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
    <View style={styles.container}>
      <MaterialIcons name="home" size={24} color="black" onPress={() => setShowMenu(!showMenu)} style={styles.menuIcon} />
      {showMenu && (
        <View style={styles.menu}>
          <View style={styles.menuItem}>
            <MaterialIcons name="description" size={24} color="black" />
            <Text style={styles.menuText} onPress={() => { navigation.navigate('Summary'); setShowMenu(false); }}>Summary</Text>
          </View>
        </View>
      )}
      <View style={styles.avatarContainer}>
        <MaterialIcons name="person" size={24} color="black" onPress={() => setShowAvatarMenu(!showAvatarMenu)} style={styles.avatarIcon} />
        {showAvatarMenu && (
          <View style={styles.menu1}>
            <View style={styles.menuItem}>
              <MaterialIcons name="person" size={24} color="black" />
              <Text style={styles.menuText} onPress={() => { navigation.navigate('Profile'); setShowAvatarMenu(false); }}>Profile</Text>
            </View>
            <View style={styles.menuItem}>
              <MaterialIcons name="exit-to-app" size={24} color="black" onPress={handleLogout} />
              <Text style={styles.menuText} onPress={handleLogout}>Logout</Text>
            </View>
          </View>
        )}
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {chartData.length > 0 ? (
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
        ) : null}
        <View style={styles.buttonsContainer}>
          <AddExpenseButton onPress={handleAddExpense} />
          <AddIncomeTextInput onPress={handleAddIncome} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonsContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  menuIcon: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  menu: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    zIndex: 1,
  },
  avatarContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  avatarIcon: {
    marginBottom: 5,
  },
  avatarMenu: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    position: 'absolute',
    right: 0,
    top: 30,
    zIndex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  menuText: {
    marginLeft: 10,
    fontSize: 16,
  },
});

export default HomeScreenMobile;
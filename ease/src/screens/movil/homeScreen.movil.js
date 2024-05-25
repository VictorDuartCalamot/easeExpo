import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Dimensions, Image, ImageBackground, TouchableOpacity } from 'react-native';
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  const handleMenuItemPress = (screen) => {
    navigation.navigate(screen);
    setIsMenuOpen(false); // Cierra el menú después de navegar
  };

  return (
    <ImageBackground source={require('../../pictures/fondo2.jpg')} style={styles.background}>
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
            <TouchableOpacity onPress={() => handleMenuItemPress('ChatIA')}>
              <View style={styles.menuItem}>
                <MaterialIcons name="assistant" size={24} color="black" />
                <Text style={styles.menuText}>Chat IA</Text>
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
          <Image source={require('../../pictures/logo.png')} style={styles.logo} />
          {chartData.length > 0 ? (
            <View style={styles.chartBackground}>
            <PieChart
  data={chartData}
  width={screenWidth * 0.8}
  height={200}
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
  style={{
    labels: {
      justifyContent: "center",
      alignItems: "center",
      marginTop: 10,
      marginBottom: 10,
    },
  }}
  labelRadius={5} // Ajusta este valor según tu preferencia
/>
            </View>
          ) : (
            <View style={styles.centeredButtonsContainer}>
              <Text></Text>
            </View>
          )}
          <View style={styles.centeredButtonsContainer}>
            <AddExpenseButton onPress={handleAddExpense} />
            <View style={{ width: 10 }} />
            <AddIncomeTextInput onPress={handleAddIncome} />
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    position: 'relative',
  },
  menuButton: {
    position: 'absolute',
    marginTop: 20,
    left: 0,
    zIndex: 2, // Asegura que el botón esté por encima del menú desplegable
    padding: 10,
  },
  menuDropdown: {
    position: 'absolute',
    left: 0,
    top: 60,
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 10,
    zIndex: 1, // Asegura que el menú esté por encima de otros elementos
    elevation: 5, // Para sombra en Android
    shadowColor: '#000', // Para sombra en iOS
    shadowOffset: { width: 0, height: 2 }, // Para sombra en iOS
    shadowOpacity: 0.8, // Para sombra en iOS
    shadowRadius: 2, // Para sombra en iOS
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  menuText: {
    fontSize: 16,
    marginLeft: 10,
  },
  chartContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  chartBackground: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    elevation: 3,
    marginTop: 20,
  },
  centeredButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  logo: {
    width: 70, // Ajusta el tamaño del logo
    height: 70,
    resizeMode: 'contain', // Para que el logo mantenga su proporción
    marginTop:-150, // Espacio entre el logo y el gráfico
    borderRadius:30,
  },
});

export default HomeScreenMobile;
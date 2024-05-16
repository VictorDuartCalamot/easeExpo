import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { getExpenses } from './api'; // Ajusta la ruta según la ubicación de tu archivo API

const SummaryScreenWeb = () => {
  const [selectedDates, setSelectedDates] = useState([]);
  const [firstSelectedDate, setFirstSelectedDate] = useState(null);
  const [secondSelectedDate, setSecondSelectedDate] = useState(null);
  const [totalGastos, setTotalGastos] = useState(0);

  const handleDateChange = (date) => {
    setSelectedDates(date);
    if (date.length === 2) {
      setFirstSelectedDate(date[0]);
      setSecondSelectedDate(date[1]);
    } else {
      setFirstSelectedDate(null);
      setSecondSelectedDate(null);
    }
  };

  const obtenerGastosEntreFechas = async () => {
    try {
      if (firstSelectedDate && secondSelectedDate) {
        const response = await getExpenses({
          start_date: firstSelectedDate.toISOString(),
          end_date: secondSelectedDate.toISOString(),
        });

        // Calcular la suma de los gastos obtenidos
        let totalGastosEntreFechas = 0;
        response.forEach((expense) => {
          totalGastosEntreFechas += expense.amount;
        });

        setTotalGastos(totalGastosEntreFechas);
      } else {
        setTotalGastos(0);
      }
    } catch (error) {
      console.error('Error obteniendo gastos:', error);
    }
  };

  useEffect(() => {
    obtenerGastosEntreFechas();
  }, [firstSelectedDate, secondSelectedDate]);

  return (
    <View style={{ alignItems: 'center' }}>
      <Calendar
        selectRange
        value={selectedDates}
        onChange={handleDateChange}
      />
      {firstSelectedDate && secondSelectedDate && (
        <View style={{ marginTop: 20 }}>
          <Text>
            Gastos totales entre {firstSelectedDate.toLocaleDateString()} y {secondSelectedDate.toLocaleDateString()}:
          </Text>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
            ${totalGastos}
          </Text>
        </View>
      )}
    </View>
  );
};

export default SummaryScreenWeb;

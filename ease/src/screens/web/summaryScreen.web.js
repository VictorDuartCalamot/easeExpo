import React, { useState } from 'react';
import { View, Text } from 'react-native';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const SummaryScreenWeb = () => {
  const [selectedDates, setSelectedDates] = useState([]);
  const [totalGastos, setTotalGastos] = useState(0);

  const handleDateChange = (date) => {
    if (selectedDates.includes(date)) {
      setSelectedDates(selectedDates.filter((d) => d !== date));
    } else {
      setSelectedDates([...selectedDates, date]);
    }
  };

  const calcularTotalGastos = () => {
    // Simulando la obtención de los gastos totales de la API
    const gastosTotales = selectedDates.reduce((total, date) => total + obtenerGastosPorFecha(date), 0);
    setTotalGastos(gastosTotales);
  };

  const obtenerGastosPorFecha = (date) => {
    // Simulación de la obtención de los gastos de la API
    // Aquí deberías hacer una llamada a tu API para obtener los gastos de la fecha
    // Por simplicidad, aquí devolveremos un gasto aleatorio
    return Math.floor(Math.random() * 100);
  };

  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>
        Gastos totales seleccionados: ${totalGastos}
      </Text>
      <Calendar
        selectRange
        value={selectedDates}
        onChange={(dates) => {
          setSelectedDates(dates);
          calcularTotalGastos();
        }}
        onClickDay={handleDateChange}
      />
    </View>
  ); 
};

export default SummaryScreenWeb;

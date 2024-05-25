import React, { useState } from 'react';
import { View, Button, TextInput, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';

const CalendarScreen = () => {
  const [selectedDates, setSelectedDates] = useState({});
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [expenseDescription, setExpenseDescription] = useState('');

  const handleDayPress = (day) => {
    const selected = { ...selectedDates };
    if (selected[day.dateString]) {
      // Deseleccionar el día si ya está seleccionado
      delete selected[day.dateString];
    } else {
      // Seleccionar el día si no está seleccionado
      selected[day.dateString] = { selected: true };
      setShowAddExpense(true); // Mostrar el formulario para agregar gastos
    }
    setSelectedDates(selected);
  };

  const handleAddExpense = async () => {
    // Envía la información del gasto al backend para guardarlo en la base de datos del usuario
    try {
      const response = await fetch('URL_del_API_para_agregar_gastos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Añade aquí cualquier token de autenticación que necesites para identificar al usuario
        },
        body: JSON.stringify({
          date: Object.keys(selectedDates)[0], // Solo toma la primera fecha seleccionada
          description: expenseDescription,
        }),
      });
      const data = await response.json();
      console.log('Gasto agregado:', data);
      // Aquí puedes agregar lógica adicional como actualizar la lista de gastos del usuario
      Alert.alert('Éxito', 'Gasto agregado correctamente');
    } catch (error) {
      console.error('Error al agregar el gasto:', error);
      Alert.alert('Error', 'Hubo un problema al agregar el gasto. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Calendar
        markedDates={selectedDates}
        onDayPress={handleDayPress}
      />
      {showAddExpense && (
        <View style={{ margin: 20 }}>
          <TextInput
            placeholder="Descripción del gasto"
            value={expenseDescription}
            onChangeText={setExpenseDescription}
          />
          <Button title="Agregar Gasto" onPress={handleAddExpense} />
        </View>
      )}
    </View>
  );
};

export default CalendarScreen;

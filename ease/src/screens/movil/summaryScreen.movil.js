import React, { useState } from 'react';
import { View } from 'react-native';
import { Calendar } from 'react-native-calendars';

const CalendarScreen = () => {
  const [selectedDates, setSelectedDates] = useState({});

  const handleDayPress = (day) => {
    const selected = { ...selectedDates };
    if (selected[day.dateString]) {
      // Deseleccionar el día si ya está seleccionado
      delete selected[day.dateString];
    } else {
      // Seleccionar el día si no está seleccionado
      selected[day.dateString] = { selected: true };
    }
    setSelectedDates(selected);
  };

  return (
    <View style={{ flex: 1 }}>
      <Calendar
        markedDates={selectedDates}
        onDayPress={handleDayPress}
      />
    </View>
  );
};

export default CalendarScreen;

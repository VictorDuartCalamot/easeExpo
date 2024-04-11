import React, { useState } from "react";
import { Button, Platform, View, Alert } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const DatePickerButton = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event, date) => {
    if (date) {
      setSelectedDate(date);
      setShowDatePicker(false);
      console.log("Fecha seleccionada:", date);
      Alert.alert("Fecha seleccionada:", date.toString());
    } else {
      setShowDatePicker(false);
    }
  };

  const openDatePicker = () => {
    setShowDatePicker(true);
  };

  return (
    <>
      <Button title="Abrir Calendario" onPress={openDatePicker} />
      {showDatePicker && (
        <View>
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        </View>
      )}
    </>
  );
};

export default DatePickerButton;
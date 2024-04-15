import React, { useState } from "react";
import { Button, Platform, View, Alert } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";

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
      {Platform.OS === "web" && showDatePicker && ( 
        <div style={{position: "absolute", zIndex: 999}}>
            <DatePicker selected={selectedDate} onChange={handleDateChange} />
        </div>
      )}
      {Platform.OS !== "web" && showDatePicker && (
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
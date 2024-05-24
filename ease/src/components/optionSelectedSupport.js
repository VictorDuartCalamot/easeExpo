import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import SelectedOptionPicker from "selected-option-picker";

const OptionSupport = () => {
  const [showPicker, setShowPicker] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  const options = [
    {
      id: 1,
      name: "Cuenta bloqueada",
    },
    {
      id: 2,
      name: "Contraseña olvidada",
    },
  ];

  const handleItemChange = (item) => {
    const itemIndex = selectedItems.findIndex((selectedItem) => selectedItem.id === item.id);

    if (itemIndex === -1) {
      setSelectedItems([...selectedItems, item]);
    } else {
      const updatedItems = [...selectedItems];
      updatedItems.splice(itemIndex, 1);
      setSelectedItems(updatedItems);
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={() => setShowPicker(true)}>
        <Text style={styles.supportText}>
          {selectedItems.length === 0
            ? "Select Support Options"
            : selectedItems.map((item) => item.name).join(", ")}
        </Text>
      </TouchableOpacity>

      <SelectedOptionPicker
        showPicker={showPicker}
        data={options}
        pickerTitle={"Select Option"}
        checkBoxType={"circle"}
        itemTitleKey={"name"}
        itemUniqueKey={"id"}
        selectedItems={selectedItems}
        enableSearch={true}
        searchPlaceholder={"Search options"}
        emptyTitle={"No Options Found"}
        onDonePress={() => setShowPicker(false)}
        onCancelPress={() => setShowPicker(false)}
        onItemChange={handleItemChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  supportText: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 5,
    textAlign: "center",
  },
});

export default OptionSupport;
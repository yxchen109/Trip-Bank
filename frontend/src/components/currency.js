import React, { useState, useRef, Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; 
import CheckBox from 'react-native-check-box';

const currency_list = [
  'TWD', 'USD', 'JPY', 'KRW', 'EUR', 
];

const ChooseCur = ({ closeModal, onSelectCurrency }) => {
  const [selectedCurrency, setSelectedCurrency] = useState([]);

  const handleCurrencyPress = (currency) => {
    setSelectedCurrency((prevCurrency) => {
      onSelectCurrency(currency);
      return currency;
    });
  };

  const renderCurrency = (currency) => {
    // Check if the currency is selected
    const isCurrencySelected = selectedCurrency === currency;

    return (
      <TouchableOpacity
        key={currency}
        onPress={() => handleCurrencyPress(currency)}
        style={[
          styles.container,
          isCurrencySelected && styles.selected,
        ]}
      >
        <Text style={styles.text}>{currency}</Text>
      </TouchableOpacity>
    );
  };

  return(
    <View style={styles.modalContent}>
      {/* 標題 */}
      <View style={styles.top}>
        <Text style={styles.modalTitle}>幣別</Text>

        {/* 右上角的關閉按鈕 */}
        <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
          <AntDesign name="close" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.choices}>
        {/* {renderCurrency('TWD')}
        {renderCurrency('USD')} */}
        {currency_list.map(currency => renderCurrency(currency))}
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  modalContent: {
  },
  top: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    right: 0,
  },
  choices: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  container: {
    margin: 3,
    paddingVertical: 10, // Maintain top and bottom padding
    paddingHorizontal: 20, // Increase left and right padding
    backgroundColor: 'transparent',
    borderRadius: 5,
    borderColor: 'gray',
    borderWidth: 1,
  },
  selected: {
    backgroundColor: 'lightgray',
  },
  text: {
    fontSize: 16,
  },
});

export default ChooseCur;
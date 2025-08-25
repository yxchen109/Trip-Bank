import React, { useState, useRef, Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; 
import CheckBox from 'react-native-check-box';


const ChoosePay = ({ closeModal, onSelectPayment }) => {
  const [selectedPayment, setSelectedPayment] = useState([]);

  const handlePaymentPress = (payment) => {
    setSelectedPayment((prevPayment) => {
      onSelectPayment(payment);
      return payment;
    });
  };

  const renderPayment = (payment) => {
    // Check if the category is selected
    const isPaymentSelected = selectedPayment === payment;

    return (
      <TouchableOpacity
        key={payment}
        onPress={() => handlePaymentPress(payment)}
        style={[
          styles.container,
          isPaymentSelected && styles.selected,
        ]}
      >
        <Text style={styles.text}>{payment}</Text>
      </TouchableOpacity>
    );
  };

  return(
    <View style={styles.modalContent}>
      {/* 標題 */}
      <View style={styles.top}>
        <Text style={styles.modalTitle}>付款方式</Text>

        {/* 右上角的關閉按鈕 */}
        <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
          <AntDesign name="close" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.choices}>
        {renderPayment('CASH')}
        {renderPayment('CARD')}
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

export default ChoosePay;
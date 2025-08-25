import React, { useState, useRef, Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; 
import CheckBox from 'react-native-check-box';

const ChooseCate = ({ closeModal, onSelectCategory }) => {
  const [selectedCategory, setSelectedCategory] = useState([]);

  const handleCategoryPress = (category) => {
    setSelectedCategory((prevCategory) => {
      onSelectCategory(category);
      return category;
    });
  };

  const renderCategory = (category) => {
    // Check if the category is selected
    const isCategorySelected = selectedCategory === category;

    return (
      <TouchableOpacity
        key={category}
        onPress={() => handleCategoryPress(category)}
        style={[
          styles.container,
          isCategorySelected && styles.selected,
        ]}
      >
        <Text style={styles.text}>{category}</Text>
      </TouchableOpacity>
    );
  };

  return(
    <View style={styles.modalContent}>
      {/* 標題 */}
      <View style={styles.top}>
        <Text style={styles.modalTitle}>類別</Text>

        {/* 右上角的關閉按鈕 */}
        <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
          <AntDesign name="close" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.choices}>
        {renderCategory('FOOD')}
        {renderCategory('TRANS')}
        {renderCategory('ENT')}
      </View>
      <View style={styles.choices}>
        {renderCategory('CLOTHES')}
        {renderCategory('OTHER')}
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

export default ChooseCate;
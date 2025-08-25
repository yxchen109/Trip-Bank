// filter.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; 

const FilterContent = ({ closeModal, onSortChange }) => {
  const [sortByDateOldToNew, setSortByDateOldToNew] = useState(false);
  const [sortByPeopleFewToMany, setSortByPeopleFewToMany] = useState(false);

  const handleSortToggle = (type) => {
    if (type === 'date') {
      setSortByDateOldToNew(!sortByDateOldToNew);
      onSortChange('date', !sortByDateOldToNew);
    } else if (type === 'people') {
      setSortByPeopleFewToMany(!sortByPeopleFewToMany);
      onSortChange('people', !sortByPeopleFewToMany);
    }
  };

  return (
    <View style={styles.modalContent}>
      {/* 標題 */}
      <View style={styles.top}>
        <Text style={styles.modalTitle}>Filter</Text>

        {/* 右上角的關閉按鈕 */}
        <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
          <AntDesign name="close" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* 選項 */}
      <View>
        <TouchableOpacity
          style={styles.optionContainer}
          onPress={() => handleSortToggle('date')}
        >
          <Text style={styles.InputLabel}>日期 {sortByDateOldToNew ? '新 – 舊' : '舊 – 新'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionContainer}
          onPress={() => handleSortToggle('people')}
        >
          <Text style={styles.InputLabel}>人數 {sortByPeopleFewToMany ? '多 – 少' : '少 – 多'}</Text>
        </TouchableOpacity>
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

  //checkbox
  optionContainer: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  InputLabel: {
    fontSize: 16,
    marginVertical: 4, // 這邊寫死==超白癡
  },
});

export default FilterContent;
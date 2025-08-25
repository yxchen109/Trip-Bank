import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; 
import CheckBox from 'react-native-check-box';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PersonInput = ({ name, isChecked, onValueChange, amount, onAmountChange }) => {
  // console.log("personinput: ", isChecked);
  // console.log("personinput amount: ", amount);
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
      <CheckBox
        style={{ marginRight: 20, marginTop: '1.2%' }}
        isChecked={isChecked}
        onClick={onValueChange}
      />
      <Text>{name}</Text>
      <View style={{ alignItems: "center", width: '30%', marginStart: '5%', borderBlockColor: 'dimgray', borderBottomWidth: 1 }}>
        <TextInput
          placeholder="金額"
          keyboardType="numeric"
          value={amount.toString()}
          onChangeText={onAmountChange}
        />
      </View>
    </View>
  );
};

const NoPersonInput = ({ name, isChecked, onValueChange }) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
      <CheckBox
        style={{ marginRight: 20, marginTop: '1.2%' }}
        isChecked={isChecked}
        onClick={onValueChange}
      />
      <Text>{name}</Text>
    </View>
  );
};

const SeparateModal = ({ closeModal, peopleData, updateRemainingAmount, totalAmount, onSelectPeople, onSplitAmount, onRecordPeople, checkedPeople, amountedPeople}) => {
  // const [isCheckedPeople, setCheckedPeople] = useState(peopleData.map(() => false));
  const [isCheckedPeople, setCheckedPeople] = useState(checkedPeople || []);
  const [amounts, setAmounts] = useState(amountedPeople || []);
  const [separateMode, setSeparateMode] = useState(0);
  const [isModalVisible, setModalVisible] = useState(false);

  // console.log("amountedPeople", amountedPeople);

  // keep
  // useEffect(() => {
  //   // 在组件挂载时加载保存的状态
  //   const loadState = async () => {
  //     try {
  //       const storedCheckedPeople = await AsyncStorage.getItem('checkedPeople');
  //       const storedAmounts = await AsyncStorage.getItem('amounts');

  //       if (storedCheckedPeople) {
  //         setCheckedPeople(JSON.parse(storedCheckedPeople));
  //       }

  //       if (storedAmounts) {
  //         setAmounts(JSON.parse(storedAmounts));
  //       }
  //     } catch (error) {
  //       console.error('Error loading state:', error);
  //     }
  //   };

  //   loadState();
  // }, []); // 空数组表示只在组件挂载时运行

  // useEffect(() => {
  //   // 在 isCheckedPeople 或 amounts 改变时保存状态
  //   const saveState = async () => {
  //     try {
  //       await AsyncStorage.setItem('checkedPeople', JSON.stringify(isCheckedPeople));
  //       await AsyncStorage.setItem('amounts', JSON.stringify(amounts));
  //     } catch (error) {
  //       console.error('Error saving state:', error);
  //     }
  //   };

  //   saveState();
  // }, [isCheckedPeople, amounts]); // 在 isCheckedPeople 或 amounts 改变时运行


  const toggleModal = (mode) => {
    setSeparateMode(mode);
  };
  const handleCloseModal = () => {
    // 將狀態傳回去
    closeModal({ isCheckedPeople, amounts });
  };

  // const handleCheckboxChange = (id, person, setter) => {
  //   let tmp = [...peopleData];
  //   tmp[id] = { ...tmp[id], is_checked: !tmp[id].is_checked };

  //   // let tmp = items.map((item) => {
  //   //   if (id === item.id) return { ...item, is_checked: !item.is_checked };
  //   //     else return item;
  //   // });
  //   setter(tmp);
  // }

  const handleCheckboxChange = (index) => {
    console.log(`current: ${index}`);

    setCheckedPeople(prevState => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      console.log(`newState: ${newState}`);

      return newState;
    });
  };

  const handleCalculate = () => {
    // Calculate the total paid amount
    console.log(`Amount State: ${amounts}`);
    console.log(`People: ${isCheckedPeople}`);

    const totalPaid = amounts.reduce((acc, amount, index) => {
      return isCheckedPeople[index] ? acc + parseFloat(amount || 0) : acc;
    }, 0);
    const numCheckedPeople = isCheckedPeople.filter(Boolean).length;

    console.log(`Total Amount: ${totalAmount}`);



    // Calculate the remaining amount to be paid
    if (separateMode === 0) {
      remainingAmount = totalAmount - totalPaid;
    } else if (separateMode === 1) {
      remainingAmount = totalAmount / (numCheckedPeople + 1);
    }
    updateRemainingAmount(remainingAmount.toString()); //這個加了才會顯示價錢

    // Display or use the values as needed
    console.log(`Total Paid: ${totalPaid}`);
    console.log(`Remaining Amount: ${remainingAmount}`);


    const selectedPeopleNames = peopleData.reduce((names, person, i) => {
      if (isCheckedPeople[i]) {
        names.push(person.username);
      }
      return names;
    }, []);
    // console.log(`SelectedPeople: ${selectedPeopleNames}`);
    // console.log(`isCheckedPeople: ${isCheckedPeople}`);

    onSelectPeople(selectedPeopleNames.toString());
    onSplitAmount(amounts);
    onRecordPeople(isCheckedPeople, amounts);

    closeModal();
  };

  const handleAmountChange = (index, newAmount) => {
    setAmounts(prevState => {
      const newState = [...prevState];
      newState[index] = newAmount;
      return newState;
    });

  };


  return (
    <View style={styles.modalContent}>
      {/* 標題 */}
      <View style={styles.top}>
        <Text style={styles.modalTitle}>分帳對象</Text>
        {/* 右上角的關閉按鈕 */}
        <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
          <AntDesign name="close" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <View style={{alignItems: "center"}}> 
        <View style={styles.modeSelect}>
          <TouchableOpacity 
            style={
              separateMode === 0 ? styles.activeButton : styles.inactiveButton
            }
            onPress={() => toggleModal(0)}
          >
            <Text style={styles.split_text}>各自付錢</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={
              separateMode === 1 ? styles.activeButton : styles.inactiveButton
            }
            onPress={() => toggleModal(1)}
          >
            <Text style={styles.split_text}>平均分攤</Text>
          </TouchableOpacity>
        </View>

        <>
          {separateMode === 0 && (
            // 各自付錢
            peopleData.map((person, index) => (
              <PersonInput
                key={index}
                name={person.username}
                isChecked={isCheckedPeople[index]}
                onValueChange={() => handleCheckboxChange(index)}
                amount={amounts[index]}
                onAmountChange={(newAmount) =>
                  handleAmountChange(index, newAmount)
                }
              />
            ))
          )}

          {separateMode === 1 && (
            // 平均分攤
            peopleData.map((person, index) => (
              <NoPersonInput
                key={index}
                name={person.username}
                isChecked={isCheckedPeople[index]}
                onValueChange={() => handleCheckboxChange(index)}
              />
            ))
          )}
        </>
        <TouchableOpacity onPress={handleCalculate} style={styles.calculateButton}>
          <Text>Calculate</Text>
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
  modeSelect: {
    flexDirection:"row",
    width:'80%',
    height:'12%',
    marginTop:'5%',
    borderBlockColor:'dimgray', 
    borderBottomWidth:1
  },
  activeButton: {
    width:'45%', 
    marginStart:'5%',
    marginRight:'1%',
    alignItems:"center", 
    justifyContent:"center",
    backgroundColor: 'lightgray',
  },
  inactiveButton: {
    width:'45%', 
    marginStart:'5%',
    marginRight:'1%',
    alignItems:"center", 
    justifyContent:"center",
    backgroundColor: 'transparent',
  },
  split_text: {
    fontSize: 17,
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: 'white',
    padding: 20,
    width: '80%',
    borderRadius: 10,
    alignItems: 'center',
  },
  calculateButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'lightgray',
    borderRadius: 5,
  },
});

export default SeparateModal;

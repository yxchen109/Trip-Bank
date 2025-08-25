import React, { useState, useRef, Component } from 'react';
import { View, Text, Button, TextInput, TouchableOpacity, Platform, StyleSheet, Image } from 'react-native';
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { AntDesign } from '@expo/vector-icons'; 
import CheckBox from 'react-native-check-box';
import * as ImagePicker from 'react-native-image-picker';

const DATA = [
  {
    name: 'Amy',
    profile: require('@assets/images/p1.jpg'),
    id: 1,
  },
  {
    name: 'Coco',
    profile: require('@assets/images/p2.jpg'),
    id: 2,
  },
  {
    name: 'Blanc',
    profile: require('@assets/images/p3.jpg'),
    id: 3,
  },
]

const AddBook = ({ closeModal }) => {
  const [name, setName] = useState('');
  const [companion, setCompanion] = useState('');

  const [isDatePickerVisible1, setDatePickerVisibility1] = useState(false);
  const [isDatePickerVisible2, setDatePickerVisibility2] = useState(false);
  const [datevalue1, setdatevalue1] = useState(new Date());
  const [datevalue2, setdatevalue2] = useState(new Date());
  const datePickerContainerRef = useRef(null);
  const [datePickerContainerHeight, setDatePickerContainerHeight] = useState(70);

  const [expanded, setExpanded] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedNames, setSelectedNames] = useState([]);

  const [selectedImage, setSelectedImage] = useState(null);

  const [isCreateSuccess, setCreateSuccess] = useState(false);

  // 改變日期
  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios'); // 在 iOS 上，我們將其設置為 true，因為 DateTimePicker 在 iOS 上是內嵌的
    setDate(selectedDate || date);
  };

  // handle data picker
  const showDatePicker1 = () => {
    setDatePickerVisibility1(true);
  };
  const showDatePicker2 = () => {
    setDatePickerVisibility2(true);
  };
  const hideDatePicker1 = () => {
    setDatePickerVisibility1(false);
  };
  const hideDatePicker2 = () => {
    setDatePickerVisibility2(false);
  };
  const handleConfirm1 = (date) => {
    setdatevalue1(date);
    hideDatePicker1();
  };
  const handleConfirm2 = (date) => {
    setdatevalue2(date);
    hideDatePicker2();
  };

  // 動態調整框框大小
  const adjustDatePickerContainerSize = () => {
    if (datePickerContainerRef.current && (isDatePickerVisible1 || isDatePickerVisible2)) {
      const containerHeight = datePickerContainerRef.current.clientHeight;
      setDatePickerContainerHeight(containerHeight);
    }
  };

  // 旅伴
  const toggleExpand = () => {
    setExpanded(!expanded);
  };
  const handleNamePress = (name) => {
    if (selectedNames.includes(name)) {
      setSelectedNames(selectedNames.filter((item) => item !== name));
    } else {
      setSelectedNames([...selectedNames, name]);
    }
    // 把自己輸入的字串清掉
    setCompanion('');
  };
  const handleRemoveName = (name) => {
    setSelectedNames(selectedNames.filter((item) => item !== name));
  };

  // upload image
  const handleChoosePhoto = () => {
    const options = {
      title: '選擇圖片',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log('用戶取消選擇圖片');
      } else if (response.error) {
        console.log('圖片選擇錯誤:', response.error);
      } else {
        // 更新選擇的圖片
        setSelectedImage({ uri: response.uri });
      }
    });

  };

  // handle create
  const handleCreate = () => {
    // 在這裡處理建立成功的邏輯（回傳資料庫？） 
    // 假設建立成功後，將 isCreateSuccess 設置為 true
    setCreateSuccess(true);
  };


  return (
    <View style={styles.modalContent}>
      {!isCreateSuccess ? (
        // 如果尚未建立成功，顯示建立表單
        <>
          {/* 標題 */}
          <View style={styles.top}>
            <Text style={styles.modalTitle}>新增帳本</Text>

            {/* 右上角的關閉按鈕 */}
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <AntDesign name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>

          {/* 名稱輸入 */}
          <View style={styles.inputContainer}>
            <Text style={styles.dateInputLabel}>名稱</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                value={name}
                onChangeText={(text) => setName(text)}
                placeholderTextColor="gray"
                fontSize={16}
              />
            </View>
          </View>

          {/* 日期輸入 */}
          <View
            style={[styles.datePickerContainer, { height: datePickerContainerHeight }]}
            ref={datePickerContainerRef}
          >
            <View style={styles.dateInputContainer}>
              <Text style={styles.dateInputLabel}>開始日期</Text>
              <TouchableOpacity onPress={() => { showDatePicker1(); adjustDatePickerContainerSize(); }}>
                <Text style={styles.dateValueLabel}>{datevalue1.toDateString()}</Text>
              </TouchableOpacity>
            </View>
            {isDatePickerVisible1 && (
              <RNDateTimePicker
                mode="date"
                value={datevalue1}
                locale="zh-tw"
                is24Hour={true} //Android Only
                display={Platform.OS === "android" ? "calendar" : "inline"}
                onChange={(event, date) => {
                  handleConfirm1(date);
                  adjustDatePickerContainerSize();
                }}
                themeVariant="light"
              />
            )}
            <View style={styles.dateInputContainer}>
              <Text style={styles.dateInputLabel}>結束日期</Text>
              <TouchableOpacity onPress={() => { showDatePicker2(); adjustDatePickerContainerSize(); }}>
                <Text style={styles.dateValueLabel}>{datevalue2.toDateString()}</Text>
              </TouchableOpacity>
            </View>
            {isDatePickerVisible2 && (
              <RNDateTimePicker
                mode="date"
                value={datevalue2}
                locale="zh-tw"
                is24Hour={true} //Android Only
                display={Platform.OS === "android" ? "calendar" : "inline"}
                onChange={(event, date) => {
                  handleConfirm2(date);
                  adjustDatePickerContainerSize();
                }}
                themeVariant="light"
              />
            )}
          </View>


          {/*旅伴輸入*/}
          <View style={styles.container}>
            <View style={styles.partnerInputContainer}>
              <Text style={styles.dateInputLabel}>旅伴</Text>
              <TouchableOpacity
                style={[styles.inputWrapper, { height: expanded ? 60 : 40 }]}
                onPress={toggleExpand}
              >
                <View style={styles.nameinput}>
                  <View style={styles.selectedNamesContainer}>
                    {selectedNames.map((name) => (
                      <View key={name} style={styles.selectedNameContainer}>
                        <Text style={styles.selectedNameText}>{name}</Text>
                        <TouchableOpacity onPress={() => handleRemoveName(name)}>
                          <AntDesign name="close" size={12} color="black" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                  <TextInput
                    value={companion}
                    onChangeText={(text) => {
                      setCompanion(text);
                      setSearch(text); // 將文字設定為搜尋字串
                    }}
                    placeholderTextColor="gray"
                    fontSize={16}
                    onFocus={toggleExpand}
                    onBlur={toggleExpand}
                    style={{
                      flex: 1,
                      // backgroundColor: 'lightgray', // for testing
                    }}
                  />
                </View>
              </TouchableOpacity>
            </View>

            {/* 列出名字 */}
            {expanded && (
              <View>
                <View style={styles.namesContainer}>
                  {companion.trim() === '' ? (
                    // 如果輸入文字被清空，顯示預設的 3 個名字
                    DATA.slice(0, 3).map((item) => (
                      <TouchableOpacity
                        key={item.name}
                        style={[styles.nameItem, selectedNames.includes(item.name) && styles.selectedName]}
                        onPress={() => handleNamePress(item.name)}
                      >
                        <View style={styles.perPartner}>
                          <Image source={item.profile} style={styles.profileImage} />
                          <Text>{item.name}</Text>
                          <CheckBox
                            isChecked={selectedNames.includes(item.name)}
                            onClick={() => handleNamePress(item.name)}
                          />
                        </View>
                      </TouchableOpacity>
                    ))
                  ) : (
                    // 如果有輸入文字，根據過濾條件顯示相應的名字
                    DATA.filter((item) => item.name.toLowerCase().includes(companion.toLowerCase())).map((item) => (
                      <TouchableOpacity
                        key={item.name}
                        style={[styles.nameItem, selectedNames.includes(item.name) && styles.selectedName]}
                        onPress={() => handleNamePress(item.name)}
                      >
                        <View style={styles.perPartner}>
                          <Image source={item.profile} style={styles.profileImage} />
                          <Text>{item.name}</Text>
                          <CheckBox
                            isChecked={selectedNames.includes(item.name)}
                            onClick={() => handleNamePress(item.name)}
                          />
                        </View>
                      </TouchableOpacity>
                    ))
                  )}
                </View>
              </View>
            )}
          </View>

          {/* 上傳照片 */}
          <TouchableOpacity style={styles.uploadButton} onPress={handleChoosePhoto}>
            <Image
              source={selectedImage ? selectedImage : require('@assets/images/p2.jpg')}
              style={styles.image}
            />
          </TouchableOpacity>


          {/* 建立按鈕 */}
          <View style={styles.createButtonContainer}>
            <Button title="建立" onPress={handleCreate} />
          </View>
        </>
      ) : (
        // 如果建立成功，顯示成功的內容
        <>
          <View style={styles.top}>
            {/* 右上角的關閉按鈕 */}
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <AntDesign name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>
          {/* 勾勾 */}
          <View style={styles.successContainer}>
            <AntDesign name="checkcircleo" size={80} color="black" />
            <View style={styles.successContent}>
              <Text>建立成功！</Text>
            </View>
          </View>
        </>
      )}
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
  input: {
    height: 40,
    borderRadius: 5,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },

  // topic
  inputContainer: {
    height: 40,
    borderRadius: 5,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputWrapper: {
    flex: 1, // 使輸入框填滿剩餘的空間
    marginLeft: 10, // 可以根據需要調整左邊距離
  },

  //calendar
  datePickerContainer: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  dateInputLabel: {
    fontSize: 16,
    marginVertical: 4, // 這邊寫死==超白癡
    // marginBottom: 10,
    color: 'gray',
  },
  dateValueLabel: {
    fontSize: 16,

  },

  //partner
  container: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    flexDirection: 'column',
  },
  partnerInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputWrapper: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  partnerinput: {
    height: 40,
    // marginBottom: 10,
  },
  namesContainer: {
    // marginTop: 10,
  },
  perPartner: {
    margin: 3,
    flexDirection: 'row',
    justifyContent: 'space-between', // 可以使用 'space-between' 讓兩個元素靠兩邊
  },
  selectedNamesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // marginTop: 8,
  },
  selectedNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    borderColor: 'gray',
    paddingVertical: 4,
    paddingHorizontal: 8,
    margin: 4,
  },
  selectedNameText: {
    marginRight: 4,
  },
  profileImage: {
    width: 30, // 調整頭像的寬度
    height: 30, // 調整頭像的高度
    borderRadius: 15, // 讓頭像呈圓形
    marginRight: 10, // 調整頭像和文字之間的距離
  },
  nameinput: {
    flexDirection: 'row',
  },

  // upload image
  uploadButton: {
    width: 150,
    height: 150,
    backgroundColor: 'lightgray',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },

  //create
  createButtonContainer: {
    marginTop: 20,
  },
  successContent: {
    alignItems: 'center',
    marginTop: 20,
  },
  successContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },

});

export default AddBook;

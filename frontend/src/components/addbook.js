import React, { useState, useRef, Component, useEffect } from 'react';
import { View, Text, Button, TextInput, TouchableOpacity, Platform, StyleSheet, Image } from 'react-native';
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { AntDesign } from '@expo/vector-icons'; 
import CheckBox from 'react-native-check-box';
// import * as ImagePicker from 'react-native-image-picker';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

// const DATA = [
//   {
//     name: 'Amy',
//     profile: require('@assets/images/p1.jpg'),
//     id: 1,
//   },
//   {
//     name: 'Coco',
//     profile: require('@assets/images/p2.jpg'),
//     id: 2,
//   },
//   {
//     name: 'Blanc',
//     profile: require('@assets/images/p3.jpg'),
//     id: 3,
//   },
// ]

const AddBook = ({ closeModal }) => {
  const [name, setName] = useState('');
  const [budget, setBudget] = useState('');

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
  const [emails, setEmails] = useState([]);

  const [selectedImage, setSelectedImage] = useState(null);
  const [image, setImage] = useState(null);

  const [DATA, setDATA] = useState([]);

  const [isCreateSuccess, setCreateSuccess] = useState(false);

  // POST
  const createNewBook = async (dataUri) => {
    try {
      console.log('AddBook User',global.email)
      if(!global.email) {
        router.push("/login/signIn");
        return;
      }
      const userEmail = global.email;

      // 讀取本地檔案的內容
      const base64 = await FileSystem.readAsStringAsync(dataUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // POST
      const apiUrl = process.env.EXPO_PUBLIC_API_URL;

      const isValidBudgetString = !isNaN(parseFloat(budget));
      const budgetFloat = isValidBudgetString ? parseFloat(budget) : 0.0;

      const allEmails = [userEmail, ...emails];
      console.log(allEmails);

      // 發送 POST 請求
      const response = await fetch(`${apiUrl}/books/new_book/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({
          "name": name,
          "start_time": datevalue1,
          "end_time": datevalue2,
          "cover_img": base64,
          "budget": budgetFloat,
          "notes": null,
          "user_email_list": allEmails,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // 解析 JSON
      const json = await response.json();
      console.log(json);
      setCreateSuccess(true);
      return json.id;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };

  // GET 旅伴
  const getAllUsers = () => {
    const apiUrl = process.env.EXPO_PUBLIC_API_URL;
    const userEmail = 'cookie@example.com';

    fetch(`${apiUrl}/users/all_users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      // Update the state with the fetched data
      setDATA(data.all_users);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };

  useEffect(() => {
    getAllUsers();
  }, []); 


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
  const handleNamePress = (name, email) => {
    if (selectedNames.includes(name)) {
      setSelectedNames(selectedNames.filter((item) => item !== name));
      setEmails(emails.filter((item) => item !== email));
    } else {
      setSelectedNames([...selectedNames, name]);
      setEmails([...emails, email]);
    }
    // 把自己輸入的字串清掉
    setCompanion('');
  };
  const handleRemoveName = (name) => {
    setSelectedNames(selectedNames.filter((item) => item !== name));
    setEmails(emails.filter((item) => item !== email));
  };

  // pick image
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
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

          {/* 預算輸入 */}
          <View style={styles.inputContainer}>
            <Text style={styles.dateInputLabel}>預算</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                value={budget}
                onChangeText={(text) => setBudget(text)}
                placeholderTextColor="gray"
                fontSize={16}
              />
            </View>
            <Text style={styles.dateInputLabel}>NTD</Text>
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
                        onPress={() => handleNamePress(item.name, item.email)}
                      >
                        <View style={styles.perPartner}>
                          <Image source={{ uri: `data:image/jpeg;base64,${item.photo}` }} style={styles.profileImage} />
                          <Text>{item.username}</Text>
                          <CheckBox
                            isChecked={selectedNames.includes(item.username)}
                            onClick={() => handleNamePress(item.username, item.email)}
                          />
                        </View>
                      </TouchableOpacity>
                    ))
                  ) : (
                    // 如果有輸入文字，根據過濾條件顯示相應的名字
                    DATA.filter((item) => item.username.toLowerCase().includes(companion.toLowerCase())).map((item) => (
                      <TouchableOpacity
                        key={item.name}
                        style={[styles.nameItem, selectedNames.includes(item.username) && styles.selectedName]}
                        onPress={() => handleNamePress(item.username, item.email)}
                      >
                        <View style={styles.perPartner}>
                          <Image source={{ uri: `data:image/jpeg;base64,${item.photo}` }} style={styles.profileImage} />
                          <Text>{item.username}</Text>
                          <CheckBox
                            isChecked={selectedNames.includes(item.username)}
                            onClick={() => handleNamePress(item.username, item.email)}
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
          <View style={styles.inputImageContainer}>
            <Text style={styles.dateInputLabel}>上傳封面</Text>
            <TouchableOpacity onPress={pickImage} style={styles.customButton}>
              <Text style={{fontSize: 16, color: "lightgray", fontWeight: 'bold'}}>從相簿中選擇</Text>
            </TouchableOpacity>
            {image && <Image source={{ uri: image }} style={{ width: 50, height: 50 }} />}
          </View>


          {/* 建立按鈕 */}
          <View style={styles.createButtonContainer}>
            <Button title="建立" onPress={() => createNewBook(image)} />
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
  inputImageContainer: {
    height: 60,
    borderRadius: 5,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
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

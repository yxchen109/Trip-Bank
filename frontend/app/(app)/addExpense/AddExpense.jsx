import React, {useState, useEffect} from "react";
import { View, Text, Pressable, TouchableOpacity, TextInput, Modal, Image, Alert, ScrollView, StyleSheet } from "react-native";
import { Stack, Link, router, useLocalSearchParams,  } from 'expo-router';
import { FontAwesome, AntDesign } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useFocusEffect } from '@react-navigation/native';

// import styles from "@components/addExpense.style";

import * as ImagePicker from 'expo-image-picker'; // for image
import * as Permissions from 'expo-permissions'; // only for ios
import * as FileSystem from 'expo-file-system'; // for base64
import Constants from 'expo-constants';

import ChooseCur from '@components/currency';
import ChooseCate from '@components/category';
import ChoosePay from '@components/payment';
import SeparateModal from '@components/split';
import { Header } from "@components/header";
import { boolean } from "zod";



let amount = 0;
let from_cur = '';
let to_cur = 'TWD';



const AddExpense = ({navigation}) => {
  // const acc_id = 19;
  // const user = 'cookie@example.com'
  const [accData, setData] = useState(null);
  const [exData, setEx] = useState(null);
  const [converted_amount, set_converted_amount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [address, setAddress] = useState('Loading...');
  const [time, setTime] = useState('Loading...');
  const [location, setLocation] = useState(null);
    // photo
  const [selectedImage, setSelectedImage] = useState(null);

  // 名稱
  const [name, setName] = useState('');
  const [isEdited_name, setIsEdited_name] = useState(false);

  // 幣別
  const [isModalVisible_cur, setModalVisible_cur] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('TWD');

  // 分帳對象
  const [peopleData, setPeopleData] = useState([]);
  const [isEdited_people, setIsEdited_people] = useState(false);
 
  // const [isCheckedPeople, setCheckedPeople] = useState(peopleData.map(() => false));
  const [isCheckedPeople, setCheckedPeople] = useState([]);
  // const [amounts, setAmounts] = useState([]);
  const [isModalVisible_split, setModalVisible_split] = useState(false);
  const [selectedPeople, setSelectedPeople] = useState(null);
  const [selectedPeople_e, setSelectedPeople_e] = useState([]);
  const [amountSplit, setAmountSplit] = useState([]);

  // 價錢
  const [moneyInputValue, setMoneyInputValue] = useState(null);
  const [isEdited_money, setIsEdited_money] = useState(false);
  const [isEdited_cur, setIsEdited_cur] = useState(false);

  // 類別
  const [isModalVisible_cate, setModalVisible_cate] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isEdited_cat, setIsEdited_cat] = useState(false);

  // 付款方式
  const [isModalVisible_pay, setModalVisible_pay] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isEdited_payment, setIsEdited_payment] = useState(false);

  // 備註
  const [memo, setMemo] = useState('');
  const [isEdited_memo, setIsEdited_memo] = useState(false);

  // let location_flag = false;
  useFocusEffect(
    React.useCallback(() => {
      // alert('Screen was focused');
      // Do something when the screen is focused
      (async () => {
        let locationjson = null;
        while (!locationjson) {
          console.log('Waiting for location...');
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
          }
          locationjson = await Location.getCurrentPositionAsync({});
          if(locationjson){
            console.log('locationjson: ', locationjson);
            const lat = locationjson.coords.latitude;
            const lon = locationjson.coords.longitude;
            console.log('lat: ', lat);
            console.log('lon: ', lon);
            console.log('location init done')
            post_location(user, lon, lat, bookId);
          }
        }
      })();
      return () => {
        // alert('Screen was unfocused');
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, [])
  );
  const post_location = (user_email, longitude, latitude, book_id) => {
    const apiUrl = process.env.EXPO_PUBLIC_API_URL;
    return fetch(`${apiUrl}/accounts/add_account/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({
        user_email: user_email,
        longitude: longitude,
        latitude: latitude,
        completed: false,
        book_id: book_id,
      }),
    })
    .then(response => response.json())
    .then(json => {
      console.log('成功抓取時間與地址: ', json);
      // setLocJson(json);
      setAddress(json.address);
      setTime(json.record_time);
      setAcc(json.id);
      
      // alert(`已成功紀錄！\n目前位置：${json.address}\n目前時間：${json.record_time}`);
    }).catch(error => console.error(error));
  }
  // record People
  useEffect(() => {
    console.log('people')
    // Initialize isCheckedPeople when peopleData changes
    setCheckedPeople(peopleData.map(() => false));
    setAmountSplit(peopleData.map(() => ''));
  }, [peopleData]);

  const params = useLocalSearchParams();
  const [acc_id, setAcc] = useState(-1);
  const bookId = params.book_id;
  const user = params.user;
  
  if(acc_id==-1){
    useEffect(() => {
      // STEP 1：在 useEffect 中定義 async function 取名為 fetchData
      const fetchLocData = async () => {
        // 紀錄位置(不確定要在哪裡紀錄TAT location.js好像有的樣子)
        console.log('param: ', params);
        console.log('before acc id: ', acc_id);//post後記得改acc_id
        console.log('bookId: ', bookId);
        console.log('user: ', user);

        let locationjson = null;
        while (!locationjson) {
          console.log('Waiting for location...');
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
          }
          locationjson = await Location.getCurrentPositionAsync({});
          if(locationjson){
            console.log('locationjson: ', locationjson);
            const lat = locationjson.coords.latitude;
            const lon = locationjson.coords.longitude;
            console.log('lat: ', lat);
            console.log('lon: ', lon);
            console.log('location init done')
            post_location(user, lon, lat, bookId);
          }
        }
      };
      // fetchLocData();
    }, []);
  }
  else{
    useEffect(() => {
      // STEP 1：在 useEffect 中定義 async function 取名為 fetchData
      const fetchData = async () => {
  
        // STEP 2：使用 Promise.all 搭配 await 等待兩個 API 都取得回應後才繼續
        const accData = await Promise.all([
          fetchAcc(),
          console.log('fetch done'),
        ]);
        // console.log(accData);
        
        // console.log('ex fetch');
  
        setData(...accData);
        console.log('acc Data', accData);
        setTime(accData[0].account_details.record_time);
        setAddress(accData[0].account_details.address);


        if(accData[0].account_details.total_price){
          amount = accData[0].account_details.total_price
          from_cur = accData[0].account_details.currents;
          setSelectedCurrency(from_cur);
          // console.log(amount);
          // console.log(from_cur);
          // console.log('set done');
        }
          
        if (amount){
          const exData = await Promise.all([
            fetchEx(),
            // console.log('ex done'),
          ]);
          setEx(exData);
          // console.log(exData);
          set_converted_amount(exData[0].converted_price);
          // console.log(converted_amount);
          // console.log(exData);
          // console.log('data', accData);
        }
        
      };
  
      // STEP 5：呼叫 fetchData 這個方法
      fetchData();
    }, []);
  }
  

  const fetchAcc = () => {
    const apiUrl = process.env.EXPO_PUBLIC_API_URL;
    const url = (`${apiUrl}/accounts/view_account?` +
      new URLSearchParams({
        user_email: user,
        account_id: acc_id,
      }).toString()
    ) 
    
    return fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          // 'access': json.access,
        },
      })
      .then(response => {
        if (response.ok) {
          // console.log('has data!')
        }
        return response.json();
      })
      .then(json => {
        // console.log(json);
        if (json !== null) { // 只在 JSON 非空時進行賦值
          console.log('fetch acc: ', json.account_details.user_list);
          setPeopleData(json.account_details.user_list);
          console.log('people data: ', peopleData);
          const moneyInputValue = json.account_details.total_price?json.account_details.total_price:'0';
          setMoneyInputValue(moneyInputValue);
          console.log('Money data: ', moneyInputValue);
          // exData = fetchEx();
          setIsLoading(false);
          return json
        }
      }).catch(error => console.error(error));}

  const fetchEx = () => {
    const apiUrl = process.env.EXPO_PUBLIC_API_URL;
    const url = (`${apiUrl}/accounts/exchange?` +
      new URLSearchParams({
        price: amount,
        from_curr: from_cur,
        to_curr: to_cur
      }).toString()
    ) 
    
    return fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          // 'access': json.access,
        },
      })
      .then(response => {
        if (response.ok) {
          // console.log('has data!')
        }
        return response.json();
      })
      .then(json => {
        // console.log(json);
        if (json !== null) { // 只在 JSON 非空時進行賦值
          console.log('fetch ex json:', json);
          set_converted_amount(json.converted_price);
          console.log('convert: ',converted_amount);

          return json
        }
      }).catch(error => console.error(error)); }


  // 分帳
  const toggleModal_split = () => {
    setModalVisible_split(true);
  };
  const closeModal_split = () => {
    setModalVisible_split(false);
  };
  const handlePeopleRecord = (people, amount) => {
    setCheckedPeople(people);
    setAmountSplit(amount);
  }
  const handlePeopleSelect = (people) => {
    const peopleArray = people.split(',');
    if (people !== null){
      setSelectedPeople(peopleArray);

      //update user email
      const userEmails = peopleArray.map(username => {
          const matchedPerson = peopleData.find(person => person.username === username);
          return matchedPerson ? matchedPerson.email : null;
      });
      const peopleEmail = userEmails.join(',');
      const emailList = peopleEmail.split(',');
      setSelectedPeople_e(emailList);
      setIsEdited_people(true);
    }
  };
  const handleAmountSplit = (amount) => {
    console.log("amountssss: ", amount);
    if (Array.isArray(amount) && amount.length > 0) {
      const integerList = amount.map(strAmount => parseInt(strAmount, 10));

      // Now you have an array of integers
      console.log("Integer List: ", integerList);

      // Assuming you want to update the state with the integer list
      setAmountSplit(integerList);
    } else {
      console.error("Invalid amount format. Expected a non-empty array.");
    }
  }

  const updateRemainingAmount = (value) => {
    setIsEdited_money(true);
    setMoneyInputValue(value);
    setSelectedPeople()
    console.log(`Return Paid Outside: ${value}`);
  };

  // 幣別
  const toggleModal_cur = () => {
    setModalVisible_cur(true);
    setIsEdited_cur(true);
  };
  const closeModal_cur = () => {
    setModalVisible_cur(false);
  };


  const handleCurrencySelect = (currency) => {
    if (currency !== null){
      from_cur = currency;
      console.log('--------------------------')
      console.log(amount)
      console.log(from_cur)
      console.log(to_cur)
      setSelectedCurrency(currency);

      fetchEx()
      setEx(exData)
      console.log('exData: ',exData)
      
      // console.log(exData);
      // console.log('data', accData);

    }
  };

  // 類別
  const toggleModal_cate = () => {
    setModalVisible_cate(true);
  };
  const closeModal_cate = () => {
    setModalVisible_cate(false);
  };
  const handleCategorySelect = (category) => {
    if (category !== null){
      setSelectedCategory(category);
    }
  };

  // 付款方式
  const toggleModal_pay = () => {
    setModalVisible_pay(true);
  };
  const closeModal_pay = () => {
    setModalVisible_pay(false);
  };
  const handlePaymentSelect = (payment) => {
    if (payment !== null){
      setSelectedPayment(payment);
    }
  };

  // take and pick image
  const getPermissionsAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL, Permissions.CAMERA);
    if (status !== 'granted') {
      alert('Sorry, we need camera and camera roll permissions to make this work!');
    }
  };
  const takeImage = async () => {
    getPermissionsAsync();

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setSelectedImage(result.assets[0].uri);
    }
    console.log(result.assets[0].uri);
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
    console.log(result.assets[0].uri);
  };


  const hasChanges = () => {
    // 檢查其他所有狀態是否有更改
    // 例如，您可以檢查name、selectedCurrency、selectedPeople等等
    // 如果有任何一個狀態已更改，返回true，否則返回false
    const flag = isEdited_name || isEdited_money || isEdited_memo ||isEdited_cur || isEdited_cat || isEdited_payment; 
    setIsEdited_cat(false);
    setIsEdited_cur(false);
    setIsEdited_memo(false);
    setIsEdited_money(false);
    setIsEdited_name(false);
    setIsEdited_payment(false);
    console.log('flag: ', flag);
    return flag;
  };

  const handleUpdate = async (dataUri) => {
    if (!hasChanges()) {
      console.log('No changes to submit');
      return;
    }
    console.log("dataUri: ", dataUri);
    const base64 = await FileSystem.readAsStringAsync(dataUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    const intAmountSplit = amountSplit.map(str => parseInt(str, 10));

    console.log("user_email ", user);
    console.log("account_id ", acc_id);
    console.log("product_name ", isEdited_name? name :accData.account_details.product_name);
    console.log("catagory ", isEdited_cat? selectedCategory:accData.account_details.currents,)
    console.log("total_price ", isEdited_money? moneyInputValue:accData.account_details.total_price);
    console.log("payment ", isEdited_payment ? selectedPayment:accData.account_details.payment);
    console.log("selectedPeople_e: ", selectedPeople_e);
    console.log("price_list: ", intAmountSplit);

    // console.log("payment.type ", typeof selectedPayment);

    const apiUrl = process.env.EXPO_PUBLIC_API_URL;
    fetch(`${apiUrl}/accounts/edit_account/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({
        // 根據您的需求，這裡可以組織要發送的數據
        "user_email": user,
        "account_id": acc_id,
        "product_name": isEdited_name? name :accData.account_details.product_name,
        "photo": base64,
        "total_price": isEdited_money? moneyInputValue:accData.account_details.total_price,
        "catagory": isEdited_cat? selectedCategory:accData.account_details.currents,
        "payment": isEdited_payment ? selectedPayment:accData.account_details.payment,
        "notes":isEdited_memo?memo:accData.account_details.notes,
        "currents": isEdited_cur? selectedCurrency:accData.account_details.currents,
        "user_email_list": selectedPeople_e,
        "price_list": intAmountSplit,
        // ... 其他狀態
      }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('update data:', data);

      setName('');
      setSelectedImage(null);
      setMoneyInputValue(null);
      setSelectedCategory(null);
      setSelectedPayment(null);
      setMemo(null);
      setSelectedCurrency('TWD');
      setSelectedPeople_e([]);
      setAmountSplit([]);
      setTime('');
      setAddress('');
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };


  return (
    <View>
      <Header
        headerLeft={
          <Pressable onPress={() => router.back()}>
            <FontAwesome name="chevron-left" size={30} color="#555" style={{marginTop: 8,}} />
          </Pressable>
        }
        headerRight={
          <Link href="/" asChild onPress={() => handleUpdate(selectedImage)} push>
            <Text style={{ fontSize: 15, color: 'dodgerblue', fontWeight: 'bold', marginEnd: 10 }}>
              完成
            </Text>
          </Link>
        }
      >
        <Text style={{fontSize: 24, marginVertical: 8, }}>編輯品項</Text>
      </Header>
      {/* header */}
      {/* <View style={styles.top}>
        <AntDesign name="close" size={24} color="black" />
        <Text style={styles.title}>編輯品項</Text>
        <Text style={{fontSize: 16, color: 'dodgerblue', fontWeight: 'bold'}}> 完成</Text>
      </View> */}

      {/* image and text */}
      <View>
        <View style={styles.img_text}>
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                '選擇操作',
                '請選擇拍照/從相簿中選擇',
                [
                  { text: '拍照', onPress: takeImage },
                  { text: '從相簿中選擇', onPress: pickImage },
                ],
                { cancelable: true }
              );
            }}
            style={styles.imagePickerContainer}
          >
            {selectedImage ? (
              <Image source={{ uri: selectedImage }} style={styles.image} />
            ) : (
              <View style={styles.iconContainer}>
                <AntDesign name="camerao" size={50} color="black" />
                <Text style={styles.iconText}>點擊選擇照片</Text>
              </View>
            )}
          </TouchableOpacity>
          
          {/* Time and Place */}
          {/* 這邊要接收 API */}
          <View style={styles.time_place}> 
            <Text style={styles.text}>時間</Text>
            <Text>{time}</Text>
            <View>
            <Text style={[styles.text, {marginTop: 10}]}>地點</Text>
            <Text style={{paddingRight:5}}>{address}</Text>
            </View>
          </View>
        </View>

        
        <View style={{ flexDirection: 'column' }}>
          {/*輸入名稱*/}
          <View style={styles.modifyContainer}>
            <Text style={styles.itemTitle}>名稱</Text>
            <View style={styles.modifyItem}>
              <TextInput
                value={isEdited_name ? name : (accData && accData.account_details.product_name)}
                onChangeText={(text) => {
                  setName(text),
                  setIsEdited_name(true)
                  // console.log(name)
                }}
                placeholder="名稱"
                placeholderTextColor="lightgray"
                flex={1}
                textAlign="center"
              />
            </View>
          </View>

          {/*輸入價錢*/}
          <View style={styles.currencyContainer}>
            <Text style={styles.itemTitle}>價錢</Text>
            <View style={styles.currency}>
              <TextInput 
                value={isEdited_money ? moneyInputValue : (accData && accData.account_details.total_price ? accData.account_details.total_price.toString() : '')}
                onChangeText={(num) =>{
                  setMoneyInputValue(num.toString()),
                  setIsEdited_money(true),
                  amount = num?num:0,
                  fetchEx()
                  console.log("moneyInputValue: ", moneyInputValue)
                }}
                placeholder="價錢"
                placeholderTextColor="lightgray"
                keyboardType="numeric"
                flex={1}
                textAlign="center"
              ></TextInput>
            </View>

            {/* 幣別 */}
            <TouchableOpacity style={styles.button} onPress={toggleModal_cur}>
              <Text style={{fontSize:10}}>
                {selectedCurrency?selectedCurrency:'TWD'}
                {/* {selectedCurrency === "TWD" ? "TWD" : selectedCurrency === "USD" ? "USD" : "TWD"} */}
              <AntDesign name="down" size={10} color="black"/>                
              </Text>
            </TouchableOpacity>
            <Modal
              animationType="slide"
              transparent={true}
              visible={isModalVisible_cur}
              onRequestClose={() => {
                closeModal_cur();
              }}
            > 
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <ChooseCur closeModal={closeModal_cur} onSelectCurrency={handleCurrencySelect}/>
                </View>
              </View>
            </Modal> 
          </View>
          
          {/* 換匯 -> 這個要再改, 要抓匯率 */}
          <Text style={{color: 'dimgrey', fontSize:12, marginStart:'60%'}}>
            {selectedCurrency === "TWD" ? "" : `相當於台幣 ${converted_amount} 元` }
          </Text>
          

          {/*選擇分帳對象*/}
          <View style={styles.modifyContainer}>
            <Text style={styles.itemTitle}>分帳對象</Text>
            <View style={styles.modifyItem}>
              <TouchableOpacity onPress={toggleModal_split}>
                <ScrollView
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                >
                  {selectedPeople ? (
                    selectedPeople.map((person, index) => (
                      <Text key={index} style={styles.selectedItem}>{person}</Text>
                    ))
                  ) : (
                    <Text style={styles.defaultText}>Click to select</Text>
                  )}
                </ScrollView>
              </TouchableOpacity>
              <Modal
                  animationType="slide"
                  transparent={true}
                  visible={isModalVisible_split}
                  onRequestClose={() => {
                    closeModal_split();
                  }}
                > 
                  <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                      <SeparateModal 
                        closeModal={closeModal_split} 
                        peopleData={peopleData} 
                        updateRemainingAmount={updateRemainingAmount}
                        totalAmount={moneyInputValue}
                        onSelectPeople={handlePeopleSelect}
                        onSplitAmount={handleAmountSplit}
                        onRecordPeople={handlePeopleRecord}
                        checkedPeople={isCheckedPeople}
                        amountedPeople={amountSplit}
                        />
                    </View>
                  </View>
                </Modal>
            </View>
          </View>

          {/*選擇類別*/}
          <View style={styles.modifyContainer}>
            <Text style={styles.itemTitle}>類別</Text>
            <View style={styles.modifyItem}>
              <TouchableOpacity onPress={() =>{
                setIsEdited_cat(true);
                toggleModal_cate();
                }}>
                <View>
                  {selectedCategory ? (
                    <Text style={styles.selectedItem}>
                      {selectedCategory}
                    </Text>
                  ) : (accData && accData.account_details.category ? (
                    <Text style={styles.selectedItem}>
                      {accData.account_details.category}
                    </Text>
                  ) : (
                    <Text style={styles.defaultText}>Click to select</Text>
                  ))}
                </View>
              </TouchableOpacity>
              <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible_cate}
                onRequestClose={() => {
                  closeModal_cate();
                }}
              > 
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <ChooseCate closeModal={closeModal_cate} onSelectCategory={handleCategorySelect}/>
                  </View>
                </View>
              </Modal>
            </View>
          </View>

          {/*選擇付款方式*/}
          <View style={styles.modifyContainer}>
          <Text style={styles.itemTitle}>付款方式</Text>
            <View style={styles.modifyItem}>
              <TouchableOpacity onPress={()=>{
                toggleModal_pay();
                setIsEdited_payment(true);
                }}>
                <View>
                  {selectedPayment ? (
                    <Text style={styles.selectedItem}>
                      {selectedPayment}
                    </Text>
                  ) : (accData && accData.account_details.payment ? (
                    <Text style={styles.selectedItem}>
                      {accData.account_details.payment}
                    </Text>
                  ) : (
                    <Text style={styles.defaultText}>Click to select</Text>
                  ))}
                </View>
              </TouchableOpacity>
              <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible_pay}
                onRequestClose={() => {
                  closeModal_pay();
                }}
              > 
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <ChoosePay closeModal={closeModal_pay} onSelectPayment={handlePaymentSelect}/>
                  </View>
                </View>
              </Modal>
            </View>
          </View>
          
          {/*填寫備註*/}
          <View style={styles.modifyContainer}>
            <Text style={styles.itemTitle}>備註</Text>
            <View style={styles.modifyItem}>
              <TextInput
                value={isEdited_memo ? memo : (accData && accData.account_details.notes)}
                onChangeText={(text) => {
                  setMemo(text),
                  setIsEdited_memo(true),
                  console.log(memo)
                }}
                placeholder="備註"
                placeholderTextColor="lightgray"
                flex={1}
                textAlign="center"
              />
            </View>
          </View>
        </View>
      </View>
    </View>
    
  );
};

const styles = StyleSheet.create({
  // header
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // 可以使用 'space-between' 讓兩個元素靠兩邊
    paddingHorizontal: 20, // 可以根據需求調整水平內邊距
    marginTop: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },

  // take and choose photo
  imagePickerContainer: {
    width: "50%",
    height: 150,
    borderRadius: 15,
    backgroundColor: 'lightgray',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 15
  },
  iconContainer: {
    alignItems: 'center',
  },
  iconText: {
    marginTop: 10,
    fontSize: 16,
    color: 'black',
  },

  //image and text
  img_text: {
    flexDirection: 'row', 
    alignItems: 'center', 
    marginStart: 20,
    marginTop: 20, 
    marginBottom: 20,
    marginRight:20,
  },
  //time and place
  time_place: { 
    flexDirection: 'column', 
    marginStart: 10,
    paddingRight:'50%',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  //每個欄位 標題 + 底線
  modifyContainer:{
    flexDirection: 'row',
    marginBottom:'7%',
    marginTop:'7%',
  },
  itemTitle:{
    fontSize: 15,
    width: '20%',
    marginStart: '20%'
  },
  modifyItem:{
    flexDirection: 'row',
    borderBlockColor:'#ccc',
    borderBottomWidth:1,
    marginStart: '5%',
    width:'40%',
    justifyContent: "center",
    // backgroundColor: 'lightgray',
  },
  currencyContainer: {
    flexDirection: 'row',
    marginTop:'5%',
    alignItems: 'center',
  },
  currency: {
    flexDirection: 'row',
    borderBlockColor:'#ccc',
    borderBottomWidth:1,
    marginStart: '5%',
    width:'30%',
  },

  // 換匯按鈕
  button: {
    justifyContent:"center",
    paddingHorizontal: '2%',
    paddingVertical: '1%',
    borderRadius: 100,
    borderBlockColor:'black',
    borderWidth:1
  },

  // 彈出式
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20
  },
  modalView: {
    width: "100%",
    justifyContent: 'center',
    // alignItems: 'center', // input field 不能左右拉開的主因
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  // split 
  defaultText: {
    color: 'lightgray',
  },
  selectedItem: {
    // flexDirection: 'row',
    // alignItems: 'center',
    borderWidth: 1,
    borderRadius: 6,
    borderColor: 'black',
    paddingVertical: 2,
    paddingHorizontal: 4,
    margin: 1,
  },
});

export default AddExpense;
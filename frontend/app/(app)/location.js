import { Link } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, TextInput } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import * as Location from 'expo-location';
const styles = StyleSheet.create({
    container: {
      // backgroundColor: '#D7EFF4',
      height: '100%',
      width: '100%',
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
    },
    locationBtn: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center"
    },
    block: {
      width: '90%',
      height: 220,
      backgroundColor: '#000',
      justifyContent: 'center',
      alignItems: 'flex-end',
      backgroundColor: 'rgba(0, 0, 0, .8)',
      borderRadius: 16,
      paddingHorizontal: 20
    },
    input: {
      width: '90%',
      backgroundColor: '#ffffff',
      borderRadius: 7,
      paddingHorizontal: 15,
      paddingVertical: 5,
      fontSize: 24,
      color: '#000',
      marginHorizontal: 20,
      marginVertical: 5,
    },
    btn: {
      color: '#ffffff',
      backgroundColor: '#cc7400',
      borderRadius: 7,
      paddingHorizontal: 15,
      paddingVertical: 5,
      marginHorizontal: 20,
      marginVertical: 5,
      justifyContent: 'center',
      alignItems: 'center'
    }
  });
const post_account = (email, longitude, latitude, book_id, name, price, time) => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  return fetch(`${apiUrl}/accounts/add_account/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify({
      user_email: email,
      longitude: longitude,
      latitude: latitude,
      completed: false,
      book_id: book_id,
      product_name: name,
      total_price: price,
      record_time: time,
    }),
  })
  .then(response => response.json())
  .then(json => {
    // console.log(json);
    alert(`已成功紀錄！\n目前位置：${json.address}\n目前時間：${json.record_time}`);
  }).catch(error => console.error(error));
}
const get_book_id = (email) => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const url = (`${apiUrl}/books/all_books/?` +
    new URLSearchParams({
      user_email: email,
    }).toString()
  ) 
  return fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      // 'access': json.access,
    },
  })
  .then(response => response.json())
  .then(json => {
    // console.log(json.book_list)
    for(item of json.book_list) {
      // console.log(item.books)
      const now = new Date();
      const start = new Date(item.book_details.start_time);
      const end = new Date(item.book_details.end_time);
      console.log(now, start, end);
      // console.log(now.getTime() > start.getTime())
      if(now.getTime() > start.getTime() && now.getTime() < end.getTime()) {
        return item.books;
      }
    }
    return null;
  }).catch(error => console.error(error));
}
export default function Page() {
  // console.log('Test',global.email)
  if(!global.email) {
    router.push("/login/signIn");
    return;
  }
  const email = global.email;
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  //const [latitude, setLatitude] = useState(null);
  //const [longitude, setLongitude] = useState(null);
  const [name, onChangeName] = React.useState('');
  const [price, onChangePrice] = React.useState('');
  useEffect(() => {
    (async () => {
      await get_book_id(email);
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      //setLatitude(location.coords.latitude);
      //setLongitude(location.coords.longitude);
      //setLocation(location.coords);
    })();
  }, []);

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }
  const getLocation = async() => {
    const book_id = await get_book_id(email);
    if(!book_id) {
      alert(`請先新增旅行帳本`);
      return;
    }
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
    const date = new Date(location.timestamp);
    await post_account(email, location.coords.longitude, location.coords.latitude, book_id, name, price, date);
    // post_account(email, 120.96745, 24.80703, book_id, name, price, "2024-01-02 10:13:37");
  }
  return (
    <View style={styles.container}>
      <View style={styles.block}>
      <TextInput
        style={styles.input}
        onChangeText={onChangeName}
        placeholder="品項"
        value={name}
      />
      <TextInput
        style={styles.input}
        onChangeText={onChangePrice}
        value={price}
        placeholder="價格"
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.btn} onPress={getLocation}>
        <Text style={{ fontSize: 24, }}>紀錄位置！</Text>
      </TouchableOpacity>
      </View>
      {/* <Text>{text}</Text> */}
    </View>   
  );
}
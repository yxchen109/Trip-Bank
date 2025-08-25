import React, { useState, useEffect } from 'react';
import { router, Link, useLocalSearchParams, } from 'expo-router';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';

import { TripMap, TripRoute, TripMarkers } from '@components/map';
import { Header, Setting } from '@components/header';
// import { SwipeComponent } from '@components/index/swipeComponent';
import { AccountList } from '@components/index/accountList';

import { useFocusEffect } from '@react-navigation/native';
const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginHorizontal: 8,
    marginTop: 10,
    elevation: 3,
    backgroundColor: '#fac8a7',
    width: 180,
    height: 50,
    borderRadius: 3,
  },
  container: {
      // backgroundColor: '#0000',
      height: '100%',
      width: '100%',
      position: 'absolute',
  },
  buttonCnt: {
    position: 'absolute',
    right: 10,
    bottom: 80,
  },
  tripDate: {
    // backgroundColor: 'gold',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  titleCnt: {
    marginTop: -10,
    marginHorizontal: 20,
  },
  title: {
    fontSize: 24,
  },
  subTitle: {
    color: '#999',
    textAlign: 'center',
  },
});
const fetchAccountData = async(email, today) => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const url = (`${apiUrl}/accounts/view/?` +
    new URLSearchParams({
      user_email: email,
      date: today,
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
    const account_details = json.account_item_list.map((value, i) => {
      return value.account_details;
    });
    return account_details;
  }).catch(error => console.error(error));
}
const get_book_detail = (email) => {
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
      // console.log(now, start, end);
      // console.log(now.getTime() > start.getTime())
      if(now.getTime() > start.getTime() && now.getTime() < end.getTime()) {
        const tmp = {book_id: item.books, start: start, end: end};
        // console.log('tmp', tmp)
        return tmp;
      }
    }
    return null;
  }).catch(error => console.error(error));
}

const handleClick = (book_detail) => {
  console.log('book detail: ', book_detail)
    if(!book_detail) {
      alert(`請先新增旅行帳本`);
      router.push('/bookshelf');
      return;
    } else {
      router.push({
        pathname: "/addExpense/AddExpense", 
        params: {
          book_id: book_detail.book_id,
          user: email
          // book_detail: book_detail
        }
      });
    }

}

let book_detail;
export default function Page(props) {
  // console.log('Test',global.email)
  global.email = 'cookie@example.com'
  if(!global.email) {
    router.push("/login/signIn");
    return;
  }
  const email = global.email;
  // if(!book_detail) {
  //   (async () => {
  //     book_detail = await get_book_detail(email);
  //     // if(!book_detail) {
  //     //   alert(`請先新增旅行帳本`);
  //     //   router.push('/bookshelf');
  //     //   return;
  //     // } else {
  //       // console.log('book id:', get_book_detail(email));
  //     // }
  //   })();
  // }
  useFocusEffect(
    React.useCallback(() => {
      // alert('Screen was focused');
      // Do something when the screen is focused
      (async () => {
        book_detail = await get_book_detail(email);
        // if(!book_detail) {
        //   alert(`請先新增旅行帳本`);
        //   router.push('/bookshelf');
        //   return;
        // } else {
          // console.log('book id:', get_book_detail(email));
        // }
      })();
      return () => {
        // alert('Screen was unfocused');
        // Do something when the screen is unfocused
        // Useful for cleanup functions
        book_detail = '';
      };
    }, [])
  );
  const [show, setShow] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [accountElement, setAccountElement] = useState([]);
  const date = new Date();
  const [today, setToday] = useState(date);
  const tomorrow_tmp = new Date(today);
  const yesterday_tmp = new Date(today);
  tomorrow_tmp.setDate(tomorrow_tmp.getDate() + 1);
  yesterday_tmp.setDate(yesterday_tmp.getDate() - 1);
  const [tomorrow, setTomorrow] = useState(tomorrow_tmp);
  const [yesterday, setYesterday] = useState(yesterday_tmp);
  const [has_yesterday, setHasYesterday] = useState(false);
  const [has_tomorrow, setHasTomorrow] = useState(false);
  // const [book_detail, setBookDetail] = useState(get_book_detail(email));
  const fetchData = async(email, today) => {
    const tomorrow_tmp = new Date(today);
    const yesterday_tmp = new Date(today);
    tomorrow_tmp.setDate(tomorrow_tmp.getDate() + 1);
    yesterday_tmp.setDate(yesterday_tmp.getDate() - 1);
    const today_data = await fetchAccountData(email, today.toISOString().split('T')[0]);
    // const yesterday_data = await fetchAccountData(email, yesterday_tmp.toISOString().split('T')[0]);
    // const tomorrow_data = await fetchAccountData(email, tomorrow_tmp.toISOString().split('T')[0]);
    setToday(today);
    setYesterday(yesterday_tmp);
    setTomorrow(tomorrow_tmp);
    setAccountElement(today_data);
    // setHasYesterday(!!yesterday_data.length);
    // setHasTomorrow(!!tomorrow_data.length);
    if(yesterday_tmp.getTime() < book_detail.start.getTime()) {
      setHasYesterday(false);
    } else {
      setHasYesterday(true);
    }
    if(tomorrow_tmp.getTime() > book_detail.end.getTime()) {
      setHasTomorrow(false);
    } else {
      setHasTomorrow(true);
    }
    if(today_data.length==0) {
      return;
    }
    const filtered_data = today_data.filter((value) => {
      const longitude = value.longitude; //經度
      const latitude = value.latitude; //緯度
      if(Math.abs(longitude) > 180 || Math.abs(latitude) > 90) {
        // console.log('經緯度超出範圍');
        return false;
      }
      return true;
    })
    
    let r = {
      latitude: filtered_data[0].latitude,
      longitude: filtered_data[0].longitude,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    };
    this.mapView.animateToRegion(r, 1000);
  }
  useEffect( async() => {
    
    // console.log('this is useEffet');
    fetchData(email, today);
    // book_detail = await get_book_detail(email);
    // if(!book_detail.book_id) {
    //   alert(`請先新增旅行帳本`);
    //   router.push('/bookshelf');
    //   return;
    // } else {
    //   // console.log('book id:', get_book_detail(email));
    // }
    
  }, []);
  
  return (
      <View style={styles.container}>
        <TripMap
          data={accountElement}
          // center={accountElement[0] ? {latitude: accountElement[0].latitude, longitude: accountElement[0].longitude} : {latitude: 24, longitude: 120}}
          width='100%'
          height='100%'
          // ref={ref => this.mapView = ref}
        >
          <TripRoute route_data={accountElement} strokeColor="#ed4242aa" strokeWidth={6} />
          <TripMarkers markers_data={accountElement}/>
        </TripMap>
        <Header headerRight={<Setting/>} position="absolute" height={70} style={{backgroundColor: '#fffc'}}>
        <View style={styles.tripDate}>
          {has_yesterday ? <TouchableOpacity onPress={() => fetchData(email, yesterday)}>
            <FontAwesome name="chevron-left" size={24} color="#555" />
          </TouchableOpacity> : <FontAwesome name="chevron-left" size={24} color="transparent" />}
          <View style={styles.titleCnt}>
            <Text style={styles.subTitle}>{`${today.getFullYear()}年${today.getMonth()+1}月${today.getDate()}日`}</Text>
            <Text style={styles.title}>旅行帳本</Text>
          </View>
          {has_tomorrow ? <TouchableOpacity onPress={() => fetchData(email, tomorrow)}>
            <FontAwesome name="chevron-right" size={24} color="#555" />
          </TouchableOpacity> : <FontAwesome name="chevron-right" size={24} color="transparent" />}
        </View>
        </Header>

        <View style={styles.buttonCnt}>
            <TouchableOpacity style={styles.button} onPress={() => handleClick(book_detail)}>
                <Text>新增帳目 +</Text>
            </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => {setShow(true); setCompleted(false); }}>
            <Text>尚未記錄地點</Text>
          </TouchableOpacity>
        </View>
        {show ? <AccountList setShow={setShow} DATA={accountElement} completed={completed} setCompleted={setCompleted}/> : null}
        {/* <SwipeComponent style={{position: 'absolute', width: 500, height: 500, backgroundColor: 'pink', }}></SwipeComponent> */}
      </View>
  );
}
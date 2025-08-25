import { useState, useEffect, useRef } from "react";
import * as React from 'react';
import {
  Text,
  View,
  Image,
  FlatList,
  Animated,
  ScrollView,
  SafeAreaView,
  ImageBackground,
  TouchableOpacity
} from "react-native";
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome, Entypo } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import styles from "@style/overview.style";
import { COLORS, SIZES, images} from "@constants";
import Chart from "@components/Chart"
import Gallery from "@components/Gallery"
import OverviewMap from "@components/overview/overview_map"



const Overview = ({navigation}) => {
  console.log('Test',global.email)
  if(!global.email) {
    router.push("/login/signIn");
    return;
  }

  let params = useLocalSearchParams();
  let bookId = params.book_id;
  let pic = params.cover_pic;


  const scrollY = useRef(new Animated.Value(0)).current;

  const [activeType, setActiveType] = useState("Overview");
  const mode = ["Overview", "Map", "Gallery"];
  const [bookData, setData] = useState(null);

  useEffect(() => {

    // STEP 1：在 useEffect 中定義 async function 取名為 fetchData
    const fetchData = async () => {
      try {
        
        // STEP 2：使用 Promise.all 搭配 await 等待兩個 API 都取得回應後才繼續
        const bookDat = await Promise.all([
          fetchBook(),
          console.log('Overview book fetch done'),
        ]);
        tmp = bookDat[0].book_info
        setData(tmp);
        // console.log('book data: ', bookData);
        // console.log('tmp', tmp.user_list);
        // console.log('Overview book data: ', bookData[0].book_info.book_name);
        
        // amount = bookData[0].account_details.total_price
        // from_cur = bookData[0].account_details.currents;
        // console.log(amount);
        // console.log(from_cur);
        // console.log('set done');
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // STEP 5：呼叫 fetchData 這個方法
    fetchData();
  }, [params]);
  

  const fetchBook = () => {
    const apiUrl = process.env.EXPO_PUBLIC_API_URL;
    const url = (`${apiUrl}/books/details?` +
      new URLSearchParams({
        user_email: email,
        book_id: bookId,
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
          // console.log(json);
          // exData = fetchEx();
          return json
        }
      }).catch(error => console.error(error));}

  function renderHeader(){
    return(
        <ImageBackground
        source={{ uri: `data:image/jpeg;base64,${pic}` }}
        style={{
          width: 500,
          height: 500,
        }}
        resizeMode='cover'>
          <LinearGradient  
            colors={["transparent", "black"]} 
            locations={[0.7,1.2]} 
            style={styles.linearGradient}>
            {/* place info */}
            <View style={{
              position: 'absolute',
              bottom: 20, 
              left: 20}}>
              <Text style={styles.placeName}>{bookData && bookData.book_name ? bookData.book_name : 'Loading...'}</Text>
              <Text style={styles.info}>
                {bookData && bookData.book_name ? 
                filterTime(bookData.start_time) + ' — '+ filterTime(bookData.end_time): 'Loading...'}</Text>
              
              {/* people */}
              <View style={{flexDirection: 'row', marginTop: 10}}>
                <Text style={styles.people}>with </Text>
                {bookData && bookData.user_list ? (
                  bookData.user_list.map((user, index) => (
                    <View key={index}>
                      <Image
                        source={{ uri: `data:image/jpeg;base64,${user.user_photo}` }}
                        style={styles.profile}
                        resizeMode='cover'
                      />
                      {/* <Text>{user.username}</Text> */}
                    </View>
                  ))
                ) : (
                  <Text>No users available</Text> // 這裡可以自行決定要顯示的內容，例如一段提示文字。
                )}
              </View>

            </View>
          </LinearGradient>
        </ImageBackground>
        
       
    )
  }

  function filterTime(date) {
    const tmp = date.split('T')[0].replace(/-/g, '.'); // 使用 replace 方法將所有 '-' 替換為 '.'
    console.log(tmp); // 輸出替換後的字串
    return tmp; // 返回替換後的字串
  }
  const mapHeight = scrollY.interpolate({
    inputRange: [0, 100], // 滾動的範圍，您可以根據需要調整
    outputRange: [SIZES.height / 2, 0], // 當滾動時，Map的高度變化的範圍
    extrapolate: 'clamp' // 確保值在inputRange範圍內
  });
  return (
    
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite}}>
        <Stack.Screen
            options={{
                headerStyle: { backgroundColor: 'transparent'},
                headerShadowVisible: false,
                headerLeft: ()=>(
                  <FontAwesome name="chevron-left" size={30} color="#555" />
                ),
                headerRight: () => (
                  <Entypo name="cog" size={30} color="black" />
                ),
                headerTitle: "大阪行",
                headerTitleAlign: 'center'
            }}
        />
      <ScrollView 
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false } // useNativeDriver 必須設為 false，因為我們要更新state
        )}
        scrollEventThrottle={16}
      >
      
        {renderHeader()}
      
        <View
            style={{
                flex: 1,
                padding: SIZES.medium
            }}
        >
          
          {/* switch buttons: overview/map/gallery */}
        
          <View style={styles.tabsContainer}>
            <FlatList
              data={mode}
              renderItem={({ item }) => (
                
                  <TouchableOpacity
                    style={styles.tab(activeType, item)}
                    onPress={() => {
                      setActiveType(item);
                    }}
                  >
                    <Text style={styles.tabText(activeType, item)}>
                        {item}
                    </Text>
                    
                  </TouchableOpacity>
             
              )}
              keyExtractor={(item) => item}
              contentContainerStyle={{ columnGap: SIZES.small }}
              horizontal
              
            />
      
          </View>
        </View>
        
        {activeType=='Overview' && <Chart bookId={bookId}/>}
        {activeType=='Map' && <OverviewMap bookId={bookId}/>}
        {activeType=='Gallery' && <Gallery bookId={bookId}/>}
        
      </ScrollView>
    </SafeAreaView>
  );
};

export default Overview;

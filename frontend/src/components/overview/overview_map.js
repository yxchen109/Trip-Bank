import { useState, useEffect } from "react";
import * as React from 'react';
import { Link } from 'expo-router';
import { TripMap, TripRoute, TripMarkers } from '@components/map';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import { COLORS, FONT, SIZES } from "@constants";

const styles = StyleSheet.create({
    container: {
        // backgroundColor: '#0000',
        flex: 1,
        height: '100%',
        width: '100%',
        // position: 'absolute',
    },
    tabsContainer: {
      width: "100%",
      marginTop: SIZES.medium,
      marginBottom: SIZES.small/2,
      marginStart: SIZES.small,
    },
    tab: (activeJobType, item) => ({
      paddingVertical: SIZES.small / 2,
      paddingHorizontal: SIZES.small,
      borderRadius: SIZES.medium,
      borderWidth: 1,
      // borderColor: activeJobType === item ? COLORS.secondary : COLORS.gray2,
      borderColor: COLORS.gray2,

    }),
    tabText: (activeJobType, item) => ({
      fontFamily: FONT.medium,
      color: activeJobType === item ? COLORS.secondary : COLORS.gray2,
    }),
});

function filterTime(date) {
    const tmp = date.split('T')[0]; // 將字串按照 '-' 分割，取第二部分之後的部分，並使用 '.' 連接
    // const result = tmp.replace(/\./g, '/'); // 將所有的 '.' 替換為 '/'

    // console.log(tmp); // 輸出處理後的字串
    return tmp; // 返回處理後的字串
}

function getDatesBetween(start_date, end_date) {
    const dates = [];
    let currentDate = new Date(start_date);
    // console.log(end_date)
    let end = new Date(end_date);
    // console.log(end)
    while (currentDate <= end) {
        dates.push(currentDate.toISOString());
        // console.log('dates: ', dates);
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
}


const OverviewMap = ({ bookId }) => {
    const book_id = bookId;
    let start_date = '';
    let end_date = '';
    const user = global.email;


    // const DATA = require('@data/23-02-10.json');
    // console.log(DATA);
    const [activeType, setActiveType] = useState("Overview");
    const [date_flag, setDateFlag] = useState(true);
    const [date_list, setDate] = useState([]);
    const [mapInfoArray, setMapInfoArray] = useState([]);
    const [center_pt, setCenterPt] = useState({ latitude: 0, longitude: 0 });
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {

        // STEP 1：在 useEffect 中定義 async function 取名為 fetchData
        const fetchData = async () => {
            const date = await fetchDate();
            // console.log('date: ', date)
            if (!date) return;
            // console.log('fetch data done');
            // console.log(date.book_info.start_time)
            start_date = filterTime(date.book_info.start_time);
            // console.log(start_date)
            end_date = filterTime(date.book_info.end_time);
            // console.log(end_date)
            const datesArray = getDatesBetween(start_date, end_date);
            // console.log(datesArray)
            let flag = false;
            for (let date of datesArray) {
                // console.log(date)
                date = filterTime(date)
                const routeInfo = await fetchRoute(date);
                console.log('date_list: ', date_list);
                if (date_list.indexOf(date) === -1) {
                  date_list.push(date);
                }
                
                
                // console.log('date: ', date);
                // console.log('route: ', routeInfo);


                if(routeInfo.map_info){
                    // console.log('mapinfo: ', routeInfo);
                    mapInfoArray.push(routeInfo);
                }

                if (!flag && routeInfo.map_info && routeInfo.map_info.length > 0) {
                    const firstLocation = routeInfo.map_info[0];
                    setCenterPt({
                        latitude: firstLocation.location.latitude,
                        longitude: firstLocation.location.longitude
                    });
                    flag = true;
                }
                // 在此處處理每天的 routeInfo，例如將其存儲到狀態中
                // console.log(mapInfoArray);
            }
            setMapInfoArray([...mapInfoArray]); 
            setDate([...date_list]);
            setIsLoading(false);   
            setDateFlag(true);
          }
        // STEP 5：呼叫 fetchData 這個方法
        fetchData();
      }, []);

      const fetchDate = () => {
        const apiUrl = process.env.EXPO_PUBLIC_API_URL;
        const url = (`${apiUrl}/books/details?` +
          new URLSearchParams({
            user_email: user,
            book_id: book_id,
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
              return json
            }
          }).catch(error => console.error(error));}

      const fetchRoute = (date) => {
        const apiUrl = process.env.EXPO_PUBLIC_API_URL;
        const url = (`${apiUrl}/books/maps?` +
          new URLSearchParams({
            user_email: user,
            book_id: book_id,
            date: date,
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
            //   console.log('fetchMoney: ', json.book_info.money_info);
              // exData = fetchEx();

              return json
            }
          }).catch(error => console.error(error));}

    // console.log('mapinfoarray: ', mapInfoArray)
    const filteredMapInfoArray = mapInfoArray.filter(item => item.map_info.length > 0);
    console.log('filltered: ', filteredMapInfoArray);

    const combinedData = filteredMapInfoArray.flatMap(mapInfo => mapInfo.map_info);
    const simplifiedData = combinedData.map(item => ({
        address: item.location.address,
        latitude: item.location.latitude,
        longitude: item.location.longitude
    }));
    console.log('simplified data: ', simplifiedData)

    if (isLoading) {
        return (
            <View style={[styles.loadingContainer, styles.container]}>
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    return(
        <View style={styles.container}>
          {/* <View style={styles.buttonCnt}>
            <Link href="/addExpense/AddExpense" asChild push>
              <TouchableOpacity style={styles.button}>
                  <Text>新增帳目 +</Text>
              </TouchableOpacity>
            </Link>
          </View> */}

          <View style={styles.tabsContainer}>
          
            <FlatList
              data={date_list}
              renderItem={({ item }) => (
                <Link href={{pathname: "/", params: {book_id: book_id}}} asChild push>
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
                </Link>
              )}
              keyExtractor={(item) => item}
              contentContainerStyle={{ columnGap: SIZES.small }}
              horizontal
              
            />
      
          </View>
            <TripMap
                data={simplifiedData}
                center={{latitude: center_pt.latitude, longitude:center_pt.longitude}}
                width='100%'
                height={600}
            >
                {/* <TripRoute route_data={DATA} strokeColor="#ed4242aa" strokeWidth={6} /> */}
                {filteredMapInfoArray.map((mapInfo, index) => {
                    // console.log('mapInfo: ', mapInfo.map_info)
                    const route_data = mapInfo.map_info.map((value, index) => {
                        return value.location;
                    })
                    // console.log('route_data: ', route_data)
                    return (<TripRoute
                            key={`${index}`}
                            route_data={route_data}  // 使用 locationData 直接作為 route_data
                            strokeColor="#ed4242aa"
                            strokeWidth={6}
                        />)
                    })}
            </TripMap>
        </View>
    );
};


export default OverviewMap;
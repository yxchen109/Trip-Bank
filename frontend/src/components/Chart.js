import { useState, useEffect } from "react";
import {
  Text,
  View,
  Modal,
  FlatList,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import { LineChart, PieChart } from "react-native-gifted-charts";
import styles from "@style/overview.style";
import { useLocalSearchParams  } from 'expo-router';
import { Feather, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
// import jsonData from "./DailyExpense.json"



const flatlist_styles = StyleSheet.create({
  paymentList: {
    paddingHorizontal: 10,
    width: '100%',
    marginTop: 30,
    marginBottom: 10,
  },
  paymentItem: {
    width: '96%',
    marginHorizontal: '2%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    textAlign: 'center',
    marginVertical: 5,
  },
});


const itemStyle = StyleSheet.create({
  detail: {
    flexDirection: 'row',
    // justifyContent: 'space-around',
    alignItems: 'center',
    textAlign: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 5,
    width: '90%',
  },
  time: {
    width: '15%',
    fontSize: 12,
  },
  text: {
    width: '80%',
  },
  name: {
    marginBottom: 10,
  },
  addr: {
    fontSize: 12,
  },
  money: {
    paddingHorizontal: 5,
    textAlign: 'center',
    width: '25%',
  },
});

const Item = ({item}) => (
  <View style={flatlist_styles.paymentItem}>
    <View style={itemStyle.detail}>
      <View style={itemStyle.text}>
        <Text style={itemStyle.name}>
          {item.name}
        </Text>
        <Text style={itemStyle.addr}>
          <MaterialCommunityIcons name="map-marker" size={16} color="#999" />
          {item.address}
        </Text>
      </View>

      <Text style={itemStyle.money}>
        $ {item.amount}{'\n'}
        <Text>{item.currency}</Text>
      </Text>
    </View>
  </View>
);

function filterTime(date) {
  const tmp = date.split('T')[0].split('-').slice(1).join('.'); // 將字串按照 '-' 分割，取第二部分之後的部分，並使用 '.' 連接
  const result = tmp.replace(/\./g, '/'); // 將所有的 '.' 替換為 '/'
  
  // console.log(result); // 輸出處理後的字串
  return result; // 返回處理後的字串
}

const Chart = ({ bookId }) => {
  // const params = useLocalSearchParams();
  // console.log(params.id);
  const book_id = bookId;
  const user = global.email;

  const [dataLoaded, setDataLoaded] = useState(false);

  const [activeGraphType, setActiveGraphType] = useState("pie");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [accData, setAccData] = useState(null);
  const [jsonData, setGraphData] = useState(null);
  //fetch data
  useEffect(() => {
    // STEP 1：在 useEffect 中定義 async function 取名為 fetchData
    const fetchData = async () => {
      // STEP 2：使用 Promise.all 搭配 await 等待兩個 API 都取得回應後才繼續
      const [accData, graphData] = await Promise.all([
        fetchMoney(),
        fetchGraph(),
        console.log('fetch done'),
      ]);

      setAccData(accData)
      // console.log('accData: ', accData)
      console.log('graph data: ', graphData.account_list)
      if (graphData && graphData.account_list) {
        const transformedData = graphData.account_list.map(item => ({
          
          address: item.account_details.address?item.account_details.address:'null',
          category: item.account_details.category?item.account_details.category:'null',
          currency: item.account_details.currents?item.account_details.currents:'null',
          id: item.account_details.id,
          name: item.account_details.product_name?item.account_details.product_name:'null',
          date: filterTime(item.account_details.record_time)?filterTime(item.account_details.record_time):'null',
          amount: item.account_details.total_price?item.account_details.total_price:0,
        }));
        setGraphData(transformedData);
        console.log(transformedData);
        setDataLoaded(true);
        };
      }
    // STEP 5：呼叫 fetchData 這個方法
    fetchData();
    
  }, []);


  const fetchMoney = () => {
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
          // console.log('fetchMoney: ', json.book_info.money_info);
          // exData = fetchEx();
          return json.book_info.money_info
        }
      }).catch(error => console.error(error));}

  
  const fetchGraph = () => {
    const apiUrl = process.env.EXPO_PUBLIC_API_URL;
    const url = (`${apiUrl}/books/accounts?` +
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
          // console.log('graphfetch: ', json.account_list);
          // exData = fetchEx();
          return json
        }
      }).catch(error => console.error(error));}



  

    
  //讀取JSON資料
  const fetchPieData =()=>{
    console.log('json file')
    //相同種類的資料合併
    const categoryMap = new Map();
    console.log('fetch pie json: ', jsonData);
    jsonData.forEach(item => {
      if(categoryMap.has(item.category)) {
        categoryMap.set(item.category, categoryMap.get(item.category) + item.amount);
      }else{
        categoryMap.set(item.category, item.amount);
      }
    });

    const colors = ["#5733FF", "#FCD5CE", "#FF9F1C", "#33B5FF", ]; 

    const preparedData = [];
    let colorIndex = 0;
  
    categoryMap.forEach((amount, category) => {
      preparedData.push({ name: category, value: amount, color: colors[colorIndex] });
      colorIndex = (colorIndex + 1) % colors.length;
    });

    return preparedData;
  }

  const fetchLineData = () => {
    const categoryMap = new Map();

    jsonData.forEach(item => {
      if (categoryMap.has(item.date)) {
        categoryMap.set(item.date, categoryMap.get(item.date) + item.amount);
      } else {
        categoryMap.set(item.date, item.amount);
      }
    });

    const preparedData = [];

    categoryMap.forEach((amount, date) => {
      preparedData.push({ label: date, value: amount, dataPointText:amount});
    });

    return preparedData;
  };


  function renderModal() {
    return (
      <Modal visible={modalVisible} animationType="slide" transparent={false}>
        <TouchableOpacity style={{marginStart:'90%', marginTop:'10%'}} onPress={() => { setModalVisible(false)}}>
          <AntDesign name="close" size={24} color="black" />
        </TouchableOpacity>
        
        <View style={{alignItems:'center'}}>
          <Text style={{ fontSize: 20, fontWeight: 'bold'}}>{`${selectedCategory}`}</Text>
        </View>
          <FlatList
            style={flatlist_styles.paymentList}
            data={
              activeGraphType === "pie"
                ? jsonData.filter(item => item.category === selectedCategory)
                : jsonData.filter(item => item.date === selectedCategory)
            }
            renderItem={({ item }) => <Item item={item} />}
            keyExtractor={item => item.id}
          />
      </Modal>
    )
  }

  const pieChartLegend = () => {
    const pieChartData = fetchPieData();
    return pieChartData.map((item) => (
      <View key={item.name} style={{ flexDirection: "row", alignItems: "center" }}>
        <View
          style={{
            width: 20,
            height: 20,
            backgroundColor: item.color,
            marginRight: 8,
          }}
        />
        <Text>{item.name}</Text>
        <Text></Text>
        <Text>${item.value}</Text>
      </View>
    ));    
  };

  const pieChart = ()=>{
    
    const pieChartData = fetchPieData();

    const handlePieChartPress = (event, index) => {
      const category = pieChartData[index]?.name;
      setSelectedCategory(category);
      setModalVisible(true);
    }
  
    return(
      <View>
        <PieChart
          data={pieChartData}
          width={300}
          height={200}
          chartConfig={{
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            fromZero: true,
          }}
          accessor="value"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
          onPress={handlePieChartPress}
        />
        <View style={{alignItems:"center", marginTop:'5%', marginBottom:'10%'}}>
        {pieChartLegend()}
        </View>
      </View>
    )
  }



  const lineChart = ()=>{
    const lineChartData = fetchLineData();
    
    const values = lineChartData.map(dataPoint => dataPoint.value);
    const max_value = Math.max(...values);

    const handleLineChartPress = (event, index) => {
      console.log(lineChartData);
      const category = lineChartData[index]?.label;
      setSelectedCategory(category);
      setModalVisible(true);
    }

    return(
      <View style={{alignItems:"center", marginBottom:'10%'}}>
        <LineChart
          data={lineChartData}
          width={200}
          height={200}
          maxValue={max_value+500}
          thickness={2}
          color1="lightgray"
          noOfSections={5}
          dataPointsColor1="blue"
          dataPointsRadius={5}
          textShiftY={-5}
          textShiftX={-5}
          textFontSize={13}
          dataPointsHeight={6}
          dataPointsWidth={6}
          onPress={handleLineChartPress}
        />
      </View>
      
    )
  }
  


  // render pieChart&lineGraph
  const renderGraph = () => {
    switch (activeGraphType) {
      
      case "pie":
        return pieChart()

      case "line":
        return lineChart()

      default:
        return null;
    }
  }

  
  return (
    <View>
      {/* 如果資料未加載，則顯示"Loading..." */}
      {!dataLoaded ? (
        <Text style={styles.overviewDisplay}>
          Loading...
        </Text>
      ) : (
        <>
          {/* 支出與預算 */}
          <Text style={styles.overviewDisplay}>
            Budget: {accData ? accData.budget : 'Loading...'} NTD{'\n'}
            Expense: {accData ? accData.expense : 'Loading...'} NTD
          </Text>
  
          {/* 轉換圖的按鈕 */}
          <View style={{flexDirection: 'row', marginStart:'75%', marginBottom:'10%'}}>
            <TouchableOpacity style={{marginRight:'15%'}}
              onPress={() => {
                setActiveGraphType("pie");
              }}>
                <Feather name="pie-chart" size={30} color="black" />
            </TouchableOpacity>
  
            <TouchableOpacity 
              onPress={() => {
                setActiveGraphType("line");
              }}>
                <AntDesign name="linechart" size={30} color="black" />
            </TouchableOpacity>
          </View>
            
          {/* 圓餅圖與長條圖 */}
          <View style={{alignItems:"center"}}>
            {renderGraph()}
          </View>
  
          {/* 彈出視窗 */}
          {renderModal()}
        </>
      )}
    </View>
  );
};

export default Chart;

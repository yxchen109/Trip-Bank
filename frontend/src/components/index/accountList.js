import React from 'react';
import { Dimensions, FlatList, View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';

const Item = ({item}) => {
  // console.log(item.record_time);
  const tmp = new Date(item.record_time)
  // console.log(tmp.toTimeString(), tmp.getHours(), tmp.getMinutes());
  const time = `${("0" + tmp.getHours()).slice(-2)}:${("0" + tmp.getMinutes()).slice(-2)}`;
  return (
  <TouchableOpacity style={styles.paymentItem} onPress={() => router.push({ pathname: '/addExpense/AddExpense', params: { id: item.id } })}>
    <View style={itemStyle.line}></View>
    <Text style={itemStyle.time}>{time}</Text>
    <View style={itemStyle.detail}>
      <View style={itemStyle.text}>
        <Text style={itemStyle.name}>
          {item.product_name}
        </Text>
        <Text style={itemStyle.addr}>
          <MaterialCommunityIcons name="map-marker" size={16} color="#999" />
          {item.address}
        </Text>
      </View>

      <Text style={itemStyle.money}>
        $ {item.total_price}{'\n'}
        <Text>{item.currents}</Text>
      </Text>
    </View>
  </TouchableOpacity>
)};

export function AccountList({DATA, setShow, completed, setCompleted}) {
  // console.log('account data: ', DATA)
  let result = DATA;
  if(!completed) {
    result = DATA.filter((item) => !item.completed);
  }
  return (
      <View style={styles.paymentCnt}>
        <FlatList
          style={styles.paymentList}
          data={result}
          renderItem={({item}) => <Item item={item} />}
          keyExtractor={item => item.id}
        />
        <TouchableOpacity style={{ position: 'absolute', right: 10, top: 10 }}
          onPress={() => setShow(false)}
        >
          <FontAwesome name="chevron-down" size={30} color="#ED8C40" />
        </TouchableOpacity>
        <TouchableOpacity
          style={{ position: 'absolute', right: 60, top: 12 }}
          onPress={() => setCompleted(!completed)}
        >
          <Text style={{fontSize: 20, fontWeight: 900, color: completed ? "#ED8C40" : "#999" }}>ALL</Text>
        </TouchableOpacity>
      </View>
  )
}

const deviceHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
  paymentList: {
    paddingLeft: 10,
    paddingRight: 20,
    width: '100%',
    marginTop: 50,
    marginBottom: 10,
    // elevation: 10,
  },
  paymentItem: {
    width: '96%',
    marginHorizontal: '2%',
    // backgroundColor: 'pink',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    textAlign: 'center',
    marginVertical: 5,
  },
  paymentCnt: {
    position: 'absolute',
    top: deviceHeight - 315,
    height: 350,
    width: '100%',
    backgroundColor: '#FBF6E7',
    alignItems: 'center',
    // borderWidth: 1,
    // borderRadius: 5,
    elevation: 10,
  },
});
const itemStyle = StyleSheet.create({
  line: {
    borderStartWidth: StyleSheet.hairlineWidth,
    height: '70%',
    position: 'absolute',
    top: '72%',
    left: 12,
  },
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
    backgroundColor: 'white',
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
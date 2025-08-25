import React, { useState, useEffect } from 'react';
import { Entypo, Feather, FontAwesome } from '@expo/vector-icons'; 
import { SearchBar, ListItem } from '@rneui/themed';
import { View, Text, TouchableOpacity, Image, Modal, StyleSheet, Button, FlatList } from 'react-native';
import AddBook from '@components/addbook';
import FilterContent from '@components/filter';
import { Header, Setting } from '@components/header';
import { router, Link } from 'expo-router';


// const DATA = [
//   {
//     id: 1,
//     topic: '韓國追星之旅',
//     start_date: '2023-9-6',
//     end_date: '2023-9-10',
//     profile1: require('@assets/images/p1.jpg'),
//     profile2: require('@assets/images/p2.jpg'),
//     cover: require('@assets/images/cover1.jpg'),
//     start: 20230906,
//     ppl: 2,
//   },
//   {
//     id:2,
//     topic: '日本畢業旅行',
//     start_date: '2023-12-6',
//     end_date: '2024-12-6',
//     profile1: require('@assets/images/p3.jpg'),
//     profile2: require('@assets/images/p4.jpg'),
//     cover: require('@assets/images/cover2.jpg'),
//     start: 20230206,
//     ppl: 3,
//   },
// ]

const TravelBookshelf = () => {
  console.log('Test',global.email)
  if(!global.email) {
    router.push("/login/signIn");
    return;
  }
  const userEmail = global.email;
  const [isModalVisible_filter, setModalVisible_filter] = useState(false);
  const [isModalVisible_book, setModalVisible_book] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [DATA, setDATA] = useState([]);

  const getAllBooks = () => {
    const apiUrl = process.env.EXPO_PUBLIC_API_URL;
    // const userEmail = 'cookie@example.com';
    // const userEmail = 'admin1@example.com';

    fetch(`${apiUrl}/books/all_books/?user_email=${userEmail}`, {
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
        setDATA(data.book_list);
        setSortedData(data.book_list);

        // Additional data-related operations
        // console.log('Books data:', DATA);
        // console.log('Sorted Books data:', sortedData);

      })
      .catch(error => {
        console.error('Error:', error);
        // 处理错误
      });
  };

  useEffect(() => {
    getAllBooks();
  }, []); 

  
  // 點擊書
  const handleBookPress = (book) => {
    console.log(`選擇了${book}`);
    if(book == 'Add')
      setModalVisible_book(true);
    else {
      //判斷是否為現在進行中的旅程
      const selectedBook = DATA.find(item => item.book_details.name === book);
      
      if (selectedBook) {
        console.log('selectedBook: ', selectedBook.books);
        const currentDate = new Date();
        const startDate = new Date(selectedBook.book_details.start_time);
        const endDate = new Date(selectedBook.book_details.end_time);

        if (currentDate >= startDate && currentDate <= endDate) {
          console.log('The journey is ongoing.');
          // console.log('selectedBook: ', selectedBook)
          // Handle logic for ongoing journey
          router.push('/');
        } else {
          console.log('The journey has ended.');
          // Handle logic for ended journey
          router.push({
            pathname: `../overview/Overview`,
            params:{
              book_id: selectedBook.books,
              cover_pic: selectedBook.book_details.cover_img,
            }
          });
        }
      } else {
        console.log('Book not found.');
      }
    }
  };

  // 點擊新增
  const closeModal_add = () => {
    setModalVisible_book(false);
    getAllBooks();
  };

  // 點擊filter
  const toggleModal = () => {
    setModalVisible_filter(!isModalVisible_filter);
  };
  const closeModal_filter = () => {
    setModalVisible_filter(false);
  };

  // search
  const updateSearch = (text) => {
    setSearch(text);

    // 以 topic 搜尋
    if (text === '') {
      setFilteredData([...DATA]);
      setSortedData([...DATA])
    } else {
      // Filter the data based on whether the topic contains the search term
      const filteredResults = DATA.filter((item) =>
       item.book_details.name.toLowerCase().includes(text.toLowerCase())
      );

      setFilteredData(filteredResults);
      setSortedData(filteredResults);
    }
  };

  // sorting
  const handleSortChange = (type, ascending) => {
    // 做sorting, 日期 / 人數
    let newData = [...DATA]; // 如果 DATA 是不可變的，請使用對應的不可變數據結構

    if (type === 'date') {
      newData.sort((a, b) => {
        const dateA = ascending ? a.start - b.start : b.start - a.start;
        return dateA;
      });
    } else if (type === 'people') {
      newData.sort((a, b) => {
        const peopleA = ascending ? a.ppl - b.ppl : b.ppl - a.ppl;
        return peopleA;
      });
    }
    setSortedData(newData);
    console.log(sortedData);
  };

  return (
    <View style={styles.container}>

      {/* 頁首 */}
      {/* <View style={styles.top}>
        <Entypo name="menu" size={24} color="transparent"  />
        <Text style={styles.title}>旅遊書櫃</Text>
        <Entypo name="cog" size={24} color="black" />
      </View> */}
      <Header headerRight={<Setting/>} height={70}>
        <Text style={styles.title}>旅遊書櫃</Text>
      </Header>
      <View style={styles.separator} />

      {/* search bar */}
      <View style={styles.searchbar}>
        <SearchBar
          placeholder="Type Here..."
          onChangeText={updateSearch}
          value={search}
          containerStyle={{ backgroundColor: 'transparent', borderWidth: 0, borderBottomWidth: 0, borderTopWidth: 0 }}
          inputContainerStyle={{
            backgroundColor: 'white',
            borderRadius: 20, // 可以根據需要調整
            borderWidth: 1,
            borderColor: 'gray', // 可以根據需要調整
            borderBottomWidth: 1, // 添加底部的線 //為啥要自己加我也不知道
            width: 200,
            height: 20,
          }}
          inputStyle={{ color: 'black' }}
        />
      </View>

      {/* your memories + filter*/}
      <View style={styles.filter }>
        <Text style={styles.text}>Your Memories</Text>
        <TouchableOpacity onPress={toggleModal}>
          <Feather name="filter" size={16} color="gray" />
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible_filter}
        onRequestClose={() => {
          closeModal_filter();
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <FilterContent closeModal={closeModal_filter} onSortChange={handleSortChange} />
          </View>
        </View>
      </Modal>

      {/* 帳本們 */}
      <CountrySelector handleBookPress={handleBookPress} sortedData={sortedData}/>
      
      {/* 新增帳本 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible_book}
        onRequestClose={() => {
          closeModal_add();
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <AddBook closeModal={closeModal_add} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const CountrySelector = ({ handleBookPress, sortedData }) => (
  <View>
    <FlatList
      data={sortedData}
      renderItem={({item}) => <Item item={item} handleBookPress={handleBookPress}/>}
      keyExtractor={item => item.id}
    />

    {/* 以下是新增帳本 */}
    <TouchableOpacity
      onPress={() => {
        handleBookPress('Add');
      }}
      style={styles.addButton}
    >
      <FontAwesome name="plus" size={24} color="lightgray" />
    </TouchableOpacity>
  </View>

);

const styles = StyleSheet.create({
  container: {
    // alignItems: 'center',
    padding: 5,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // 可以使用 'space-between' 讓兩個元素靠兩邊
    paddingHorizontal: 20, // 可以根據需求調整水平內邊距
    marginTop: 40, // 原20
    // marginBottom: 20,
    height: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    backgroundColor: 'black',
    marginBottom: 10,
  },

  // Search bar
  searchbar: {
    // margin: 10,
    alignItems: 'center',
    marginBottom: 10,
  },

  // filter
  filter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // 可以使用 'space-between' 讓兩個元素靠兩邊
    paddingHorizontal: 20, // 可以根據需求調整水平內邊距
  },
  text: {
    fontSize: 14,
    color: 'gray',
  },

  // 帳本
  countryBox: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    padding: 30,
    margin: 10,
    backgroundColor: 'lightgray',
  },
  travelContainer: {
    flexDirection: 'row', // 水平方向排列
    alignItems: 'flex-start', // 靠左對齊
  },
  travelInfo: {
    flexDirection: 'column', //垂直方向排列
    alignItems: 'flex-start', //靠左
  },
  travelName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5, // 添加底部邊距
  },
  travelDate: {
    fontSize: 10,
    color: 'gray',
    marginBottom: 5, // 添加底部邊距
  },
  travelCompanions: {
    flexDirection: 'row', // 垂直方向排列
    alignItems: 'flex-start', // 靠左對齊
    marginRight: 10,
  },
  companionImage: {
    width: 20,
    height: 20,
    borderRadius: 15, // 使圖片呈現圓形
    marginRight: 5,
  },
  coverImage: {
    width: 80,
    height: 80,
    resizeMode: 'cover', // 使圖片保持原始比例並覆蓋整個區域
    marginLeft: 'auto', // 靠右
  },

  // 新增帳本
  addButton: {
    borderWidth: 1,
    borderColor: 'gray',
    // backgroundColor: 'lightgray',
    padding: 30,
    borderRadius: 10,
    margin: 10,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
});

const Item = ({item, handleBookPress}) => (
  <TouchableOpacity
    onPress={() => handleBookPress(item.book_details.name)}
    style={styles.countryBox}
  >
    <View style={styles.travelContainer}>
      <View style={styles.travelInfo}>
        <Text style={styles.travelName}>{item.book_details.name}</Text>
        <Text style={styles.travelDate}>{item.book_details.start_time.substring(0, 10)} - {item.book_details.end_time.substring(0, 10)}</Text>
        <View style={styles.travelCompanions}>
          {/* 我還沒想到人頭不同要怎麼搞 */}
          {item.book_details.user_list.map((user, index) => (
            <Image key={index} 
              source={{ uri: `data:image/jpeg;base64,${user.user_photo}` }}
              style={styles.companionImage} />
          ))}
        </View>
      </View>
      <Image
        source={{ uri: `data:image/jpeg;base64,${item.book_details.cover_img}` }}
        style={styles.coverImage}
      />
    </View>
  </TouchableOpacity>
);

export default TravelBookshelf;
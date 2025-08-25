import { React, useState, useEffect } from "react";
import {
  Text,
  View,
  Image,
  Modal,
  ScrollView,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity
} from "react-native";
import { LineChart, PieChart } from "react-native-gifted-charts";
// import styles from "@components/overview.style";
import { Feather, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import jsonData from "./DailyExpense.json"


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
  },
  albumContainer: {
    width: '48%', 
    marginTop: 10,
    marginBottom: 10,
    padding: 2,
  },
  thumbnail: {
    width: '100%',
    height: 110,
    marginBottom: 5,
    resizeMode: 'cover',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  title: {
    fontSize: 16,
  },
  modalContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  modalContent: {
    
    padding: 20,
  },
  modalImage: {
    height: 150,
    resizeMode: 'contain',
    marginBottom: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  modalRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',  // 新增這行，以便照片可以換行
    justifyContent: 'space-between',
    marginBottom: 10,
  },
});

const Gallery = ({ bookId }) => {
  const book_id = bookId;
  const user = global.email;

  const [filteredData, setfilteredData] = useState(null); 
  const [album_data, album_setActive] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [transformedData, setTrans] = useState([]);
  const [album_photos, setPhotos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoading_1, setIsLoading_1] = useState(true);
  const [first, setFirst] = useState(false);

  //fetch album
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const url_album = (`${apiUrl}/books/all_photos?` +
    new URLSearchParams({
      user_email: user,
      book_id: book_id,
    }).toString()
  ) 
  
  useEffect(() => {
    fetch(url_album, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        // 'access': json.access,
      },
    })
    .then(response => response.json())
    .then(json => {
      if (json !== null) { // 只在 JSON 非空時進行賦值
        
      
        console.log('json:', json);

        if(!first){
          for (const date in json.photo_list) {
            const product = {
                date: date,
                product_name: json.photo_list[date].product_name,
                photo: json.photo_list[date].photo
            };
            transformedData.push(product);
          }
          setTrans(transformedData)
          console.log('transformedData: ', transformedData);
          album_setActive(transformedData);
          setIsLoading(false);
          setFirst(true)
        }
        
    }});
  }, []);

  useEffect(() => {
    // Fetch photos when the selectedAlbum changes
    if (selectedAlbum) {
      const url_photo = (`${apiUrl}/books/daily_photos?` +
        new URLSearchParams({
          user_email: user,
          book_id: book_id,
          date: selectedAlbum.date,
        }).toString()
      ) 
      fetch(url_photo, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          // 'access': json.access,
        },
      })
      .then(response => response.json())
      .then(json => {
        if (json !== null) { // 只在 JSON 非空時進行賦值
          // console.log('photo json:', json);
          setPhotos(json.photo_list.filter(item => item.photo_base64 && item.product_name));
          // setPhotos(json);
          console.log('album_photos: ', album_photos);
          setIsLoading_1(false);
          
      }});
    }
  }, [selectedAlbum]);

  

  const handleAlbumPress = (album) => {
    setSelectedAlbum(album);
    setModalVisible(true);
  };


  const closeModal = () => {
    setSelectedAlbum(null);
    setModalVisible(false);
  };



  // fetch('https://jsonplaceholder.typicode.com/photos')
  // .then(response => response.json())
  // .then(json => console.log(json[0].url), json=>setActive(json[0].url))

  // if (!album_data || album_data.length === 0) {
  //   return <Text>No albums found</Text>;
  // }
  

  
  if (isLoading) {
    return (
        <View style={[styles.loadingContainer, styles.container]}>
            <Text style={styles.loadingText}>Loading...</Text>
        </View>
    );
  }
  return (
    <View style={styles.container}>
    
    {album_data
      .sort((a, b) => new Date(a.date) - new Date(b.date)) // 根據日期排序
      .map((album, index) => (
        <TouchableOpacity style={styles.albumContainer} key={index} onPress={() => handleAlbumPress(album)}>
          <Text style={styles.title}>{album.date}</Text>
          <Image style={styles.thumbnail} 
          source={{ uri: `data:image/jpeg;base64,${album.photo}` }} />
        </TouchableOpacity>
    ))}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        
        <View style={styles.modalContainer}>
          <TouchableOpacity style={{marginStart:'90%', marginTop:'10%'}} onPress={() => { setModalVisible(false)}}>
            <AntDesign name="close" size={24} color="black" />
          </TouchableOpacity>
          <View style={styles.modalContent}>
          
            <ScrollView >
              
              
            {isLoading_1 ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <View style={styles.modalRow}>
                {album_photos.map((photo, index) => {
                  console.log(`photo:`, photo); // 加入這行以輸出 photo_base64 的值

                  return (
                    <View key={index} style={{ width: '70%', marginBottom: 20 }}>
                      <Image style={styles.modalImage} source={{ uri: `data:image/jpeg;base64,${photo.photo_base64}` }} />
                      <Text style={styles.title}>{photo.product_name}</Text>
                    </View>
                  );
                })}                       
              </View>
            )}
              
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Gallery;

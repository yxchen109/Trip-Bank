import { Link } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { Entypo } from '@expo/vector-icons';

import * as Location from 'expo-location';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#D7EFF4',
    height: '100%',
    width: '100%',
    position: 'absolute',
  },
  locationBtn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  //const [latitude, setLatitude] = useState(null);
  //const [longitude, setLongitude] = useState(null);

  useEffect(() => {
    (async () => {
      
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

  return (
    <View style={styles.container}>
      <Pressable style={styles.locationBtn} onPress={() => alert(text)}>
        <Entypo name="location" size={50} color="black" />
      </Pressable>
    </View>   
  );
}
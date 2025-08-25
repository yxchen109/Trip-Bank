import { Drawer } from 'expo-router/drawer';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import { View, StyleSheet, Text, Pressable, ScrollView } from 'react-native';
import { AntDesign, Ionicons, Entypo } from '@expo/vector-icons';
import { useFonts } from "expo-font";
import React, { useCallback } from "react";
import * as SplashScreen from 'expo-splash-screen';
import Constants from 'expo-constants';
import { Redirect } from 'expo-router';
import { useSession } from '../../ctx';

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginHorizontal: 8,
    marginTop:5,
    // elevation: 3,
  },
  menuButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 5,
    marginHorizontal: 10,
    marginTop: Constants.statusBarHeight,
    position: 'absolute',
    // top: 45,
    // elevation: 3,
  }
});
function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      {/* <DrawerItem label={() => <Ionicons name="close" size={30} color="white" />} onPress={() => props.navigation.closeDrawer()} /> */}
      <DrawerItemList {...props} />
    </DrawerContentScrollView >
  );
}
function CustomHeader(props) {
  // console.log(props.route.name)
  const top = (props.route.name == "index" ? 5 : 10);
  return (
    <Pressable style={[styles.menuButton, {top: top}]} onPress={() => props.navigation.openDrawer()}>
      <Entypo name="menu" size={40} color="black"  />
    </Pressable>
  );
}
SplashScreen.preventAutoHideAsync();
export default function Layout({route}) {
  // console.log('route:', route)
  // const { session, isLoading } = useSession();
  // if (isLoading) {
  //   return <Text>Loading...</Text>;
  // }
  // // Only require authentication within the (app) group's layout as users
  // // need to be able to access the (auth) group and sign in again.
  // if (!session) {
  //   // On web, static rendering will stop here as the user is not authenticated
  //   // in the headless Node process that the pages are rendered in.
  //   return <Redirect href="/welcome" />;
  // }
  const [FontsLoaded] = useFonts({
    Pixellettersfull: require('@assets/fonts/Pixellettersfull-BnJ5.ttf'),
    BelieveIt: require('@assets/fonts/BelieveIt-DvLE.ttf'),
    ClatteryRegular: require('@assets/fonts/ClatteryRegular-4B2ex.ttf'),
    CorporateGothicNbpRegular: require('@assets/fonts/CorporateGothicNbpRegular-YJJ2.ttf'),
    DMBold: require('@assets/fonts/DMSans-Bold.ttf'),
    DMMedium: require('@assets/fonts/DMSans-Medium.ttf'),
    DMRegular: require('@assets/fonts/DMSans-Regular.ttf')
  })

  const onLayoutRootView = useCallback(async () => {
    if(FontsLoaded){
      await SplashScreen.hideAsync();
    }
  }, [FontsLoaded])

  if(!FontsLoaded) return null;

  // BackHandler.addEventListener('hardwareBackPress', onBackPress);
  
  return (
    <Drawer
    drawerContent={(props) => {
        return <CustomDrawerContent {...props}  />
      }
    }
    screenOptions={(props) => {
      return {
        header: () => <CustomHeader {...props}/>,
        drawerStyle: {
          backgroundColor: 'black',
          width: 200
        },
        drawerLabelStyle: {
          color: 'white'
        },
      }
    }}
    >
    <Drawer.Screen
      name="index" // This is the name of the page and must match the url from root
      options={(props) => {
        // console.log(props)
        return {
          drawerLabel: '記帳地圖',
          title: '',
          // props: props,
        }
      }}
    />
    <Drawer.Screen
      name="overview/Overview" // This is the name of the page and must match the url from root
      options={{
      drawerLabel: '當前旅程一覽',
      title: '',
      }}
    />
    <Drawer.Screen
      name="bookshelf/index"
      options={{
      drawerLabel: '旅行書櫃',
      title: '',
      }}
    />
    <Drawer.Screen
      name="test2" // This is the name of the page and must match the url from root
      options={{
        drawerLabel: '日常記帳',
        title: '',
        drawerItemStyle: {
          borderTopColor: 'white',
          borderTopWidth: 1,
          color: 'white',
          marginTop: 20,
          paddingTop: 20
        }
      }}
    />
    <Drawer.Screen
      name="addExpense/AddExpense"
      options={{
        drawerItemStyle: { display: 'none', },
        headerShown: false,
      }}
    />
    <Drawer.Screen
      name="history_book/[book_id]"
      options={{
        drawerItemStyle: { display: 'none', },
      }}
    />
    <Drawer.Screen
      name="login/welcome"
      options={{
        // drawerItemStyle: { display: 'none', },
        headerShown: false,
      }}
    />
    <Drawer.Screen
      name="login/signIn"
      options={{
        drawerItemStyle: { display: 'none', },
        headerShown: false,
      }}
    />
    <Drawer.Screen
      name="login/signUp"
      options={{
        drawerItemStyle: { display: 'none', },
        headerShown: false,
      }}
    />
    </Drawer>
  );
}

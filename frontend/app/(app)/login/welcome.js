
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, BackHandler } from 'react-native';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

const HomeScreen = ({ navigation }) => {
    useFocusEffect(
        React.useCallback(() => {
          const onBackPress = () => {
            // Do Whatever you want to do on back button click
            // Return true to stop default back navigaton
            // Return false to keep default back navigaton
            console.log(router.canGoBack());
            router.back();
            return true;
          };
      
          BackHandler.addEventListener(
            'hardwareBackPress', onBackPress
          );
      
          return () =>
            BackHandler.removeEventListener(
              'hardwareBackPress', onBackPress
            );
        }, [])
      );
    return (  
        <View style={styles.container}>
            <Image
                source={require('@assets/images/hello.png')}
                style={styles.logo}
                resizeMode="contain"
            />
            <Text style={styles.appName}>旅行記帳</Text>
            
            <TouchableOpacity style={styles.siButton} onPress={() => router.push('/login/signIn')}>  
                <Text style={styles.siText}>登入</Text>
            </TouchableOpacity>
          
            <TouchableOpacity style={styles.suButton}  onPress={() => router.push('/login/signUp')}>
                <Text style={styles.suText}>註冊</Text>
            </TouchableOpacity>

            <View style={styles.separatorContainer}>
                <View style={styles.separator} />
                <Text style={styles.separatorText}>或</Text>
                <View style={styles.separator} />
            </View>
            
            <TouchableOpacity style={styles.guestButton} onPress={() => alert('Coming Soon!')}>
                <Text style={styles.guestText}>訪客登入</Text>
            </TouchableOpacity>
            
        </View>
    );
};

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FBF6E7',
    },
    logo:{
        marginBottom: 10,
        width: 120, 
        height: 120,
        bottom: '10%',
        marginBottom: 10,
    },
    appName: {
        //fontFamily: 'BelieveIt',
        fontSize: 60,
        fontWeight: 'bold',
        color:'#5B3330',
        marginBottom: 20,
        bottom: '10%'
    },
    siButton: {
        height: 40,
        width: windowWidth*50/100,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ED8C40',
        backgroundColor: '#ED8C40',
        borderRadius: 20,
        marginBottom: 10,
        top: '10%'
    },
    siText: {
        color: '#FBF6E7',
        fontSize: 18,
        fontWeight: 'bold',
    },
    suButton: {
        height: 40,
        width: windowWidth*50/100,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FBF6E7',
        borderColor: '#ED8C40',
        borderWidth: 1,
        borderRadius: 20,
        marginBottom: 10,
        top: '10%'
    },
    suText: {
        color: '#ED8C40',
        fontSize: 18,
        fontWeight: 'bold',
    },
    separatorContainer:{
        flexDirection: 'row', 
        alignItems: 'center',
        top: '12%'
    },
    separator:{ 
        width: 100, 
        height: 1, 
        top: '14%',
        backgroundColor: '#933810'
    }, 
    separatorText:{
        width: 50, 
        textAlign: 'center',
        top: '14%',
        //fontFamily: 'ClatteryRegular',
        fontSize: 14,
        color: '#5B3330'
    },
    guestButton: {
        top: '14%'
    },
    guestText: {
        fontSize: 16,
        color: '#ED8C40',
        fontWeight: 'bold',
        
    },
});

export default HomeScreen;
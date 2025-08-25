import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const HomeScreen = ({ navigation }) => {
    return (  
        <View style={styles.container}>
            <Image
                source={require('@assets/images/hello.png')}
                style={styles.logo}
                resizeMode="contain"
            />
            <Text style={styles.title}>Welcome to</Text>
            <Text style={styles.appName}>Trip Bank</Text>
            
            <TouchableOpacity style={styles.siButton} onPress={() => navigation.navigate('Sign In')}>  
                <Text style={styles.siText}>Sign in</Text>
            </TouchableOpacity>
          
            <TouchableOpacity style={styles.suButton}  onPress={() => navigation.navigate('Sign Up')}>
                <Text style={styles.suText}>Sign up</Text>
            </TouchableOpacity>

            <View style={styles.separatorContainer}>
                <View style={styles.separator} />
                <Text style={styles.separatorText}>or</Text>
                <View style={styles.separator} />
            </View>
            
            <TouchableOpacity style={styles.guestButton} onPress={() => alert('Coming Soon!')}>
                <Text style={styles.guestText}>Join as a guest</Text>
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
        bottom: windowHeight*10/100
    },
    title: {
        fontFamily: 'Pixellettersfull',
        fontSize: 30,
        color:'#933810',
        marginBottom: 10,
        right: windowWidth*20/100,
        bottom: windowHeight*10/100
    },
    appName: {
        fontFamily: 'BelieveIt',
        fontSize: 72,
        fontWeight: 'bold',
        color:'#5B3330',
        marginBottom: 20,
        bottom: windowHeight*10/100
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
        top: windowHeight*10/100
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
        top: windowHeight*10/100
    },
    suText: {
        color: '#ED8C40',
        fontSize: 18,
        fontWeight: 'bold',
    },
    separatorContainer:{
        flexDirection: 'row', 
        alignItems: 'center',
        top: windowHeight*12/100
    },
    separator:{
        width: 100, 
        height: 1, 
        backgroundColor: '#933810'
    }, 
    separatorText:{
        width: 50, 
        textAlign: 'center',
        fontFamily: 'ClatteryRegular',
        fontSize: 30,
        color: '#5B3330'
    },
    guestButton: {
        top: windowHeight*12/100
    },
    guestText: {
        fontSize: 16,
        color: '#ED8C40',
        fontWeight: 'bold',
        
    },
});

export default HomeScreen;
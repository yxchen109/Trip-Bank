import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const SignUpScreen = ({ navigation }) => {
    return(
        <View style={styles.container}> 
            <Text> Sign Up </Text>
            <TouchableOpacity  onPress={() => {
                navigation.pop();
                navigation.navigate('Sign In')}
            }>
                <View style={styles.siButton}>
                    <Text style={styles.siText}>Sign in</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FBF6E7',
    },
    siButton: {
        height: 40,
        width: windowWidth*50/100,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ED8C40',
        backgroundColor: '#ED8C40',
        borderRadius: 20,
        marginBottom: 20,
    },
    siText: {
        color: '#FBF6E7',
        fontSize: 16,
        fontWeight: 'bold',
    },
    siButton: {
        height: 40,
        width: windowWidth*50/100,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ED8C40',
        borderRadius: 20,
        marginBottom: 10,
        top: windowHeight*10/100,
    },
    siText: {
        color: '#FBF6E7',
        fontSize: 18,
        fontWeight: 'bold',
    }
});

export default SignUpScreen;

import { StyleSheet, Dimensions } from "react-native";

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
    width: 120, 
    height: 120,
    bottom: '10%'
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color:'#5B3330',
    marginBottom: 20,
    bottom: '10%'
  },
  inputContainer:{
    bottom: '10%',
    marginBottom: 20,
  }, 
  input: {
    height: 40,
    width: windowWidth*80/100,
    backgroundColor: 'white',
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 8,
    borderRadius: 8,
  },
  errorMessage:{
    flexDirection: 'row',
    fontSize: 11,
    color: 'red',
    position: 'absolute',
    left: 10,
    top: 40
  },
  showPasswordIcon: {
    alignItems: 'flex-end',
    position: 'absolute',
    top: 7,
    right: 10,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    position: 'absolute',
    top: 42,
    right: 10
  },
  forgotPasswordText: {
    //fontFamily: 'CorporateGothicNbpRegular',
    fontSize: 14,
    color: '#933810',
    textDecorationLine: 'underline',
  },
  siButton: {
    height: 40,
    width: windowWidth*50/100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ED8C40',
    borderRadius: 20,
    marginBottom: 10,
    top: 10,
    bottom: '10%',
  },
  siText: {
    color: '#FBF6E7',
    fontSize: 18,
    fontWeight: 'bold',
  },
  suContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    top: 10,
    bottom: '10%',
  },
  suText: {
    //fontFamily: 'CorporateGothicNbpRegular',
    fontSize: 16,
    color: '#5B3330',
  },
  suLink: {
    fontSize: 16,
    color: '#933810',
    marginLeft: 5,
    fontWeight: 'bold',
    textDecorationLine: 'underline'
  },
  failContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: '120%',
    height: 30,
    width: windowWidth*80/100,
    backgroundColor: '#ffe6e6',
    borderColor: '#ffcccc',
    borderWidth: 0.6,
  },
  failMessage: {
    flexDirection: 'row',
    fontSize: 16,
    fontWeight: 'bold',
    color: 'red',
  },
  failboxClose:{
    left:windowWidth*10/100,
  },
  successContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: '30%',
    height: windowHeight*50/100,
    width: windowWidth*80/100,
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5, // For Android
  },
  successMessage: {
    flexDirection: 'row',
    fontSize: 40,
    fontWeight: 'bold',
    color: 'black'
  },
});

export default styles;
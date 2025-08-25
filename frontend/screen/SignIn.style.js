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
    marginBottom: 10,
    width: 120, 
    height: 120,
    bottom: windowHeight*20/100
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color:'#5B3330',
    marginBottom: 20,
    bottom: windowHeight*20/100
  },
  emailContainer:{
    position: 'absolute',
    top: windowHeight*40/100,
    marginBottom: 20,
  }, 
  pwContainer:{
    position: 'absolute',
    top: windowHeight*47/100,
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
    //position: 'absolute',
    left: 10,
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
    fontFamily: 'CorporateGothicNbpRegular',
    fontSize: 18,
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
    top: windowHeight*10/100,
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
    //position: 'absolute',
    top: windowHeight*10/100,
  },
  suText: {
    fontFamily: 'CorporateGothicNbpRegular',
    fontSize: 20,
    color: '#5B3330',
  },
  suLink: {
    fontSize: 16,
    color: '#933810',
    marginLeft: 5,
    fontWeight: 'bold',
    textDecorationLine: 'underline'
  },
});

export default styles;
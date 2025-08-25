import { StyleSheet } from "react-native";
import { COLORS, FONT, SIZES } from "@constants";

const styles = StyleSheet.create({
  container: {
    marginTop: SIZES.xLarge,
  },
  modifyContainer:{
    flexDirection: 'row',
    marginBottom:'7%',
    marginTop:'7%',
    // alignItems: 'center'
  },
  itemTitle:{
    fontSize: 15,
    width: '20%',
    marginStart: '20%'
  },
  modifyItem:{
    flexDirection: 'row',
    borderBlockColor:'#ccc',
    borderBottomWidth:1,
    marginStart: '5%',
    width:'40%',
  },
  button: {
    justifyContent:"center",
    paddingHorizontal: '2%',
    paddingVertical: '1%',
    borderRadius: 100,
    borderBlockColor:'black',
    borderWidth:1
  },
  // checklist
  checklist:{
    paddingTop: 80,
    paddingHorizontal:20,
  }
});

export default styles;

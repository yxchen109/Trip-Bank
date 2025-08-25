import { StyleSheet } from "react-native";
import { COLORS, FONT, SIZES } from "@constants";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    width: "100%",
  },
  linearGradient: {
    backgroundColor: "transparent",
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  pieChartimageDisplay:{
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    width: "100%",
    bottom:50
  },
  lineGraphimageDisplay:{
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    width: "100%",
    bottom:50
  },
  overviewDisplay: {
    textAlign: 'center',
    fontFamily: FONT.bold,
    fontSize: SIZES.xLarge,
    color: COLORS.primary,
    marginTop: '10%',
    marginBottom: '5%',
  },
  
  info: {
    fontFamily: FONT.regular,
    fontSize: SIZES.medium,
    color: COLORS.lightWhite,
    marginLeft:5
  },
  people: {
    fontFamily: FONT.regular,
    fontSize: SIZES.small,
    color: COLORS.lightWhite,
    marginLeft:5,
    marginRight:5,
    marginTop:5
  },
  profile:{
    width: 30, 
    height: 30, 
    marginRight: 5,
    borderRadius: 15
  },
  placeName: {
    fontFamily: FONT.bold,
    fontSize: SIZES.xxLarge,
    color: COLORS.lightWhite,
    marginBottom:2
  },
  searchContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginTop: SIZES.large,
    height: 50,
  },
  searchWrapper: {
    flex: 1,
    backgroundColor: COLORS.white,
    marginRight: SIZES.small,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: SIZES.medium,
    height: "100%",
  },
  searchInput: {
    fontFamily: FONT.regular,
    width: "100%",
    height: "100%",
    paddingHorizontal: SIZES.medium,
  },
  tabsContainer: {
    width: "100%",
    marginTop: SIZES.medium,
  },
  tab: (activeJobType, item) => ({
    paddingVertical: SIZES.small / 2,
    paddingHorizontal: SIZES.small,
    borderRadius: SIZES.medium,
    borderWidth: 1,
    borderColor: activeJobType === item ? COLORS.secondary : COLORS.gray2,
  }),
  tabText: (activeJobType, item) => ({
    fontFamily: FONT.medium,
    color: activeJobType === item ? COLORS.secondary : COLORS.gray2,
  }),
});

export default styles;

import { StyleSheet } from "react-native";

export const stylesnav_dropdown = StyleSheet.create({

  arrows: {
    position: "absolute",
    bottom: "100%",
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  navTopArrowView: {
    position: "absolute",
    bottom: -10,
  },

  navTopArrow: {
    width: 10,
    height: 10,
    resizeMode: "contain",
  },

  navTopModal: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 3,
  },
  navTopBg: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  navTopModalIn: {
    padding: 0,
    width: "100%",
    borderTopWidth: 2.5,
    borderTopColor: "#ebebeb",
  },

  navTopModalText: {
    textAlign: "center",
  },



  containerSentences: {
    backgroundColor: "#ffffff",
    paddingTop: "6%",
    paddingBottom: "11%",
  },
  titleh5: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#7ec81a",
    textAlign: "center",
  },
  titleh6: {
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 20,
    color: "#9f9f9f",
    textAlign: "center",
  },
  titleh7: {
    fontSize: 24,
    fontWeight: '500',
    color: "#FF9600",
    marginTop: 30,
    textAlign: "center",
    alignItems: "center",
  },
  containerCourseData: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
    cardCourseData: {
    flexDirection: 'row',
    width: '90%',
    borderRadius: 12,
    borderColor: '#d8d8d8',
    backgroundColor: "#f9f9f9",
    shadowColor: '#d8d8d8',
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
    iconContainer: {
    width: '47%',
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
      iconContainerRead: {
    width: '47%',
    paddingHorizontal: 10,
    paddingVertical: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
    cardMiddleProcenteCourse: {
    position: 'absolute',
    top: '-15%',
    right: 0,
    bottom: 0,
    left: 0,
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    zIndex: 1,
  },
    cardMiddleProcenteRow:{
    flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
      zIndex: 2,
  },


  textProcenteCourse: {
      fontSize: 35,
      fontWeight: '700',
      color: '#6a6a6a',
  },
  textProcenteCourse1: {
      fontSize: 15,
      fontWeight: '700',
      color: '#6a6a6a',
      alignContent: 'flex-start',
      marginLeft: '2%',
      height: '80%',
  },
    courseSheet:{
    width: 143,
    height: 154,
    resizeMode: "contain",
  },
  booksImgCard:{
    width: 90,
    height: 90,
    resizeMode: "contain",
  },



containerSheet: {
    width: '90%',
    marginTop: '5%',
    alignSelf: 'center',
  },
  cardSheet: {
    flexDirection: 'row',
    borderRadius: 12,
    borderColor: '#d8d8d8',
    backgroundColor: "#f9f9f9",
    shadowColor: '#d8d8d8',
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  sectionSheet: {
    padding: 20,
    justifyContent: 'center',
  },
  sectionSheet2: {
    width: '47%',
    paddingLeft: 15,
    justifyContent: 'center',
  }, 
    sectionSheet1: {
    padding: 20,
    width: '100%',
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderColor: '#d8d8d8',
  },
  headerSheet: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#777',
    marginBottom: 5,
  },
  numberSheetTxt: {
    fontSize: 31,
    fontWeight: 'bold',
    color: '#6a6a6a',
  },
  sectionSheetBorder: {
    flex: 1,
    borderLeftWidth: 2,
    borderColor: '#d8d8d8',
  },
    dividerCourseData: {
    width: 2,
    backgroundColor: '#d8d8d8',
    alignSelf: 'stretch',
  },
    fluencyContainer: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
   iconSubText: {
    fontSize: 16,
    color: '#777',
  },

  cardDataDayCurrent:{
    width: "45%",
    paddingTop: '4%',
    paddingBottom: '4%',
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: 1,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderColor: '#d8d8d8',
    borderTopLeftRadius: 10, 
    borderTopRightRadius: 0, 
    borderBottomLeftRadius: 10, 
    borderBottomRightRadius: 0,
  },

  cardDataDayLong:{
    width: "45%",
    paddingTop: '4%',
    paddingBottom: '4%',
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderLeftWidth: 1,
    borderRightWidth: 2,
    borderColor: '#d8d8d8',
    borderTopLeftRadius: 0, 
    borderTopRightRadius: 10, 
    borderBottomLeftRadius: 0, 
    borderBottomRightRadius: 10,
  },
    imageAnalyticsDay:{
    width: 60,
    height: 60,
    resizeMode: "contain",
    alignSelf: "center",
  },
  flagsLang:{
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  imageAnalyticsDayCheck:{
    width: 30,
    height: 30,
    resizeMode: "contain",
    alignSelf: "center",
    marginTop: 8,
  },
    cardDataSce: {
    width: "42%",
    marginTop: '7%',
    marginHorizontal: '2%',
    paddingHorizontal: '3%',
    paddingTop: '8%',
    paddingBottom: '8%',
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
    percentage1: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#4b4b4b",
    marginTop: '4%',
    textAlign: 'center',
  },
    timeframe1: {
    fontSize: 16,
    marginTop: '0%',
    color: "#545b62",
  },
    containerResultDataSce1: {
    flexDirection: "row",
    justifyContent: "center",
  },
    dayW: {
    fontSize: 19,
    fontWeight: "bold",
    marginTop: '3%',
    color: "#FF9600",
    textAlign: 'center',
  },
    boxDay:{
    marginTop: '8%',
    marginLeft: '2.7%',
    marginRight: '2.7%',
  },
    rowBlockSentences: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },
    resultProgressBar: {
    fontSize: 37,
    fontWeight: "bold",
    color: "#748895",
    textAlign: "center",
  },
    containerResultDataSce: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
    percentage: {
    fontSize: 35,
    fontWeight: "bold",
    color: "#7ec81a",
    textAlign: 'center',
  },

  timeframe: {
    fontSize: 16,
    marginTop: '3%',
    color: "#545b62",
    textAlign: 'center',
  },
    rowContainerLanguageSelect:{
    flexDirection: "row",
  },
    containerLanguageSelect: {
    justifyContent: "center",
    marginLeft: '6%',
    alignItems: 'flex-start',
  },

  textLangSelect: {
    fontSize: 16,
    marginTop: '0%',
    color: "#545b62",
    fontWeight: '700',
    textAlign: 'center',
  },
  

  fluencyText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

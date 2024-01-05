import { StyleSheet } from 'react-native';

// sergiu test 123123

// test 123

// test 1111111111111111111

const globalCss = StyleSheet.create({
  NavTopStartApp:{
    
  },
  alignItemsCenter:{
    alignItems: 'center',
  },
  container: {
    flex: 1, 
    padding: 20,
    marginTop: '13%',
  },
  title: {
    color: '#494949',
    fontWeight: '700',
    fontSize: 33,
    marginBottom: 20,
  },
  mb17:{
    marginBottom: '17%',
  },
  mb11:{
    marginBottom: '11%',
  },
  mb3:{
    marginBottom: '3%',
  },
  textAlignCenter:{
    textAlign: 'center'
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignContent: 'center',
  },
  link:{
    color: '#3ca6ff',
  },
  gry:{
    color: '#636363',
  },
  bold:{
    fontWeight: '700'
  },
  input: {
    color: '#636363',
    fontSize: 17,
    flex: 1,
  },
  card: {
    width: '48%',
    marginBottom: '5%',
    paddingTop: 55,
    paddingBottom: 55,
    paddingLeft: 8,
    paddingRight: 8,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  bgGry: {
    backgroundColor: '#f9f9f9',
    borderColor: '#d8d8d8',
    shadowColor: '#d8d8d8',
  },
  bgGryPressed: {
    backgroundColor: '#f9f9f9',
    borderColor: '#d8d8d8',
  },
  cardPressed:{
    shadowOffset: { width: 0, height: 0 },
    transform: [{ translateY: 4 }],
  },
  button:{
    width: '100%',
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: 'center',
    borderRadius: 14,
    marginBottom: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  buttonPressed:{
    shadowOffset: { width: 0, height: 0 },
    transform: [{ translateY: 4 }],
  },
  buttonBlue: {
    backgroundColor: '#1cb0f6',
    shadowColor: '#368fc3',
  },
  buttonWhite: {
    backgroundColor: '#ffffff',
    shadowColor: '#95d5a1',
  },
  buttonGreen: {
    backgroundColor: '#57cc04',
    shadowColor: '#62a10a',
  },
  buttonPressedBlue: {
    backgroundColor: '#1cb0f6',
  },
  buttonPressedWhite: {
    backgroundColor: '#ffffff',
  },
  buttonPressedGreen: {
    backgroundColor: '#57cc04',
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
  buttonTextGreen: {
    color: '#40b352',
    fontSize: 15,
    fontWeight: '600',
  },
  textUpercase:{
    textTransform: 'uppercase'
  },
});

export default globalCss;

import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, Modal, Animated, ImageBackground } from 'react-native';
import globalCss from './css/globalCss';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStar,  } from '@fortawesome/free-solid-svg-icons';

const FlashCardWords = ({ navigation }) => {
  const [pressedCards, setPressedCards] = useState({});
  const [data, setData] = useState([]);

  const [isDropdownAnimatedVisible, setIsDropdownAnimatedVisible] = useState(false);

  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const dropdownAnimation = useRef(new Animated.Value(-100)).current;
  useEffect(() => {
    if (isDropdownVisible) {
      setIsDropdownAnimatedVisible(true);
      Animated.timing(dropdownAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(dropdownAnimation, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,

      }).start(() => {
        setIsDropdownAnimatedVisible(false);
      });
    }
  }, [isDropdownVisible, dropdownAnimation]);


  const dropdownStyle = {
    transform: [{ translateY: dropdownAnimation }], // Animăm translateY
  };

  useEffect(() => {
    fetch('https://www.language.onllyons.com/ru/ru-en/backend/mobile_app/sergiu/flascard-words.php')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error:', error));
  }, []);

  const onPressIn = (id) => {
    setPressedCards(prevState => ({ ...prevState, [id]: true }));
  };

  const onPressOut = (id) => {
    setPressedCards(prevState => ({ ...prevState, [id]: false }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.navTabUser}>
        <View style={styles.itemNavTabUser}>
          <Image source={require('./images/other_images/nav-top/english.png')} style={styles.imageNavTop} />
          <Text style={styles.dataNavTop}>EN</Text>
        </View>
        <View style={styles.itemNavTabUser}>
          <Image source={require('./images/other_images/nav-top/sapphire.png')} style={styles.imageNavTop} />
          <Text style={styles.dataNavTop}>743</Text>
        </View>
        <View style={styles.itemNavTabUser}>
          <Image source={require('./images/other_images/nav-top/flame.png')} style={styles.imageNavTop} />
          <Text style={styles.dataNavTop}>4</Text>
        </View>
        <TouchableOpacity style={styles.itemNavTabUser} onPress={() => setIsDropdownVisible(!isDropdownVisible)}>
          <Image source={require('./images/other_images/nav-top/star.png')} style={styles.imageNavTop} />
          <Text style={styles.dataNavTop}>4</Text>
        </TouchableOpacity>
      </View>

      {isDropdownAnimatedVisible && (
        <Animated.View style={[styles.dropdown, dropdownStyle]}>
          <Text>Detaliu 1</Text>
          <Text>Detaliu 2</Text>
          <Text>Detaliu 3</Text>
          <Text>Detaliu 3</Text>
          <Text>Detaliu 3</Text>
          <Text>Detaliu 3</Text>
          <Text>Detaliu 3</Text>
          <Text>Detaliu 3</Text>
          <Text>Detaliu 3</Text>
          <Text>Detaliu 3</Text>
          {/* ...alte detalii */}
        </Animated.View>
      )}
      <ScrollView scrollEnabled={!isDropdownVisible}>
        <ImageBackground 
          source={require('./images/background-app/flashcards.png')}
          resizeMode='repeat'
          style={{flex: 1}}
        >
          <View style={styles.contentFlashCards}>
            {data.map((item, index) => (
              <View key={item.id} style={[{ width: index % 3 === 0 ? '100%' : '50%' }, globalCss.alignItemsCenter]}>
                <TouchableOpacity
                  style={[
                    styles.card,
                    pressedCards[item.id] && styles.cardPressed,
                    styles.bgGry,
                    pressedCards[item.id] && styles.bgGryPressed,
                  ]}
                  onPress={() => navigation.navigate('FlashCardsWordsCategory', { codeName: item.code_name })}
                  onPressIn={() => onPressIn(item.id)}
                  onPressOut={() => onPressOut(item.id)}
                  activeOpacity={1}
                >
                  <Text><FontAwesomeIcon icon={faStar} size={30} style={styles.iconFlash} /></Text>
                </TouchableOpacity>
                <Text>{item.title_category}</Text>
              </View>
            ))}
          </View>
        </ImageBackground>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{

  },
  card: {
    // 110
    width: 100,
    height: 100,
    marginBottom: '9%',
    borderRadius: 60,
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
  cardPressed: {
    shadowOffset: { width: 0, height: 0 },
    transform: [{ translateY: 4 }],
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
  contentFlashCards: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    zIndex: 2,
  },
  iconFlash: {

  },
  imageNavTop:{
    width: 28,
    height: 28,
  },
  dataNavTop:{
    fontSize: 16,
    color: '#383838',
    fontWeight: '700',
    marginLeft: '5%',
  },
  navTabUser:{
    width: "100%",
    paddingTop: "10%",
    backgroundColor: "#eeeff0",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 3,
  },
  itemNavTabUser:{
    flexDirection: "row",
    paddingTop: '5%',
    paddingBottom: '5%',
    alignItems: "center",
    justifyContent: 'center',
    flex: 1,
  },
  dropdown: {
    position: 'absolute',
    // top: '12.3%',
    left: 0,
    width: '100%',
    height: '30%',
    backgroundColor: 'red',
    // backgroundColor: '#dbdbdb',
    padding: 10,
    zIndex: 1,
  },

  template:{

  },
  template:{

  },
  template:{

  },
  template:{

  },
  template:{

  },
  template:{

  },
  template:{

  },
  template:{

  },
  template:{

  },
  template:{

  },
  template:{

  },
  template:{

  },
  template:{

  },
  template:{

  },

});

export default FlashCardWords;

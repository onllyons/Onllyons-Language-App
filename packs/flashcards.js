import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, Modal, Animated } from 'react-native';
import globalCss from './css/globalCss';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

const FlashCardWords = ({ navigation }) => {
  const [pressedCards, setPressedCards] = useState({});
  const [data, setData] = useState([]);
  const [visibleData, setVisibleData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    fetch('https://www.language.onllyons.com/ru/ru-en/backend/mobile_app/sergiu/flascard-words.php')
      .then(response => response.json())
      .then(data => {
        setData(data);
        setVisibleData(data.slice(0, 20)); // Afișează primele 20 de carduri inițial
        setIsLoading(false);
      })
      .catch(error => console.error('Error:', error));
  }, []);

  const onPressIn = (id) => {
    setPressedCards(prevState => ({ ...prevState, [id]: true }));
  };

  const onPressOut = (id) => {
    setPressedCards(prevState => ({ ...prevState, [id]: false }));
  };

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const contentHeight = event.nativeEvent.contentSize.height;
    const screenHeight = event.nativeEvent.layoutMeasurement.height;

    // Verifică dacă utilizatorul a derulat până la sfârșit
    if (offsetY + screenHeight >= contentHeight - 20 && !isLoading) {
      setIsLoading(true);

      // Încarcă următoarele carduri din baza de date
      const nextVisibleData = data.slice(visibleData.length, visibleData.length + 20);
      setTimeout(() => {
        setVisibleData(prevVisibleData => [...prevVisibleData, ...nextVisibleData]);
        setIsLoading(false);
      }, 1000); // Acesta este un delay simulat pentru a demonstra încărcarea treptată
    }
  };

  return (
    <View style={styles.container}>
      <View style={globalCss.navTabUser}>
        <View style={globalCss.itemNavTabUser}>
          <Image
            source={require("./images/other_images/nav-top/english.webp")}
            style={globalCss.imageNavTop}
          />
          <Text style={globalCss.dataNavTop}>EN</Text>
        </View>
        <View style={globalCss.itemNavTabUser}>
          <Image
            source={require("./images/other_images/nav-top/open-book.png")}
            style={globalCss.imageNavTop}
          />
          <Text style={globalCss.dataNavTop}>743</Text>
        </View>
        <View style={globalCss.itemNavTabUser}>
          <Image
            source={require("./images/other_images/nav-top/flame.png")}
            style={globalCss.imageNavTop}
          />
          <Text style={globalCss.dataNavTop}>4</Text>
        </View>
        <TouchableOpacity style={globalCss.itemNavTabUser}>
          <Image
            source={require("./images/other_images/nav-top/star.png")}
            style={globalCss.imageNavTop}
          />
          <Text style={globalCss.dataNavTop}>4</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingTop: 30, paddingBottom: 220 }}
        onScroll={handleScroll}
        scrollEventThrottle={400}
        ref={scrollViewRef}
      >
        <View style={styles.contentFlashCards}>
            {visibleData.map((item, index) => (
              <View key={item.id} style={[{ width: index % 3 === 0 ? '100%' : '50%' }, globalCss.alignItemsCenter]}>
              <TouchableOpacity
                style={[
                  styles.card,
                  pressedCards[item.id] && styles.cardPressed,
                  styles.bgGry,
                  pressedCards[item.id] && styles.bgGryPressed,
                ]} 
                onPress={() => navigation.navigate('FlashCardsWordsCategory', { codeName: item.code_name, codeTitle: item.title_category })}
                onPressIn={() => onPressIn(item.id)}
                onPressOut={() => onPressOut(item.id)}
                activeOpacity={1}
              >
                <Text>
                  <FontAwesomeIcon icon={faStar} size={30} style={styles.iconFlash} />
                </Text>
              </TouchableOpacity>
              <Text style={styles.titleFlashCards}>{item.title_category}</Text>
            </View>
          ))}
        </View>
        {isLoading && <Text></Text>}
      </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({
  container:{
    backgroundColor: 'white',
  },
  titleFlashCards:{
    marginBottom: '15%',
    fontSize: 13,
    maxWidth: '80%',
    alignSelf: 'center',
    textAlign: 'center',
  },
  card: {
    // 110
    width: 100,
    height: 100,
    marginBottom: '6%',
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

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import globalCss from './css/globalCss';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

export default function FlashCardWords({ navigation }) {

  const [pressedCards, setPressedCards] = useState({});
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('https://www.language.onllyons.com/ru/ru-en/backend/mobile_app/sergiu/flascard-words.php')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error:', error));
  }, []);

  const onPressIn = (id) => {
    setPressedCards(prevState => ({...prevState, [id]: true}));
  };

  const onPressOut = (id) => {
    setPressedCards(prevState => ({...prevState, [id]: false}));
  };

  return (
    <ScrollView  style={globalCss.container}>

      <View>
        <Text style={[globalCss.title, globalCss.textAlignCenter]}>Flash cards</Text>
      </View>

      <View style={styles.contentFlashCards}>
        {data ? (
          data.map((item, index) => (
            <>
              {(index % 3 === 0 || index === 0) && <View style={{ width: '100%' }}></View>}
              <View key={item.id} style={[{ width: index % 3 === 0 ? '100%' : '50%' }, globalCss.alignItemsCenter]}>
                <TouchableOpacity 
                  style={[styles.card, pressedCards[item.id] ? [styles.cardPressed, styles.bgGryPressed] : styles.bgGry]}
                  onPress={() => navigation.navigate('FlashCardsWords')}
                  onPressIn={() => onPressIn(item.id)}
                  onPressOut={() => onPressOut(item.id)}
                  activeOpacity={1}
                >
                  <Text><FontAwesomeIcon icon={faStar} size={30} style={styles.iconFlash} /></Text>
                </TouchableOpacity>
                <Text>{item.title_category}</Text>
              </View>
            </>
          ))
        ) : (
          <Text></Text>
        )}
      </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  card: {
    width: 110,
    height: 110,
    marginBottom: '5%',
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
  cardPressed:{
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
  contentFlashCards:{
    flexDirection: 'row', 
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },

  iconFlash:{

  },


});
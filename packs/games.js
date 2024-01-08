import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import globalCss from './css/globalCss';

export default function GamesScreen({ navigation }) {
  const [isCardPressed1, setIsCardPressed1] = useState(false);
  const [isCardPressed2, setIsCardPressed2] = useState(false);
  const [isCardPressed3, setIsCardPressed3] = useState(false);

  return (

    <View style={globalCss.row}>
      <TouchableOpacity 
        style={[styles.card, isCardPressed1 ? [styles.cardPressed, styles.bgGryPressed] : styles.bgGry]}
        onPress={() => navigation.navigate('GamesQuiz')}
        onPressIn={() => setIsCardPressed1(true)}
        onPressOut={() => setIsCardPressed1(false)}
        activeOpacity={1}
      >
        <Image
          source={{ uri: 'https://www.language.onllyons.com/ru/ru-en/dist/images/other/cards-icon/quiz-game.webp' }}
          style={{ width: 100, height: 100 }}
        />
        <Text>game quiz puzzle</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.card, isCardPressed2 ? [styles.cardPressed, styles.bgGryPressed] : styles.bgGry]}
        onPress={() => navigation.navigate('GamesQuiz')}
        onPressIn={() => setIsCardPressed2(true)}
        onPressOut={() => setIsCardPressed2(false)}
        activeOpacity={1}
      >
        <Image
          source={{ uri: 'https://www.language.onllyons.com/ru/ru-en/dist/images/other/cards-icon/quiz-game.webp' }}
          style={{ width: 100, height: 100 }}
        />
        <Text>game alphabet</Text>
      </TouchableOpacity>
    </View>

  );
}
const styles = StyleSheet.create({
  card: {
    flex: 1,
    // width: '40%',
    height: 110,
    marginBottom: '5%',
    borderRadius: 6,
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
    marginLeft: 4, 
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


});
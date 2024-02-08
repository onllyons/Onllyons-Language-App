import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import globalCss from './css/globalCss';

const cardData = [
  { id: 1, uri: 'https://www.language.onllyons.com/ru/ru-en/dist/images/other/cards-icon/quiz-game.webp', text: 'Задачи' },
  { id: 2, uri: 'https://www.language.onllyons.com/ru/ru-en/dist/images/other/cards-icon/quiz-game-write-with-keyboard.webp', text: 'Написать перевод' },
  { id: 3, uri: 'https://www.language.onllyons.com/ru/ru-en/dist/images/other/cards-icon/quiz-game-write-translate.webp', text: 'Расшифруйте аудио' },
  { id: 4, uri: 'https://www.language.onllyons.com/ru/ru-en/dist/images/other/cards-icon/quiz-game-change-eyes.webp', text: 'Переведите аудио' },
  { id: 5, uri: 'https://www.language.onllyons.com/ru/ru-en/dist/images/other/cards-icon/quiz-game-true-false.webp', text: 'Верно - Не верно' },
];

export default function GamesScreen({ navigation }) {
  const [pressedCard, setPressedCard] = useState(null);

  const handlePress = (id) => {
    if (id === 1) {
      setPressedCard(null); // Resetare înainte de navigație
      navigation.navigate('GamesQuiz');
    } else {
      Alert.alert(
        "Игра будет доступна в системе в ближайшее время. Благодарим за ваше терпение и понимание.",
        "",
        [{ text: "OK", onPress: () => setPressedCard(null) }] // Resetare după afișarea alertei
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titlePage}>
        Quiz game
      </Text>

      <View style={[globalCss.row, styles.containerCards]}>
        {cardData.map((card) => (
          <Card
            key={card.id}
            card={card}
            isPressed={pressedCard === card.id}
            onPress={() => handlePress(card.id)}
            onPressIn={() => setPressedCard(card.id)}
            onPressOut={() => setPressedCard(null)}
          />
        ))}
      </View>
    </View>
  );
}

const Card = ({ card, isPressed, onPress, onPressIn, onPressOut }) => (
  <TouchableOpacity
    style={[styles.card, isPressed ? [styles.cardPressed, styles.bgGryPressed] : styles.bgGry]}
    onPress={onPress}
    onPressIn={onPressIn}
    onPressOut={onPressOut}
    activeOpacity={1}
  >
    <Image
      source={{ uri: card.uri }}
      style={{ width: 100, height: 100 }}
    />
    <Text>{card.text}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container:{
    padding: 20,
    flex: 1,
    backgroundColor: 'white',
  },
  containerCards:{
    backgroundColor: 'white',
  },
  titlePage:{
    marginTop: '13%',
    fontSize: 30,
    fontWeight: '600',
    color: '#333333',
  },
  card: {
    flexBasis: '48%',
    height: 150,
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
    marginVertical: '2%',
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
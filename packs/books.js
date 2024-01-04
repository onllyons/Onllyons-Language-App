import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import globalCss from './css/globalCss';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

export default function BooksScreen({ navigation }) {

  const [pressedCards, setPressedCards] = useState({});
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch('https://www.language.onllyons.com/ru/ru-en/backend/mobile_app/sergiu/books.php')
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


    <ScrollView style={globalCss.container}>
        {/* <Text style={globalCss.title}>Books</Text> */}
        <View style={styles.contentBooks}>
          {data ? (
            data.map((item, index) => (
              <View key={item.id} style={styles.cell}>
                <TouchableOpacity
                  style={[styles.card, pressedCards[item.id] ? [styles.cardPressed, styles.bgGryPressed] : styles.bgGry]}
                  onPress={() => navigation.navigate('books_reading', { url: item.url })}
                  onPressIn={() => onPressIn(item.id)}
                  onPressOut={() => onPressOut(item.id)}
                  activeOpacity={1}
                >
                  <Image
                    source={{
                      uri: `https://www.language.onllyons.com/ru/ru-en/packs/assest/books/read-books/img/${item.image}`,
                    }}
                    style={styles.image}
                  />
                  
                </TouchableOpacity>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.author}>{item.author}</Text>
              </View>
            ))
          ) : (
            <Text></Text>
          )}
        </View>

    </ScrollView>

  );
}


const styles = StyleSheet.create({
  bgCourse:{
    backgroundColor: '#d1d1d1',
  },
  cell:{
    width: '50%',
    minHeight: 260,
    paddingRight: '5%',
    paddingLeft: '5%',
  },
  card: {
    width: '100%',
    marginBottom: '0%',
    borderRadius: 14,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
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
  contentBooks:{
    flexDirection: 'row', 
    flexWrap: 'wrap',
  },
  image: {
    width: '100%',
    height: 205,
    resizeMode: 'cover',
    borderRadius: 14,
  },
  title: {
    fontSize: 15,
    marginTop: '4%',
    fontWeight: 'bold',
    color: 'black',
  },
  author: {
    fontSize: 12,
    color: 'black',
  },

});

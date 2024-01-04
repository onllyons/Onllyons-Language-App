import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import globalCss from './css/globalCss';

export default function BooksScreen({ navigation }) {
  return (
    <ScrollView style={globalCss.container}>
      <Text style={globalCss.title}>Colectia de carti</Text>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.cardBook}
          onPress={() => navigation.navigate('books_reading')}
          activeOpacity={1}
        >
          <Image
            source={{
              uri:
                'https://www.language.onllyons.com/ru/ru-en/packs/assest/books/read-books/img/the-wolf-and-the-lamb-the-classic-fairy-tale.webp',
            }}
            style={styles.image}
          />
          <Text style={styles.title}>asdf</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardBook: {
    width: '48%',
    marginBottom: 16,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 14,
  },
  title: {
    fontSize: 15,
    marginTop: '4%',
    color: 'black',
  },
});

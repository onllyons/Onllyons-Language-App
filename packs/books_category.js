import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from '@react-navigation/native';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from "react-native";

import globalCss from "./css/globalCss";
import BooksReading from "./books_reading";

export default function BooksCategoryScreen({ route }) {
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const { category } = route.params;
  const bookId = route.params.bookId;

  useEffect(() => {
    fetch('https://www.language.onllyons.com/ru/ru-en/backend/mobile_app/sergiu/books.php')
      .then(response => response.json())
      .then(data => {
        const filteredData = data.filter(item => item.type_category === category);
        setData(filteredData);
      })
      .catch(error => console.error('Error:', error));
  }, [category]);

  const getCategoryImageAndText = (categoryValue) => {
    switch (categoryValue) {
      case "1":
        return {
          imageSource: require('./images/icon/levelEasy.png'),
          text: "Начальный уровень"
        };
      case "2":
        return {
          imageSource: require('./images/icon/levelMedium.png'),
          text: "Средний уровень"
        };
      case "3":
        return {
          imageSource: require('./images/icon/levelHard.png'),
          text: "Продвинутый уровень"
        };
      default:
        return {
          imageSource: null,
          text: ""
        };
    }
  };

  const renderItem = ({ item }) => {
    const categoryInfo = getCategoryImageAndText(item.category);

    return (
      <TouchableOpacity onPress={() => navigation.navigate('BooksReading', { url: item.id, bookId: item.id })}>
        <View style={styles.item}>
          <Image 
            source={{
              uri: `https://www.language.onllyons.com/ru/ru-en/packs/assest/books/read-books/img/${item.image}`,
            }}
            style={styles.image}
          />
          <View>
            <Text style={styles.author}>{item.author}</Text>
            <Text style={styles.title}>{item.title}</Text>
            <View style={styles.levelHard}>
              <Image
                source={categoryInfo.imageSource}
                style={styles.levelHardImg}
              /> 
              <Text style={styles.levelHardTxt}>{categoryInfo.text}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.categoryTitle}>{category}</Text>
        {data.map((item) => (
          <View key={item.id}>
            {renderItem({ item })}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1, 
    padding: 20,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  item: {
    marginBottom: '10%',
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: '26%',
    height: 130,
    borderRadius: 15,
    marginRight: 10,
  },
  title: {
    fontSize: 17,
    marginTop: '2%',
    fontWeight: "bold",
  },
  author: {
    fontSize: 14,
    marginTop: '2%',
    color: "gray",
  },
  levelHard:{
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '2%',
    alignContent: 'flex-start',
  },
  levelHardImg:{
    width: 25,
    height: 25,
  },
  levelHardTxt:{
    marginLeft: '3%'
  },

});

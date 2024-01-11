import React, { useEffect, useState } from "react";
import { useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";

export default function FlashCardsCategory({ route }) {
  const navigation = useNavigation();
  const { codeName } = route.params;
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('https://www.language.onllyons.com/ru/ru-en/backend/mobile_app/sergiu/flascard-words-category.php')
      .then((response) => response.json())
      .then((data) => {
        const filteredData = data.filter((item) => item.group_category === codeName);
        setData(filteredData);
      })
      .catch((error) => console.error('Error:', error));
  }, [codeName]);

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

  return (
    <ScrollView>
      <View style={styles.container}>
      {data.map((item) => (

        <TouchableOpacity key={item.id} onPress={() => navigation.navigate('FlashCardsWords', { url: item.url })}>
          <View style={styles.item}>
            <Image
              source={{
                uri: `https://www.language.onllyons.com/ru/ru-en/packs/assest/books/read-books/img/an-ant-a-grasshopper-the-classic-fairy-tale.webp`,
              }}
              style={styles.image}
            />
            <View>
              <Text style={styles.author}>{item.time_lessons}</Text>
              <Text style={styles.title}>{item.title}</Text>
              <View style={styles.category}>
                <Image
                  source={getCategoryImageAndText(item.category).imageSource}
                  style={styles.levelHardImg}
                />
                <Text style={styles.levelHardTxt}>
                  {getCategoryImageAndText(item.category).text}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
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

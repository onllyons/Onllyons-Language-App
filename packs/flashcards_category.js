import React, { useEffect, useState } from "react";
import { useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import globalCss from './css/globalCss';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export default function FlashCardsCategory({ route, navigation }) {
  const { codeName } = route.params;
  const [data, setData] = useState([]);
  const [pressedCards, setPressedCards] = useState({});

  const colors = ['#FF9400', '#7BC70A', '#CE81FF', '#1AB1F6', '#ffcc01', '#FC4849']; 
  const colorsPressed = ['#ffb14c', '#92ea0e', '#deadff', '#59c7f7', '#f9d243', '#f97575']; 
  
  const images = [
    require('./images/other_images/flash-cards-leeson/kitty.png'),
    require('./images/other_images/flash-cards-leeson/house.png'),
    require('./images/other_images/flash-cards-leeson/dog.png'),
    require('./images/other_images/flash-cards-leeson/astronomy.png'),
    require('./images/other_images/flash-cards-leeson/paper-lantern.png'),
    require('./images/other_images/flash-cards-leeson/snowflake.png'),
    require('./images/other_images/flash-cards-leeson/night.png'),
    require('./images/other_images/flash-cards-leeson/swords.png'),
    require('./images/other_images/flash-cards-leeson/dragon.png'),
    require('./images/other_images/flash-cards-leeson/crown.png'),
    require('./images/other_images/flash-cards-leeson/circle.png'),
    require('./images/other_images/flash-cards-leeson/sea-waves.png'),
    require('./images/other_images/flash-cards-leeson/fire.png'),
    require('./images/other_images/flash-cards-leeson/star.png'),
    require('./images/other_images/flash-cards-leeson/groundhog.png'),
    require('./images/other_images/flash-cards-leeson/groundhog1.png'),
    require('./images/other_images/flash-cards-leeson/groundhog2.png'),
    require('./images/other_images/flash-cards-leeson/glasses.png'),
    require('./images/other_images/flash-cards-leeson/cupcake.png'),
    require('./images/other_images/flash-cards-leeson/camera.png'),
    require('./images/other_images/flash-cards-leeson/wedding-planner.png'),
    require('./images/other_images/flash-cards-leeson/fireworks.png'),
  ];
  const [shuffledImages, setShuffledImages] = useState([]);

  useEffect(() => {
    setShuffledImages(shuffleArray([...images]));
  }, []);


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
          imageSource: require('./images/icon/1-star.png')
        };
      case "2":
        return {
          imageSource: require('./images/icon/2-star.png')
        };
      case "3":
        return {
          imageSource: require('./images/icon/3-star.png')
        };
      default:
        return {
          imageSource: null
        };
    }
  };

  const onPressIn = (id) => {
    setPressedCards(prevState => ({ ...prevState, [id]: true }));
  };

  const onPressOut = (id) => {
    setPressedCards(prevState => ({ ...prevState, [id]: false }));
  };

  return (
    <View>

      <View style={globalCss.navTabUser}>
        <TouchableOpacity style={globalCss.itemNavTabUser} onPress={() => navigation.navigate('FlashCardsScreen')}>
          <FontAwesomeIcon icon={faArrowLeft} size={30}  style={globalCss.blue} />
          <Text style={globalCss.dataNavTop}></Text>
        </TouchableOpacity>
        <View style={globalCss.itemNavTabUser}>
          <Image
            source={require("./images/other_images/nav-top/sapphire.webp")}
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
        <TouchableOpacity style={globalCss.itemNavTabUser} onPress={() => setIsDropdownVisible(!isDropdownVisible)}>
          <Image
            source={require("./images/other_images/nav-top/star.png")}
            style={globalCss.imageNavTop}
          />
          <Text style={globalCss.dataNavTop}>4</Text>
        </TouchableOpacity>
      </View>


      <ScrollView contentContainerStyle={{ paddingTop: 10, paddingBottom: 160 }}>
        <View style={styles.container}>
          {data.map((item, index) => (
            <View style={styles.cardLesson} key={item.id}>
              <TouchableOpacity
                style={[
                  styles.item,
                  pressedCards[item.id] && styles.cardPressed,
                  {
                    backgroundColor: pressedCards[item.id] ? colorsPressed[index % colorsPressed.length] : colors[index % colors.length],
                    borderColor: '#d8d8d8',
                  },
                ]}
                onPressIn={() => onPressIn(item.id)}
                onPressOut={() => onPressOut(item.id)}
                activeOpacity={1}
                onPress={() => navigation.navigate('FlashCardsWords', { url: item.url })}>

                <Image
                  source={shuffledImages[index % shuffledImages.length]}
                  style={styles.randomImg}
                />

                <View style={styles.levelStars}>
                  <Image
                    source={getCategoryImageAndText(item.category).imageSource}
                    style={styles.levelIcon}
                  />
                </View>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1, 
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: '2%',
  },
  cardPressed: {
    shadowOffset: { width: 0, height: 0 },
    transform: [{ translateY: 4 }],
  },
  bgGryPressed: {
    backgroundColor: '#f9f9f9',
    borderColor: '#d8d8d8',
  },
  cardLesson:{
    width: '33%',
    marginBottom: 20,
    paddingHorizontal: '2.5%',

  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  item: {
    width: '100%',
    height: 140,
    paddingTop: 10,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
    borderRadius: 10,
    borderColor: '#d8d8d8',
    shadowColor: '#d8d8d8',
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
  levelStars:{
        flex: 1,
    resizeMode: 'contain',
    width: '80%',
    alignSelf: 'center',
  },
  levelIcon:{
    flex: 1,
    resizeMode: 'contain',
    width: '100%',
    alignSelf: 'center',
  },
  randomImg:{
    flex: 1,
    resizeMode: 'contain',
    width: '100%',
    alignSelf: 'center',
  },
  levelHardTxt:{
    marginLeft: '3%'
  },
});
